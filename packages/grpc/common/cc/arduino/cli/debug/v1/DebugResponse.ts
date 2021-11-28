// Original file: src\cc\arduino\cli\debug\v1\debug.proto


export interface DebugResponse {
  'data'?: (Buffer | Uint8Array | string);
  'error'?: (string);
}

export interface DebugResponse__Output {
  'data': (Buffer);
  'error': (string);
}
