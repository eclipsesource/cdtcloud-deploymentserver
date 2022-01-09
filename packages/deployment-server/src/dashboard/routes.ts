import { DeployStatus, DeviceStatus } from '@prisma/client'
import { Router } from 'express'
import { Dashboard } from '.'
import { validate } from '../util/validate'

export default function dashboardRoutes (router: Router): void {
  router.get(
    '/dashboard',
    validate<Dashboard>({}),
    async (req, res, next) => {
      try {
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

        const deployRequestCount = await req.db.deployRequest.count()
        const deviceCount = await req.db.device.count()

        const deploymentOverview = await req.db.deployRequest.groupBy({
          by: ['status'],
          _count: true
        // eslint-disable-next-line @typescript-eslint/prefer-reduce-type-parameter, @typescript-eslint/consistent-type-assertions
        }).then(x => x.reduce((acc, { status, _count }) => ({ ...acc, [status]: _count }), {} as Record<DeployStatus, number>))

        const deviceOverview = await req.db.device.groupBy({
          by: ['status'],
          _count: true
        // eslint-disable-next-line @typescript-eslint/prefer-reduce-type-parameter, @typescript-eslint/consistent-type-assertions
        }).then(x => x.reduce((acc, { status, _count }) => ({ ...acc, [status]: _count }), {} as Record<DeviceStatus, number>))

        return res.json({
          recentDeployments,
          deploymentOverview,
          deployRequestCount,
          deviceOverview,
          deviceCount
        })
      } catch (e) {
        next(e)
      }
    }
  )
}
