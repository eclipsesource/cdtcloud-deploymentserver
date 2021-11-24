// Original file: src\cc\arduino\cli\debug\v1\debug.proto

import type { Instance as _cc_arduino_cli_commands_v1_Instance, Instance__Output as _cc_arduino_cli_commands_v1_Instance__Output } from '../../../../../cc/arduino/cli/commands/v1/Instance';
import type { Port as _cc_arduino_cli_commands_v1_Port, Port__Output as _cc_arduino_cli_commands_v1_Port__Output } from '../../../../../cc/arduino/cli/commands/v1/Port';

export interface DebugConfigRequest {
  'instance'?: (_cc_arduino_cli_commands_v1_Instance | null);
  'fqbn'?: (string);
  'sketch_path'?: (string);
  'port'?: (_cc_arduino_cli_commands_v1_Port | null);
  'interpreter'?: (string);
  'import_dir'?: (string);
  'programmer'?: (string);
}

export interface DebugConfigRequest__Output {
  'instance': (_cc_arduino_cli_commands_v1_Instance__Output | null);
  'fqbn': (string);
  'sketch_path': (string);
  'port': (_cc_arduino_cli_commands_v1_Port__Output | null);
  'interpreter': (string);
  'import_dir': (string);
  'programmer': (string);
}
