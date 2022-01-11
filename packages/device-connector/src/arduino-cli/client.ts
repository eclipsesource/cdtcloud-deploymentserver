import * as grpc from '@grpc/grpc-js'
import { ChannelOptions, ServiceError, StatusObject } from '@grpc/grpc-js'
import { Status } from '@grpc/grpc-js/build/src/constants'
import * as protoLoader from '@grpc/proto-loader'
import { ArduinoCoreServiceClient } from 'arduino-cli_proto_ts/common/cc/arduino/cli/commands/v1/ArduinoCoreService'
import { BoardListAllRequest } from 'arduino-cli_proto_ts/common/cc/arduino/cli/commands/v1/BoardListAllRequest'
import { BoardListAllResponse } from 'arduino-cli_proto_ts/common/cc/arduino/cli/commands/v1/BoardListAllResponse'
import { BoardListItem } from 'arduino-cli_proto_ts/common/cc/arduino/cli/commands/v1/BoardListItem'
import { BoardListRequest } from 'arduino-cli_proto_ts/common/cc/arduino/cli/commands/v1/BoardListRequest'
import { BoardListResponse__Output as BoardListResponse } from 'arduino-cli_proto_ts/common/cc/arduino/cli/commands/v1/BoardListResponse'
import { BoardListWatchRequest } from 'arduino-cli_proto_ts/common/cc/arduino/cli/commands/v1/BoardListWatchRequest'
import { BoardListWatchResponse__Output as BoardListWatchResponse } from 'arduino-cli_proto_ts/common/cc/arduino/cli/commands/v1/BoardListWatchResponse'
import { BurnBootloaderResponse } from 'arduino-cli_proto_ts/common/cc/arduino/cli/commands/v1/BurnBootloaderResponse'
import { CreateResponse } from 'arduino-cli_proto_ts/common/cc/arduino/cli/commands/v1/CreateResponse'
import { DetectedPort__Output as DetectedPort } from 'arduino-cli_proto_ts/common/cc/arduino/cli/commands/v1/DetectedPort'
import { InitRequest } from 'arduino-cli_proto_ts/common/cc/arduino/cli/commands/v1/InitRequest'
import { Instance } from 'arduino-cli_proto_ts/common/cc/arduino/cli/commands/v1/Instance'
import { MonitorRequest } from 'arduino-cli_proto_ts/common/cc/arduino/cli/commands/v1/MonitorRequest'
import { MonitorResponse } from 'arduino-cli_proto_ts/common/cc/arduino/cli/commands/v1/MonitorResponse'
import { Port__Output as Port } from 'arduino-cli_proto_ts/common/cc/arduino/cli/commands/v1/Port'
import { UploadRequest } from 'arduino-cli_proto_ts/common/cc/arduino/cli/commands/v1/UploadRequest'
import { UploadResponse } from 'arduino-cli_proto_ts/common/cc/arduino/cli/commands/v1/UploadResponse'
import { ProtoGrpcType as ArduinoProtoGrpcType } from 'arduino-cli_proto_ts/common/commands'
import { deleteDeviceRequest } from '../deployment-server/service'
import { addDevice, removeDevice } from '../devices/service'
import { ConnectedDevices } from '../devices/store'
import { DeviceTypes } from '../device-types/store'
import { logger } from '../util/logger'

export class GRPCClient {
  readonly address: string
  #client: ArduinoCoreServiceClient | undefined
  #instance: Instance | undefined
  #isConnected: boolean = false

  constructor (address: string = '127.0.0.1:50051') {
    this.address = address
  }

  async init (): Promise<void> {
    const loadedProto = protoLoader.loadSync('../grpc/proto/cc/arduino/cli/commands/v1/commands.proto', {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true
    })

    const options: ChannelOptions = {
      'grpc.keepalive_permit_without_calls': 1
    }

    const deadline = new Date()
    deadline.setSeconds(deadline.getSeconds() + 5)

    return await new Promise((resolve) => {
      const arduinoGrpcObject = grpc.loadPackageDefinition(loadedProto) as unknown as ArduinoProtoGrpcType

      const arduinoServiceClient = new arduinoGrpcObject.cc.arduino.cli.commands.v1.ArduinoCoreService(this.address, grpc.credentials.createInsecure(), options)
      arduinoServiceClient.waitForReady(deadline, (error: Error | undefined) => {
        if (error != null) {
          logger.error(`Arduino-CLI: ${error.message} - retrying`)
          return resolve(this.init())
        }

        this.#client = arduinoServiceClient
        return resolve()
      })
    })
  }

  async createInstance (): Promise<void> {
    return await new Promise((resolve, reject) => {
      if (this.#client == null) {
        return reject(new Error('Client not initialized'))
      }

      this.#client.Create({}, (err: ServiceError | null, data?: CreateResponse) => {
        if (err != null) {
          return reject(new Error(err.message))
        }

        if ((data === undefined) || (data.instance == null)) {
          return reject(new Error('No Instance created'))
        }

        this.#instance = data.instance
        return resolve()
      })
    })
  }

  async destroyInstance (i?: Instance): Promise<void> {
    const instance = i ?? this.#instance
    const destroyRequest = { instance }

    return await new Promise((resolve, reject) => {
      if (this.#client == null) {
        return reject(new Error('Client not initialized'))
      }

      this.#client.destroy(destroyRequest, (err: ServiceError | null) => {
        if (err != null) {
          return reject(new Error(err.message))
        }
        return resolve()
      })
    })
  }

  async initInstance (i?: Instance): Promise<void> {
    const instance = i ?? this.#instance
    if (i != null) {
      this.#instance = i
    }
    const initRequest: InitRequest = { instance }

    if (ConnectedDevices.store.length > 0) {
      await this.removeAllDevices()
    }

    return await new Promise((resolve, reject) => {
      if ((instance == null) || (this.#client == null)) {
        return reject(new Error('Client not connected'))
      }

      const stream = this.#client.Init(initRequest)
      stream.on('status', (status: StatusObject) => {
        switch (status.code) {
          case Status.OK:
            this.#isConnected = true
            logger.info(`Connected to Arduino-CLI (${this.address})`)
            return resolve()
          case Status.INVALID_ARGUMENT:
            return resolve(this.createInstance().then(async () => {
              return await this.initInstance()
            }))
          case Status.UNAVAILABLE:
            if (this.#isConnected) {
              setTimeout(() => {
                return resolve(this.initInstance())
              }, 3000)
            }
            return reject(status)
          default:
            return reject(status)
        }
      })

      stream.on('end', () => {
        stream.destroy()
      })

      stream.on('error', (err: StatusObject) => {
        logger.error(err)
      })
    })
  }

  async listBoards (): Promise<DetectedPort[]> {
    const boardListRequest: BoardListRequest = { instance: this.#instance, timeout: 1000 }

    return await new Promise((resolve, reject) => {
      if (this.#client == null) {
        return reject(new Error('Client not initialized'))
      }

      this.#client.boardList(boardListRequest, (err: ServiceError | null, data?: BoardListResponse) => {
        if (err != null) {
          return reject(new Error(err.message))
        }

        if ((data?.ports) == null) {
          return reject(new Error('No Boards found'))
        }

        return resolve(data.ports)
      })
    })
  }

  async listAllBoards (filter?: string[]): Promise<BoardListItem[]> {
    const boardListAllRequest: BoardListAllRequest = {
      instance: this.#instance,
      search_args: filter,
      include_hidden_boards: false
    }

    return await new Promise((resolve, reject) => {
      if (this.#client == null) {
        return reject(new Error('Client not initialized'))
      }
      this.#client.BoardListAll(boardListAllRequest, (err: ServiceError | null, data?: BoardListAllResponse) => {
        if (err != null) {
          return reject(new Error(err.message))
        }

        if ((data?.boards) == null) {
          return reject(new Error('No Boards found'))
        }

        return resolve(data.boards)
      })
    })
  }

  async uploadBin (fqbn: string, port: Port, file: string, verify: boolean = false, dryRun: boolean = false): Promise<void> {
    const uploadRequest: UploadRequest = {
      instance: this.#instance,
      fqbn,
      port,
      import_file: file,
      verify,
      dry_run: dryRun
    }

    return await new Promise((resolve, reject) => {
      if (this.#client == null) {
        return reject(new Error('Client not initialized'))
      }

      const stream = this.#client.Upload(uploadRequest)
      stream.on('data', (data: UploadResponse) => {
        if (data.err_stream != null && data.err_stream.length > 0) {
          reject(new Error(data.err_stream.toString()))
        }
      })

      stream.on('end', () => {
        stream.destroy()
      })

      stream.on('status', (status: StatusObject) => {
        if (status.code === Status.OK) {
          const devName = DeviceTypes.withFQBN(fqbn)?.name ?? 'Unknown Device Name'
          logger.info(`Deployment OK: ${devName} on ${port.address} (${port.protocol})`)
          return resolve()
        }

        return reject(status)
      })

      stream.on('error', (err: StatusObject) => {
        reject(err)
      })
    })
  }

  async burnBootloader (fqbn: string, port: Port, programmer: string, verify: boolean = false): Promise<boolean> {
    const burnBootloaderRequest = { instance: this.#instance, fqbn, port, programmer, verify }

    return await new Promise((resolve, reject) => {
      if (this.#client == null) {
        return reject(new Error('Client not initialized'))
      }

      const stream = this.#client.BurnBootloader(burnBootloaderRequest)
      stream.on('data', (data: BurnBootloaderResponse) => {
        if (data.err_stream != null && data.err_stream.length > 0) {
          reject(new Error(data.err_stream.toString()))
        }
      })

      stream.on('end', () => {
        stream.destroy()
      })

      stream.on('status', (status: StatusObject) => {
        return status.code === 0 ? resolve(true) : reject(status)
      })

      stream.on('error', (err: StatusObject) => {
        reject(err)
      })
    })
  }

  async boardListWatch (): Promise<void> {
    const boardListWatchRequest: BoardListWatchRequest = { instance: this.#instance, interrupt: false }

    if (this.#client == null) {
      const error = new Error('Client not initialized')
      logger.error(error)
      return
    }

    const stream = this.#client.boardListWatch()
    stream.write(boardListWatchRequest)

    stream.on('end', () => {
      stream.destroy()
    })

    stream.on('error', (err: StatusObject) => {
      logger.error(err)

      setTimeout(() => {
        this.initInstance().finally(() => {
          this.boardListWatch().catch(() => {
            // Should never happen
            logger.error('Watch devices finally failed')
          })
        })
      }, 3000)
    })

    stream.on('data', (resp: BoardListWatchResponse) => {
      onNewDevice(resp).catch((err) => {
        if (err != null) {
          logger.error(err)
        }
      })
    })

    const onNewDevice = async (data: BoardListWatchResponse): Promise<void> => {
      if (data.error !== '') {
        logger.error(new Error(data.error))
      }

      const eventType = data.event_type
      const detectedPort = data.port

      if (eventType === 'add' && detectedPort?.matching_boards != null && detectedPort.matching_boards.length > 0) {
        try {
          await addDevice(detectedPort)
        } catch (e) {
          logger.error(e)
        }
      } else if (eventType === 'remove') {
        const port = detectedPort?.port
        if (port == null) {
          logger.warn('Port not defined')
          return
        }

        if (port.address == null || port.address === '') {
          logger.warn('Removed device could not be unregistered: Unknown port')
          return
        }

        const removed = ConnectedDevices.onPort(port.address, port.protocol ?? 'serial')
        if (removed == null) {
          return
        }

        await removeDevice(removed)
        const devType = await removed.getType()
        const devName = devType?.name ?? 'Unknown Device Name'
        logger.info(`Device removed: ${devName} from ${port.address} (${port.protocol})`)
      }
    }
  }

  async monitor (port: Port, timeout: number): Promise<grpc.ClientDuplexStream<MonitorRequest, MonitorResponse>> {
    const monitorRequest: MonitorRequest = { instance: this.#instance, port }

    return await new Promise((resolve, reject) => {
      if (this.#client == null) {
        return reject(new Error('Client not initialized'))
      }

      const deadline = new Date()
      deadline.setSeconds(deadline.getSeconds() + timeout)
      const stream = this.#client.monitor({ deadline })
      stream.once('readable', () => {
        logger.info(`Start monitoring output of device on port ${port.address} (${port.protocol})`)
      })

      stream.on('end', () => {
        logger.info(`Closing monitoring of device on port ${port.address} (${port.protocol})`)
        stream.destroy()
      })

      stream.on('error', (err: StatusObject) => {
        if (err.code === Status.DEADLINE_EXCEEDED) {
          logger.warn(`Monitoring deadline of ${timeout}s exceeded on port ${port.address} (${port.protocol})`)
        } else {
          logger.error(err)
        }
        stream.unpipe()
        stream.end()
      })

      stream.write(monitorRequest, (err: Error | null | undefined) => {
        if (err != null) {
          return reject(err)
        }
        return resolve(stream)
      })
    })
  }

  async initializeDevices (): Promise<void> {
    const boards = await this.listBoards()
    for (const detectedPort of boards) {
      try {
        await addDevice(detectedPort)
      } catch (e) {
        logger.error(e)
      }
    }
  }

  async removeAllDevices (): Promise<void> {
    for (const device of ConnectedDevices.store) {
      try {
        await deleteDeviceRequest(device.id)
      } catch {
        logger.warn(`Failed to deregister device with id ${device.id}`)
      }
    }

    ConnectedDevices.store = []
  }

  closeClient (): void {
    this.#client?.close()
  }
}
