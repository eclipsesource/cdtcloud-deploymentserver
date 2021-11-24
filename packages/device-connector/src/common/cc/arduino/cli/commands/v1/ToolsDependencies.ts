// Original file: src\cc\arduino\cli\commands\v1\board.proto

import type { Systems as _cc_arduino_cli_commands_v1_Systems, Systems__Output as _cc_arduino_cli_commands_v1_Systems__Output } from '../../../../../cc/arduino/cli/commands/v1/Systems';

export interface ToolsDependencies {
  'packager'?: (string);
  'name'?: (string);
  'version'?: (string);
  'systems'?: (_cc_arduino_cli_commands_v1_Systems)[];
}

export interface ToolsDependencies__Output {
  'packager': (string);
  'name': (string);
  'version': (string);
  'systems': (_cc_arduino_cli_commands_v1_Systems__Output)[];
}
