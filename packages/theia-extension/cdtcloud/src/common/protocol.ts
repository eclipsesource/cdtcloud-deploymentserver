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
  compile(fqbn:string, id:string, sketchPath:string): Promise<Deployment>;
}

export type Deployment = {
  id: string
  status: string
  createdAt: Date
  updatedAt: Date
  artifactUrl: string | null
  deviceId: string
}
