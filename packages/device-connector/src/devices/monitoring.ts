import type { MonitorRequest } from 'arduino-cli_proto_ts/common/cc/arduino/cli/commands/v1/MonitorRequest'
import type { MonitorResponse } from 'arduino-cli_proto_ts/common/cc/arduino/cli/commands/v1/MonitorResponse'
import type { Port__Output as Port } from 'arduino-cli_proto_ts/common/cc/arduino/cli/commands/v1/Port'
import type { Device } from '@prisma/client'
import { ClientDuplexStream } from '@grpc/grpc-js'
import { Duplex, Transform } from 'stream'
import { ConnectedDevices } from './store'
import { DeviceStatus } from '../util/common'
import { setTimeout } from 'timers/promises'
import { arduinoClient } from '../deviceConnector'
import { logger } from '../util/logger'
import { openDeployStream } from '../deployment-server/connection'

export interface MonitorData {
  device: Device
  timeout?: number
}

export class DeviceMonitor {
  #isConnected: boolean = false
  #monitorStream: ClientDuplexStream<MonitorRequest, MonitorResponse> | undefined
  #serverStream: Duplex | undefined
  #deploymentId: string | undefined
  readonly port: Port

  constructor (port: Port) {
    this.port = port
  }

  async start (deploymentId: string, sec: number): Promise<void> {
    if (this.isPaused() && this.#deploymentId === deploymentId) {
      return this.resume()
    }

    // Check if deploymentId is different to last monitor request
    if (this.#deploymentId !== deploymentId) {
      this.#deploymentId = deploymentId

      // Destroy outdated stream to server
      if (this.#serverStream != null && !this.#serverStream.destroyed) {
        this.#serverStream.destroy()
      }
    }

    // Open deployment stream to server
    if (this.#serverStream == null || this.#serverStream.destroyed) {
      this.#serverStream = await openDeployStream(this.#deploymentId)
    }

    // Create monitor stream to device
    this.#monitorStream = await arduinoClient.monitor(this.port, sec)

    this.#monitorStream.on('close', () => {
      this.stop().catch((err) => {
        logger.error(err)
      })
    })

    try {
      await this.pipeToSocket()
    } catch (e) {
      logger.error(e)
      await this.stop()
    }
    this.#isConnected = true
  }

  async stop (): Promise<void> {
    if (!this.#isConnected) {
      return
    }

    // Unpipe streams beforehand
    this.unpipe()

    // Destroy stream to device
    this.#monitorStream?.end()
    this.#monitorStream = undefined
    this.#isConnected = false

    // Destroy stream to server
    this.#serverStream?.end()
    this.#serverStream = undefined

    // Wait 5 seconds to ensure that the device also closed the stream
    await setTimeout(5000)
    try {
      const device = ConnectedDevices.onPort(this.port.address, this.port.protocol)
      await device.updateStatus(DeviceStatus.AVAILABLE)
    } catch (e) {
      logger.error(e)
    }
  }

  pause (): void {
    this.#monitorStream?.pause()
  }

  resume (): void {
    this.#monitorStream?.resume()
  }

  isPaused (): boolean {
    if (this.#monitorStream != null) {
      return this.#monitorStream.isPaused()
    }

    return false
  }

  isMonitoring (): boolean {
    return this.#isConnected && !this.isPaused()
  }

  async pipeToSocket (): Promise<void> {
    if (this.#monitorStream == null) {
      throw new Error(`No valid data stream to pipe from device on port ${this.port.address} (${this.port.protocol})`)
    }

    if (this.#serverStream == null) {
      throw new Error(`No valid deployment stream to server for device on port ${this.port.address} (${this.port.protocol})`)
    }

    this.#monitorStream.pipe(monitorResponseTransform).pipe(this.#serverStream)
  }

  unpipe (): void {
    if (this.#monitorStream != null) {
      this.#monitorStream.unpipe()
    }
  }

  get isConnected (): boolean {
    return this.#isConnected
  }
}

const monitorResponseTransform = new Transform({
  writableObjectMode: true,

  transform (chunk: MonitorResponse, encoding, callback) {
    const { error, rx_data: data } = chunk

    if (error != null && error !== '') {
      callback(null, error)
    } else {
      callback(null, data)
    }
  }
})
