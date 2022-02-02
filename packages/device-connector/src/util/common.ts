export const DeviceStatus = {
  UNAVAILABLE: 'UNAVAILABLE',
  AVAILABLE: 'AVAILABLE',
  DEPLOYING: 'DEPLOYING',
  RUNNING: 'RUNNING',
  MONITORING: 'MONITORING'
} as const

export const DeployStatus = {
  PENDING: 'PENDING',
  RUNNING: 'RUNNING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  TERMINATED: 'TERMINATED'
} as const
