// Original file: src\cc\arduino\cli\commands\v1\compile.proto

import type { Instance as _cc_arduino_cli_commands_v1_Instance, Instance__Output as _cc_arduino_cli_commands_v1_Instance__Output } from '../../../../../cc/arduino/cli/commands/v1/Instance';
import type { BoolValue as _google_protobuf_BoolValue, BoolValue__Output as _google_protobuf_BoolValue__Output } from '../../../../../google/protobuf/BoolValue';

export interface CompileRequest {
  'instance'?: (_cc_arduino_cli_commands_v1_Instance | null);
  'fqbn'?: (string);
  'sketch_path'?: (string);
  'show_properties'?: (boolean);
  'preprocess'?: (boolean);
  'build_cache_path'?: (string);
  'build_path'?: (string);
  'build_properties'?: (string)[];
  'warnings'?: (string);
  'verbose'?: (boolean);
  'quiet'?: (boolean);
  'vid_pid'?: (string);
  'jobs'?: (number);
  'libraries'?: (string)[];
  'optimize_for_debug'?: (boolean);
  'export_dir'?: (string);
  'clean'?: (boolean);
  'create_compilation_database_only'?: (boolean);
  'source_override'?: ({[key: string]: string});
  'export_binaries'?: (_google_protobuf_BoolValue | null);
  'library'?: (string)[];
}

export interface CompileRequest__Output {
  'instance': (_cc_arduino_cli_commands_v1_Instance__Output | null);
  'fqbn': (string);
  'sketch_path': (string);
  'show_properties': (boolean);
  'preprocess': (boolean);
  'build_cache_path': (string);
  'build_path': (string);
  'build_properties': (string)[];
  'warnings': (string);
  'verbose': (boolean);
  'quiet': (boolean);
  'vid_pid': (string);
  'jobs': (number);
  'libraries': (string)[];
  'optimize_for_debug': (boolean);
  'export_dir': (string);
  'clean': (boolean);
  'create_compilation_database_only': (boolean);
  'source_override': ({[key: string]: string});
  'export_binaries': (_google_protobuf_BoolValue__Output | null);
  'library': (string)[];
}
