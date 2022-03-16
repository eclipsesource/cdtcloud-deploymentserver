/********************************************************************************
    Copyright (c) 2022 EclipseSource and others.

    This program and the accompanying materials are made available under the
    terms of the Eclipse Public License v. 2.0 which is available at
    http://www.eclipse.org/legal/epl-2.0.

    This Source Code may also be made available under the following Secondary
    Licenses when the conditions for such availability set forth in the Eclipse
    Public License v. 2.0 are satisfied: GNU General Public License, version 2
    with the GNU Classpath Exception which is available at
    https://www.gnu.org/software/classpath/license.html.

    SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
********************************************************************************/

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
        const [{ mostUsedDeviceType } = { mostUsedDeviceType: 'Unknown' }] = await req.db.$queryRaw`
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
        ` as [{mostUsedDeviceType: string} | undefined]

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
        `.then((x) => x.reduce<Record<string, number>>((acc, { bucket, count }) => ({ ...acc, [bucket]: parseInt(count) }), {}))

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
