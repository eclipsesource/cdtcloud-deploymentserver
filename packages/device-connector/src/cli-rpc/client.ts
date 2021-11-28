import { ServiceError } from "@grpc/grpc-js"
import * as grpc from "@grpc/grpc-js"
import * as protoLoader from "@grpc/proto-loader"
import { ArduinoCoreServiceClient } from "arduino-cli_proto_ts/common/cc/arduino/cli/commands/v1/ArduinoCoreService"
import { BoardListAllRequest } from "arduino-cli_proto_ts/common/cc/arduino/cli/commands/v1/BoardListAllRequest"
import { BoardListAllResponse } from "arduino-cli_proto_ts/common/cc/arduino/cli/commands/v1/BoardListAllResponse"
import { BoardListItem } from "arduino-cli_proto_ts/common/cc/arduino/cli/commands/v1/BoardListItem"
import { BoardListResponse } from "arduino-cli_proto_ts/common/cc/arduino/cli/commands/v1/BoardListResponse"
import { CreateResponse } from "arduino-cli_proto_ts/common/cc/arduino/cli/commands/v1/CreateResponse"
import { DetectedPort } from "arduino-cli_proto_ts/common/cc/arduino/cli/commands/v1/DetectedPort"
import { InitRequest } from "arduino-cli_proto_ts/common/cc/arduino/cli/commands/v1/InitRequest"
import { Instance } from "arduino-cli_proto_ts/common/cc/arduino/cli/commands/v1/Instance"
import { Port } from "arduino-cli_proto_ts/common/cc/arduino/cli/commands/v1/Port"
import { UploadResponse } from "arduino-cli_proto_ts/common/cc/arduino/cli/commands/v1/UploadResponse"
import { ProtoGrpcType } from "arduino-cli_proto_ts/common/commands"

export class RPCClient {
  address: string;
  private client: ArduinoCoreServiceClient | undefined;
  instance: Instance | undefined;

  constructor(address: string = "127.0.0.1:50051") {
    this.address = address
  }

  async init(): Promise<void> {
    const address = this.address
    const packageDefinition = protoLoader.loadSync(
      "../grpc/proto/cc/arduino/cli/commands/v1/commands.proto", {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
      })

    const deadline = new Date()
    deadline.setSeconds(deadline.getSeconds() + 5)

    return await new Promise((resolve, reject) => {
      const proto = grpc.loadPackageDefinition(packageDefinition) as unknown as ProtoGrpcType
      if (!proto) {
        return reject(new Error("Proto load failed"))
      }

      const arduinoServiceClient = new proto.cc.arduino.cli.commands.v1.ArduinoCoreService(address, grpc.credentials.createInsecure())
      arduinoServiceClient.waitForReady(deadline, (error: Error | undefined) => {
        if (error != null) {
          return reject(new Error(error.message))
        }
        this.client = arduinoServiceClient
        return resolve()
      })
    })
  };

  async createInstance(): Promise<void> {
    return await new Promise((resolve, reject) => {
      if (this.client == null) {
        return reject(new Error("Client not initialized"))
      }

      this.client.Create({}, (err: ServiceError | null, data?: CreateResponse) => {
        if (err != null) {
          return reject(new Error(err.message))
        }
        if ((data == null) || (data.instance == null)) {
          return reject(new Error("No Instance created"))
        }
        this.instance = data.instance
        return resolve()
      })
    })
  }

  async initInstance(i?: Instance): Promise<void> {
    const instance = i ?? this.instance
    const initRequest: InitRequest = { instance }

    return await new Promise((resolve, reject) => {
      if ((instance == null) || (this.client == null)) {
        return reject(new Error("Client not connected"))
      }

      const stream = this.client.Init(initRequest)
      stream.on("status", (status) => {
        return status.code === 0 ? resolve() : reject(new Error(status.details))
      })

      stream.on("end", () => {
        stream.destroy()
      })

      stream.on("error", (err: Error) => {
        stream.destroy()
        return reject(new Error(err.message))
      })
    })
  }

  async listBoards(): Promise<DetectedPort[]> {
    const boardListRequest: BoardListAllRequest = { instance: this.instance }

    return await new Promise((resolve, reject) => {
      if (this.client == null) {
        return reject(new Error("Client not initialized"))
      }
      this.client.BoardList(boardListRequest, (err: ServiceError | null, data?: BoardListResponse) => {
        if (err != null) {
          return reject(new Error(err.message))
        }

        if ((data?.ports) == null) {
          return reject(new Error("No Boards found"))
        }

        return resolve(data.ports)
      })
    })
  }

  async uploadBin(fqbn: string, port: Port, file: string): Promise<boolean> {
    const uploadRequest = { instance: this.instance, fqbn, port, import_file: file }

    return await new Promise((resolve, reject) => {
      if (this.client == null) {
        return reject(new Error("Client not initialized"))
      }

      const stream = this.client.Upload(uploadRequest)
      stream.on("data", (data: UploadResponse) => {
        if (data.err_stream && data.err_stream.length > 0) {
          reject(new Error(data.err_stream.toString()))
        }
      })
      stream.on("end", () => {
        stream.destroy()
      })
      stream.on("status", (status) => {
        return status.code === 0 ? resolve(true) : reject(new Error(status.details))
      })
      stream.on("error", (err: Error) => {
        reject(new Error(err.message))
      })
    })
  }

  async listAllBoards(): Promise<BoardListItem[]> {
    const boardListAllRequest: BoardListAllRequest = {
      instance: this.instance,
      search_args: [],
      include_hidden_boards: false
    }

    return await new Promise((resolve, reject) => {
      if (this.client == null) {
        return reject(new Error("Client not initialized"))
      }
      this.client.BoardListAll(boardListAllRequest, (err: ServiceError | null, data?: BoardListAllResponse) => {
        if (err != null) {
          return reject(new Error(err.message))
        }

        if ((data?.boards) == null) {
          return reject(new Error("No Boards found"))
        }

        return resolve(data.boards)
      })
    })
  }
}
