// Original file: src\cc\arduino\cli\commands\v1\board.proto

import type { Instance as _cc_arduino_cli_commands_v1_Instance, Instance__Output as _cc_arduino_cli_commands_v1_Instance__Output } from '../../../../../cc/arduino/cli/commands/v1/Instance';

export interface BoardSearchRequest {
  'instance'?: (_cc_arduino_cli_commands_v1_Instance | null);
  'search_args'?: (string);
  'include_hidden_boards'?: (boolean);
}

export interface BoardSearchRequest__Output {
  'instance': (_cc_arduino_cli_commands_v1_Instance__Output | null);
  'search_args': (string);
  'include_hidden_boards': (boolean);
}
