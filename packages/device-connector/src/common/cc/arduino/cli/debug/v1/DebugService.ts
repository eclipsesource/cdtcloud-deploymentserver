// Original file: src\cc\arduino\cli\debug\v1\debug.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { DebugConfigRequest as _cc_arduino_cli_debug_v1_DebugConfigRequest, DebugConfigRequest__Output as _cc_arduino_cli_debug_v1_DebugConfigRequest__Output } from '../../../../../cc/arduino/cli/debug/v1/DebugConfigRequest';
import type { DebugRequest as _cc_arduino_cli_debug_v1_DebugRequest, DebugRequest__Output as _cc_arduino_cli_debug_v1_DebugRequest__Output } from '../../../../../cc/arduino/cli/debug/v1/DebugRequest';
import type { DebugResponse as _cc_arduino_cli_debug_v1_DebugResponse, DebugResponse__Output as _cc_arduino_cli_debug_v1_DebugResponse__Output } from '../../../../../cc/arduino/cli/debug/v1/DebugResponse';
import type { GetDebugConfigResponse as _cc_arduino_cli_debug_v1_GetDebugConfigResponse, GetDebugConfigResponse__Output as _cc_arduino_cli_debug_v1_GetDebugConfigResponse__Output } from '../../../../../cc/arduino/cli/debug/v1/GetDebugConfigResponse';

export interface DebugServiceClient extends grpc.Client {
  Debug(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_cc_arduino_cli_debug_v1_DebugRequest, _cc_arduino_cli_debug_v1_DebugResponse__Output>;
  Debug(options?: grpc.CallOptions): grpc.ClientDuplexStream<_cc_arduino_cli_debug_v1_DebugRequest, _cc_arduino_cli_debug_v1_DebugResponse__Output>;
  debug(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_cc_arduino_cli_debug_v1_DebugRequest, _cc_arduino_cli_debug_v1_DebugResponse__Output>;
  debug(options?: grpc.CallOptions): grpc.ClientDuplexStream<_cc_arduino_cli_debug_v1_DebugRequest, _cc_arduino_cli_debug_v1_DebugResponse__Output>;
  
  GetDebugConfig(argument: _cc_arduino_cli_debug_v1_DebugConfigRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_debug_v1_GetDebugConfigResponse__Output>): grpc.ClientUnaryCall;
  GetDebugConfig(argument: _cc_arduino_cli_debug_v1_DebugConfigRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cc_arduino_cli_debug_v1_GetDebugConfigResponse__Output>): grpc.ClientUnaryCall;
  GetDebugConfig(argument: _cc_arduino_cli_debug_v1_DebugConfigRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_debug_v1_GetDebugConfigResponse__Output>): grpc.ClientUnaryCall;
  GetDebugConfig(argument: _cc_arduino_cli_debug_v1_DebugConfigRequest, callback: grpc.requestCallback<_cc_arduino_cli_debug_v1_GetDebugConfigResponse__Output>): grpc.ClientUnaryCall;
  getDebugConfig(argument: _cc_arduino_cli_debug_v1_DebugConfigRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_debug_v1_GetDebugConfigResponse__Output>): grpc.ClientUnaryCall;
  getDebugConfig(argument: _cc_arduino_cli_debug_v1_DebugConfigRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cc_arduino_cli_debug_v1_GetDebugConfigResponse__Output>): grpc.ClientUnaryCall;
  getDebugConfig(argument: _cc_arduino_cli_debug_v1_DebugConfigRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_debug_v1_GetDebugConfigResponse__Output>): grpc.ClientUnaryCall;
  getDebugConfig(argument: _cc_arduino_cli_debug_v1_DebugConfigRequest, callback: grpc.requestCallback<_cc_arduino_cli_debug_v1_GetDebugConfigResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface DebugServiceHandlers extends grpc.UntypedServiceImplementation {
  Debug: grpc.handleBidiStreamingCall<_cc_arduino_cli_debug_v1_DebugRequest__Output, _cc_arduino_cli_debug_v1_DebugResponse>;
  
  GetDebugConfig: grpc.handleUnaryCall<_cc_arduino_cli_debug_v1_DebugConfigRequest__Output, _cc_arduino_cli_debug_v1_GetDebugConfigResponse>;
  
}

export interface DebugServiceDefinition extends grpc.ServiceDefinition {
  Debug: MethodDefinition<_cc_arduino_cli_debug_v1_DebugRequest, _cc_arduino_cli_debug_v1_DebugResponse, _cc_arduino_cli_debug_v1_DebugRequest__Output, _cc_arduino_cli_debug_v1_DebugResponse__Output>
  GetDebugConfig: MethodDefinition<_cc_arduino_cli_debug_v1_DebugConfigRequest, _cc_arduino_cli_debug_v1_GetDebugConfigResponse, _cc_arduino_cli_debug_v1_DebugConfigRequest__Output, _cc_arduino_cli_debug_v1_GetDebugConfigResponse__Output>
}
