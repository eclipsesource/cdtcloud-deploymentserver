// Original file: src\cc\arduino\cli\commands\v1\commands.proto

import type { InstalledLibrary as _cc_arduino_cli_commands_v1_InstalledLibrary, InstalledLibrary__Output as _cc_arduino_cli_commands_v1_InstalledLibrary__Output } from '../../../../../cc/arduino/cli/commands/v1/InstalledLibrary';
import type { Platform as _cc_arduino_cli_commands_v1_Platform, Platform__Output as _cc_arduino_cli_commands_v1_Platform__Output } from '../../../../../cc/arduino/cli/commands/v1/Platform';

export interface OutdatedResponse {
  'outdated_libraries'?: (_cc_arduino_cli_commands_v1_InstalledLibrary)[];
  'outdated_platforms'?: (_cc_arduino_cli_commands_v1_Platform)[];
}

export interface OutdatedResponse__Output {
  'outdated_libraries': (_cc_arduino_cli_commands_v1_InstalledLibrary__Output)[];
  'outdated_platforms': (_cc_arduino_cli_commands_v1_Platform__Output)[];
}
