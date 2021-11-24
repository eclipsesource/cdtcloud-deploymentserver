// Original file: src\cc\arduino\cli\commands\v1\lib.proto

import type { SearchedLibrary as _cc_arduino_cli_commands_v1_SearchedLibrary, SearchedLibrary__Output as _cc_arduino_cli_commands_v1_SearchedLibrary__Output } from '../../../../../cc/arduino/cli/commands/v1/SearchedLibrary';
import type { LibrarySearchStatus as _cc_arduino_cli_commands_v1_LibrarySearchStatus } from '../../../../../cc/arduino/cli/commands/v1/LibrarySearchStatus';

export interface LibrarySearchResponse {
  'libraries'?: (_cc_arduino_cli_commands_v1_SearchedLibrary)[];
  'status'?: (_cc_arduino_cli_commands_v1_LibrarySearchStatus | keyof typeof _cc_arduino_cli_commands_v1_LibrarySearchStatus);
}

export interface LibrarySearchResponse__Output {
  'libraries': (_cc_arduino_cli_commands_v1_SearchedLibrary__Output)[];
  'status': (keyof typeof _cc_arduino_cli_commands_v1_LibrarySearchStatus);
}
