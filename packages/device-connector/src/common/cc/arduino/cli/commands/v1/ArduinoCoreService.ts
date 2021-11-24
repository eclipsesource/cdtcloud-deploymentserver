// Original file: src\cc\arduino\cli\commands\v1\commands.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { ArchiveSketchRequest as _cc_arduino_cli_commands_v1_ArchiveSketchRequest, ArchiveSketchRequest__Output as _cc_arduino_cli_commands_v1_ArchiveSketchRequest__Output } from '../../../../../cc/arduino/cli/commands/v1/ArchiveSketchRequest';
import type { ArchiveSketchResponse as _cc_arduino_cli_commands_v1_ArchiveSketchResponse, ArchiveSketchResponse__Output as _cc_arduino_cli_commands_v1_ArchiveSketchResponse__Output } from '../../../../../cc/arduino/cli/commands/v1/ArchiveSketchResponse';
import type { BoardAttachRequest as _cc_arduino_cli_commands_v1_BoardAttachRequest, BoardAttachRequest__Output as _cc_arduino_cli_commands_v1_BoardAttachRequest__Output } from '../../../../../cc/arduino/cli/commands/v1/BoardAttachRequest';
import type { BoardAttachResponse as _cc_arduino_cli_commands_v1_BoardAttachResponse, BoardAttachResponse__Output as _cc_arduino_cli_commands_v1_BoardAttachResponse__Output } from '../../../../../cc/arduino/cli/commands/v1/BoardAttachResponse';
import type { BoardDetailsRequest as _cc_arduino_cli_commands_v1_BoardDetailsRequest, BoardDetailsRequest__Output as _cc_arduino_cli_commands_v1_BoardDetailsRequest__Output } from '../../../../../cc/arduino/cli/commands/v1/BoardDetailsRequest';
import type { BoardDetailsResponse as _cc_arduino_cli_commands_v1_BoardDetailsResponse, BoardDetailsResponse__Output as _cc_arduino_cli_commands_v1_BoardDetailsResponse__Output } from '../../../../../cc/arduino/cli/commands/v1/BoardDetailsResponse';
import type { BoardListAllRequest as _cc_arduino_cli_commands_v1_BoardListAllRequest, BoardListAllRequest__Output as _cc_arduino_cli_commands_v1_BoardListAllRequest__Output } from '../../../../../cc/arduino/cli/commands/v1/BoardListAllRequest';
import type { BoardListAllResponse as _cc_arduino_cli_commands_v1_BoardListAllResponse, BoardListAllResponse__Output as _cc_arduino_cli_commands_v1_BoardListAllResponse__Output } from '../../../../../cc/arduino/cli/commands/v1/BoardListAllResponse';
import type { BoardListRequest as _cc_arduino_cli_commands_v1_BoardListRequest, BoardListRequest__Output as _cc_arduino_cli_commands_v1_BoardListRequest__Output } from '../../../../../cc/arduino/cli/commands/v1/BoardListRequest';
import type { BoardListResponse as _cc_arduino_cli_commands_v1_BoardListResponse, BoardListResponse__Output as _cc_arduino_cli_commands_v1_BoardListResponse__Output } from '../../../../../cc/arduino/cli/commands/v1/BoardListResponse';
import type { BoardListWatchRequest as _cc_arduino_cli_commands_v1_BoardListWatchRequest, BoardListWatchRequest__Output as _cc_arduino_cli_commands_v1_BoardListWatchRequest__Output } from '../../../../../cc/arduino/cli/commands/v1/BoardListWatchRequest';
import type { BoardListWatchResponse as _cc_arduino_cli_commands_v1_BoardListWatchResponse, BoardListWatchResponse__Output as _cc_arduino_cli_commands_v1_BoardListWatchResponse__Output } from '../../../../../cc/arduino/cli/commands/v1/BoardListWatchResponse';
import type { BoardSearchRequest as _cc_arduino_cli_commands_v1_BoardSearchRequest, BoardSearchRequest__Output as _cc_arduino_cli_commands_v1_BoardSearchRequest__Output } from '../../../../../cc/arduino/cli/commands/v1/BoardSearchRequest';
import type { BoardSearchResponse as _cc_arduino_cli_commands_v1_BoardSearchResponse, BoardSearchResponse__Output as _cc_arduino_cli_commands_v1_BoardSearchResponse__Output } from '../../../../../cc/arduino/cli/commands/v1/BoardSearchResponse';
import type { BurnBootloaderRequest as _cc_arduino_cli_commands_v1_BurnBootloaderRequest, BurnBootloaderRequest__Output as _cc_arduino_cli_commands_v1_BurnBootloaderRequest__Output } from '../../../../../cc/arduino/cli/commands/v1/BurnBootloaderRequest';
import type { BurnBootloaderResponse as _cc_arduino_cli_commands_v1_BurnBootloaderResponse, BurnBootloaderResponse__Output as _cc_arduino_cli_commands_v1_BurnBootloaderResponse__Output } from '../../../../../cc/arduino/cli/commands/v1/BurnBootloaderResponse';
import type { CompileRequest as _cc_arduino_cli_commands_v1_CompileRequest, CompileRequest__Output as _cc_arduino_cli_commands_v1_CompileRequest__Output } from '../../../../../cc/arduino/cli/commands/v1/CompileRequest';
import type { CompileResponse as _cc_arduino_cli_commands_v1_CompileResponse, CompileResponse__Output as _cc_arduino_cli_commands_v1_CompileResponse__Output } from '../../../../../cc/arduino/cli/commands/v1/CompileResponse';
import type { CreateRequest as _cc_arduino_cli_commands_v1_CreateRequest, CreateRequest__Output as _cc_arduino_cli_commands_v1_CreateRequest__Output } from '../../../../../cc/arduino/cli/commands/v1/CreateRequest';
import type { CreateResponse as _cc_arduino_cli_commands_v1_CreateResponse, CreateResponse__Output as _cc_arduino_cli_commands_v1_CreateResponse__Output } from '../../../../../cc/arduino/cli/commands/v1/CreateResponse';
import type { DestroyRequest as _cc_arduino_cli_commands_v1_DestroyRequest, DestroyRequest__Output as _cc_arduino_cli_commands_v1_DestroyRequest__Output } from '../../../../../cc/arduino/cli/commands/v1/DestroyRequest';
import type { DestroyResponse as _cc_arduino_cli_commands_v1_DestroyResponse, DestroyResponse__Output as _cc_arduino_cli_commands_v1_DestroyResponse__Output } from '../../../../../cc/arduino/cli/commands/v1/DestroyResponse';
import type { EnumerateMonitorPortSettingsRequest as _cc_arduino_cli_commands_v1_EnumerateMonitorPortSettingsRequest, EnumerateMonitorPortSettingsRequest__Output as _cc_arduino_cli_commands_v1_EnumerateMonitorPortSettingsRequest__Output } from '../../../../../cc/arduino/cli/commands/v1/EnumerateMonitorPortSettingsRequest';
import type { EnumerateMonitorPortSettingsResponse as _cc_arduino_cli_commands_v1_EnumerateMonitorPortSettingsResponse, EnumerateMonitorPortSettingsResponse__Output as _cc_arduino_cli_commands_v1_EnumerateMonitorPortSettingsResponse__Output } from '../../../../../cc/arduino/cli/commands/v1/EnumerateMonitorPortSettingsResponse';
import type { GitLibraryInstallRequest as _cc_arduino_cli_commands_v1_GitLibraryInstallRequest, GitLibraryInstallRequest__Output as _cc_arduino_cli_commands_v1_GitLibraryInstallRequest__Output } from '../../../../../cc/arduino/cli/commands/v1/GitLibraryInstallRequest';
import type { GitLibraryInstallResponse as _cc_arduino_cli_commands_v1_GitLibraryInstallResponse, GitLibraryInstallResponse__Output as _cc_arduino_cli_commands_v1_GitLibraryInstallResponse__Output } from '../../../../../cc/arduino/cli/commands/v1/GitLibraryInstallResponse';
import type { InitRequest as _cc_arduino_cli_commands_v1_InitRequest, InitRequest__Output as _cc_arduino_cli_commands_v1_InitRequest__Output } from '../../../../../cc/arduino/cli/commands/v1/InitRequest';
import type { InitResponse as _cc_arduino_cli_commands_v1_InitResponse, InitResponse__Output as _cc_arduino_cli_commands_v1_InitResponse__Output } from '../../../../../cc/arduino/cli/commands/v1/InitResponse';
import type { LibraryDownloadRequest as _cc_arduino_cli_commands_v1_LibraryDownloadRequest, LibraryDownloadRequest__Output as _cc_arduino_cli_commands_v1_LibraryDownloadRequest__Output } from '../../../../../cc/arduino/cli/commands/v1/LibraryDownloadRequest';
import type { LibraryDownloadResponse as _cc_arduino_cli_commands_v1_LibraryDownloadResponse, LibraryDownloadResponse__Output as _cc_arduino_cli_commands_v1_LibraryDownloadResponse__Output } from '../../../../../cc/arduino/cli/commands/v1/LibraryDownloadResponse';
import type { LibraryInstallRequest as _cc_arduino_cli_commands_v1_LibraryInstallRequest, LibraryInstallRequest__Output as _cc_arduino_cli_commands_v1_LibraryInstallRequest__Output } from '../../../../../cc/arduino/cli/commands/v1/LibraryInstallRequest';
import type { LibraryInstallResponse as _cc_arduino_cli_commands_v1_LibraryInstallResponse, LibraryInstallResponse__Output as _cc_arduino_cli_commands_v1_LibraryInstallResponse__Output } from '../../../../../cc/arduino/cli/commands/v1/LibraryInstallResponse';
import type { LibraryListRequest as _cc_arduino_cli_commands_v1_LibraryListRequest, LibraryListRequest__Output as _cc_arduino_cli_commands_v1_LibraryListRequest__Output } from '../../../../../cc/arduino/cli/commands/v1/LibraryListRequest';
import type { LibraryListResponse as _cc_arduino_cli_commands_v1_LibraryListResponse, LibraryListResponse__Output as _cc_arduino_cli_commands_v1_LibraryListResponse__Output } from '../../../../../cc/arduino/cli/commands/v1/LibraryListResponse';
import type { LibraryResolveDependenciesRequest as _cc_arduino_cli_commands_v1_LibraryResolveDependenciesRequest, LibraryResolveDependenciesRequest__Output as _cc_arduino_cli_commands_v1_LibraryResolveDependenciesRequest__Output } from '../../../../../cc/arduino/cli/commands/v1/LibraryResolveDependenciesRequest';
import type { LibraryResolveDependenciesResponse as _cc_arduino_cli_commands_v1_LibraryResolveDependenciesResponse, LibraryResolveDependenciesResponse__Output as _cc_arduino_cli_commands_v1_LibraryResolveDependenciesResponse__Output } from '../../../../../cc/arduino/cli/commands/v1/LibraryResolveDependenciesResponse';
import type { LibrarySearchRequest as _cc_arduino_cli_commands_v1_LibrarySearchRequest, LibrarySearchRequest__Output as _cc_arduino_cli_commands_v1_LibrarySearchRequest__Output } from '../../../../../cc/arduino/cli/commands/v1/LibrarySearchRequest';
import type { LibrarySearchResponse as _cc_arduino_cli_commands_v1_LibrarySearchResponse, LibrarySearchResponse__Output as _cc_arduino_cli_commands_v1_LibrarySearchResponse__Output } from '../../../../../cc/arduino/cli/commands/v1/LibrarySearchResponse';
import type { LibraryUninstallRequest as _cc_arduino_cli_commands_v1_LibraryUninstallRequest, LibraryUninstallRequest__Output as _cc_arduino_cli_commands_v1_LibraryUninstallRequest__Output } from '../../../../../cc/arduino/cli/commands/v1/LibraryUninstallRequest';
import type { LibraryUninstallResponse as _cc_arduino_cli_commands_v1_LibraryUninstallResponse, LibraryUninstallResponse__Output as _cc_arduino_cli_commands_v1_LibraryUninstallResponse__Output } from '../../../../../cc/arduino/cli/commands/v1/LibraryUninstallResponse';
import type { LibraryUpgradeAllRequest as _cc_arduino_cli_commands_v1_LibraryUpgradeAllRequest, LibraryUpgradeAllRequest__Output as _cc_arduino_cli_commands_v1_LibraryUpgradeAllRequest__Output } from '../../../../../cc/arduino/cli/commands/v1/LibraryUpgradeAllRequest';
import type { LibraryUpgradeAllResponse as _cc_arduino_cli_commands_v1_LibraryUpgradeAllResponse, LibraryUpgradeAllResponse__Output as _cc_arduino_cli_commands_v1_LibraryUpgradeAllResponse__Output } from '../../../../../cc/arduino/cli/commands/v1/LibraryUpgradeAllResponse';
import type { ListProgrammersAvailableForUploadRequest as _cc_arduino_cli_commands_v1_ListProgrammersAvailableForUploadRequest, ListProgrammersAvailableForUploadRequest__Output as _cc_arduino_cli_commands_v1_ListProgrammersAvailableForUploadRequest__Output } from '../../../../../cc/arduino/cli/commands/v1/ListProgrammersAvailableForUploadRequest';
import type { ListProgrammersAvailableForUploadResponse as _cc_arduino_cli_commands_v1_ListProgrammersAvailableForUploadResponse, ListProgrammersAvailableForUploadResponse__Output as _cc_arduino_cli_commands_v1_ListProgrammersAvailableForUploadResponse__Output } from '../../../../../cc/arduino/cli/commands/v1/ListProgrammersAvailableForUploadResponse';
import type { LoadSketchRequest as _cc_arduino_cli_commands_v1_LoadSketchRequest, LoadSketchRequest__Output as _cc_arduino_cli_commands_v1_LoadSketchRequest__Output } from '../../../../../cc/arduino/cli/commands/v1/LoadSketchRequest';
import type { LoadSketchResponse as _cc_arduino_cli_commands_v1_LoadSketchResponse, LoadSketchResponse__Output as _cc_arduino_cli_commands_v1_LoadSketchResponse__Output } from '../../../../../cc/arduino/cli/commands/v1/LoadSketchResponse';
import type { MonitorRequest as _cc_arduino_cli_commands_v1_MonitorRequest, MonitorRequest__Output as _cc_arduino_cli_commands_v1_MonitorRequest__Output } from '../../../../../cc/arduino/cli/commands/v1/MonitorRequest';
import type { MonitorResponse as _cc_arduino_cli_commands_v1_MonitorResponse, MonitorResponse__Output as _cc_arduino_cli_commands_v1_MonitorResponse__Output } from '../../../../../cc/arduino/cli/commands/v1/MonitorResponse';
import type { NewSketchRequest as _cc_arduino_cli_commands_v1_NewSketchRequest, NewSketchRequest__Output as _cc_arduino_cli_commands_v1_NewSketchRequest__Output } from '../../../../../cc/arduino/cli/commands/v1/NewSketchRequest';
import type { NewSketchResponse as _cc_arduino_cli_commands_v1_NewSketchResponse, NewSketchResponse__Output as _cc_arduino_cli_commands_v1_NewSketchResponse__Output } from '../../../../../cc/arduino/cli/commands/v1/NewSketchResponse';
import type { OutdatedRequest as _cc_arduino_cli_commands_v1_OutdatedRequest, OutdatedRequest__Output as _cc_arduino_cli_commands_v1_OutdatedRequest__Output } from '../../../../../cc/arduino/cli/commands/v1/OutdatedRequest';
import type { OutdatedResponse as _cc_arduino_cli_commands_v1_OutdatedResponse, OutdatedResponse__Output as _cc_arduino_cli_commands_v1_OutdatedResponse__Output } from '../../../../../cc/arduino/cli/commands/v1/OutdatedResponse';
import type { PlatformDownloadRequest as _cc_arduino_cli_commands_v1_PlatformDownloadRequest, PlatformDownloadRequest__Output as _cc_arduino_cli_commands_v1_PlatformDownloadRequest__Output } from '../../../../../cc/arduino/cli/commands/v1/PlatformDownloadRequest';
import type { PlatformDownloadResponse as _cc_arduino_cli_commands_v1_PlatformDownloadResponse, PlatformDownloadResponse__Output as _cc_arduino_cli_commands_v1_PlatformDownloadResponse__Output } from '../../../../../cc/arduino/cli/commands/v1/PlatformDownloadResponse';
import type { PlatformInstallRequest as _cc_arduino_cli_commands_v1_PlatformInstallRequest, PlatformInstallRequest__Output as _cc_arduino_cli_commands_v1_PlatformInstallRequest__Output } from '../../../../../cc/arduino/cli/commands/v1/PlatformInstallRequest';
import type { PlatformInstallResponse as _cc_arduino_cli_commands_v1_PlatformInstallResponse, PlatformInstallResponse__Output as _cc_arduino_cli_commands_v1_PlatformInstallResponse__Output } from '../../../../../cc/arduino/cli/commands/v1/PlatformInstallResponse';
import type { PlatformListRequest as _cc_arduino_cli_commands_v1_PlatformListRequest, PlatformListRequest__Output as _cc_arduino_cli_commands_v1_PlatformListRequest__Output } from '../../../../../cc/arduino/cli/commands/v1/PlatformListRequest';
import type { PlatformListResponse as _cc_arduino_cli_commands_v1_PlatformListResponse, PlatformListResponse__Output as _cc_arduino_cli_commands_v1_PlatformListResponse__Output } from '../../../../../cc/arduino/cli/commands/v1/PlatformListResponse';
import type { PlatformSearchRequest as _cc_arduino_cli_commands_v1_PlatformSearchRequest, PlatformSearchRequest__Output as _cc_arduino_cli_commands_v1_PlatformSearchRequest__Output } from '../../../../../cc/arduino/cli/commands/v1/PlatformSearchRequest';
import type { PlatformSearchResponse as _cc_arduino_cli_commands_v1_PlatformSearchResponse, PlatformSearchResponse__Output as _cc_arduino_cli_commands_v1_PlatformSearchResponse__Output } from '../../../../../cc/arduino/cli/commands/v1/PlatformSearchResponse';
import type { PlatformUninstallRequest as _cc_arduino_cli_commands_v1_PlatformUninstallRequest, PlatformUninstallRequest__Output as _cc_arduino_cli_commands_v1_PlatformUninstallRequest__Output } from '../../../../../cc/arduino/cli/commands/v1/PlatformUninstallRequest';
import type { PlatformUninstallResponse as _cc_arduino_cli_commands_v1_PlatformUninstallResponse, PlatformUninstallResponse__Output as _cc_arduino_cli_commands_v1_PlatformUninstallResponse__Output } from '../../../../../cc/arduino/cli/commands/v1/PlatformUninstallResponse';
import type { PlatformUpgradeRequest as _cc_arduino_cli_commands_v1_PlatformUpgradeRequest, PlatformUpgradeRequest__Output as _cc_arduino_cli_commands_v1_PlatformUpgradeRequest__Output } from '../../../../../cc/arduino/cli/commands/v1/PlatformUpgradeRequest';
import type { PlatformUpgradeResponse as _cc_arduino_cli_commands_v1_PlatformUpgradeResponse, PlatformUpgradeResponse__Output as _cc_arduino_cli_commands_v1_PlatformUpgradeResponse__Output } from '../../../../../cc/arduino/cli/commands/v1/PlatformUpgradeResponse';
import type { SupportedUserFieldsRequest as _cc_arduino_cli_commands_v1_SupportedUserFieldsRequest, SupportedUserFieldsRequest__Output as _cc_arduino_cli_commands_v1_SupportedUserFieldsRequest__Output } from '../../../../../cc/arduino/cli/commands/v1/SupportedUserFieldsRequest';
import type { SupportedUserFieldsResponse as _cc_arduino_cli_commands_v1_SupportedUserFieldsResponse, SupportedUserFieldsResponse__Output as _cc_arduino_cli_commands_v1_SupportedUserFieldsResponse__Output } from '../../../../../cc/arduino/cli/commands/v1/SupportedUserFieldsResponse';
import type { UpdateCoreLibrariesIndexRequest as _cc_arduino_cli_commands_v1_UpdateCoreLibrariesIndexRequest, UpdateCoreLibrariesIndexRequest__Output as _cc_arduino_cli_commands_v1_UpdateCoreLibrariesIndexRequest__Output } from '../../../../../cc/arduino/cli/commands/v1/UpdateCoreLibrariesIndexRequest';
import type { UpdateCoreLibrariesIndexResponse as _cc_arduino_cli_commands_v1_UpdateCoreLibrariesIndexResponse, UpdateCoreLibrariesIndexResponse__Output as _cc_arduino_cli_commands_v1_UpdateCoreLibrariesIndexResponse__Output } from '../../../../../cc/arduino/cli/commands/v1/UpdateCoreLibrariesIndexResponse';
import type { UpdateIndexRequest as _cc_arduino_cli_commands_v1_UpdateIndexRequest, UpdateIndexRequest__Output as _cc_arduino_cli_commands_v1_UpdateIndexRequest__Output } from '../../../../../cc/arduino/cli/commands/v1/UpdateIndexRequest';
import type { UpdateIndexResponse as _cc_arduino_cli_commands_v1_UpdateIndexResponse, UpdateIndexResponse__Output as _cc_arduino_cli_commands_v1_UpdateIndexResponse__Output } from '../../../../../cc/arduino/cli/commands/v1/UpdateIndexResponse';
import type { UpdateLibrariesIndexRequest as _cc_arduino_cli_commands_v1_UpdateLibrariesIndexRequest, UpdateLibrariesIndexRequest__Output as _cc_arduino_cli_commands_v1_UpdateLibrariesIndexRequest__Output } from '../../../../../cc/arduino/cli/commands/v1/UpdateLibrariesIndexRequest';
import type { UpdateLibrariesIndexResponse as _cc_arduino_cli_commands_v1_UpdateLibrariesIndexResponse, UpdateLibrariesIndexResponse__Output as _cc_arduino_cli_commands_v1_UpdateLibrariesIndexResponse__Output } from '../../../../../cc/arduino/cli/commands/v1/UpdateLibrariesIndexResponse';
import type { UpgradeRequest as _cc_arduino_cli_commands_v1_UpgradeRequest, UpgradeRequest__Output as _cc_arduino_cli_commands_v1_UpgradeRequest__Output } from '../../../../../cc/arduino/cli/commands/v1/UpgradeRequest';
import type { UpgradeResponse as _cc_arduino_cli_commands_v1_UpgradeResponse, UpgradeResponse__Output as _cc_arduino_cli_commands_v1_UpgradeResponse__Output } from '../../../../../cc/arduino/cli/commands/v1/UpgradeResponse';
import type { UploadRequest as _cc_arduino_cli_commands_v1_UploadRequest, UploadRequest__Output as _cc_arduino_cli_commands_v1_UploadRequest__Output } from '../../../../../cc/arduino/cli/commands/v1/UploadRequest';
import type { UploadResponse as _cc_arduino_cli_commands_v1_UploadResponse, UploadResponse__Output as _cc_arduino_cli_commands_v1_UploadResponse__Output } from '../../../../../cc/arduino/cli/commands/v1/UploadResponse';
import type { UploadUsingProgrammerRequest as _cc_arduino_cli_commands_v1_UploadUsingProgrammerRequest, UploadUsingProgrammerRequest__Output as _cc_arduino_cli_commands_v1_UploadUsingProgrammerRequest__Output } from '../../../../../cc/arduino/cli/commands/v1/UploadUsingProgrammerRequest';
import type { UploadUsingProgrammerResponse as _cc_arduino_cli_commands_v1_UploadUsingProgrammerResponse, UploadUsingProgrammerResponse__Output as _cc_arduino_cli_commands_v1_UploadUsingProgrammerResponse__Output } from '../../../../../cc/arduino/cli/commands/v1/UploadUsingProgrammerResponse';
import type { VersionRequest as _cc_arduino_cli_commands_v1_VersionRequest, VersionRequest__Output as _cc_arduino_cli_commands_v1_VersionRequest__Output } from '../../../../../cc/arduino/cli/commands/v1/VersionRequest';
import type { VersionResponse as _cc_arduino_cli_commands_v1_VersionResponse, VersionResponse__Output as _cc_arduino_cli_commands_v1_VersionResponse__Output } from '../../../../../cc/arduino/cli/commands/v1/VersionResponse';
import type { ZipLibraryInstallRequest as _cc_arduino_cli_commands_v1_ZipLibraryInstallRequest, ZipLibraryInstallRequest__Output as _cc_arduino_cli_commands_v1_ZipLibraryInstallRequest__Output } from '../../../../../cc/arduino/cli/commands/v1/ZipLibraryInstallRequest';
import type { ZipLibraryInstallResponse as _cc_arduino_cli_commands_v1_ZipLibraryInstallResponse, ZipLibraryInstallResponse__Output as _cc_arduino_cli_commands_v1_ZipLibraryInstallResponse__Output } from '../../../../../cc/arduino/cli/commands/v1/ZipLibraryInstallResponse';

export interface ArduinoCoreServiceClient extends grpc.Client {
  ArchiveSketch(argument: _cc_arduino_cli_commands_v1_ArchiveSketchRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_ArchiveSketchResponse__Output>): grpc.ClientUnaryCall;
  ArchiveSketch(argument: _cc_arduino_cli_commands_v1_ArchiveSketchRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_ArchiveSketchResponse__Output>): grpc.ClientUnaryCall;
  ArchiveSketch(argument: _cc_arduino_cli_commands_v1_ArchiveSketchRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_ArchiveSketchResponse__Output>): grpc.ClientUnaryCall;
  ArchiveSketch(argument: _cc_arduino_cli_commands_v1_ArchiveSketchRequest, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_ArchiveSketchResponse__Output>): grpc.ClientUnaryCall;
  archiveSketch(argument: _cc_arduino_cli_commands_v1_ArchiveSketchRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_ArchiveSketchResponse__Output>): grpc.ClientUnaryCall;
  archiveSketch(argument: _cc_arduino_cli_commands_v1_ArchiveSketchRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_ArchiveSketchResponse__Output>): grpc.ClientUnaryCall;
  archiveSketch(argument: _cc_arduino_cli_commands_v1_ArchiveSketchRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_ArchiveSketchResponse__Output>): grpc.ClientUnaryCall;
  archiveSketch(argument: _cc_arduino_cli_commands_v1_ArchiveSketchRequest, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_ArchiveSketchResponse__Output>): grpc.ClientUnaryCall;
  
  BoardAttach(argument: _cc_arduino_cli_commands_v1_BoardAttachRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_BoardAttachResponse__Output>;
  BoardAttach(argument: _cc_arduino_cli_commands_v1_BoardAttachRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_BoardAttachResponse__Output>;
  boardAttach(argument: _cc_arduino_cli_commands_v1_BoardAttachRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_BoardAttachResponse__Output>;
  boardAttach(argument: _cc_arduino_cli_commands_v1_BoardAttachRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_BoardAttachResponse__Output>;
  
  BoardDetails(argument: _cc_arduino_cli_commands_v1_BoardDetailsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_BoardDetailsResponse__Output>): grpc.ClientUnaryCall;
  BoardDetails(argument: _cc_arduino_cli_commands_v1_BoardDetailsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_BoardDetailsResponse__Output>): grpc.ClientUnaryCall;
  BoardDetails(argument: _cc_arduino_cli_commands_v1_BoardDetailsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_BoardDetailsResponse__Output>): grpc.ClientUnaryCall;
  BoardDetails(argument: _cc_arduino_cli_commands_v1_BoardDetailsRequest, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_BoardDetailsResponse__Output>): grpc.ClientUnaryCall;
  boardDetails(argument: _cc_arduino_cli_commands_v1_BoardDetailsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_BoardDetailsResponse__Output>): grpc.ClientUnaryCall;
  boardDetails(argument: _cc_arduino_cli_commands_v1_BoardDetailsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_BoardDetailsResponse__Output>): grpc.ClientUnaryCall;
  boardDetails(argument: _cc_arduino_cli_commands_v1_BoardDetailsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_BoardDetailsResponse__Output>): grpc.ClientUnaryCall;
  boardDetails(argument: _cc_arduino_cli_commands_v1_BoardDetailsRequest, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_BoardDetailsResponse__Output>): grpc.ClientUnaryCall;
  
  BoardList(argument: _cc_arduino_cli_commands_v1_BoardListRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_BoardListResponse__Output>): grpc.ClientUnaryCall;
  BoardList(argument: _cc_arduino_cli_commands_v1_BoardListRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_BoardListResponse__Output>): grpc.ClientUnaryCall;
  BoardList(argument: _cc_arduino_cli_commands_v1_BoardListRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_BoardListResponse__Output>): grpc.ClientUnaryCall;
  BoardList(argument: _cc_arduino_cli_commands_v1_BoardListRequest, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_BoardListResponse__Output>): grpc.ClientUnaryCall;
  boardList(argument: _cc_arduino_cli_commands_v1_BoardListRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_BoardListResponse__Output>): grpc.ClientUnaryCall;
  boardList(argument: _cc_arduino_cli_commands_v1_BoardListRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_BoardListResponse__Output>): grpc.ClientUnaryCall;
  boardList(argument: _cc_arduino_cli_commands_v1_BoardListRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_BoardListResponse__Output>): grpc.ClientUnaryCall;
  boardList(argument: _cc_arduino_cli_commands_v1_BoardListRequest, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_BoardListResponse__Output>): grpc.ClientUnaryCall;
  
  BoardListAll(argument: _cc_arduino_cli_commands_v1_BoardListAllRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_BoardListAllResponse__Output>): grpc.ClientUnaryCall;
  BoardListAll(argument: _cc_arduino_cli_commands_v1_BoardListAllRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_BoardListAllResponse__Output>): grpc.ClientUnaryCall;
  BoardListAll(argument: _cc_arduino_cli_commands_v1_BoardListAllRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_BoardListAllResponse__Output>): grpc.ClientUnaryCall;
  BoardListAll(argument: _cc_arduino_cli_commands_v1_BoardListAllRequest, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_BoardListAllResponse__Output>): grpc.ClientUnaryCall;
  boardListAll(argument: _cc_arduino_cli_commands_v1_BoardListAllRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_BoardListAllResponse__Output>): grpc.ClientUnaryCall;
  boardListAll(argument: _cc_arduino_cli_commands_v1_BoardListAllRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_BoardListAllResponse__Output>): grpc.ClientUnaryCall;
  boardListAll(argument: _cc_arduino_cli_commands_v1_BoardListAllRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_BoardListAllResponse__Output>): grpc.ClientUnaryCall;
  boardListAll(argument: _cc_arduino_cli_commands_v1_BoardListAllRequest, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_BoardListAllResponse__Output>): grpc.ClientUnaryCall;
  
  BoardListWatch(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_cc_arduino_cli_commands_v1_BoardListWatchRequest, _cc_arduino_cli_commands_v1_BoardListWatchResponse__Output>;
  BoardListWatch(options?: grpc.CallOptions): grpc.ClientDuplexStream<_cc_arduino_cli_commands_v1_BoardListWatchRequest, _cc_arduino_cli_commands_v1_BoardListWatchResponse__Output>;
  boardListWatch(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_cc_arduino_cli_commands_v1_BoardListWatchRequest, _cc_arduino_cli_commands_v1_BoardListWatchResponse__Output>;
  boardListWatch(options?: grpc.CallOptions): grpc.ClientDuplexStream<_cc_arduino_cli_commands_v1_BoardListWatchRequest, _cc_arduino_cli_commands_v1_BoardListWatchResponse__Output>;
  
  BoardSearch(argument: _cc_arduino_cli_commands_v1_BoardSearchRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_BoardSearchResponse__Output>): grpc.ClientUnaryCall;
  BoardSearch(argument: _cc_arduino_cli_commands_v1_BoardSearchRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_BoardSearchResponse__Output>): grpc.ClientUnaryCall;
  BoardSearch(argument: _cc_arduino_cli_commands_v1_BoardSearchRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_BoardSearchResponse__Output>): grpc.ClientUnaryCall;
  BoardSearch(argument: _cc_arduino_cli_commands_v1_BoardSearchRequest, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_BoardSearchResponse__Output>): grpc.ClientUnaryCall;
  boardSearch(argument: _cc_arduino_cli_commands_v1_BoardSearchRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_BoardSearchResponse__Output>): grpc.ClientUnaryCall;
  boardSearch(argument: _cc_arduino_cli_commands_v1_BoardSearchRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_BoardSearchResponse__Output>): grpc.ClientUnaryCall;
  boardSearch(argument: _cc_arduino_cli_commands_v1_BoardSearchRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_BoardSearchResponse__Output>): grpc.ClientUnaryCall;
  boardSearch(argument: _cc_arduino_cli_commands_v1_BoardSearchRequest, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_BoardSearchResponse__Output>): grpc.ClientUnaryCall;
  
  BurnBootloader(argument: _cc_arduino_cli_commands_v1_BurnBootloaderRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_BurnBootloaderResponse__Output>;
  BurnBootloader(argument: _cc_arduino_cli_commands_v1_BurnBootloaderRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_BurnBootloaderResponse__Output>;
  burnBootloader(argument: _cc_arduino_cli_commands_v1_BurnBootloaderRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_BurnBootloaderResponse__Output>;
  burnBootloader(argument: _cc_arduino_cli_commands_v1_BurnBootloaderRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_BurnBootloaderResponse__Output>;
  
  Compile(argument: _cc_arduino_cli_commands_v1_CompileRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_CompileResponse__Output>;
  Compile(argument: _cc_arduino_cli_commands_v1_CompileRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_CompileResponse__Output>;
  compile(argument: _cc_arduino_cli_commands_v1_CompileRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_CompileResponse__Output>;
  compile(argument: _cc_arduino_cli_commands_v1_CompileRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_CompileResponse__Output>;
  
  Create(argument: _cc_arduino_cli_commands_v1_CreateRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_CreateResponse__Output>): grpc.ClientUnaryCall;
  Create(argument: _cc_arduino_cli_commands_v1_CreateRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_CreateResponse__Output>): grpc.ClientUnaryCall;
  Create(argument: _cc_arduino_cli_commands_v1_CreateRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_CreateResponse__Output>): grpc.ClientUnaryCall;
  Create(argument: _cc_arduino_cli_commands_v1_CreateRequest, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_CreateResponse__Output>): grpc.ClientUnaryCall;
  create(argument: _cc_arduino_cli_commands_v1_CreateRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_CreateResponse__Output>): grpc.ClientUnaryCall;
  create(argument: _cc_arduino_cli_commands_v1_CreateRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_CreateResponse__Output>): grpc.ClientUnaryCall;
  create(argument: _cc_arduino_cli_commands_v1_CreateRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_CreateResponse__Output>): grpc.ClientUnaryCall;
  create(argument: _cc_arduino_cli_commands_v1_CreateRequest, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_CreateResponse__Output>): grpc.ClientUnaryCall;
  
  Destroy(argument: _cc_arduino_cli_commands_v1_DestroyRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_DestroyResponse__Output>): grpc.ClientUnaryCall;
  Destroy(argument: _cc_arduino_cli_commands_v1_DestroyRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_DestroyResponse__Output>): grpc.ClientUnaryCall;
  Destroy(argument: _cc_arduino_cli_commands_v1_DestroyRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_DestroyResponse__Output>): grpc.ClientUnaryCall;
  Destroy(argument: _cc_arduino_cli_commands_v1_DestroyRequest, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_DestroyResponse__Output>): grpc.ClientUnaryCall;
  destroy(argument: _cc_arduino_cli_commands_v1_DestroyRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_DestroyResponse__Output>): grpc.ClientUnaryCall;
  destroy(argument: _cc_arduino_cli_commands_v1_DestroyRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_DestroyResponse__Output>): grpc.ClientUnaryCall;
  destroy(argument: _cc_arduino_cli_commands_v1_DestroyRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_DestroyResponse__Output>): grpc.ClientUnaryCall;
  destroy(argument: _cc_arduino_cli_commands_v1_DestroyRequest, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_DestroyResponse__Output>): grpc.ClientUnaryCall;
  
  EnumerateMonitorPortSettings(argument: _cc_arduino_cli_commands_v1_EnumerateMonitorPortSettingsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_EnumerateMonitorPortSettingsResponse__Output>): grpc.ClientUnaryCall;
  EnumerateMonitorPortSettings(argument: _cc_arduino_cli_commands_v1_EnumerateMonitorPortSettingsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_EnumerateMonitorPortSettingsResponse__Output>): grpc.ClientUnaryCall;
  EnumerateMonitorPortSettings(argument: _cc_arduino_cli_commands_v1_EnumerateMonitorPortSettingsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_EnumerateMonitorPortSettingsResponse__Output>): grpc.ClientUnaryCall;
  EnumerateMonitorPortSettings(argument: _cc_arduino_cli_commands_v1_EnumerateMonitorPortSettingsRequest, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_EnumerateMonitorPortSettingsResponse__Output>): grpc.ClientUnaryCall;
  enumerateMonitorPortSettings(argument: _cc_arduino_cli_commands_v1_EnumerateMonitorPortSettingsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_EnumerateMonitorPortSettingsResponse__Output>): grpc.ClientUnaryCall;
  enumerateMonitorPortSettings(argument: _cc_arduino_cli_commands_v1_EnumerateMonitorPortSettingsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_EnumerateMonitorPortSettingsResponse__Output>): grpc.ClientUnaryCall;
  enumerateMonitorPortSettings(argument: _cc_arduino_cli_commands_v1_EnumerateMonitorPortSettingsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_EnumerateMonitorPortSettingsResponse__Output>): grpc.ClientUnaryCall;
  enumerateMonitorPortSettings(argument: _cc_arduino_cli_commands_v1_EnumerateMonitorPortSettingsRequest, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_EnumerateMonitorPortSettingsResponse__Output>): grpc.ClientUnaryCall;
  
  GitLibraryInstall(argument: _cc_arduino_cli_commands_v1_GitLibraryInstallRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_GitLibraryInstallResponse__Output>;
  GitLibraryInstall(argument: _cc_arduino_cli_commands_v1_GitLibraryInstallRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_GitLibraryInstallResponse__Output>;
  gitLibraryInstall(argument: _cc_arduino_cli_commands_v1_GitLibraryInstallRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_GitLibraryInstallResponse__Output>;
  gitLibraryInstall(argument: _cc_arduino_cli_commands_v1_GitLibraryInstallRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_GitLibraryInstallResponse__Output>;
  
  Init(argument: _cc_arduino_cli_commands_v1_InitRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_InitResponse__Output>;
  Init(argument: _cc_arduino_cli_commands_v1_InitRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_InitResponse__Output>;
  init(argument: _cc_arduino_cli_commands_v1_InitRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_InitResponse__Output>;
  init(argument: _cc_arduino_cli_commands_v1_InitRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_InitResponse__Output>;
  
  LibraryDownload(argument: _cc_arduino_cli_commands_v1_LibraryDownloadRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_LibraryDownloadResponse__Output>;
  LibraryDownload(argument: _cc_arduino_cli_commands_v1_LibraryDownloadRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_LibraryDownloadResponse__Output>;
  libraryDownload(argument: _cc_arduino_cli_commands_v1_LibraryDownloadRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_LibraryDownloadResponse__Output>;
  libraryDownload(argument: _cc_arduino_cli_commands_v1_LibraryDownloadRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_LibraryDownloadResponse__Output>;
  
  LibraryInstall(argument: _cc_arduino_cli_commands_v1_LibraryInstallRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_LibraryInstallResponse__Output>;
  LibraryInstall(argument: _cc_arduino_cli_commands_v1_LibraryInstallRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_LibraryInstallResponse__Output>;
  libraryInstall(argument: _cc_arduino_cli_commands_v1_LibraryInstallRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_LibraryInstallResponse__Output>;
  libraryInstall(argument: _cc_arduino_cli_commands_v1_LibraryInstallRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_LibraryInstallResponse__Output>;
  
  LibraryList(argument: _cc_arduino_cli_commands_v1_LibraryListRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_LibraryListResponse__Output>): grpc.ClientUnaryCall;
  LibraryList(argument: _cc_arduino_cli_commands_v1_LibraryListRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_LibraryListResponse__Output>): grpc.ClientUnaryCall;
  LibraryList(argument: _cc_arduino_cli_commands_v1_LibraryListRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_LibraryListResponse__Output>): grpc.ClientUnaryCall;
  LibraryList(argument: _cc_arduino_cli_commands_v1_LibraryListRequest, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_LibraryListResponse__Output>): grpc.ClientUnaryCall;
  libraryList(argument: _cc_arduino_cli_commands_v1_LibraryListRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_LibraryListResponse__Output>): grpc.ClientUnaryCall;
  libraryList(argument: _cc_arduino_cli_commands_v1_LibraryListRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_LibraryListResponse__Output>): grpc.ClientUnaryCall;
  libraryList(argument: _cc_arduino_cli_commands_v1_LibraryListRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_LibraryListResponse__Output>): grpc.ClientUnaryCall;
  libraryList(argument: _cc_arduino_cli_commands_v1_LibraryListRequest, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_LibraryListResponse__Output>): grpc.ClientUnaryCall;
  
  LibraryResolveDependencies(argument: _cc_arduino_cli_commands_v1_LibraryResolveDependenciesRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_LibraryResolveDependenciesResponse__Output>): grpc.ClientUnaryCall;
  LibraryResolveDependencies(argument: _cc_arduino_cli_commands_v1_LibraryResolveDependenciesRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_LibraryResolveDependenciesResponse__Output>): grpc.ClientUnaryCall;
  LibraryResolveDependencies(argument: _cc_arduino_cli_commands_v1_LibraryResolveDependenciesRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_LibraryResolveDependenciesResponse__Output>): grpc.ClientUnaryCall;
  LibraryResolveDependencies(argument: _cc_arduino_cli_commands_v1_LibraryResolveDependenciesRequest, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_LibraryResolveDependenciesResponse__Output>): grpc.ClientUnaryCall;
  libraryResolveDependencies(argument: _cc_arduino_cli_commands_v1_LibraryResolveDependenciesRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_LibraryResolveDependenciesResponse__Output>): grpc.ClientUnaryCall;
  libraryResolveDependencies(argument: _cc_arduino_cli_commands_v1_LibraryResolveDependenciesRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_LibraryResolveDependenciesResponse__Output>): grpc.ClientUnaryCall;
  libraryResolveDependencies(argument: _cc_arduino_cli_commands_v1_LibraryResolveDependenciesRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_LibraryResolveDependenciesResponse__Output>): grpc.ClientUnaryCall;
  libraryResolveDependencies(argument: _cc_arduino_cli_commands_v1_LibraryResolveDependenciesRequest, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_LibraryResolveDependenciesResponse__Output>): grpc.ClientUnaryCall;
  
  LibrarySearch(argument: _cc_arduino_cli_commands_v1_LibrarySearchRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_LibrarySearchResponse__Output>): grpc.ClientUnaryCall;
  LibrarySearch(argument: _cc_arduino_cli_commands_v1_LibrarySearchRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_LibrarySearchResponse__Output>): grpc.ClientUnaryCall;
  LibrarySearch(argument: _cc_arduino_cli_commands_v1_LibrarySearchRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_LibrarySearchResponse__Output>): grpc.ClientUnaryCall;
  LibrarySearch(argument: _cc_arduino_cli_commands_v1_LibrarySearchRequest, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_LibrarySearchResponse__Output>): grpc.ClientUnaryCall;
  librarySearch(argument: _cc_arduino_cli_commands_v1_LibrarySearchRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_LibrarySearchResponse__Output>): grpc.ClientUnaryCall;
  librarySearch(argument: _cc_arduino_cli_commands_v1_LibrarySearchRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_LibrarySearchResponse__Output>): grpc.ClientUnaryCall;
  librarySearch(argument: _cc_arduino_cli_commands_v1_LibrarySearchRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_LibrarySearchResponse__Output>): grpc.ClientUnaryCall;
  librarySearch(argument: _cc_arduino_cli_commands_v1_LibrarySearchRequest, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_LibrarySearchResponse__Output>): grpc.ClientUnaryCall;
  
  LibraryUninstall(argument: _cc_arduino_cli_commands_v1_LibraryUninstallRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_LibraryUninstallResponse__Output>;
  LibraryUninstall(argument: _cc_arduino_cli_commands_v1_LibraryUninstallRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_LibraryUninstallResponse__Output>;
  libraryUninstall(argument: _cc_arduino_cli_commands_v1_LibraryUninstallRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_LibraryUninstallResponse__Output>;
  libraryUninstall(argument: _cc_arduino_cli_commands_v1_LibraryUninstallRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_LibraryUninstallResponse__Output>;
  
  LibraryUpgradeAll(argument: _cc_arduino_cli_commands_v1_LibraryUpgradeAllRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_LibraryUpgradeAllResponse__Output>;
  LibraryUpgradeAll(argument: _cc_arduino_cli_commands_v1_LibraryUpgradeAllRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_LibraryUpgradeAllResponse__Output>;
  libraryUpgradeAll(argument: _cc_arduino_cli_commands_v1_LibraryUpgradeAllRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_LibraryUpgradeAllResponse__Output>;
  libraryUpgradeAll(argument: _cc_arduino_cli_commands_v1_LibraryUpgradeAllRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_LibraryUpgradeAllResponse__Output>;
  
  ListProgrammersAvailableForUpload(argument: _cc_arduino_cli_commands_v1_ListProgrammersAvailableForUploadRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_ListProgrammersAvailableForUploadResponse__Output>): grpc.ClientUnaryCall;
  ListProgrammersAvailableForUpload(argument: _cc_arduino_cli_commands_v1_ListProgrammersAvailableForUploadRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_ListProgrammersAvailableForUploadResponse__Output>): grpc.ClientUnaryCall;
  ListProgrammersAvailableForUpload(argument: _cc_arduino_cli_commands_v1_ListProgrammersAvailableForUploadRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_ListProgrammersAvailableForUploadResponse__Output>): grpc.ClientUnaryCall;
  ListProgrammersAvailableForUpload(argument: _cc_arduino_cli_commands_v1_ListProgrammersAvailableForUploadRequest, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_ListProgrammersAvailableForUploadResponse__Output>): grpc.ClientUnaryCall;
  listProgrammersAvailableForUpload(argument: _cc_arduino_cli_commands_v1_ListProgrammersAvailableForUploadRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_ListProgrammersAvailableForUploadResponse__Output>): grpc.ClientUnaryCall;
  listProgrammersAvailableForUpload(argument: _cc_arduino_cli_commands_v1_ListProgrammersAvailableForUploadRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_ListProgrammersAvailableForUploadResponse__Output>): grpc.ClientUnaryCall;
  listProgrammersAvailableForUpload(argument: _cc_arduino_cli_commands_v1_ListProgrammersAvailableForUploadRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_ListProgrammersAvailableForUploadResponse__Output>): grpc.ClientUnaryCall;
  listProgrammersAvailableForUpload(argument: _cc_arduino_cli_commands_v1_ListProgrammersAvailableForUploadRequest, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_ListProgrammersAvailableForUploadResponse__Output>): grpc.ClientUnaryCall;
  
  LoadSketch(argument: _cc_arduino_cli_commands_v1_LoadSketchRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_LoadSketchResponse__Output>): grpc.ClientUnaryCall;
  LoadSketch(argument: _cc_arduino_cli_commands_v1_LoadSketchRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_LoadSketchResponse__Output>): grpc.ClientUnaryCall;
  LoadSketch(argument: _cc_arduino_cli_commands_v1_LoadSketchRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_LoadSketchResponse__Output>): grpc.ClientUnaryCall;
  LoadSketch(argument: _cc_arduino_cli_commands_v1_LoadSketchRequest, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_LoadSketchResponse__Output>): grpc.ClientUnaryCall;
  loadSketch(argument: _cc_arduino_cli_commands_v1_LoadSketchRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_LoadSketchResponse__Output>): grpc.ClientUnaryCall;
  loadSketch(argument: _cc_arduino_cli_commands_v1_LoadSketchRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_LoadSketchResponse__Output>): grpc.ClientUnaryCall;
  loadSketch(argument: _cc_arduino_cli_commands_v1_LoadSketchRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_LoadSketchResponse__Output>): grpc.ClientUnaryCall;
  loadSketch(argument: _cc_arduino_cli_commands_v1_LoadSketchRequest, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_LoadSketchResponse__Output>): grpc.ClientUnaryCall;
  
  Monitor(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_cc_arduino_cli_commands_v1_MonitorRequest, _cc_arduino_cli_commands_v1_MonitorResponse__Output>;
  Monitor(options?: grpc.CallOptions): grpc.ClientDuplexStream<_cc_arduino_cli_commands_v1_MonitorRequest, _cc_arduino_cli_commands_v1_MonitorResponse__Output>;
  monitor(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_cc_arduino_cli_commands_v1_MonitorRequest, _cc_arduino_cli_commands_v1_MonitorResponse__Output>;
  monitor(options?: grpc.CallOptions): grpc.ClientDuplexStream<_cc_arduino_cli_commands_v1_MonitorRequest, _cc_arduino_cli_commands_v1_MonitorResponse__Output>;
  
  NewSketch(argument: _cc_arduino_cli_commands_v1_NewSketchRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_NewSketchResponse__Output>): grpc.ClientUnaryCall;
  NewSketch(argument: _cc_arduino_cli_commands_v1_NewSketchRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_NewSketchResponse__Output>): grpc.ClientUnaryCall;
  NewSketch(argument: _cc_arduino_cli_commands_v1_NewSketchRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_NewSketchResponse__Output>): grpc.ClientUnaryCall;
  NewSketch(argument: _cc_arduino_cli_commands_v1_NewSketchRequest, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_NewSketchResponse__Output>): grpc.ClientUnaryCall;
  newSketch(argument: _cc_arduino_cli_commands_v1_NewSketchRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_NewSketchResponse__Output>): grpc.ClientUnaryCall;
  newSketch(argument: _cc_arduino_cli_commands_v1_NewSketchRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_NewSketchResponse__Output>): grpc.ClientUnaryCall;
  newSketch(argument: _cc_arduino_cli_commands_v1_NewSketchRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_NewSketchResponse__Output>): grpc.ClientUnaryCall;
  newSketch(argument: _cc_arduino_cli_commands_v1_NewSketchRequest, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_NewSketchResponse__Output>): grpc.ClientUnaryCall;
  
  Outdated(argument: _cc_arduino_cli_commands_v1_OutdatedRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_OutdatedResponse__Output>): grpc.ClientUnaryCall;
  Outdated(argument: _cc_arduino_cli_commands_v1_OutdatedRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_OutdatedResponse__Output>): grpc.ClientUnaryCall;
  Outdated(argument: _cc_arduino_cli_commands_v1_OutdatedRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_OutdatedResponse__Output>): grpc.ClientUnaryCall;
  Outdated(argument: _cc_arduino_cli_commands_v1_OutdatedRequest, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_OutdatedResponse__Output>): grpc.ClientUnaryCall;
  outdated(argument: _cc_arduino_cli_commands_v1_OutdatedRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_OutdatedResponse__Output>): grpc.ClientUnaryCall;
  outdated(argument: _cc_arduino_cli_commands_v1_OutdatedRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_OutdatedResponse__Output>): grpc.ClientUnaryCall;
  outdated(argument: _cc_arduino_cli_commands_v1_OutdatedRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_OutdatedResponse__Output>): grpc.ClientUnaryCall;
  outdated(argument: _cc_arduino_cli_commands_v1_OutdatedRequest, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_OutdatedResponse__Output>): grpc.ClientUnaryCall;
  
  PlatformDownload(argument: _cc_arduino_cli_commands_v1_PlatformDownloadRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_PlatformDownloadResponse__Output>;
  PlatformDownload(argument: _cc_arduino_cli_commands_v1_PlatformDownloadRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_PlatformDownloadResponse__Output>;
  platformDownload(argument: _cc_arduino_cli_commands_v1_PlatformDownloadRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_PlatformDownloadResponse__Output>;
  platformDownload(argument: _cc_arduino_cli_commands_v1_PlatformDownloadRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_PlatformDownloadResponse__Output>;
  
  PlatformInstall(argument: _cc_arduino_cli_commands_v1_PlatformInstallRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_PlatformInstallResponse__Output>;
  PlatformInstall(argument: _cc_arduino_cli_commands_v1_PlatformInstallRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_PlatformInstallResponse__Output>;
  platformInstall(argument: _cc_arduino_cli_commands_v1_PlatformInstallRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_PlatformInstallResponse__Output>;
  platformInstall(argument: _cc_arduino_cli_commands_v1_PlatformInstallRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_PlatformInstallResponse__Output>;
  
  PlatformList(argument: _cc_arduino_cli_commands_v1_PlatformListRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_PlatformListResponse__Output>): grpc.ClientUnaryCall;
  PlatformList(argument: _cc_arduino_cli_commands_v1_PlatformListRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_PlatformListResponse__Output>): grpc.ClientUnaryCall;
  PlatformList(argument: _cc_arduino_cli_commands_v1_PlatformListRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_PlatformListResponse__Output>): grpc.ClientUnaryCall;
  PlatformList(argument: _cc_arduino_cli_commands_v1_PlatformListRequest, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_PlatformListResponse__Output>): grpc.ClientUnaryCall;
  platformList(argument: _cc_arduino_cli_commands_v1_PlatformListRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_PlatformListResponse__Output>): grpc.ClientUnaryCall;
  platformList(argument: _cc_arduino_cli_commands_v1_PlatformListRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_PlatformListResponse__Output>): grpc.ClientUnaryCall;
  platformList(argument: _cc_arduino_cli_commands_v1_PlatformListRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_PlatformListResponse__Output>): grpc.ClientUnaryCall;
  platformList(argument: _cc_arduino_cli_commands_v1_PlatformListRequest, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_PlatformListResponse__Output>): grpc.ClientUnaryCall;
  
  PlatformSearch(argument: _cc_arduino_cli_commands_v1_PlatformSearchRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_PlatformSearchResponse__Output>): grpc.ClientUnaryCall;
  PlatformSearch(argument: _cc_arduino_cli_commands_v1_PlatformSearchRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_PlatformSearchResponse__Output>): grpc.ClientUnaryCall;
  PlatformSearch(argument: _cc_arduino_cli_commands_v1_PlatformSearchRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_PlatformSearchResponse__Output>): grpc.ClientUnaryCall;
  PlatformSearch(argument: _cc_arduino_cli_commands_v1_PlatformSearchRequest, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_PlatformSearchResponse__Output>): grpc.ClientUnaryCall;
  platformSearch(argument: _cc_arduino_cli_commands_v1_PlatformSearchRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_PlatformSearchResponse__Output>): grpc.ClientUnaryCall;
  platformSearch(argument: _cc_arduino_cli_commands_v1_PlatformSearchRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_PlatformSearchResponse__Output>): grpc.ClientUnaryCall;
  platformSearch(argument: _cc_arduino_cli_commands_v1_PlatformSearchRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_PlatformSearchResponse__Output>): grpc.ClientUnaryCall;
  platformSearch(argument: _cc_arduino_cli_commands_v1_PlatformSearchRequest, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_PlatformSearchResponse__Output>): grpc.ClientUnaryCall;
  
  PlatformUninstall(argument: _cc_arduino_cli_commands_v1_PlatformUninstallRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_PlatformUninstallResponse__Output>;
  PlatformUninstall(argument: _cc_arduino_cli_commands_v1_PlatformUninstallRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_PlatformUninstallResponse__Output>;
  platformUninstall(argument: _cc_arduino_cli_commands_v1_PlatformUninstallRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_PlatformUninstallResponse__Output>;
  platformUninstall(argument: _cc_arduino_cli_commands_v1_PlatformUninstallRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_PlatformUninstallResponse__Output>;
  
  PlatformUpgrade(argument: _cc_arduino_cli_commands_v1_PlatformUpgradeRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_PlatformUpgradeResponse__Output>;
  PlatformUpgrade(argument: _cc_arduino_cli_commands_v1_PlatformUpgradeRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_PlatformUpgradeResponse__Output>;
  platformUpgrade(argument: _cc_arduino_cli_commands_v1_PlatformUpgradeRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_PlatformUpgradeResponse__Output>;
  platformUpgrade(argument: _cc_arduino_cli_commands_v1_PlatformUpgradeRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_PlatformUpgradeResponse__Output>;
  
  SupportedUserFields(argument: _cc_arduino_cli_commands_v1_SupportedUserFieldsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_SupportedUserFieldsResponse__Output>): grpc.ClientUnaryCall;
  SupportedUserFields(argument: _cc_arduino_cli_commands_v1_SupportedUserFieldsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_SupportedUserFieldsResponse__Output>): grpc.ClientUnaryCall;
  SupportedUserFields(argument: _cc_arduino_cli_commands_v1_SupportedUserFieldsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_SupportedUserFieldsResponse__Output>): grpc.ClientUnaryCall;
  SupportedUserFields(argument: _cc_arduino_cli_commands_v1_SupportedUserFieldsRequest, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_SupportedUserFieldsResponse__Output>): grpc.ClientUnaryCall;
  supportedUserFields(argument: _cc_arduino_cli_commands_v1_SupportedUserFieldsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_SupportedUserFieldsResponse__Output>): grpc.ClientUnaryCall;
  supportedUserFields(argument: _cc_arduino_cli_commands_v1_SupportedUserFieldsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_SupportedUserFieldsResponse__Output>): grpc.ClientUnaryCall;
  supportedUserFields(argument: _cc_arduino_cli_commands_v1_SupportedUserFieldsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_SupportedUserFieldsResponse__Output>): grpc.ClientUnaryCall;
  supportedUserFields(argument: _cc_arduino_cli_commands_v1_SupportedUserFieldsRequest, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_SupportedUserFieldsResponse__Output>): grpc.ClientUnaryCall;
  
  UpdateCoreLibrariesIndex(argument: _cc_arduino_cli_commands_v1_UpdateCoreLibrariesIndexRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_UpdateCoreLibrariesIndexResponse__Output>;
  UpdateCoreLibrariesIndex(argument: _cc_arduino_cli_commands_v1_UpdateCoreLibrariesIndexRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_UpdateCoreLibrariesIndexResponse__Output>;
  updateCoreLibrariesIndex(argument: _cc_arduino_cli_commands_v1_UpdateCoreLibrariesIndexRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_UpdateCoreLibrariesIndexResponse__Output>;
  updateCoreLibrariesIndex(argument: _cc_arduino_cli_commands_v1_UpdateCoreLibrariesIndexRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_UpdateCoreLibrariesIndexResponse__Output>;
  
  UpdateIndex(argument: _cc_arduino_cli_commands_v1_UpdateIndexRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_UpdateIndexResponse__Output>;
  UpdateIndex(argument: _cc_arduino_cli_commands_v1_UpdateIndexRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_UpdateIndexResponse__Output>;
  updateIndex(argument: _cc_arduino_cli_commands_v1_UpdateIndexRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_UpdateIndexResponse__Output>;
  updateIndex(argument: _cc_arduino_cli_commands_v1_UpdateIndexRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_UpdateIndexResponse__Output>;
  
  UpdateLibrariesIndex(argument: _cc_arduino_cli_commands_v1_UpdateLibrariesIndexRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_UpdateLibrariesIndexResponse__Output>;
  UpdateLibrariesIndex(argument: _cc_arduino_cli_commands_v1_UpdateLibrariesIndexRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_UpdateLibrariesIndexResponse__Output>;
  updateLibrariesIndex(argument: _cc_arduino_cli_commands_v1_UpdateLibrariesIndexRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_UpdateLibrariesIndexResponse__Output>;
  updateLibrariesIndex(argument: _cc_arduino_cli_commands_v1_UpdateLibrariesIndexRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_UpdateLibrariesIndexResponse__Output>;
  
  Upgrade(argument: _cc_arduino_cli_commands_v1_UpgradeRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_UpgradeResponse__Output>;
  Upgrade(argument: _cc_arduino_cli_commands_v1_UpgradeRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_UpgradeResponse__Output>;
  upgrade(argument: _cc_arduino_cli_commands_v1_UpgradeRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_UpgradeResponse__Output>;
  upgrade(argument: _cc_arduino_cli_commands_v1_UpgradeRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_UpgradeResponse__Output>;
  
  Upload(argument: _cc_arduino_cli_commands_v1_UploadRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_UploadResponse__Output>;
  Upload(argument: _cc_arduino_cli_commands_v1_UploadRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_UploadResponse__Output>;
  upload(argument: _cc_arduino_cli_commands_v1_UploadRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_UploadResponse__Output>;
  upload(argument: _cc_arduino_cli_commands_v1_UploadRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_UploadResponse__Output>;
  
  UploadUsingProgrammer(argument: _cc_arduino_cli_commands_v1_UploadUsingProgrammerRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_UploadUsingProgrammerResponse__Output>;
  UploadUsingProgrammer(argument: _cc_arduino_cli_commands_v1_UploadUsingProgrammerRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_UploadUsingProgrammerResponse__Output>;
  uploadUsingProgrammer(argument: _cc_arduino_cli_commands_v1_UploadUsingProgrammerRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_UploadUsingProgrammerResponse__Output>;
  uploadUsingProgrammer(argument: _cc_arduino_cli_commands_v1_UploadUsingProgrammerRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_UploadUsingProgrammerResponse__Output>;
  
  Version(argument: _cc_arduino_cli_commands_v1_VersionRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_VersionResponse__Output>): grpc.ClientUnaryCall;
  Version(argument: _cc_arduino_cli_commands_v1_VersionRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_VersionResponse__Output>): grpc.ClientUnaryCall;
  Version(argument: _cc_arduino_cli_commands_v1_VersionRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_VersionResponse__Output>): grpc.ClientUnaryCall;
  Version(argument: _cc_arduino_cli_commands_v1_VersionRequest, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_VersionResponse__Output>): grpc.ClientUnaryCall;
  version(argument: _cc_arduino_cli_commands_v1_VersionRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_VersionResponse__Output>): grpc.ClientUnaryCall;
  version(argument: _cc_arduino_cli_commands_v1_VersionRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_VersionResponse__Output>): grpc.ClientUnaryCall;
  version(argument: _cc_arduino_cli_commands_v1_VersionRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_VersionResponse__Output>): grpc.ClientUnaryCall;
  version(argument: _cc_arduino_cli_commands_v1_VersionRequest, callback: grpc.requestCallback<_cc_arduino_cli_commands_v1_VersionResponse__Output>): grpc.ClientUnaryCall;
  
  ZipLibraryInstall(argument: _cc_arduino_cli_commands_v1_ZipLibraryInstallRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_ZipLibraryInstallResponse__Output>;
  ZipLibraryInstall(argument: _cc_arduino_cli_commands_v1_ZipLibraryInstallRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_ZipLibraryInstallResponse__Output>;
  zipLibraryInstall(argument: _cc_arduino_cli_commands_v1_ZipLibraryInstallRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_ZipLibraryInstallResponse__Output>;
  zipLibraryInstall(argument: _cc_arduino_cli_commands_v1_ZipLibraryInstallRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_cc_arduino_cli_commands_v1_ZipLibraryInstallResponse__Output>;
  
}

export interface ArduinoCoreServiceHandlers extends grpc.UntypedServiceImplementation {
  ArchiveSketch: grpc.handleUnaryCall<_cc_arduino_cli_commands_v1_ArchiveSketchRequest__Output, _cc_arduino_cli_commands_v1_ArchiveSketchResponse>;
  
  BoardAttach: grpc.handleServerStreamingCall<_cc_arduino_cli_commands_v1_BoardAttachRequest__Output, _cc_arduino_cli_commands_v1_BoardAttachResponse>;
  
  BoardDetails: grpc.handleUnaryCall<_cc_arduino_cli_commands_v1_BoardDetailsRequest__Output, _cc_arduino_cli_commands_v1_BoardDetailsResponse>;
  
  BoardList: grpc.handleUnaryCall<_cc_arduino_cli_commands_v1_BoardListRequest__Output, _cc_arduino_cli_commands_v1_BoardListResponse>;
  
  BoardListAll: grpc.handleUnaryCall<_cc_arduino_cli_commands_v1_BoardListAllRequest__Output, _cc_arduino_cli_commands_v1_BoardListAllResponse>;
  
  BoardListWatch: grpc.handleBidiStreamingCall<_cc_arduino_cli_commands_v1_BoardListWatchRequest__Output, _cc_arduino_cli_commands_v1_BoardListWatchResponse>;
  
  BoardSearch: grpc.handleUnaryCall<_cc_arduino_cli_commands_v1_BoardSearchRequest__Output, _cc_arduino_cli_commands_v1_BoardSearchResponse>;
  
  BurnBootloader: grpc.handleServerStreamingCall<_cc_arduino_cli_commands_v1_BurnBootloaderRequest__Output, _cc_arduino_cli_commands_v1_BurnBootloaderResponse>;
  
  Compile: grpc.handleServerStreamingCall<_cc_arduino_cli_commands_v1_CompileRequest__Output, _cc_arduino_cli_commands_v1_CompileResponse>;
  
  Create: grpc.handleUnaryCall<_cc_arduino_cli_commands_v1_CreateRequest__Output, _cc_arduino_cli_commands_v1_CreateResponse>;
  
  Destroy: grpc.handleUnaryCall<_cc_arduino_cli_commands_v1_DestroyRequest__Output, _cc_arduino_cli_commands_v1_DestroyResponse>;
  
  EnumerateMonitorPortSettings: grpc.handleUnaryCall<_cc_arduino_cli_commands_v1_EnumerateMonitorPortSettingsRequest__Output, _cc_arduino_cli_commands_v1_EnumerateMonitorPortSettingsResponse>;
  
  GitLibraryInstall: grpc.handleServerStreamingCall<_cc_arduino_cli_commands_v1_GitLibraryInstallRequest__Output, _cc_arduino_cli_commands_v1_GitLibraryInstallResponse>;
  
  Init: grpc.handleServerStreamingCall<_cc_arduino_cli_commands_v1_InitRequest__Output, _cc_arduino_cli_commands_v1_InitResponse>;
  
  LibraryDownload: grpc.handleServerStreamingCall<_cc_arduino_cli_commands_v1_LibraryDownloadRequest__Output, _cc_arduino_cli_commands_v1_LibraryDownloadResponse>;
  
  LibraryInstall: grpc.handleServerStreamingCall<_cc_arduino_cli_commands_v1_LibraryInstallRequest__Output, _cc_arduino_cli_commands_v1_LibraryInstallResponse>;
  
  LibraryList: grpc.handleUnaryCall<_cc_arduino_cli_commands_v1_LibraryListRequest__Output, _cc_arduino_cli_commands_v1_LibraryListResponse>;
  
  LibraryResolveDependencies: grpc.handleUnaryCall<_cc_arduino_cli_commands_v1_LibraryResolveDependenciesRequest__Output, _cc_arduino_cli_commands_v1_LibraryResolveDependenciesResponse>;
  
  LibrarySearch: grpc.handleUnaryCall<_cc_arduino_cli_commands_v1_LibrarySearchRequest__Output, _cc_arduino_cli_commands_v1_LibrarySearchResponse>;
  
  LibraryUninstall: grpc.handleServerStreamingCall<_cc_arduino_cli_commands_v1_LibraryUninstallRequest__Output, _cc_arduino_cli_commands_v1_LibraryUninstallResponse>;
  
  LibraryUpgradeAll: grpc.handleServerStreamingCall<_cc_arduino_cli_commands_v1_LibraryUpgradeAllRequest__Output, _cc_arduino_cli_commands_v1_LibraryUpgradeAllResponse>;
  
  ListProgrammersAvailableForUpload: grpc.handleUnaryCall<_cc_arduino_cli_commands_v1_ListProgrammersAvailableForUploadRequest__Output, _cc_arduino_cli_commands_v1_ListProgrammersAvailableForUploadResponse>;
  
  LoadSketch: grpc.handleUnaryCall<_cc_arduino_cli_commands_v1_LoadSketchRequest__Output, _cc_arduino_cli_commands_v1_LoadSketchResponse>;
  
  Monitor: grpc.handleBidiStreamingCall<_cc_arduino_cli_commands_v1_MonitorRequest__Output, _cc_arduino_cli_commands_v1_MonitorResponse>;
  
  NewSketch: grpc.handleUnaryCall<_cc_arduino_cli_commands_v1_NewSketchRequest__Output, _cc_arduino_cli_commands_v1_NewSketchResponse>;
  
  Outdated: grpc.handleUnaryCall<_cc_arduino_cli_commands_v1_OutdatedRequest__Output, _cc_arduino_cli_commands_v1_OutdatedResponse>;
  
  PlatformDownload: grpc.handleServerStreamingCall<_cc_arduino_cli_commands_v1_PlatformDownloadRequest__Output, _cc_arduino_cli_commands_v1_PlatformDownloadResponse>;
  
  PlatformInstall: grpc.handleServerStreamingCall<_cc_arduino_cli_commands_v1_PlatformInstallRequest__Output, _cc_arduino_cli_commands_v1_PlatformInstallResponse>;
  
  PlatformList: grpc.handleUnaryCall<_cc_arduino_cli_commands_v1_PlatformListRequest__Output, _cc_arduino_cli_commands_v1_PlatformListResponse>;
  
  PlatformSearch: grpc.handleUnaryCall<_cc_arduino_cli_commands_v1_PlatformSearchRequest__Output, _cc_arduino_cli_commands_v1_PlatformSearchResponse>;
  
  PlatformUninstall: grpc.handleServerStreamingCall<_cc_arduino_cli_commands_v1_PlatformUninstallRequest__Output, _cc_arduino_cli_commands_v1_PlatformUninstallResponse>;
  
  PlatformUpgrade: grpc.handleServerStreamingCall<_cc_arduino_cli_commands_v1_PlatformUpgradeRequest__Output, _cc_arduino_cli_commands_v1_PlatformUpgradeResponse>;
  
  SupportedUserFields: grpc.handleUnaryCall<_cc_arduino_cli_commands_v1_SupportedUserFieldsRequest__Output, _cc_arduino_cli_commands_v1_SupportedUserFieldsResponse>;
  
  UpdateCoreLibrariesIndex: grpc.handleServerStreamingCall<_cc_arduino_cli_commands_v1_UpdateCoreLibrariesIndexRequest__Output, _cc_arduino_cli_commands_v1_UpdateCoreLibrariesIndexResponse>;
  
  UpdateIndex: grpc.handleServerStreamingCall<_cc_arduino_cli_commands_v1_UpdateIndexRequest__Output, _cc_arduino_cli_commands_v1_UpdateIndexResponse>;
  
  UpdateLibrariesIndex: grpc.handleServerStreamingCall<_cc_arduino_cli_commands_v1_UpdateLibrariesIndexRequest__Output, _cc_arduino_cli_commands_v1_UpdateLibrariesIndexResponse>;
  
  Upgrade: grpc.handleServerStreamingCall<_cc_arduino_cli_commands_v1_UpgradeRequest__Output, _cc_arduino_cli_commands_v1_UpgradeResponse>;
  
  Upload: grpc.handleServerStreamingCall<_cc_arduino_cli_commands_v1_UploadRequest__Output, _cc_arduino_cli_commands_v1_UploadResponse>;
  
  UploadUsingProgrammer: grpc.handleServerStreamingCall<_cc_arduino_cli_commands_v1_UploadUsingProgrammerRequest__Output, _cc_arduino_cli_commands_v1_UploadUsingProgrammerResponse>;
  
  Version: grpc.handleUnaryCall<_cc_arduino_cli_commands_v1_VersionRequest__Output, _cc_arduino_cli_commands_v1_VersionResponse>;
  
  ZipLibraryInstall: grpc.handleServerStreamingCall<_cc_arduino_cli_commands_v1_ZipLibraryInstallRequest__Output, _cc_arduino_cli_commands_v1_ZipLibraryInstallResponse>;
  
}

export interface ArduinoCoreServiceDefinition extends grpc.ServiceDefinition {
  ArchiveSketch: MethodDefinition<_cc_arduino_cli_commands_v1_ArchiveSketchRequest, _cc_arduino_cli_commands_v1_ArchiveSketchResponse, _cc_arduino_cli_commands_v1_ArchiveSketchRequest__Output, _cc_arduino_cli_commands_v1_ArchiveSketchResponse__Output>
  BoardAttach: MethodDefinition<_cc_arduino_cli_commands_v1_BoardAttachRequest, _cc_arduino_cli_commands_v1_BoardAttachResponse, _cc_arduino_cli_commands_v1_BoardAttachRequest__Output, _cc_arduino_cli_commands_v1_BoardAttachResponse__Output>
  BoardDetails: MethodDefinition<_cc_arduino_cli_commands_v1_BoardDetailsRequest, _cc_arduino_cli_commands_v1_BoardDetailsResponse, _cc_arduino_cli_commands_v1_BoardDetailsRequest__Output, _cc_arduino_cli_commands_v1_BoardDetailsResponse__Output>
  BoardList: MethodDefinition<_cc_arduino_cli_commands_v1_BoardListRequest, _cc_arduino_cli_commands_v1_BoardListResponse, _cc_arduino_cli_commands_v1_BoardListRequest__Output, _cc_arduino_cli_commands_v1_BoardListResponse__Output>
  BoardListAll: MethodDefinition<_cc_arduino_cli_commands_v1_BoardListAllRequest, _cc_arduino_cli_commands_v1_BoardListAllResponse, _cc_arduino_cli_commands_v1_BoardListAllRequest__Output, _cc_arduino_cli_commands_v1_BoardListAllResponse__Output>
  BoardListWatch: MethodDefinition<_cc_arduino_cli_commands_v1_BoardListWatchRequest, _cc_arduino_cli_commands_v1_BoardListWatchResponse, _cc_arduino_cli_commands_v1_BoardListWatchRequest__Output, _cc_arduino_cli_commands_v1_BoardListWatchResponse__Output>
  BoardSearch: MethodDefinition<_cc_arduino_cli_commands_v1_BoardSearchRequest, _cc_arduino_cli_commands_v1_BoardSearchResponse, _cc_arduino_cli_commands_v1_BoardSearchRequest__Output, _cc_arduino_cli_commands_v1_BoardSearchResponse__Output>
  BurnBootloader: MethodDefinition<_cc_arduino_cli_commands_v1_BurnBootloaderRequest, _cc_arduino_cli_commands_v1_BurnBootloaderResponse, _cc_arduino_cli_commands_v1_BurnBootloaderRequest__Output, _cc_arduino_cli_commands_v1_BurnBootloaderResponse__Output>
  Compile: MethodDefinition<_cc_arduino_cli_commands_v1_CompileRequest, _cc_arduino_cli_commands_v1_CompileResponse, _cc_arduino_cli_commands_v1_CompileRequest__Output, _cc_arduino_cli_commands_v1_CompileResponse__Output>
  Create: MethodDefinition<_cc_arduino_cli_commands_v1_CreateRequest, _cc_arduino_cli_commands_v1_CreateResponse, _cc_arduino_cli_commands_v1_CreateRequest__Output, _cc_arduino_cli_commands_v1_CreateResponse__Output>
  Destroy: MethodDefinition<_cc_arduino_cli_commands_v1_DestroyRequest, _cc_arduino_cli_commands_v1_DestroyResponse, _cc_arduino_cli_commands_v1_DestroyRequest__Output, _cc_arduino_cli_commands_v1_DestroyResponse__Output>
  EnumerateMonitorPortSettings: MethodDefinition<_cc_arduino_cli_commands_v1_EnumerateMonitorPortSettingsRequest, _cc_arduino_cli_commands_v1_EnumerateMonitorPortSettingsResponse, _cc_arduino_cli_commands_v1_EnumerateMonitorPortSettingsRequest__Output, _cc_arduino_cli_commands_v1_EnumerateMonitorPortSettingsResponse__Output>
  GitLibraryInstall: MethodDefinition<_cc_arduino_cli_commands_v1_GitLibraryInstallRequest, _cc_arduino_cli_commands_v1_GitLibraryInstallResponse, _cc_arduino_cli_commands_v1_GitLibraryInstallRequest__Output, _cc_arduino_cli_commands_v1_GitLibraryInstallResponse__Output>
  Init: MethodDefinition<_cc_arduino_cli_commands_v1_InitRequest, _cc_arduino_cli_commands_v1_InitResponse, _cc_arduino_cli_commands_v1_InitRequest__Output, _cc_arduino_cli_commands_v1_InitResponse__Output>
  LibraryDownload: MethodDefinition<_cc_arduino_cli_commands_v1_LibraryDownloadRequest, _cc_arduino_cli_commands_v1_LibraryDownloadResponse, _cc_arduino_cli_commands_v1_LibraryDownloadRequest__Output, _cc_arduino_cli_commands_v1_LibraryDownloadResponse__Output>
  LibraryInstall: MethodDefinition<_cc_arduino_cli_commands_v1_LibraryInstallRequest, _cc_arduino_cli_commands_v1_LibraryInstallResponse, _cc_arduino_cli_commands_v1_LibraryInstallRequest__Output, _cc_arduino_cli_commands_v1_LibraryInstallResponse__Output>
  LibraryList: MethodDefinition<_cc_arduino_cli_commands_v1_LibraryListRequest, _cc_arduino_cli_commands_v1_LibraryListResponse, _cc_arduino_cli_commands_v1_LibraryListRequest__Output, _cc_arduino_cli_commands_v1_LibraryListResponse__Output>
  LibraryResolveDependencies: MethodDefinition<_cc_arduino_cli_commands_v1_LibraryResolveDependenciesRequest, _cc_arduino_cli_commands_v1_LibraryResolveDependenciesResponse, _cc_arduino_cli_commands_v1_LibraryResolveDependenciesRequest__Output, _cc_arduino_cli_commands_v1_LibraryResolveDependenciesResponse__Output>
  LibrarySearch: MethodDefinition<_cc_arduino_cli_commands_v1_LibrarySearchRequest, _cc_arduino_cli_commands_v1_LibrarySearchResponse, _cc_arduino_cli_commands_v1_LibrarySearchRequest__Output, _cc_arduino_cli_commands_v1_LibrarySearchResponse__Output>
  LibraryUninstall: MethodDefinition<_cc_arduino_cli_commands_v1_LibraryUninstallRequest, _cc_arduino_cli_commands_v1_LibraryUninstallResponse, _cc_arduino_cli_commands_v1_LibraryUninstallRequest__Output, _cc_arduino_cli_commands_v1_LibraryUninstallResponse__Output>
  LibraryUpgradeAll: MethodDefinition<_cc_arduino_cli_commands_v1_LibraryUpgradeAllRequest, _cc_arduino_cli_commands_v1_LibraryUpgradeAllResponse, _cc_arduino_cli_commands_v1_LibraryUpgradeAllRequest__Output, _cc_arduino_cli_commands_v1_LibraryUpgradeAllResponse__Output>
  ListProgrammersAvailableForUpload: MethodDefinition<_cc_arduino_cli_commands_v1_ListProgrammersAvailableForUploadRequest, _cc_arduino_cli_commands_v1_ListProgrammersAvailableForUploadResponse, _cc_arduino_cli_commands_v1_ListProgrammersAvailableForUploadRequest__Output, _cc_arduino_cli_commands_v1_ListProgrammersAvailableForUploadResponse__Output>
  LoadSketch: MethodDefinition<_cc_arduino_cli_commands_v1_LoadSketchRequest, _cc_arduino_cli_commands_v1_LoadSketchResponse, _cc_arduino_cli_commands_v1_LoadSketchRequest__Output, _cc_arduino_cli_commands_v1_LoadSketchResponse__Output>
  Monitor: MethodDefinition<_cc_arduino_cli_commands_v1_MonitorRequest, _cc_arduino_cli_commands_v1_MonitorResponse, _cc_arduino_cli_commands_v1_MonitorRequest__Output, _cc_arduino_cli_commands_v1_MonitorResponse__Output>
  NewSketch: MethodDefinition<_cc_arduino_cli_commands_v1_NewSketchRequest, _cc_arduino_cli_commands_v1_NewSketchResponse, _cc_arduino_cli_commands_v1_NewSketchRequest__Output, _cc_arduino_cli_commands_v1_NewSketchResponse__Output>
  Outdated: MethodDefinition<_cc_arduino_cli_commands_v1_OutdatedRequest, _cc_arduino_cli_commands_v1_OutdatedResponse, _cc_arduino_cli_commands_v1_OutdatedRequest__Output, _cc_arduino_cli_commands_v1_OutdatedResponse__Output>
  PlatformDownload: MethodDefinition<_cc_arduino_cli_commands_v1_PlatformDownloadRequest, _cc_arduino_cli_commands_v1_PlatformDownloadResponse, _cc_arduino_cli_commands_v1_PlatformDownloadRequest__Output, _cc_arduino_cli_commands_v1_PlatformDownloadResponse__Output>
  PlatformInstall: MethodDefinition<_cc_arduino_cli_commands_v1_PlatformInstallRequest, _cc_arduino_cli_commands_v1_PlatformInstallResponse, _cc_arduino_cli_commands_v1_PlatformInstallRequest__Output, _cc_arduino_cli_commands_v1_PlatformInstallResponse__Output>
  PlatformList: MethodDefinition<_cc_arduino_cli_commands_v1_PlatformListRequest, _cc_arduino_cli_commands_v1_PlatformListResponse, _cc_arduino_cli_commands_v1_PlatformListRequest__Output, _cc_arduino_cli_commands_v1_PlatformListResponse__Output>
  PlatformSearch: MethodDefinition<_cc_arduino_cli_commands_v1_PlatformSearchRequest, _cc_arduino_cli_commands_v1_PlatformSearchResponse, _cc_arduino_cli_commands_v1_PlatformSearchRequest__Output, _cc_arduino_cli_commands_v1_PlatformSearchResponse__Output>
  PlatformUninstall: MethodDefinition<_cc_arduino_cli_commands_v1_PlatformUninstallRequest, _cc_arduino_cli_commands_v1_PlatformUninstallResponse, _cc_arduino_cli_commands_v1_PlatformUninstallRequest__Output, _cc_arduino_cli_commands_v1_PlatformUninstallResponse__Output>
  PlatformUpgrade: MethodDefinition<_cc_arduino_cli_commands_v1_PlatformUpgradeRequest, _cc_arduino_cli_commands_v1_PlatformUpgradeResponse, _cc_arduino_cli_commands_v1_PlatformUpgradeRequest__Output, _cc_arduino_cli_commands_v1_PlatformUpgradeResponse__Output>
  SupportedUserFields: MethodDefinition<_cc_arduino_cli_commands_v1_SupportedUserFieldsRequest, _cc_arduino_cli_commands_v1_SupportedUserFieldsResponse, _cc_arduino_cli_commands_v1_SupportedUserFieldsRequest__Output, _cc_arduino_cli_commands_v1_SupportedUserFieldsResponse__Output>
  UpdateCoreLibrariesIndex: MethodDefinition<_cc_arduino_cli_commands_v1_UpdateCoreLibrariesIndexRequest, _cc_arduino_cli_commands_v1_UpdateCoreLibrariesIndexResponse, _cc_arduino_cli_commands_v1_UpdateCoreLibrariesIndexRequest__Output, _cc_arduino_cli_commands_v1_UpdateCoreLibrariesIndexResponse__Output>
  UpdateIndex: MethodDefinition<_cc_arduino_cli_commands_v1_UpdateIndexRequest, _cc_arduino_cli_commands_v1_UpdateIndexResponse, _cc_arduino_cli_commands_v1_UpdateIndexRequest__Output, _cc_arduino_cli_commands_v1_UpdateIndexResponse__Output>
  UpdateLibrariesIndex: MethodDefinition<_cc_arduino_cli_commands_v1_UpdateLibrariesIndexRequest, _cc_arduino_cli_commands_v1_UpdateLibrariesIndexResponse, _cc_arduino_cli_commands_v1_UpdateLibrariesIndexRequest__Output, _cc_arduino_cli_commands_v1_UpdateLibrariesIndexResponse__Output>
  Upgrade: MethodDefinition<_cc_arduino_cli_commands_v1_UpgradeRequest, _cc_arduino_cli_commands_v1_UpgradeResponse, _cc_arduino_cli_commands_v1_UpgradeRequest__Output, _cc_arduino_cli_commands_v1_UpgradeResponse__Output>
  Upload: MethodDefinition<_cc_arduino_cli_commands_v1_UploadRequest, _cc_arduino_cli_commands_v1_UploadResponse, _cc_arduino_cli_commands_v1_UploadRequest__Output, _cc_arduino_cli_commands_v1_UploadResponse__Output>
  UploadUsingProgrammer: MethodDefinition<_cc_arduino_cli_commands_v1_UploadUsingProgrammerRequest, _cc_arduino_cli_commands_v1_UploadUsingProgrammerResponse, _cc_arduino_cli_commands_v1_UploadUsingProgrammerRequest__Output, _cc_arduino_cli_commands_v1_UploadUsingProgrammerResponse__Output>
  Version: MethodDefinition<_cc_arduino_cli_commands_v1_VersionRequest, _cc_arduino_cli_commands_v1_VersionResponse, _cc_arduino_cli_commands_v1_VersionRequest__Output, _cc_arduino_cli_commands_v1_VersionResponse__Output>
  ZipLibraryInstall: MethodDefinition<_cc_arduino_cli_commands_v1_ZipLibraryInstallRequest, _cc_arduino_cli_commands_v1_ZipLibraryInstallResponse, _cc_arduino_cli_commands_v1_ZipLibraryInstallRequest__Output, _cc_arduino_cli_commands_v1_ZipLibraryInstallResponse__Output>
}
