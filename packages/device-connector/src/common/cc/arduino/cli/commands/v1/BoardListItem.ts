// Original file: src\cc\arduino\cli\commands\v1\board.proto

import type { Platform as _cc_arduino_cli_commands_v1_Platform, Platform__Output as _cc_arduino_cli_commands_v1_Platform__Output } from '../../../../../cc/arduino/cli/commands/v1/Platform';

export interface BoardListItem {
  'name'?: (string);
  'fqbn'?: (string);
  'is_hidden'?: (boolean);
  'platform'?: (_cc_arduino_cli_commands_v1_Platform | null);
}

export interface BoardListItem__Output {
  'name': (string);
  'fqbn': (string);
  'is_hidden': (boolean);
  'platform': (_cc_arduino_cli_commands_v1_Platform__Output | null);
}
