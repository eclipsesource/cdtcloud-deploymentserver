// Original file: src\cc\arduino\cli\commands\v1\compile.proto

import type { Long } from '@grpc/proto-loader';

export interface ExecutableSectionSize {
  'name'?: (string);
  'size'?: (number | string | Long);
  'max_size'?: (number | string | Long);
}

export interface ExecutableSectionSize__Output {
  'name': (string);
  'size': (string);
  'max_size': (string);
}
