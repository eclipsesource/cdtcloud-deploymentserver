import { Connector, DeployStatus, Device, DeviceStatus } from '@prisma/client'
import { db } from '../util/prisma'

type DeviceWithConnector = Device & { connector: Connector }

export async function getAvailableDevice (deviceType: string): Promise<DeviceWithConnector | null> {
  return await db.device.findFirst({
    where: {
      deviceTypeId: deviceType,
      status: DeviceStatus.AVAILABLE
    },
    include: {
      connector: true
    }
  })
}

export async function getLeastLoadedDevice (deviceType: string): Promise<DeviceWithConnector | null> {
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
    include: {
      connector: true
    },
    orderBy: {
      deployRequests: {
        _count: 'desc'
      }
    }
  })
}
