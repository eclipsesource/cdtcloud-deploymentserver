import type { Port__Output as Port } from 'arduino-cli_proto_ts/common/cc/arduino/cli/commands/v1/Port'
import type { Device, DeviceType } from '@prisma/client'
import { DeployStatus, DeviceStatus } from '../util/common'
import { fetchDeviceType, setDeployRequest, setDeviceRequest } from '../deployment-server/service'
import { DeviceMonitor } from './monitoring'
import { FQBN } from '../device-types/service'
import { DeviceTypes } from '../device-types/store'
import { connectorId } from '../deployment-server/connection'
import { logger } from '../util/logger'
import { Deployment, DeploymentId } from './deployment'
import { arduinoClient } from '../deviceConnector'
import { setTimeout } from 'timers/promises'

export class ConnectedDevice implements Device {
  readonly id: string
  readonly deviceTypeId: string
  readonly connectorId = connectorId
  readonly port: Port
  status: keyof typeof DeviceStatus
  #deployment: Deployment | undefined
  #deviceMonitor: DeviceMonitor | undefined
  deployQueue = new Array<Deployment>()

  constructor (id: string, deviceTypeId: string, port: Port, status: keyof typeof DeviceStatus = DeviceStatus.AVAILABLE) {
    this.id = id
    this.deviceTypeId = deviceTypeId
    this.port = port
    this.status = status
  }

  async getFQBN (): Promise<FQBN> {
    const deviceType = await this.getType()

    return deviceType.fqbn
  }

  async getName (): Promise<string> {
    const deviceType = await this.getType()

    return deviceType.name
  }

  async getType (): Promise<DeviceType> {
    let deviceType: DeviceType

    try {
      deviceType = await DeviceTypes.getById(this.deviceTypeId)
    } catch (e) {
      logger.warn(e)
      deviceType = await fetchDeviceType(this.deviceTypeId)
      DeviceTypes.add(deviceType)
    }

    return deviceType
  }

  async updateStatus (status: keyof typeof DeviceStatus): Promise<void> {
    // Only set remote status back to available if there are no deployments queued
    if (status !== DeviceStatus.AVAILABLE || this.deployQueue.length === 0) {
      try {
        await setDeviceRequest(this.id, status)
      } catch (e) {
        logger.error(e)
      }
    }

    // Only set remote status and don't execute further steps if status is already set locally
    if (this.status === status) {
      return
    }

    this.status = status

    const type = await this.getType()
    logger.info(`Device ${status.toLowerCase()}: ${type.name} on ${this.port.address} (${this.port.protocol})`)

    if (this.status === DeviceStatus.AVAILABLE) {
      const next = this.deployQueue.pop()
      if (next != null) {
        await this.deploy(next)
      }
    }
  }

  async monitorOutput (sec: number = 5 * 60): Promise<void> {
    if (this.status !== DeviceStatus.RUNNING || this.#deployment == null) {
      throw new Error(`Device with id ${this.id} not currently running code`)
    }

    if (this.#deviceMonitor == null) {
      this.#deviceMonitor = new DeviceMonitor(this.port)
    }

    await this.updateStatus(DeviceStatus.UNAVAILABLE)
    await this.#deviceMonitor.start(this.#deployment.id, sec)
  }

  async stopMonitoring (): Promise<void> {
    if (this.#deviceMonitor != null) {
      await this.#deviceMonitor.stop()
    }
  }

  async pauseMonitoring (): Promise<void> {
    if (this.#deviceMonitor != null) {
      this.#deviceMonitor.pause()
    }
  }

  async resumeMonitoring (): Promise<void> {
    if (this.#deviceMonitor != null && this.#deviceMonitor.isConnected) {
      this.#deviceMonitor.resume()
    } else {
      const type = await this.getType()
      logger.error(`Resume monitor failed: No connection of ${type.name} on port ${this.port.address} (${this.port.protocol})`)
    }
  }

  isMonitoring (): boolean {
    if (this.#deviceMonitor != null) {
      return this.#deviceMonitor.isConnected
    }

    return false
  }

  async deploy (deployment: Deployment, runtimeMS: number = 120000): Promise<void> {
    const fqbn = await this.getFQBN()

    // Update device status and notify server of status-change
    await this.updateStatus(DeviceStatus.DEPLOYING)
    this.#deployment = deployment

    try {
      // Start uploading artifact
      await arduinoClient.uploadBin(fqbn, this.port, deployment.artifactPath)
    } catch (e) {
      try {
        await this.updateStatus(DeviceStatus.AVAILABLE)
        await setDeployRequest(deployment.id, DeployStatus.FAILED)
      } catch (err) {
        logger.error(err)
      }
      throw e
    }

    // Update device status and notify server of status-change
    try {
      await this.updateStatus(DeviceStatus.RUNNING)
      await setDeployRequest(deployment.id, DeployStatus.RUNNING)
    } catch (e) {
      logger.error(e)
    }

    // Run code only for a set amount of time. Set device back to available after.
    // Default: 2min
    await setTimeout(runtimeMS)
    try {
      if (this.isMonitoring()) {
        await this.stopMonitoring()
      }
      await setDeployRequest(deployment.id, DeployStatus.TERMINATED)
      await this.updateStatus(DeviceStatus.AVAILABLE)
    } catch (e) {
      logger.error(e)
    }
  }

  getLastDeployment (): Deployment | undefined {
    return this.#deployment
  }

  async queue (deployment: Deployment): Promise<void> {
    await setDeployRequest(deployment.id, DeployStatus.PENDING)
    this.deployQueue.push(deployment)
  }

  async dequeue (deployId: DeploymentId): Promise<void> {
    this.deployQueue = this.deployQueue.filter((deployment) => deployment.id !== deployId)
  }
}
