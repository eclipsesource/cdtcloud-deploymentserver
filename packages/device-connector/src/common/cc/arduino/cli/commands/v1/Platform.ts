// Original file: src\cc\arduino\cli\commands\v1\common.proto

import type { Board as _cc_arduino_cli_commands_v1_Board, Board__Output as _cc_arduino_cli_commands_v1_Board__Output } from '../../../../../cc/arduino/cli/commands/v1/Board';

export interface Platform {
  'id'?: (string);
  'installed'?: (string);
  'latest'?: (string);
  'name'?: (string);
  'maintainer'?: (string);
  'website'?: (string);
  'email'?: (string);
  'boards'?: (_cc_arduino_cli_commands_v1_Board)[];
  'manually_installed'?: (boolean);
  'deprecated'?: (boolean);
}

export interface Platform__Output {
  'id': (string);
  'installed': (string);
  'latest': (string);
  'name': (string);
  'maintainer': (string);
  'website': (string);
  'email': (string);
  'boards': (_cc_arduino_cli_commands_v1_Board__Output)[];
  'manually_installed': (boolean);
  'deprecated': (boolean);
}
