// Original file: src\cc\arduino\cli\commands\v1\lib.proto

import type { Library as _cc_arduino_cli_commands_v1_Library, Library__Output as _cc_arduino_cli_commands_v1_Library__Output } from '../../../../../cc/arduino/cli/commands/v1/Library';
import type { LibraryRelease as _cc_arduino_cli_commands_v1_LibraryRelease, LibraryRelease__Output as _cc_arduino_cli_commands_v1_LibraryRelease__Output } from '../../../../../cc/arduino/cli/commands/v1/LibraryRelease';

export interface InstalledLibrary {
  'library'?: (_cc_arduino_cli_commands_v1_Library | null);
  'release'?: (_cc_arduino_cli_commands_v1_LibraryRelease | null);
}

export interface InstalledLibrary__Output {
  'library': (_cc_arduino_cli_commands_v1_Library__Output | null);
  'release': (_cc_arduino_cli_commands_v1_LibraryRelease__Output | null);
}
