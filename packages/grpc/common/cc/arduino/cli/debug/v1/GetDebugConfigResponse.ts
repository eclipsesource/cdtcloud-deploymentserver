// Original file: src\cc\arduino\cli\debug\v1\debug.proto


export interface GetDebugConfigResponse {
  'executable'?: (string);
  'toolchain'?: (string);
  'toolchain_path'?: (string);
  'toolchain_prefix'?: (string);
  'server'?: (string);
  'server_path'?: (string);
  'toolchain_configuration'?: ({[key: string]: string});
  'server_configuration'?: ({[key: string]: string});
}

export interface GetDebugConfigResponse__Output {
  'executable': (string);
  'toolchain': (string);
  'toolchain_path': (string);
  'toolchain_prefix': (string);
  'server': (string);
  'server_path': (string);
  'toolchain_configuration': ({[key: string]: string});
  'server_configuration': ({[key: string]: string});
}
