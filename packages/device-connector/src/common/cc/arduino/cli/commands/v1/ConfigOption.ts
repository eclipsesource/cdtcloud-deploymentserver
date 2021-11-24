// Original file: src\cc\arduino\cli\commands\v1\board.proto

import type { ConfigValue as _cc_arduino_cli_commands_v1_ConfigValue, ConfigValue__Output as _cc_arduino_cli_commands_v1_ConfigValue__Output } from '../../../../../cc/arduino/cli/commands/v1/ConfigValue';

export interface ConfigOption {
  'option'?: (string);
  'option_label'?: (string);
  'values'?: (_cc_arduino_cli_commands_v1_ConfigValue)[];
}

export interface ConfigOption__Output {
  'option': (string);
  'option_label': (string);
  'values': (_cc_arduino_cli_commands_v1_ConfigValue__Output)[];
}
