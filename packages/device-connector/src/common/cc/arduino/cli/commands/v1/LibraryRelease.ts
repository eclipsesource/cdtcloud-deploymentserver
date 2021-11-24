// Original file: src\cc\arduino\cli\commands\v1\lib.proto

import type { DownloadResource as _cc_arduino_cli_commands_v1_DownloadResource, DownloadResource__Output as _cc_arduino_cli_commands_v1_DownloadResource__Output } from '../../../../../cc/arduino/cli/commands/v1/DownloadResource';
import type { LibraryDependency as _cc_arduino_cli_commands_v1_LibraryDependency, LibraryDependency__Output as _cc_arduino_cli_commands_v1_LibraryDependency__Output } from '../../../../../cc/arduino/cli/commands/v1/LibraryDependency';

export interface LibraryRelease {
  'author'?: (string);
  'version'?: (string);
  'maintainer'?: (string);
  'sentence'?: (string);
  'paragraph'?: (string);
  'website'?: (string);
  'category'?: (string);
  'architectures'?: (string)[];
  'types'?: (string)[];
  'resources'?: (_cc_arduino_cli_commands_v1_DownloadResource | null);
  'license'?: (string);
  'provides_includes'?: (string)[];
  'dependencies'?: (_cc_arduino_cli_commands_v1_LibraryDependency)[];
}

export interface LibraryRelease__Output {
  'author': (string);
  'version': (string);
  'maintainer': (string);
  'sentence': (string);
  'paragraph': (string);
  'website': (string);
  'category': (string);
  'architectures': (string)[];
  'types': (string)[];
  'resources': (_cc_arduino_cli_commands_v1_DownloadResource__Output | null);
  'license': (string);
  'provides_includes': (string)[];
  'dependencies': (_cc_arduino_cli_commands_v1_LibraryDependency__Output)[];
}
