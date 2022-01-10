import type { MonitorRequest } from 'arduino-cli_proto_ts/common/cc/arduino/cli/commands/v1/MonitorRequest'
import type { MonitorResponse } from 'arduino-cli_proto_ts/common/cc/arduino/cli/commands/v1/MonitorResponse'
import type { Port__Output as Port } from 'arduino-cli_proto_ts/common/cc/arduino/cli/commands/v1/Port'
import type { Device } from '@prisma/client'
import { ClientDuplexStream } from '@grpc/grpc-js'
import { Transform } from 'stream'
import { ConnectedDevices } from './store'
import { DeviceStatus } from '../util/common'
import { setTimeout } from 'timers/promises'
import { arduinoClient, deploymentSocket } from '../deviceConnector'
import { logger } from '../util/logger'

export interface MonitorData {
  device: Device
  timeout?: number
}

export class DeviceMonitor {
  #isConnected: boolean = false
  #monitorStream: ClientDuplexStream<MonitorRequest, MonitorResponse> | undefined
  readonly port: Port

  constructor (port: Port) {
    this.port = port
  }

  async start (sec: number): Promise<void> {
    if (this.isPaused()) {
      return this.resume()
    }

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

    this.unpipe()
    this.#monitorStream?.destroy()
    this.#monitorStream = undefined
    this.#isConnected = false

    // Wait 5 seconds to ensure that the device also closed the stream
    await setTimeout(5000)
    const device = ConnectedDevices.onPort(this.port.address, this.port.protocol)
    await device?.updateStatus(DeviceStatus.AVAILABLE)
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

    this.#monitorStream.pipe(monitorResponseTransform).pipe(deploymentSocket)
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