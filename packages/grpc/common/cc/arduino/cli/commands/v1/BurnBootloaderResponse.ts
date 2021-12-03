// Original file: src\cc\arduino\cli\commands\v1\upload.proto


export interface BurnBootloaderResponse {
  'out_stream'?: (Buffer | Uint8Array | string);
  'err_stream'?: (Buffer | Uint8Array | string);
}

export interface BurnBootloaderResponse__Output {
  'out_stream': (Buffer);
  'err_stream': (Buffer);
}
