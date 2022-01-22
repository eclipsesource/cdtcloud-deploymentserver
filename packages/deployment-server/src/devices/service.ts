import prismaClient from '@prisma/client'
import type { Device, Connector } from '@prisma/client'
import { db } from '../util/prisma'

export const MAX_QUEUE_SIZE = 3
const { DeployStatus, DeviceStatus, Prisma } = prismaClient

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

export async function getLeastLoadedDevice (deviceType: string): Promise<[device: DeviceWithConnector | null, queueLength: number]> {
  const minQueueLength: [] | [{id: string, queueLength: number}] = await db.$queryRaw`
    SELECT "Device"."id", COALESCE(sub.sum, 0) AS "queueLength"
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
  `

  if (minQueueLength.length === 0) {
    return [null, 0]
  }

  const [{ id, queueLength }] = minQueueLength

  return [await db.device.findUnique({
    where: {
      id
    },
    include: {
      connector: true
    }
  }), queueLength]
}

export async function updateDeviceStatus ({ id }: Pick<Device, 'id'>): Promise<void> {
  const deviceStatus = await db.device.findUnique({
    where: {
      id
    },
    select: {
      status: true
    }
  })

  if (deviceStatus == null) {
    return
  }

  const accumulator: Record<keyof typeof DeployStatus, number> =
    Object.fromEntries(Object.entries(DeployStatus).map(status => [status, 0]))

  const requestCount = await db.deployRequest.groupBy({
    by: ['status'],
    _count: true,
    where: {
      deviceId: id
    }
  }).then(res => res.reduce((acc, { status, _count }) => ({ ...acc, [status]: _count }), accumulator))

  let status: (keyof typeof DeviceStatus) = deviceStatus.status

  if (requestCount[DeployStatus.RUNNING] > 0) {
    status = DeviceStatus.RUNNING
  } else if (requestCount[DeployStatus.PENDING] > 0) {
    status = DeviceStatus.DEPLOYING
  } else {
    status = DeviceStatus.AVAILABLE
  }

  await db.device.update({
    where: {
      id
    },
    data: {
      status
    }
  })
}

/**
 * Determine if we should add new Deploy Requests to the queue.
 */
export async function isDeployable (device: Pick<Device, 'id' | 'status'>): Promise<boolean> {
  if (device.status === DeviceStatus.UNAVAILABLE) return false

  const pendingRequests = await db.deployRequest.count({
    where: {
      deviceId: device.id,
      status: DeployStatus.PENDING
    }
  })

  return (pendingRequests < MAX_QUEUE_SIZE)
}
