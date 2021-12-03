import { DeviceType } from '.prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import { Static, Type } from '@sinclair/typebox'
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

  const postBody = Type.Object({
    name: Type.String({ minLength: 1, maxLength: 255 }),
    fqbn: Type.String({ minLength: 1, maxLength: 255 })
  }, { additionalProperties: false })

  router.post(
    '/device-types',
    validate<DeviceType, {}, Static<typeof postBody>>({ body: postBody }),
    async (req, res, next) => {
      try {
        const deviceType = await req.db.deviceType.create({
          data: req.body
        })

        return res.json(deviceType)
      } catch (e) {
        next(e)
      }
    })

  const putBody = Type.Object({
    fqbn: Type.Optional(Type.String({ minLength: 1, maxLength: 255 })),
    name: Type.Optional(Type.String({ minLength: 1, maxLength: 255 }))
  }, { additionalProperties: false })

  router.put(
    '/device-types/:id',
    validate<DeviceType, IdParams, Static<typeof putBody>>({ params: idParams, body: putBody }),
    async (req, res, next) => {
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
