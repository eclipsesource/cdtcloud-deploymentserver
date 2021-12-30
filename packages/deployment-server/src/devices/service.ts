import prismaClient from '@prisma/client'
import type { Device, Connector } from '@prisma/client'
import { db } from '../util/prisma'

const { DeployStatus, DeviceStatus, Prisma } = prismaClient

type DeviceWithConnector = Device & { connector: Connector }

export async function getAvailableDevice (deviceType: string): Promise<DeviceWithConnector | null> {
  return await db.device.findFirst({
    where: {
      deviceTypeId: deviceType,
      status: {
        not: DeviceStatus.UNAVAILABLE
      },
      deployRequests: {
        every: {
          status: {
            notIn: [DeployStatus.PENDING, DeployStatus.RUNNING]
          }
        }
      }
    },
    include: {
      connector: true
    }
  })
}

export async function getLeastLoadedDevice (deviceType: string): Promise<DeviceWithConnector | null> {
  const [{ id }] = await db.$queryRaw`
    SELECT "Device"."id"
    FROM "Device" LEFT OUTER JOIN (
      SELECT "Device".id, COUNT("DeployRequest"."status") as sum
      FROM "DeployRequest" LEFT JOIN "Device" ON "Device"."id" = "DeployRequest"."deviceId"
        WHERE "Device"."deviceTypeId" = ${deviceType}
        AND "DeployRequest".status IN (
          ${Prisma.join([DeployStatus.RUNNING, DeployStatus.PENDING])}
        )
      GROUP BY "Device".id
    ) AS sub
    ON "Device".id = sub.id
    WHERE "Device"."deviceTypeId" = ${deviceType}
    AND "Device"."status" != ${DeviceStatus.UNAVAILABLE}
    ORDER BY COALESCE(sub.sum, 0) ASC LIMIT 1;
  ` as [{id: string}]

  return await db.device.findUnique({
    where: {
      id
    },
    include: {
      connector: true
    }
  })
}
