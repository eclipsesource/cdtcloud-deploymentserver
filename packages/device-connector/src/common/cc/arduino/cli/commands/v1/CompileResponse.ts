// Original file: src\cc\arduino\cli\commands\v1\compile.proto

import type { Library as _cc_arduino_cli_commands_v1_Library, Library__Output as _cc_arduino_cli_commands_v1_Library__Output } from '../../../../../cc/arduino/cli/commands/v1/Library';
import type { ExecutableSectionSize as _cc_arduino_cli_commands_v1_ExecutableSectionSize, ExecutableSectionSize__Output as _cc_arduino_cli_commands_v1_ExecutableSectionSize__Output } from '../../../../../cc/arduino/cli/commands/v1/ExecutableSectionSize';

export interface CompileResponse {
  'out_stream'?: (Buffer | Uint8Array | string);
  'err_stream'?: (Buffer | Uint8Array | string);
  'build_path'?: (string);
  'used_libraries'?: (_cc_arduino_cli_commands_v1_Library)[];
  'executable_sections_size'?: (_cc_arduino_cli_commands_v1_ExecutableSectionSize)[];
}

export interface CompileResponse__Output {
  'out_stream': (Buffer);
  'err_stream': (Buffer);
  'build_path': (string);
  'used_libraries': (_cc_arduino_cli_commands_v1_Library__Output)[];
  'executable_sections_size': (_cc_arduino_cli_commands_v1_ExecutableSectionSize__Output)[];
}
