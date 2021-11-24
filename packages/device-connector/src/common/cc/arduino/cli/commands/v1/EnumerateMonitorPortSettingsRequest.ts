// Original file: src\cc\arduino\cli\commands\v1\monitor.proto

import type { Instance as _cc_arduino_cli_commands_v1_Instance, Instance__Output as _cc_arduino_cli_commands_v1_Instance__Output } from '../../../../../cc/arduino/cli/commands/v1/Instance';

export interface EnumerateMonitorPortSettingsRequest {
  'instance'?: (_cc_arduino_cli_commands_v1_Instance | null);
  'port_protocol'?: (string);
  'fqbn'?: (string);
}

export interface EnumerateMonitorPortSettingsRequest__Output {
  'instance': (_cc_arduino_cli_commands_v1_Instance__Output | null);
  'port_protocol': (string);
  'fqbn': (string);
}
