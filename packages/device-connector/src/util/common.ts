export enum grpcStatus {
  ok = 'Ok',
  notInitialized = 'Client not initialized',
  unknown = 'Unknown'
}

export enum DeviceStatus {
  UNAVAILABLE = 'UNAVAILABLE',
  AVAILABLE = 'AVAILABLE',
  DEPLOYING = 'DEPLOYING',
  MONITORING = 'MONITORING',
  RUNNING = 'RUNNING'
}

export enum DeployStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  TERMINATED = 'TERMINATED'
}

export enum MonitorStatus {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTED = 'CONNECTED'
}
