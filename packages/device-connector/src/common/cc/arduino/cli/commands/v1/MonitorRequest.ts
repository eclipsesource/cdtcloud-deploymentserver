// Original file: src\cc\arduino\cli\commands\v1\monitor.proto

import type { Instance as _cc_arduino_cli_commands_v1_Instance, Instance__Output as _cc_arduino_cli_commands_v1_Instance__Output } from '../../../../../cc/arduino/cli/commands/v1/Instance';
import type { Port as _cc_arduino_cli_commands_v1_Port, Port__Output as _cc_arduino_cli_commands_v1_Port__Output } from '../../../../../cc/arduino/cli/commands/v1/Port';
import type { MonitorPortConfiguration as _cc_arduino_cli_commands_v1_MonitorPortConfiguration, MonitorPortConfiguration__Output as _cc_arduino_cli_commands_v1_MonitorPortConfiguration__Output } from '../../../../../cc/arduino/cli/commands/v1/MonitorPortConfiguration';

export interface MonitorRequest {
  'instance'?: (_cc_arduino_cli_commands_v1_Instance | null);
  'port'?: (_cc_arduino_cli_commands_v1_Port | null);
  'fqbn'?: (string);
  'tx_data'?: (Buffer | Uint8Array | string);
  'port_configuration'?: (_cc_arduino_cli_commands_v1_MonitorPortConfiguration | null);
}

export interface MonitorRequest__Output {
  'instance': (_cc_arduino_cli_commands_v1_Instance__Output | null);
  'port': (_cc_arduino_cli_commands_v1_Port__Output | null);
  'fqbn': (string);
  'tx_data': (Buffer);
  'port_configuration': (_cc_arduino_cli_commands_v1_MonitorPortConfiguration__Output | null);
}
