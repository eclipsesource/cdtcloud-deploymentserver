// Original file: src\cc\arduino\cli\commands\v1\board.proto

import type { Long } from '@grpc/proto-loader';

export interface BoardPlatform {
  'architecture'?: (string);
  'category'?: (string);
  'url'?: (string);
  'archive_filename'?: (string);
  'checksum'?: (string);
  'size'?: (number | string | Long);
  'name'?: (string);
}

export interface BoardPlatform__Output {
  'architecture': (string);
  'category': (string);
  'url': (string);
  'archive_filename': (string);
  'checksum': (string);
  'size': (string);
  'name': (string);
}
