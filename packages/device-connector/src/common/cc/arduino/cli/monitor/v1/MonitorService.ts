// Original file: src\cc\arduino\cli\monitor\v1\monitor.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { StreamingOpenRequest as _cc_arduino_cli_monitor_v1_StreamingOpenRequest, StreamingOpenRequest__Output as _cc_arduino_cli_monitor_v1_StreamingOpenRequest__Output } from '../../../../../cc/arduino/cli/monitor/v1/StreamingOpenRequest';
import type { StreamingOpenResponse as _cc_arduino_cli_monitor_v1_StreamingOpenResponse, StreamingOpenResponse__Output as _cc_arduino_cli_monitor_v1_StreamingOpenResponse__Output } from '../../../../../cc/arduino/cli/monitor/v1/StreamingOpenResponse';

export interface MonitorServiceClient extends grpc.Client {
  StreamingOpen(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_cc_arduino_cli_monitor_v1_StreamingOpenRequest, _cc_arduino_cli_monitor_v1_StreamingOpenResponse__Output>;
  StreamingOpen(options?: grpc.CallOptions): grpc.ClientDuplexStream<_cc_arduino_cli_monitor_v1_StreamingOpenRequest, _cc_arduino_cli_monitor_v1_StreamingOpenResponse__Output>;
  streamingOpen(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_cc_arduino_cli_monitor_v1_StreamingOpenRequest, _cc_arduino_cli_monitor_v1_StreamingOpenResponse__Output>;
  streamingOpen(options?: grpc.CallOptions): grpc.ClientDuplexStream<_cc_arduino_cli_monitor_v1_StreamingOpenRequest, _cc_arduino_cli_monitor_v1_StreamingOpenResponse__Output>;
  
}

export interface MonitorServiceHandlers extends grpc.UntypedServiceImplementation {
  StreamingOpen: grpc.handleBidiStreamingCall<_cc_arduino_cli_monitor_v1_StreamingOpenRequest__Output, _cc_arduino_cli_monitor_v1_StreamingOpenResponse>;
  
}

export interface MonitorServiceDefinition extends grpc.ServiceDefinition {
  StreamingOpen: MethodDefinition<_cc_arduino_cli_monitor_v1_StreamingOpenRequest, _cc_arduino_cli_monitor_v1_StreamingOpenResponse, _cc_arduino_cli_monitor_v1_StreamingOpenRequest__Output, _cc_arduino_cli_monitor_v1_StreamingOpenResponse__Output>
}
