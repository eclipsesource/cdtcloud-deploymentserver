import { DeviceType, DeviceTypeResource, DeviceTypeStatus, DeviceTypeWithCount, TypeStatus } from '.'
import { getAvailableDevice, getLeastLoadedDevice, isDeployable } from '../devices/service'
import { db } from '../util/prisma'

export function withCount <T extends DeviceType & {_count: {devices: number}}> (deviceType: T): Omit<T, '_count'> & {numberOfDevices: number} {
  const numberOfDevices = deviceType._count.devices
  delete (deviceType as Partial<{_count: unknown}>)._count

  return {
    ...deviceType,
    numberOfDevices
  }
}

export async function determineStatus (deviceType: DeviceTypeWithCount): Promise<TypeStatus> {
  if (deviceType.numberOfDevices === 0) {
    return { status: DeviceTypeStatus.UNAVAILABLE }
  }

  const availableDevice = await getAvailableDevice(deviceType.id)
  if (availableDevice != null) {
    return { status: DeviceTypeStatus.AVAILABLE }
  }

  const [leastLoadedDevice, queueLength] = await getLeastLoadedDevice(deviceType.id)
  if (leastLoadedDevice != null && await isDeployable(leastLoadedDevice)) {
    return { status: DeviceTypeStatus.QUEUEABLE, queueLength }
  }

  return { status: DeviceTypeStatus.BUSY }
}

export async function toJSON (deviceType: DeviceType & {_count: {devices: number}}): Promise<DeviceTypeResource> {
  const deviceTypeWithCount = withCount(deviceType)
  const status = await determineStatus(deviceTypeWithCount)

  const issuesByType = await db.$queryRaw`
    WITH buckets AS (
      SELECT generate_series(
        date_trunc('hour', now()) - '24 hours'::interval,
        date_trunc('hour', now()),
        '1 hour'::interval
      ) as bucket
    )

    SELECT
      buckets.bucket,
      count("Issue".id) AS "issueCount"
      FROM buckets
    LEFT JOIN "Issue"
      ON date_trunc('hour', "Issue"."createdAt") = buckets.bucket AND "Issue"."deviceTypeId" = ${deviceType.id}
      GROUP BY 1
      ORDER BY 1
  ` as [{ bucket: string, issueCount: number }]

  const deploymentsByType = await db.$queryRaw`
    WITH buckets AS (
      SELECT generate_series(
        date_trunc('hour', now()) - '24 hours'::interval,
        date_trunc('hour', now()),
        '1 hour'::interval
      ) as bucket
    ), req AS (
      SELECT "DeployRequest"."id", "DeployRequest"."createdAt" FROM "DeployRequest"
        LEFT JOIN "Device" ON "Device"."id" = "DeployRequest"."deviceId"
        WHERE "Device"."deviceTypeId" = ${deviceType.id}
    )

    SELECT
      buckets.bucket,
      count(req.id) AS "deployCount"
      FROM buckets
    LEFT JOIN req
      ON date_trunc('hour', req."createdAt") = buckets.bucket
      GROUP BY 1
      ORDER BY 1
  ` as [{ bucket: string, deployCount: number }]

  const deploymentsByTypeHash = deploymentsByType.reduce<Record<string, number>>((acc, { bucket, deployCount }) => ({ ...acc, [bucket]: deployCount }), {})

  const history: Record<string, {deploymentCount: number, issueCount: number}> = {}

  for (const { bucket, issueCount } of issuesByType) {
    history[bucket] = {
      deploymentCount: deploymentsByTypeHash[bucket],
      issueCount
    }
  }

  return {
    ...deviceTypeWithCount,
    ...status,
    history
  }
}
