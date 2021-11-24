// Original file: src\cc\arduino\cli\commands\v1\commands.proto

import type { Instance as _cc_arduino_cli_commands_v1_Instance, Instance__Output as _cc_arduino_cli_commands_v1_Instance__Output } from '../../../../../cc/arduino/cli/commands/v1/Instance';

export interface LoadSketchRequest {
  'instance'?: (_cc_arduino_cli_commands_v1_Instance | null);
  'sketch_path'?: (string);
}

export interface LoadSketchRequest__Output {
  'instance': (_cc_arduino_cli_commands_v1_Instance__Output | null);
  'sketch_path': (string);
}
