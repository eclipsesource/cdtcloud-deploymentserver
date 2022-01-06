import type { Port__Output as Port } from 'arduino-cli_proto_ts/common/cc/arduino/cli/commands/v1/Port'
import { DeviceStatus } from '../util/common'
import { fetchDeviceType, setDeviceRequest } from '../deployment-server/service'
import { RPCClient } from '../arduino-cli/client'
import { Duplex } from 'stream'
import { DeviceMonitor } from './monitoring'
import { DeviceType, FQBN } from '../device-types/service'
import { DeviceTypes } from '../device-types/store'
import logger from '../util/logger'

export interface Device {
  id: string
  status: keyof typeof DeviceStatus
  deviceTypeId: string
}

export class ConnectedDevice implements Device {
  readonly id: string
  readonly deviceTypeId: string
  readonly port: Port
  status: keyof typeof DeviceStatus
  #deviceMonitor: DeviceMonitor | undefined

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

  async getType (): Promise<DeviceType> {
    let deviceType = await DeviceTypes.withId(this.deviceTypeId)

    if (deviceType == null) {
      // Should never happen
      deviceType = await fetchDeviceType(this.deviceTypeId)
      DeviceTypes.add(deviceType)
    }

    return deviceType
  }

  async updateStatus (status: keyof typeof DeviceStatus): Promise<void> {
    await setDeviceRequest(this.id, status)
    this.status = status

    const type = await this.getType()
    logger.info(`Device ${status.toLowerCase()}: ${type.name} on ${this.port.address} (${this.port.protocol})`)
  }

  async monitorOutput (client: RPCClient, outStream: Duplex, sec: number = 5 * 60): Promise<void> {
    if (this.#deviceMonitor == null) {
      this.#deviceMonitor = new DeviceMonitor(this.port)
    }

    await this.updateStatus(DeviceStatus.UNAVAILABLE)
    await this.#deviceMonitor.start(client, outStream, sec)
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
}
