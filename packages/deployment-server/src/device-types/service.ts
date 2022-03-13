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
import { DeviceType, DeviceTypeResource, DeviceTypeStatus, DeviceTypeWithCount, TypeStatus } from '.'
import { getAvailableDevice, getLeastLoadedDevice, isDeployable } from '../devices/service'
import { db } from '../util/prisma'
import prisma from '@prisma/client'

const { DeployStatus } = prisma

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

  const deploymentsOverTime = await db.$queryRaw`
      WITH buckets AS (
        SELECT generate_series(
          date_trunc('hour', now()) - '24 hours'::interval,
          date_trunc('hour', now()),
          '1 hour'::interval
        ) as bucket
      ), req AS (
        SELECT "DeployRequest"."id", "DeployRequest"."createdAt", "DeployRequest"."status" FROM "DeployRequest"
          LEFT JOIN "Device" ON "Device"."id" = "DeployRequest"."deviceId"
          WHERE "Device"."deviceTypeId" = ${deviceType.id}
          AND "DeployRequest"."status" IN (${DeployStatus.SUCCESS}, ${DeployStatus.FAILED}, ${DeployStatus.TERMINATED})
      )

      SELECT
        buckets.bucket,
        req.status,
        count(req.id) AS "deployCount"
        FROM buckets
      LEFT JOIN req
        ON date_trunc('hour', req."createdAt") = buckets.bucket
        GROUP BY 1,2
        ORDER BY 1
    ` as [{ bucket: string, deployCount: number, status: 'SUCCESS' | 'FAILED' | 'TERMINATED' | null }]

  const deploymentsByStatus: Record<string, {SUCCESS: number, FAILED: number, TERMINATED: number}> = {}

  for (const { bucket, status, deployCount } of deploymentsOverTime) {
    if (deploymentsByStatus[bucket] == null) {
      deploymentsByStatus[bucket] = { SUCCESS: 0, FAILED: 0, TERMINATED: 0 }
    }

    if (status == null) continue

    deploymentsByStatus[bucket][status] = deployCount
  }

  const history: DeviceTypeResource['history'] = {}

  for (const { bucket, issueCount } of issuesByType) {
    history[bucket] = {
      deploymentCount: deploymentsByStatus[bucket],
      issueCount
    }
  }

  return {
    ...deviceTypeWithCount,
    ...status,
    history
  }
}
