// Original file: src\cc\arduino\cli\commands\v1\board.proto

import type { BoardListItem as _cc_arduino_cli_commands_v1_BoardListItem, BoardListItem__Output as _cc_arduino_cli_commands_v1_BoardListItem__Output } from '../../../../../cc/arduino/cli/commands/v1/BoardListItem';
import type { Port as _cc_arduino_cli_commands_v1_Port, Port__Output as _cc_arduino_cli_commands_v1_Port__Output } from '../../../../../cc/arduino/cli/commands/v1/Port';

export interface DetectedPort {
  'matching_boards'?: (_cc_arduino_cli_commands_v1_BoardListItem)[];
  'port'?: (_cc_arduino_cli_commands_v1_Port | null);
}

export interface DetectedPort__Output {
  'matching_boards': (_cc_arduino_cli_commands_v1_BoardListItem__Output)[];
  'port': (_cc_arduino_cli_commands_v1_Port__Output | null);
}
