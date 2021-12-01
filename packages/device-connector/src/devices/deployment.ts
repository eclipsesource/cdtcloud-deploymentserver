import { Device } from './service'

export interface deploymentData {
  device: Device
  artifactUri: string
}

export interface deploymentRequest {
  type: 'deploy'
  data: deploymentData
}
