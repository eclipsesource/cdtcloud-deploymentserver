import { Device } from "./service";

export type deploymentData = {
    device: Device,
    artifactUri: string
}

export type deploymentRequest = {
    type: 'deploy',
    data: deploymentData
}
