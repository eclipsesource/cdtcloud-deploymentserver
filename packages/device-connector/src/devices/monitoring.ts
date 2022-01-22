import type { Port__Output as Port } from 'arduino-cli_proto_ts/common/cc/arduino/cli/commands/v1/Port'
import type { Device } from 'deployment-server'
import { ClientDuplexStream } from '@grpc/grpc-js'
import { Duplex, pipeline, Transform } from 'stream'
import { ConnectedDevices } from './store'
import { DeviceStatus } from '../util/common'
import { setTimeout } from 'timers/promises'
import { logger } from '../util/logger'
import { openDeployStream } from '../deployment-server/connection'
import { StreamingOpenRequest } from 'arduino-cli_proto_ts/common/cc/arduino/cli/monitor/v1/StreamingOpenRequest'
import { StreamingOpenResponse__Output as StreamingOpenResponse } from 'arduino-cli_proto_ts/common/cc/arduino/cli/monitor/v1/StreamingOpenResponse'
import { monitor } from '../arduino-cli/monitor'
import { once } from 'events'

export interface MonitorData {
  device: Device
  timeout?: number
}

export class DeviceMonitor {
  #isConnected: boolean = false
  #monitorStream: ClientDuplexStream<StreamingOpenRequest, StreamingOpenResponse> | undefined
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
      if (this.#serverStream != null) {
        this.#serverStream.end()
        this.#serverStream.unpipe()
        await setTimeout(200)
        this.#serverStream.destroy()
        await once(this.#serverStream, 'close')
        this.#serverStream = undefined
      }
    }

    // Open deployment stream to server
    if (this.#serverStream == null || !this.#serverStream.writable) {
      this.#serverStream = await openDeployStream(this.#deploymentId)
    }

    // Create monitor stream to device
    this.#monitorStream = await monitor(this.port)

    try {
      await this.pipeToSocket()
    } catch (e) {
      logger.error(e)
      await this.stop()
    }
    this.#isConnected = true
    await setTimeout(sec * 1000)
    await this.stop()
  }

  async stop (): Promise<void> {
    if (!this.#isConnected) {
      return
    }

    // End monitor stream and unpipe
    if (this.#monitorStream != null) {
      this.#monitorStream.end()
      this.#monitorStream.unpipe()
      await setTimeout(200)
      this.#monitorStream.destroy()

      // Set monitor stream back to undefined
      this.#monitorStream = undefined
    }

    this.#isConnected = false

    // End server stream and unpipe
    if (this.#serverStream != null) {
      this.#serverStream.end()
      this.#serverStream.unpipe()
      monitorResponseTransform.unpipe(this.#serverStream)
      await setTimeout(200)
      this.#serverStream.destroy()
      await once(this.#serverStream, 'close')

      // Set server stream back to undefined
      this.#serverStream = undefined
    }

    // Wait 5 seconds to ensure that the device also closed the stream
    await setTimeout(5000)

    try {
      const device = ConnectedDevices.onPort(this.port.address, this.port.protocol)
      await device.updateStatus(DeviceStatus.RUNNING)
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

  async pipeToSocket (): Promise<Duplex> {
    if (this.#monitorStream == null) {
      throw new Error(`No valid data stream to pipe from device on port ${this.port.address} (${this.port.protocol})`)
    }

    if (this.#serverStream == null) {
      throw new Error(`No valid deployment stream to server for device on port ${this.port.address} (${this.port.protocol})`)
    }

    return pipeline(this.#monitorStream, monitorResponseTransform, this.#serverStream, (error) => {
      if (error != null) {
        logger.error(error)
      }
    })
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

  transform (chunk: StreamingOpenResponse, encoding, callback) {
    const { data, dropped } = chunk

    if (dropped > 0) {
      logger.debug(`Dropped ${dropped} bytes during monitoring`)
    }

    callback(null, data)
  }
})
