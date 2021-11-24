import { ServiceError } from "@grpc/grpc-js";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from '@grpc/proto-loader';
import { ArduinoCoreServiceClient } from "../common/cc/arduino/cli/commands/v1/ArduinoCoreService";
import { BoardListAllRequest } from "../common/cc/arduino/cli/commands/v1/BoardListAllRequest";
import { BoardListAllResponse } from "../common/cc/arduino/cli/commands/v1/BoardListAllResponse";
import { BoardListResponse } from "../common/cc/arduino/cli/commands/v1/BoardListResponse";
import { BurnBootloaderRequest } from "../common/cc/arduino/cli/commands/v1/BurnBootloaderRequest";
import { CreateResponse } from "../common/cc/arduino/cli/commands/v1/CreateResponse";
import { InitRequest } from "../common/cc/arduino/cli/commands/v1/InitRequest";
import { Instance } from "../common/cc/arduino/cli/commands/v1/Instance";
import { Port } from "../common/cc/arduino/cli/commands/v1/Port";
import { UploadResponse } from "../common/cc/arduino/cli/commands/v1/UploadResponse";
import { ProtoGrpcType } from "../common/commands";

export let client: ArduinoCoreServiceClient;
export let instance: Instance;

export async function initClient() {

  const packageDefinition = protoLoader.loadSync(
    "src/proto/cc/arduino/cli/commands/v1/commands.proto", {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    });

  const proto = grpc.loadPackageDefinition(packageDefinition) as unknown as ProtoGrpcType;

  // Establish connection with the server
  client = new proto.cc.arduino.cli.commands.v1.ArduinoCoreService("127.0.0.1:8000", grpc.credentials.createInsecure());

  const deadline = new Date();
  deadline.setSeconds(deadline.getSeconds() + 5);
  client.waitForReady(deadline, async (error: Error | undefined) => {
    if (error) {
      console.log(`Client connect error: ${error}`);
    } else {
      await createInstance();
    }
  });

  const createInstance = async () => {
    client.Create({}, (err: ServiceError | null, data: CreateResponse | undefined) => {
      if (err) {
        console.log("Create-Error: " + err)
      } else {
        console.log(data)
      }
    })
  }
}

const initInstance = async (i: Instance = {id: 1}) => {
  const initRequest: InitRequest = {instance: i};
  const stream = client.Init(initRequest);

  stream.on("end", () => {
    stream.destroy();
  })

  stream.on("error", (err: Error) => {
    console.log("Error")
    console.log(err.message);
    stream.destroy();
  })
}

const listAllBoards = async (inst: Instance = instance, args: string[] = [] ,hidden: boolean = false) => {
  const boardListAllRequest: BoardListAllRequest = {instance: inst, search_args: args, include_hidden_boards: hidden};

  client.BoardListAll(boardListAllRequest, (err: ServiceError | null, data: BoardListAllResponse | undefined) => {
    if (err) {
      console.log("Boards-Error: " + err)
    } else {
      console.log(data)
    }
  });
}

const listBoards = async (inst: Instance = instance, args: string[] = [] ,hidden: boolean = false) => {
  const boardListRequest: BoardListAllRequest = {instance: inst, search_args: args, include_hidden_boards: hidden};
  let port: Port | undefined;

  client.BoardList(boardListRequest, (err: ServiceError | null, data: BoardListResponse | undefined) => {
    if (err) {
      console.log("Boards-Error: " + err);
    } else if (data?.ports) {
      console.log(data?.ports);
      port = data?.ports[1].port || undefined;
    }
  });

  return port;
}

const uploadBin = async (inst: Instance = instance, boardName: string, port: Port | undefined, file: string) => {
  const uploadRequest = {instance: inst, fqbn: boardName, port: port, import_file: file};

  let stream: grpc.ClientReadableStream<UploadResponse>;
  try {
    stream = client.Upload(uploadRequest);
    stream.on("data", (data: UploadResponse) => {
      if (data.out_stream) {
        console.log(data.out_stream.toString());
      } else if (data.err_stream) {
        console.log(data.err_stream.toString());
      }

    })
    stream.on("end", () => {
      stream.destroy();
    })
    stream.on("status", (status) => {
      status.code === 0 ? console.log("success") : console.log(status.details);
    })
    stream.on("error", (err: Error) => {
      console.log(err.message);
    })
  } catch (e) {
    throw e;
  }
}

const burnBootloader = async (boardName: string, port: Port) => {
  const burnBootloaderRequest: BurnBootloaderRequest = {instance: instance, fqbn: boardName, port: port};

  return client.burnBootloader(burnBootloaderRequest);
}

await initClient();
await initInstance();
const myPort = {
    properties: {
      serialNumber: '85036313230351F0A110',
      vid: '0x2341',
      pid: '0x003D'
    },
    address: 'COM4',
    label: 'COM4',
    protocol: 'serial',
    protocol_label: 'Serial Port (USB)'
  }
;

//await listBoards({id: 1})
//await uploadBin({id: 1}, "arduino:sam:arduino_due_x_dbg", myPort, "./tests/tests.bin");
