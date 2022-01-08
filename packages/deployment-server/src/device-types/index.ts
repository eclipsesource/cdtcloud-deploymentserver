import type { DeviceType } from '@prisma/client'

export interface DeviceTypeWithCount extends DeviceType {
  numberOfDevices: number
}

export type { DeviceType }
