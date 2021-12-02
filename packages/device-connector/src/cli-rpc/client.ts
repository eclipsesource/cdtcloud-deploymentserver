import { ServiceError, StatusObject } from '@grpc/grpc-js'
import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import { ArduinoCoreServiceClient } from 'arduino-cli_proto_ts/common/cc/arduino/cli/commands/v1/ArduinoCoreService'
import { BoardListAllRequest } from 'arduino-cli_proto_ts/common/cc/arduino/cli/commands/v1/BoardListAllRequest'
import { BoardListAllResponse } from 'arduino-cli_proto_ts/common/cc/arduino/cli/commands/v1/BoardListAllResponse'
import { BoardListItem } from 'arduino-cli_proto_ts/common/cc/arduino/cli/commands/v1/BoardListItem'
import { BoardListRequest } from 'arduino-cli_proto_ts/common/cc/arduino/cli/commands/v1/BoardListRequest'
import { BoardListResponse } from 'arduino-cli_proto_ts/common/cc/arduino/cli/commands/v1/BoardListResponse'
import { BurnBootloaderResponse } from 'arduino-cli_proto_ts/common/cc/arduino/cli/commands/v1/BurnBootloaderResponse'
import { CreateResponse } from 'arduino-cli_proto_ts/common/cc/arduino/cli/commands/v1/CreateResponse'
import { DetectedPort } from 'arduino-cli_proto_ts/common/cc/arduino/cli/commands/v1/DetectedPort'
import { InitRequest } from 'arduino-cli_proto_ts/common/cc/arduino/cli/commands/v1/InitRequest'
import { Instance } from 'arduino-cli_proto_ts/common/cc/arduino/cli/commands/v1/Instance'
import { MonitorRequest } from 'arduino-cli_proto_ts/common/cc/arduino/cli/commands/v1/MonitorRequest'
import { MonitorResponse } from 'arduino-cli_proto_ts/common/cc/arduino/cli/commands/v1/MonitorResponse'
import { Port } from 'arduino-cli_proto_ts/common/cc/arduino/cli/commands/v1/Port'
import { UploadResponse } from 'arduino-cli_proto_ts/common/cc/arduino/cli/commands/v1/UploadResponse'
import { ProtoGrpcType as ArduinoProtoGrpcType } from 'arduino-cli_proto_ts/common/commands'
import { BoardListWatchResponse } from 'arduino-cli_proto_ts/common/cc/arduino/cli/commands/v1/BoardListWatchResponse'
import logger from '../util/logger'

export class RPCClient {
  address: string
  private client: ArduinoCoreServiceClient | undefined
  instance: Instance | undefined

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

    const deadline = new Date()
    deadline.setSeconds(deadline.getSeconds() + 5)

    return await new Promise((resolve, reject) => {
      const arduinoGrpcObject = grpc.loadPackageDefinition(loadedProto) as unknown as ArduinoProtoGrpcType

      const arduinoServiceClient = new arduinoGrpcObject.cc.arduino.cli.commands.v1.ArduinoCoreService(this.address, grpc.credentials.createInsecure())
      arduinoServiceClient.waitForReady(deadline, (error: Error | undefined) => {
        if (error != null) {
          return reject(new Error(error.message))
        }

        this.client = arduinoServiceClient
        logger.info(`Connected to ${this.address} (Arduino-CLI)`)
        return resolve()
      })
    })
  };

  async createInstance (): Promise<void> {
    return await new Promise((resolve, reject) => {
      if (this.client == null) {
        return reject(new Error('Client not initialized'))
      }

      this.client.Create({}, (err: ServiceError | null, data?: CreateResponse) => {
        if (err != null) {
          return reject(new Error(err.message))
        }
        if ((data == null) || (data.instance == null)) {
          return reject(new Error('No Instance created'))
        }
        this.instance = data.instance
        return resolve()
      })
    })
  }

  async initInstance (i?: Instance): Promise<void> {
    const instance = i ?? this.instance
    if (i) {
      this.instance = i
    }
    const initRequest: InitRequest = { instance }

    return await new Promise((resolve, reject) => {
      if ((instance == null) || (this.client == null)) {
        return reject(new Error('Client not connected'))
      }

      const stream = this.client.Init(initRequest)
      stream.on('status', (status: StatusObject) => {
        return status.code === 0 ? resolve() : reject(new Error(status.details))
      })

      stream.on('end', () => {
        stream.destroy()
      })

      stream.on('error', (err: Error) => {
        stream.destroy()
        return reject(new Error(err.message))
      })
    })
  }

  async listBoards (): Promise<DetectedPort[]> {
    const boardListRequest: BoardListRequest = { instance: this.instance, timeout: 1000 }

    return await new Promise((resolve, reject) => {
      if (this.client == null) {
        return reject(new Error('Client not initialized'))
      }

      this.client.boardList(boardListRequest, (err: ServiceError | null, data?: BoardListResponse) => {
        console.log(data)
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
      instance: this.instance,
      search_args: filter,
      include_hidden_boards: false
    }

    return await new Promise((resolve, reject) => {
      if (this.client == null) {
        return reject(new Error('Client not initialized'))
      }
      this.client.BoardListAll(boardListAllRequest, (err: ServiceError | null, data?: BoardListAllResponse) => {
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

  async uploadBin (fqbn: string, port: Port, file: string, verify: boolean = false): Promise<boolean> {
    const uploadRequest = { instance: this.instance, fqbn, port, import_file: file, verify }

    return await new Promise((resolve, reject) => {
      if (this.client == null) {
        return reject(new Error('Client not initialized'))
      }

      const stream = this.client.Upload(uploadRequest)
      stream.on('data', (data: UploadResponse) => {
        if (data.err_stream != null && data.err_stream.length > 0) {
          reject(new Error(data.err_stream.toString()))
        }
      })
      stream.on('end', () => {
        stream.destroy()
      })
      stream.on('status', (status) => {
        return status.code === 0 ? resolve(true) : reject(new Error(status.details))
      })
      stream.on('error', (err: Error) => {
        reject(new Error(err.message))
      })
    })
  }

  async burnBootloader (fqbn: string, port: Port, programmer: string, verify: boolean = false): Promise<boolean> {
    const burnBootloaderRequest = { instance: this.instance, fqbn, port, programmer, verify }

    return await new Promise((resolve, reject) => {
      if (this.client == null) {
        return reject(new Error('Client not initialized'))
      }

      const stream = this.client.BurnBootloader(burnBootloaderRequest)
      stream.on('data', (data: BurnBootloaderResponse) => {
        if (data.err_stream != null && data.err_stream.length > 0) {
          reject(new Error(data.err_stream.toString()))
        }
      })
      stream.on('end', () => {
        stream.destroy()
      })
      stream.on('status', (status) => {
        return status.code === 0 ? resolve(true) : reject(new Error(status.details))
      })
      stream.on('error', (err: Error) => {
        reject(new Error(err.message))
      })
    })
  }

  async boardListWatch (): Promise<void> {
    const boardListWatchRequest = { instance: this.instance, interrupt: false }

    return await new Promise((resolve, reject) => {
      if (this.client == null) {
        return reject(new Error('Client not initialized'))
      }

      const stream = this.client.boardListWatch()
      stream.write(boardListWatchRequest)

      stream.on('end', () => {
        stream.destroy()
      })

      stream.on('error', (err: Error) => {
        logger.error(err)
      })

      stream.on('data', (data: BoardListWatchResponse) => {
        if (data.error !== '') {
          logger.error(new Error(data.error))
        }

        const eventType = data.event_type
        const detectedPort = data.port
        const port = detectedPort?.port
        if (port == null) {
          return
        }

        const devicePort = {
          address: port.address,
          label: port.label,
          protocol: port.protocol
        }

        if (eventType === 'add' && detectedPort?.matching_boards != null && detectedPort.matching_boards.length > 0) {
          const board = detectedPort.matching_boards[0]
          const device = {
            name: board.name ?? 'Unknown Device',
            serialNumber: port.properties?.serialNumber,
            fqbn: board.fqbn,
            hidden: board.is_hidden,
            platform: board.platform,
            port: devicePort
          }

          logger.info(`Device attached: ${device.name}`)
        } else if (eventType === 'remove') {
          // TODO
          logger.info('Device removed')
        }
      })
    })
  }
}

