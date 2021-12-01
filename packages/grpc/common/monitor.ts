import type * as grpc from '@grpc/grpc-js';
import type { EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { MonitorServiceClient as _cc_arduino_cli_monitor_v1_MonitorServiceClient, MonitorServiceDefinition as _cc_arduino_cli_monitor_v1_MonitorServiceDefinition } from './cc/arduino/cli/monitor/v1/MonitorService';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  cc: {
    arduino: {
      cli: {
        monitor: {
          v1: {
            MonitorConfig: MessageTypeDefinition
            MonitorService: SubtypeConstructor<typeof grpc.Client, _cc_arduino_cli_monitor_v1_MonitorServiceClient> & { service: _cc_arduino_cli_monitor_v1_MonitorServiceDefinition }
            StreamingOpenRequest: MessageTypeDefinition
            StreamingOpenResponse: MessageTypeDefinition
          }
        }
      }
    }
  }
  google: {
    protobuf: {
      ListValue: MessageTypeDefinition
      NullValue: EnumTypeDefinition
      Struct: MessageTypeDefinition
      Value: MessageTypeDefinition
    }
  }
}

