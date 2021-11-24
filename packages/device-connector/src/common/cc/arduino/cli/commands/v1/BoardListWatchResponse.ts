// Original file: src\cc\arduino\cli\commands\v1\board.proto

import type { DetectedPort as _cc_arduino_cli_commands_v1_DetectedPort, DetectedPort__Output as _cc_arduino_cli_commands_v1_DetectedPort__Output } from '../../../../../cc/arduino/cli/commands/v1/DetectedPort';

export interface BoardListWatchResponse {
  'event_type'?: (string);
  'port'?: (_cc_arduino_cli_commands_v1_DetectedPort | null);
  'error'?: (string);
}

export interface BoardListWatchResponse__Output {
  'event_type': (string);
  'port': (_cc_arduino_cli_commands_v1_DetectedPort__Output | null);
  'error': (string);
}
