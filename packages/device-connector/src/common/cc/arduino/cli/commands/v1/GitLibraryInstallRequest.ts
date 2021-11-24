// Original file: src\cc\arduino\cli\commands\v1\lib.proto

import type { Instance as _cc_arduino_cli_commands_v1_Instance, Instance__Output as _cc_arduino_cli_commands_v1_Instance__Output } from '../../../../../cc/arduino/cli/commands/v1/Instance';

export interface GitLibraryInstallRequest {
  'instance'?: (_cc_arduino_cli_commands_v1_Instance | null);
  'url'?: (string);
  'overwrite'?: (boolean);
}

export interface GitLibraryInstallRequest__Output {
  'instance': (_cc_arduino_cli_commands_v1_Instance__Output | null);
  'url': (string);
  'overwrite': (boolean);
}
