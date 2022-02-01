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
  compile(fqbn:string, id:string, sketchPath:string): Promise<Deployment | DeploymentError>;
}

export type Deployment = {
  kind: "deployment";
  id: string
  status: string
  createdAt: Date
  updatedAt: Date
  artifactUrl: string | null
  deviceId: string
}

export interface DeploymentError {
  kind: "deployment-error";
  statusMessage: string | undefined
  data: {
    name: string,
    message: string,
  }
}

export const ConfigService = Symbol("Config");
export const CONFIG_PATH = "/services/config";
export interface ConfigService {
  getWebsocketHost(): Promise<string>;
  getDeploymentServerHost(): Promise<string>;
}
