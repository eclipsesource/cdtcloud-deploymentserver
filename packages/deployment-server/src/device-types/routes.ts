import { DeviceType } from '.prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import { Router } from 'express'
import { IdParams, idParams } from '../util/idParams'
import { validate } from '../util/validate'

export default function deviceTypeRoutes (router: Router): void {
  router.get('/device-types', validate<DeviceType[]>({}), async (req, res, next) => {
    try {
      const deviceTypes = await req.db.deviceType.findMany()

      return res.json(deviceTypes)
    } catch (e) {
      next(e)
    }
  })

  router.get('/device-types/:id', validate<DeviceType, IdParams>({ params: idParams }), async (req, res, next) => {
    try {
      const deviceType = await req.db.deviceType.findUnique({ where: { id: req.params.id } })

      if (deviceType == null) return res.sendStatus(404)

      return res.json(deviceType)
    } catch (e) {
      next(e)
    }
  })

  router.post('/device-types', validate<DeviceType>({ body: {} }), async (req, res, next) => {
    try {
      const deviceType = await req.db.deviceType.create({ data: req.body })

      return res.json(deviceType)
    } catch (e) {
      next(e)
    }
  })

  router.put('/device-types/:id', validate<DeviceType, IdParams>({ params: idParams, body: {} }), async (req, res, next) => {
    try {
      const deviceType = await req.db.deviceType.update({
        where: { id: req.params.id },
        data: req.body
      })

      return res.json(deviceType)
    } catch (e) {
      next(e)
    }
  })

  router.delete('/device-types/:id', validate<DeviceType, IdParams>({ params: idParams }), async (req, res, next) => {
    try {
      const deviceType = await req.db.deviceType.delete({
        where: { id: req.params.id }
      })

      return res.json(deviceType)
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2025') {
        return res.sendStatus(404)
      }

      next(e)
    }
  })
}
