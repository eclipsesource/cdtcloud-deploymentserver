// Original file: src\cc\arduino\cli\commands\v1\lib.proto

import type { LibraryRelease as _cc_arduino_cli_commands_v1_LibraryRelease, LibraryRelease__Output as _cc_arduino_cli_commands_v1_LibraryRelease__Output } from '../../../../../cc/arduino/cli/commands/v1/LibraryRelease';

export interface SearchedLibrary {
  'name'?: (string);
  'releases'?: ({[key: string]: _cc_arduino_cli_commands_v1_LibraryRelease});
  'latest'?: (_cc_arduino_cli_commands_v1_LibraryRelease | null);
}

export interface SearchedLibrary__Output {
  'name': (string);
  'releases': ({[key: string]: _cc_arduino_cli_commands_v1_LibraryRelease__Output});
  'latest': (_cc_arduino_cli_commands_v1_LibraryRelease__Output | null);
}
