// Original file: src\cc\arduino\cli\commands\v1\core.proto

import type { DownloadProgress as _cc_arduino_cli_commands_v1_DownloadProgress, DownloadProgress__Output as _cc_arduino_cli_commands_v1_DownloadProgress__Output } from '../../../../../cc/arduino/cli/commands/v1/DownloadProgress';
import type { TaskProgress as _cc_arduino_cli_commands_v1_TaskProgress, TaskProgress__Output as _cc_arduino_cli_commands_v1_TaskProgress__Output } from '../../../../../cc/arduino/cli/commands/v1/TaskProgress';

export interface PlatformInstallResponse {
  'progress'?: (_cc_arduino_cli_commands_v1_DownloadProgress | null);
  'task_progress'?: (_cc_arduino_cli_commands_v1_TaskProgress | null);
}

export interface PlatformInstallResponse__Output {
  'progress': (_cc_arduino_cli_commands_v1_DownloadProgress__Output | null);
  'task_progress': (_cc_arduino_cli_commands_v1_TaskProgress__Output | null);
}
