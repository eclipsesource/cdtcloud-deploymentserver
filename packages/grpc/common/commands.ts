import type * as grpc from '@grpc/grpc-js';
import type { EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { ArduinoCoreServiceClient as _cc_arduino_cli_commands_v1_ArduinoCoreServiceClient, ArduinoCoreServiceDefinition as _cc_arduino_cli_commands_v1_ArduinoCoreServiceDefinition } from './cc/arduino/cli/commands/v1/ArduinoCoreService';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  cc: {
    arduino: {
      cli: {
        commands: {
          v1: {
            AlreadyAtLatestVersionError: MessageTypeDefinition
            ArchiveSketchRequest: MessageTypeDefinition
            ArchiveSketchResponse: MessageTypeDefinition
            ArduinoCoreService: SubtypeConstructor<typeof grpc.Client, _cc_arduino_cli_commands_v1_ArduinoCoreServiceClient> & { service: _cc_arduino_cli_commands_v1_ArduinoCoreServiceDefinition }
            Board: MessageTypeDefinition
            BoardAttachRequest: MessageTypeDefinition
            BoardAttachResponse: MessageTypeDefinition
            BoardDetailsRequest: MessageTypeDefinition
            BoardDetailsResponse: MessageTypeDefinition
            BoardIdentificationProperties: MessageTypeDefinition
            BoardListAllRequest: MessageTypeDefinition
            BoardListAllResponse: MessageTypeDefinition
            BoardListItem: MessageTypeDefinition
            BoardListRequest: MessageTypeDefinition
            BoardListResponse: MessageTypeDefinition
            BoardListWatchRequest: MessageTypeDefinition
            BoardListWatchResponse: MessageTypeDefinition
            BoardPlatform: MessageTypeDefinition
            BoardSearchRequest: MessageTypeDefinition
            BoardSearchResponse: MessageTypeDefinition
            BurnBootloaderRequest: MessageTypeDefinition
            BurnBootloaderResponse: MessageTypeDefinition
            CompileRequest: MessageTypeDefinition
            CompileResponse: MessageTypeDefinition
            ConfigOption: MessageTypeDefinition
            ConfigValue: MessageTypeDefinition
            CreateRequest: MessageTypeDefinition
            CreateResponse: MessageTypeDefinition
            DestroyRequest: MessageTypeDefinition
            DestroyResponse: MessageTypeDefinition
            DetectedPort: MessageTypeDefinition
            DownloadProgress: MessageTypeDefinition
            DownloadResource: MessageTypeDefinition
            EnumerateMonitorPortSettingsRequest: MessageTypeDefinition
            EnumerateMonitorPortSettingsResponse: MessageTypeDefinition
            ExecutableSectionSize: MessageTypeDefinition
            GitLibraryInstallRequest: MessageTypeDefinition
            GitLibraryInstallResponse: MessageTypeDefinition
            Help: MessageTypeDefinition
            InitRequest: MessageTypeDefinition
            InitResponse: MessageTypeDefinition
            InstalledLibrary: MessageTypeDefinition
            Instance: MessageTypeDefinition
            Library: MessageTypeDefinition
            LibraryDependency: MessageTypeDefinition
            LibraryDependencyStatus: MessageTypeDefinition
            LibraryDownloadRequest: MessageTypeDefinition
            LibraryDownloadResponse: MessageTypeDefinition
            LibraryInstallRequest: MessageTypeDefinition
            LibraryInstallResponse: MessageTypeDefinition
            LibraryLayout: EnumTypeDefinition
            LibraryListRequest: MessageTypeDefinition
            LibraryListResponse: MessageTypeDefinition
            LibraryLocation: EnumTypeDefinition
            LibraryRelease: MessageTypeDefinition
            LibraryResolveDependenciesRequest: MessageTypeDefinition
            LibraryResolveDependenciesResponse: MessageTypeDefinition
            LibrarySearchRequest: MessageTypeDefinition
            LibrarySearchResponse: MessageTypeDefinition
            LibrarySearchStatus: EnumTypeDefinition
            LibraryUninstallRequest: MessageTypeDefinition
            LibraryUninstallResponse: MessageTypeDefinition
            LibraryUpgradeAllRequest: MessageTypeDefinition
            LibraryUpgradeAllResponse: MessageTypeDefinition
            ListProgrammersAvailableForUploadRequest: MessageTypeDefinition
            ListProgrammersAvailableForUploadResponse: MessageTypeDefinition
            LoadSketchRequest: MessageTypeDefinition
            LoadSketchResponse: MessageTypeDefinition
            MonitorPortConfiguration: MessageTypeDefinition
            MonitorPortSetting: MessageTypeDefinition
            MonitorPortSettingDescriptor: MessageTypeDefinition
            MonitorRequest: MessageTypeDefinition
            MonitorResponse: MessageTypeDefinition
            NewSketchRequest: MessageTypeDefinition
            NewSketchResponse: MessageTypeDefinition
            OutdatedRequest: MessageTypeDefinition
            OutdatedResponse: MessageTypeDefinition
            Package: MessageTypeDefinition
            Platform: MessageTypeDefinition
            PlatformDownloadRequest: MessageTypeDefinition
            PlatformDownloadResponse: MessageTypeDefinition
            PlatformInstallRequest: MessageTypeDefinition
            PlatformInstallResponse: MessageTypeDefinition
            PlatformListRequest: MessageTypeDefinition
            PlatformListResponse: MessageTypeDefinition
            PlatformSearchRequest: MessageTypeDefinition
            PlatformSearchResponse: MessageTypeDefinition
            PlatformUninstallRequest: MessageTypeDefinition
            PlatformUninstallResponse: MessageTypeDefinition
            PlatformUpgradeRequest: MessageTypeDefinition
            PlatformUpgradeResponse: MessageTypeDefinition
            Port: MessageTypeDefinition
            Programmer: MessageTypeDefinition
            ProgrammerIsRequiredForUploadError: MessageTypeDefinition
            SearchedLibrary: MessageTypeDefinition
            SupportedUserFieldsRequest: MessageTypeDefinition
            SupportedUserFieldsResponse: MessageTypeDefinition
            Systems: MessageTypeDefinition
            TaskProgress: MessageTypeDefinition
            ToolsDependencies: MessageTypeDefinition
            UpdateCoreLibrariesIndexRequest: MessageTypeDefinition
            UpdateCoreLibrariesIndexResponse: MessageTypeDefinition
            UpdateIndexRequest: MessageTypeDefinition
            UpdateIndexResponse: MessageTypeDefinition
            UpdateLibrariesIndexRequest: MessageTypeDefinition
            UpdateLibrariesIndexResponse: MessageTypeDefinition
            UpgradeRequest: MessageTypeDefinition
            UpgradeResponse: MessageTypeDefinition
            UploadRequest: MessageTypeDefinition
            UploadResponse: MessageTypeDefinition
            UploadUsingProgrammerRequest: MessageTypeDefinition
            UploadUsingProgrammerResponse: MessageTypeDefinition
            UserField: MessageTypeDefinition
            VersionRequest: MessageTypeDefinition
            VersionResponse: MessageTypeDefinition
            ZipLibraryInstallRequest: MessageTypeDefinition
            ZipLibraryInstallResponse: MessageTypeDefinition
          }
        }
      }
    }
  }
  google: {
    protobuf: {
      Any: MessageTypeDefinition
      BoolValue: MessageTypeDefinition
      BytesValue: MessageTypeDefinition
      DoubleValue: MessageTypeDefinition
      FloatValue: MessageTypeDefinition
      Int32Value: MessageTypeDefinition
      Int64Value: MessageTypeDefinition
      StringValue: MessageTypeDefinition
      UInt32Value: MessageTypeDefinition
      UInt64Value: MessageTypeDefinition
    }
    rpc: {
      Status: MessageTypeDefinition
    }
  }
}

