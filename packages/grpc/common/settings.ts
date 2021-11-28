import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { SettingsServiceClient as _cc_arduino_cli_settings_v1_SettingsServiceClient, SettingsServiceDefinition as _cc_arduino_cli_settings_v1_SettingsServiceDefinition } from './cc/arduino/cli/settings/v1/SettingsService';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  cc: {
    arduino: {
      cli: {
        settings: {
          v1: {
            GetAllRequest: MessageTypeDefinition
            GetAllResponse: MessageTypeDefinition
            GetValueRequest: MessageTypeDefinition
            GetValueResponse: MessageTypeDefinition
            MergeRequest: MessageTypeDefinition
            MergeResponse: MessageTypeDefinition
            SetValueRequest: MessageTypeDefinition
            SetValueResponse: MessageTypeDefinition
            SettingsService: SubtypeConstructor<typeof grpc.Client, _cc_arduino_cli_settings_v1_SettingsServiceClient> & { service: _cc_arduino_cli_settings_v1_SettingsServiceDefinition }
            WriteRequest: MessageTypeDefinition
            WriteResponse: MessageTypeDefinition
          }
        }
      }
    }
  }
}

