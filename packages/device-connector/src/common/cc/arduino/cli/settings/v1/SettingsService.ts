// Original file: src\cc\arduino\cli\settings\v1\settings.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { GetAllRequest as _cc_arduino_cli_settings_v1_GetAllRequest, GetAllRequest__Output as _cc_arduino_cli_settings_v1_GetAllRequest__Output } from '../../../../../cc/arduino/cli/settings/v1/GetAllRequest';
import type { GetAllResponse as _cc_arduino_cli_settings_v1_GetAllResponse, GetAllResponse__Output as _cc_arduino_cli_settings_v1_GetAllResponse__Output } from '../../../../../cc/arduino/cli/settings/v1/GetAllResponse';
import type { GetValueRequest as _cc_arduino_cli_settings_v1_GetValueRequest, GetValueRequest__Output as _cc_arduino_cli_settings_v1_GetValueRequest__Output } from '../../../../../cc/arduino/cli/settings/v1/GetValueRequest';
import type { GetValueResponse as _cc_arduino_cli_settings_v1_GetValueResponse, GetValueResponse__Output as _cc_arduino_cli_settings_v1_GetValueResponse__Output } from '../../../../../cc/arduino/cli/settings/v1/GetValueResponse';
import type { MergeRequest as _cc_arduino_cli_settings_v1_MergeRequest, MergeRequest__Output as _cc_arduino_cli_settings_v1_MergeRequest__Output } from '../../../../../cc/arduino/cli/settings/v1/MergeRequest';
import type { MergeResponse as _cc_arduino_cli_settings_v1_MergeResponse, MergeResponse__Output as _cc_arduino_cli_settings_v1_MergeResponse__Output } from '../../../../../cc/arduino/cli/settings/v1/MergeResponse';
import type { SetValueRequest as _cc_arduino_cli_settings_v1_SetValueRequest, SetValueRequest__Output as _cc_arduino_cli_settings_v1_SetValueRequest__Output } from '../../../../../cc/arduino/cli/settings/v1/SetValueRequest';
import type { SetValueResponse as _cc_arduino_cli_settings_v1_SetValueResponse, SetValueResponse__Output as _cc_arduino_cli_settings_v1_SetValueResponse__Output } from '../../../../../cc/arduino/cli/settings/v1/SetValueResponse';
import type { WriteRequest as _cc_arduino_cli_settings_v1_WriteRequest, WriteRequest__Output as _cc_arduino_cli_settings_v1_WriteRequest__Output } from '../../../../../cc/arduino/cli/settings/v1/WriteRequest';
import type { WriteResponse as _cc_arduino_cli_settings_v1_WriteResponse, WriteResponse__Output as _cc_arduino_cli_settings_v1_WriteResponse__Output } from '../../../../../cc/arduino/cli/settings/v1/WriteResponse';

export interface SettingsServiceClient extends grpc.Client {
  GetAll(argument: _cc_arduino_cli_settings_v1_GetAllRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_settings_v1_GetAllResponse__Output>): grpc.ClientUnaryCall;
  GetAll(argument: _cc_arduino_cli_settings_v1_GetAllRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cc_arduino_cli_settings_v1_GetAllResponse__Output>): grpc.ClientUnaryCall;
  GetAll(argument: _cc_arduino_cli_settings_v1_GetAllRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_settings_v1_GetAllResponse__Output>): grpc.ClientUnaryCall;
  GetAll(argument: _cc_arduino_cli_settings_v1_GetAllRequest, callback: grpc.requestCallback<_cc_arduino_cli_settings_v1_GetAllResponse__Output>): grpc.ClientUnaryCall;
  getAll(argument: _cc_arduino_cli_settings_v1_GetAllRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_settings_v1_GetAllResponse__Output>): grpc.ClientUnaryCall;
  getAll(argument: _cc_arduino_cli_settings_v1_GetAllRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cc_arduino_cli_settings_v1_GetAllResponse__Output>): grpc.ClientUnaryCall;
  getAll(argument: _cc_arduino_cli_settings_v1_GetAllRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_settings_v1_GetAllResponse__Output>): grpc.ClientUnaryCall;
  getAll(argument: _cc_arduino_cli_settings_v1_GetAllRequest, callback: grpc.requestCallback<_cc_arduino_cli_settings_v1_GetAllResponse__Output>): grpc.ClientUnaryCall;
  
  GetValue(argument: _cc_arduino_cli_settings_v1_GetValueRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_settings_v1_GetValueResponse__Output>): grpc.ClientUnaryCall;
  GetValue(argument: _cc_arduino_cli_settings_v1_GetValueRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cc_arduino_cli_settings_v1_GetValueResponse__Output>): grpc.ClientUnaryCall;
  GetValue(argument: _cc_arduino_cli_settings_v1_GetValueRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_settings_v1_GetValueResponse__Output>): grpc.ClientUnaryCall;
  GetValue(argument: _cc_arduino_cli_settings_v1_GetValueRequest, callback: grpc.requestCallback<_cc_arduino_cli_settings_v1_GetValueResponse__Output>): grpc.ClientUnaryCall;
  getValue(argument: _cc_arduino_cli_settings_v1_GetValueRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_settings_v1_GetValueResponse__Output>): grpc.ClientUnaryCall;
  getValue(argument: _cc_arduino_cli_settings_v1_GetValueRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cc_arduino_cli_settings_v1_GetValueResponse__Output>): grpc.ClientUnaryCall;
  getValue(argument: _cc_arduino_cli_settings_v1_GetValueRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_settings_v1_GetValueResponse__Output>): grpc.ClientUnaryCall;
  getValue(argument: _cc_arduino_cli_settings_v1_GetValueRequest, callback: grpc.requestCallback<_cc_arduino_cli_settings_v1_GetValueResponse__Output>): grpc.ClientUnaryCall;
  
  Merge(argument: _cc_arduino_cli_settings_v1_MergeRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_settings_v1_MergeResponse__Output>): grpc.ClientUnaryCall;
  Merge(argument: _cc_arduino_cli_settings_v1_MergeRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cc_arduino_cli_settings_v1_MergeResponse__Output>): grpc.ClientUnaryCall;
  Merge(argument: _cc_arduino_cli_settings_v1_MergeRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_settings_v1_MergeResponse__Output>): grpc.ClientUnaryCall;
  Merge(argument: _cc_arduino_cli_settings_v1_MergeRequest, callback: grpc.requestCallback<_cc_arduino_cli_settings_v1_MergeResponse__Output>): grpc.ClientUnaryCall;
  merge(argument: _cc_arduino_cli_settings_v1_MergeRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_settings_v1_MergeResponse__Output>): grpc.ClientUnaryCall;
  merge(argument: _cc_arduino_cli_settings_v1_MergeRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cc_arduino_cli_settings_v1_MergeResponse__Output>): grpc.ClientUnaryCall;
  merge(argument: _cc_arduino_cli_settings_v1_MergeRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_settings_v1_MergeResponse__Output>): grpc.ClientUnaryCall;
  merge(argument: _cc_arduino_cli_settings_v1_MergeRequest, callback: grpc.requestCallback<_cc_arduino_cli_settings_v1_MergeResponse__Output>): grpc.ClientUnaryCall;
  
  SetValue(argument: _cc_arduino_cli_settings_v1_SetValueRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_settings_v1_SetValueResponse__Output>): grpc.ClientUnaryCall;
  SetValue(argument: _cc_arduino_cli_settings_v1_SetValueRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cc_arduino_cli_settings_v1_SetValueResponse__Output>): grpc.ClientUnaryCall;
  SetValue(argument: _cc_arduino_cli_settings_v1_SetValueRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_settings_v1_SetValueResponse__Output>): grpc.ClientUnaryCall;
  SetValue(argument: _cc_arduino_cli_settings_v1_SetValueRequest, callback: grpc.requestCallback<_cc_arduino_cli_settings_v1_SetValueResponse__Output>): grpc.ClientUnaryCall;
  setValue(argument: _cc_arduino_cli_settings_v1_SetValueRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_settings_v1_SetValueResponse__Output>): grpc.ClientUnaryCall;
  setValue(argument: _cc_arduino_cli_settings_v1_SetValueRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cc_arduino_cli_settings_v1_SetValueResponse__Output>): grpc.ClientUnaryCall;
  setValue(argument: _cc_arduino_cli_settings_v1_SetValueRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_settings_v1_SetValueResponse__Output>): grpc.ClientUnaryCall;
  setValue(argument: _cc_arduino_cli_settings_v1_SetValueRequest, callback: grpc.requestCallback<_cc_arduino_cli_settings_v1_SetValueResponse__Output>): grpc.ClientUnaryCall;
  
  Write(argument: _cc_arduino_cli_settings_v1_WriteRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_settings_v1_WriteResponse__Output>): grpc.ClientUnaryCall;
  Write(argument: _cc_arduino_cli_settings_v1_WriteRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cc_arduino_cli_settings_v1_WriteResponse__Output>): grpc.ClientUnaryCall;
  Write(argument: _cc_arduino_cli_settings_v1_WriteRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_settings_v1_WriteResponse__Output>): grpc.ClientUnaryCall;
  Write(argument: _cc_arduino_cli_settings_v1_WriteRequest, callback: grpc.requestCallback<_cc_arduino_cli_settings_v1_WriteResponse__Output>): grpc.ClientUnaryCall;
  write(argument: _cc_arduino_cli_settings_v1_WriteRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_settings_v1_WriteResponse__Output>): grpc.ClientUnaryCall;
  write(argument: _cc_arduino_cli_settings_v1_WriteRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cc_arduino_cli_settings_v1_WriteResponse__Output>): grpc.ClientUnaryCall;
  write(argument: _cc_arduino_cli_settings_v1_WriteRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_settings_v1_WriteResponse__Output>): grpc.ClientUnaryCall;
  write(argument: _cc_arduino_cli_settings_v1_WriteRequest, callback: grpc.requestCallback<_cc_arduino_cli_settings_v1_WriteResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface SettingsServiceHandlers extends grpc.UntypedServiceImplementation {
  GetAll: grpc.handleUnaryCall<_cc_arduino_cli_settings_v1_GetAllRequest__Output, _cc_arduino_cli_settings_v1_GetAllResponse>;
  
  GetValue: grpc.handleUnaryCall<_cc_arduino_cli_settings_v1_GetValueRequest__Output, _cc_arduino_cli_settings_v1_GetValueResponse>;
  
  Merge: grpc.handleUnaryCall<_cc_arduino_cli_settings_v1_MergeRequest__Output, _cc_arduino_cli_settings_v1_MergeResponse>;
  
  SetValue: grpc.handleUnaryCall<_cc_arduino_cli_settings_v1_SetValueRequest__Output, _cc_arduino_cli_settings_v1_SetValueResponse>;
  
  Write: grpc.handleUnaryCall<_cc_arduino_cli_settings_v1_WriteRequest__Output, _cc_arduino_cli_settings_v1_WriteResponse>;
  
}

export interface SettingsServiceDefinition extends grpc.ServiceDefinition {
  GetAll: MethodDefinition<_cc_arduino_cli_settings_v1_GetAllRequest, _cc_arduino_cli_settings_v1_GetAllResponse, _cc_arduino_cli_settings_v1_GetAllRequest__Output, _cc_arduino_cli_settings_v1_GetAllResponse__Output>
  GetValue: MethodDefinition<_cc_arduino_cli_settings_v1_GetValueRequest, _cc_arduino_cli_settings_v1_GetValueResponse, _cc_arduino_cli_settings_v1_GetValueRequest__Output, _cc_arduino_cli_settings_v1_GetValueResponse__Output>
  Merge: MethodDefinition<_cc_arduino_cli_settings_v1_MergeRequest, _cc_arduino_cli_settings_v1_MergeResponse, _cc_arduino_cli_settings_v1_MergeRequest__Output, _cc_arduino_cli_settings_v1_MergeResponse__Output>
  SetValue: MethodDefinition<_cc_arduino_cli_settings_v1_SetValueRequest, _cc_arduino_cli_settings_v1_SetValueResponse, _cc_arduino_cli_settings_v1_SetValueRequest__Output, _cc_arduino_cli_settings_v1_SetValueResponse__Output>
  Write: MethodDefinition<_cc_arduino_cli_settings_v1_WriteRequest, _cc_arduino_cli_settings_v1_WriteResponse, _cc_arduino_cli_settings_v1_WriteRequest__Output, _cc_arduino_cli_settings_v1_WriteResponse__Output>
}
