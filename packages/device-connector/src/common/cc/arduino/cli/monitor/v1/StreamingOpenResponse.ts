// Original file: src\cc\arduino\cli\monitor\v1\monitor.proto


export interface StreamingOpenResponse {
  'data'?: (Buffer | Uint8Array | string);
  'dropped'?: (number);
}

export interface StreamingOpenResponse__Output {
  'data': (Buffer);
  'dropped': (number);
}
