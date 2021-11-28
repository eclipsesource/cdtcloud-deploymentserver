// Original file: src\cc\arduino\cli\commands\v1\upload.proto


export interface UploadResponse {
  'out_stream'?: (Buffer | Uint8Array | string);
  'err_stream'?: (Buffer | Uint8Array | string);
}

export interface UploadResponse__Output {
  'out_stream': (Buffer);
  'err_stream': (Buffer);
}
