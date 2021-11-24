// Original file: src\cc\arduino\cli\commands\v1\board.proto

import type { Help as _cc_arduino_cli_commands_v1_Help, Help__Output as _cc_arduino_cli_commands_v1_Help__Output } from '../../../../../cc/arduino/cli/commands/v1/Help';

export interface Package {
  'maintainer'?: (string);
  'url'?: (string);
  'website_url'?: (string);
  'email'?: (string);
  'name'?: (string);
  'help'?: (_cc_arduino_cli_commands_v1_Help | null);
}

export interface Package__Output {
  'maintainer': (string);
  'url': (string);
  'website_url': (string);
  'email': (string);
  'name': (string);
  'help': (_cc_arduino_cli_commands_v1_Help__Output | null);
}
