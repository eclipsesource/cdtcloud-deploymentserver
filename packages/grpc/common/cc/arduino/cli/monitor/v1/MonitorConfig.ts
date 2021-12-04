// Original file: src\cc\arduino\cli\monitor\v1\monitor.proto

import type { Struct as _google_protobuf_Struct, Struct__Output as _google_protobuf_Struct__Output } from '../../../../../google/protobuf/Struct';

// Original file: src\cc\arduino\cli\monitor\v1\monitor.proto

export enum _cc_arduino_cli_monitor_v1_MonitorConfig_TargetType {
  TARGET_TYPE_SERIAL = 0,
  TARGET_TYPE_NULL = 99,
}

export interface MonitorConfig {
  'target'?: (string);
  'type'?: (_cc_arduino_cli_monitor_v1_MonitorConfig_TargetType | keyof typeof _cc_arduino_cli_monitor_v1_MonitorConfig_TargetType);
  'additional_config'?: (_google_protobuf_Struct | null);
  'recv_rate_limit_buffer'?: (number);
}

export interface MonitorConfig__Output {
  'target': (string);
  'type': (keyof typeof _cc_arduino_cli_monitor_v1_MonitorConfig_TargetType);
  'additional_config': (_google_protobuf_Struct__Output | null);
  'recv_rate_limit_buffer': (number);
}
