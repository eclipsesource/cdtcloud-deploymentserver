// Original file: src\cc\arduino\cli\commands\v1\lib.proto

import type { LibraryLocation as _cc_arduino_cli_commands_v1_LibraryLocation } from '../../../../../cc/arduino/cli/commands/v1/LibraryLocation';
import type { LibraryLayout as _cc_arduino_cli_commands_v1_LibraryLayout } from '../../../../../cc/arduino/cli/commands/v1/LibraryLayout';

export interface Library {
  'name'?: (string);
  'author'?: (string);
  'maintainer'?: (string);
  'sentence'?: (string);
  'paragraph'?: (string);
  'website'?: (string);
  'category'?: (string);
  'architectures'?: (string)[];
  'types'?: (string)[];
  'install_dir'?: (string);
  'source_dir'?: (string);
  'utility_dir'?: (string);
  'container_platform'?: (string);
  'real_name'?: (string);
  'dot_a_linkage'?: (boolean);
  'precompiled'?: (boolean);
  'ld_flags'?: (string);
  'is_legacy'?: (boolean);
  'version'?: (string);
  'license'?: (string);
  'properties'?: ({[key: string]: string});
  'location'?: (_cc_arduino_cli_commands_v1_LibraryLocation | keyof typeof _cc_arduino_cli_commands_v1_LibraryLocation);
  'layout'?: (_cc_arduino_cli_commands_v1_LibraryLayout | keyof typeof _cc_arduino_cli_commands_v1_LibraryLayout);
  'examples'?: (string)[];
  'provides_includes'?: (string)[];
  'compatible_with'?: ({[key: string]: boolean});
}

export interface Library__Output {
  'name': (string);
  'author': (string);
  'maintainer': (string);
  'sentence': (string);
  'paragraph': (string);
  'website': (string);
  'category': (string);
  'architectures': (string)[];
  'types': (string)[];
  'install_dir': (string);
  'source_dir': (string);
  'utility_dir': (string);
  'container_platform': (string);
  'real_name': (string);
  'dot_a_linkage': (boolean);
  'precompiled': (boolean);
  'ld_flags': (string);
  'is_legacy': (boolean);
  'version': (string);
  'license': (string);
  'properties': ({[key: string]: string});
  'location': (keyof typeof _cc_arduino_cli_commands_v1_LibraryLocation);
  'layout': (keyof typeof _cc_arduino_cli_commands_v1_LibraryLayout);
  'examples': (string)[];
  'provides_includes': (string)[];
  'compatible_with': ({[key: string]: boolean});
}
