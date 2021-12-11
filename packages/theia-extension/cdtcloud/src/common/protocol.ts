import { JsonRpcServer } from "@theia/core/lib/common/messaging";

export const DeviceTypeService = Symbol("DeviceType");
export const DEVICE_TYPES_PATH = "/services/device-types";

export interface DeviceTypeService {
  getDeviceList(): Promise<any[]>;
}

export const CompilationService = Symbol("Compilation");
export const COMPILATION_PATH = "/services/compilation";
export interface CompilationService {
  binaryFile: string;
  artifactUri: string;
  compile(fqbn:string, id:string, sketchPath:string): Promise<void>;
}

export const HelloBackendWithClientService = Symbol("BackendWithClient");
export const HELLO_BACKEND_WITH_CLIENT_PATH = "/services/withClient";

export interface HelloBackendWithClientService
  extends JsonRpcServer<BackendClient> {
  greet(): Promise<string>;
}
export const BackendClient = Symbol("BackendClient");
export interface BackendClient {
  getName(): Promise<string>;
}
