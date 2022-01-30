/* eslint-disable @typescript-eslint/prefer-reduce-type-parameter */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
import client, { DeviceStatus as DeviceStatusType, DeployStatus as DeployStatusType } from '@prisma/client'
import { Router } from 'express'
import { Dashboard } from '.'
import { validate } from '../util/validate'

const { DeployStatus, DeviceStatus } = client

export default function dashboardRoutes (router: Router): void {
  router.get(
    '/dashboard',
    validate<Dashboard>({}),
    async (req, res, next) => {
      try {
        const [{ mostUsedDeviceType }] = await req.db.$queryRaw`
          SELECT
            "DeviceType"."name" as "mostUsedDeviceType"
          FROM
            "DeployRequest"
          LEFT JOIN "Device" ON "Device".id = "DeployRequest"."deviceId"
          LEFT JOIN "DeviceType" ON "DeviceType".id = "Device"."deviceTypeId"
          GROUP BY
            "DeviceType"."name"
          ORDER BY
            COUNT("DeviceType"."name") DESC
          LIMIT 1
        ` as [{mostUsedDeviceType: string}]

        const pendingDeploymentsCount = await req.db.deployRequest.count({
          where: {
            status: DeployStatus.PENDING
          }
        })
        const targetDevicesCount = await req.db.device.count({
          where: {
            status: {
              not: DeviceStatus.UNAVAILABLE
            }
          }
        })

        const averageQueueTime = Math.round(pendingDeploymentsCount * 30 / targetDevicesCount)

        const recentDeployments = await req.db.deployRequest.findMany({
          take: 5,
          include: {
            device: {
              include: {
                type: true
              }
            }
          },
          orderBy: {
            updatedAt: 'desc'
          }
        })

        const deploymentsPerBucket = await req.db.$queryRaw<Array<{bucket: string, count: string}>>`
          WITH buckets AS (
            SELECT generate_series(
              date_trunc('hour', now()) - '20 hours'::interval,
              date_trunc('hour', now()),
              '1 hour'::interval
            ) as bucket
          )

          SELECT
            buckets.bucket,
            count("DeployRequest".id)
          FROM buckets
          LEFT JOIN "DeployRequest" on date_trunc('hour', "DeployRequest"."createdAt") = buckets.bucket
          GROUP BY 1
          ORDER BY 1
        `.then((x) => x.reduce((acc, { bucket, count }) => ({ ...acc, [bucket]: parseInt(count) }), {} as Record<string, number>))

        const deployRequestCount = await req.db.deployRequest.count()
        const deviceCount = await req.db.device.count()

        const deploymentOverview = await req.db.deployRequest.groupBy({
          by: ['status'],
          _count: true
        }).then(x => x.reduce((acc, { status, _count }) => ({ ...acc, [status]: _count }), {} as Record<DeployStatusType, number>))

        const deviceOverview = await req.db.device.groupBy({
          by: ['status'],
          _count: true
        }).then(x => x.reduce((acc, { status, _count }) => ({ ...acc, [status]: _count }), {} as Record<DeviceStatusType, number>))

        return res.json({
          recentDeployments,
          deploymentOverview,
          deployRequestCount,
          deviceOverview,
          deviceCount,
          deploymentsPerBucket,
          mostUsedDeviceType,
          averageQueueTime
        })
      } catch (e) {
        next(e)
      }
    }
  )
}
