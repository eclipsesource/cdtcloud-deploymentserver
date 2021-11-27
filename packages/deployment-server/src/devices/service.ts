import { DeployStatus, Device, DeviceStatus } from '@prisma/client'
import { db } from '../util/prisma'

export async function getAvailableDevice (deviceType: string): Promise<Device | null> {
  return await db.device.findFirst({
    where: {
      deviceTypeId: deviceType,
      status: DeviceStatus.AVAILABLE
    }
  })
}

export async function getLeastLoadedDevice (deviceType: string): Promise<Device | null> {
  return await db.device.findFirst({
    where: {
      deviceTypeId: deviceType,
      deployRequests: {
        some: {
          status: {
            notIn: [
              DeployStatus.TERMINATED,
              DeployStatus.FAILED,
              DeployStatus.SUCCESS
            ]
          }
        }
      }
    },
    orderBy: {
      deployRequests: {
        _count: 'desc'
      }
    }
  })
}
