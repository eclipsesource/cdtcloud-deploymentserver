// Original file: src\cc\arduino\cli\commands\v1\lib.proto

import type { Instance as _cc_arduino_cli_commands_v1_Instance, Instance__Output as _cc_arduino_cli_commands_v1_Instance__Output } from '../../../../../cc/arduino/cli/commands/v1/Instance';

export interface LibraryUninstallRequest {
  'instance'?: (_cc_arduino_cli_commands_v1_Instance | null);
  'name'?: (string);
  'version'?: (string);
}

export interface LibraryUninstallRequest__Output {
  'instance': (_cc_arduino_cli_commands_v1_Instance__Output | null);
  'name': (string);
  'version': (string);
}
