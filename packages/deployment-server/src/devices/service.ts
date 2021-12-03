import prismaClient from '@prisma/client'
import type { Device, Connector } from '@prisma/client'
import { db } from '../util/prisma'

const { DeployStatus, DeviceStatus } = prismaClient

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
