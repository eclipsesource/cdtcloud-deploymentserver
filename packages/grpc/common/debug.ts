import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { DebugServiceClient as _cc_arduino_cli_debug_v1_DebugServiceClient, DebugServiceDefinition as _cc_arduino_cli_debug_v1_DebugServiceDefinition } from './cc/arduino/cli/debug/v1/DebugService';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  cc: {
    arduino: {
      cli: {
        commands: {
          v1: {
            Board: MessageTypeDefinition
            DownloadProgress: MessageTypeDefinition
            Instance: MessageTypeDefinition
            Platform: MessageTypeDefinition
            Port: MessageTypeDefinition
            Programmer: MessageTypeDefinition
            TaskProgress: MessageTypeDefinition
          }
        }
        debug: {
          v1: {
            DebugConfigRequest: MessageTypeDefinition
            DebugRequest: MessageTypeDefinition
            DebugResponse: MessageTypeDefinition
            DebugService: SubtypeConstructor<typeof grpc.Client, _cc_arduino_cli_debug_v1_DebugServiceClient> & { service: _cc_arduino_cli_debug_v1_DebugServiceDefinition }
            GetDebugConfigResponse: MessageTypeDefinition
          }
        }
      }
    }
  }
}

