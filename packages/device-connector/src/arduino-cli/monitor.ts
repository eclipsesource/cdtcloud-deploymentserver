import * as protoLoader from '@grpc/proto-loader'
import * as grpc from '@grpc/grpc-js'
import { ProtoGrpcType as ArduinoProtoGrpcType } from 'arduino-cli_proto_ts/common/monitor'
import { logger } from '../util/logger'
import { Port__Output as Port } from 'arduino-cli_proto_ts/common/cc/arduino/cli/commands/v1/Port'
import { StreamingOpenRequest } from 'arduino-cli_proto_ts/common/cc/arduino/cli/monitor/v1/StreamingOpenRequest'
import {
  _cc_arduino_cli_monitor_v1_MonitorConfig_TargetType as MonitorTargetType,
  MonitorConfig
} from 'arduino-cli_proto_ts/common/cc/arduino/cli/monitor/v1/MonitorConfig'
import { StreamingOpenResponse__Output as StreamingOpenResponse } from 'arduino-cli_proto_ts/common/cc/arduino/cli/monitor/v1/StreamingOpenResponse'
import { promisify } from 'util'

// Create proto loader for grpc connection
const loadedProto = protoLoader.loadSync('../grpc/proto/cc/arduino/cli/monitor/v1/monitor.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
})

const arduinoGrpcObject = grpc.loadPackageDefinition(loadedProto) as unknown as ArduinoProtoGrpcType

export const monitor = async (port: Port): Promise<grpc.ClientDuplexStream<StreamingOpenRequest, StreamingOpenResponse>> => {
  // Set deadline until connection failure to 5 seconds
  const deadline = new Date()
  deadline.setSeconds(deadline.getSeconds() + 5)

  // Connect grpc and wait for ready
  const arduinoMonitorClient = new arduinoGrpcObject.cc.arduino.cli.monitor.v1.MonitorService('127.0.0.1:50051', grpc.credentials.createInsecure())
  try {
    await promisify(arduinoMonitorClient.waitForReady.bind(arduinoMonitorClient))(deadline)
  } catch (e) {
    throw new Error('Monitor-Stream failed', { cause: e })
  }

  // Initiate variables for monitor request
  const monitorConfig: MonitorConfig = { target: port.address, type: MonitorTargetType.TARGET_TYPE_SERIAL }
  const monitorRequest: StreamingOpenRequest = { config: monitorConfig }

  // Open stream
  const stream = arduinoMonitorClient.streamingOpen()
  stream.once('readable', () => {
    logger.info(`Start monitoring output of device on port ${port.address} (${port.protocol})`)
  })

  stream.on('data', (data: StreamingOpenResponse) => {
    if (data != null) {
      const outData = data.data.toString()
      if (outData.match(/^\s*$/) != null) {
        logger.trace(`Monitoring ${port.address} (Empty line): ${outData}`)
      } else {
        logger.debug(`Monitoring ${port.address}: ${outData}`)
      }
    }
  })

  stream.on('close', () => {
    logger.info(`Closing monitoring of device on port ${port.address} (${port.protocol})`)
    arduinoMonitorClient.close()
  })

  // Start monitoring
  await promisify(stream.write.bind(stream))(monitorRequest)

  return stream
}
