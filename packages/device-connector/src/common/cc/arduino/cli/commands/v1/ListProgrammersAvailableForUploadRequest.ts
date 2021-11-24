// Original file: src\cc\arduino\cli\commands\v1\upload.proto

import type { Instance as _cc_arduino_cli_commands_v1_Instance, Instance__Output as _cc_arduino_cli_commands_v1_Instance__Output } from '../../../../../cc/arduino/cli/commands/v1/Instance';

export interface ListProgrammersAvailableForUploadRequest {
  'instance'?: (_cc_arduino_cli_commands_v1_Instance | null);
  'fqbn'?: (string);
}

export interface ListProgrammersAvailableForUploadRequest__Output {
  'instance': (_cc_arduino_cli_commands_v1_Instance__Output | null);
  'fqbn': (string);
}
