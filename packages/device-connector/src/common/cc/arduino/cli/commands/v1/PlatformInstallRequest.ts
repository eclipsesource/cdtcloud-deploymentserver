// Original file: src\cc\arduino\cli\commands\v1\core.proto

import type { Instance as _cc_arduino_cli_commands_v1_Instance, Instance__Output as _cc_arduino_cli_commands_v1_Instance__Output } from '../../../../../cc/arduino/cli/commands/v1/Instance';

export interface PlatformInstallRequest {
  'instance'?: (_cc_arduino_cli_commands_v1_Instance | null);
  'platform_package'?: (string);
  'architecture'?: (string);
  'version'?: (string);
  'skip_post_install'?: (boolean);
}

export interface PlatformInstallRequest__Output {
  'instance': (_cc_arduino_cli_commands_v1_Instance__Output | null);
  'platform_package': (string);
  'architecture': (string);
  'version': (string);
  'skip_post_install': (boolean);
}
