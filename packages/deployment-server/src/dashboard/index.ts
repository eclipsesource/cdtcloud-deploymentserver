import { Device } from '@prisma/client'
import { DeployRequest, DeviceType } from '..'

export type RecentDeployment = (DeployRequest & {
  device: Device & {
    type: DeviceType
  }
})

export interface Dashboard {
  recentDeployments: RecentDeployment[]
  deployRequestCount: number
  deviceCount: number
  deploymentOverview: Record<DeployRequest['status'], number>
  deviceOverview: Record<Device['status'], number>
  deploymentsPerBucket: Record<string, number>
  mostUsedDeviceType: string
}
