import dbClient, { DeviceType } from '@prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import { Static, Type } from '@sinclair/typebox'
import { Router } from 'express'
import { IdParams, idParams } from '../util/idParams'
import { validate } from '../util/validate'

const { DeviceStatus } = dbClient

export default function deviceTypeRoutes (router: Router): void {
  const getQuery = Type.Object(
    {
      deployable: Type.Optional(Type.Boolean())
    },
    { additionalProperties: false }
  )

  router.get(
    '/device-types',
    validate<DeviceType[], {}, never, Static<typeof getQuery>>({
      query: getQuery
    }),
    async (req, res, next) => {
      try {
        const selectDeployable: Parameters<typeof req['db']['deviceType']['findMany']>[0] = {
          where: {
            devices: {
              some: {
                status: {
                  in: [
                    DeviceStatus.AVAILABLE,
                    DeviceStatus.DEPLOYING,
                    DeviceStatus.RUNNING
                  ]
                }
              }
            }
          },
          include: {
            _count: {
              select: { devices: true }
            }
          }
        }

        const deviceTypes: Array<DeviceType & { _count?: { devices: number } }> =
          await req.db.deviceType.findMany(req.query.deployable != null ? selectDeployable : {})

        for (const deviceType of deviceTypes) {
          delete deviceType._count
        }

        res.json(deviceTypes)
      } catch (e) {
        next(e)
      }
    }
  )

  router.get(
    '/device-types/:id',
    validate<DeviceType, IdParams>({ params: idParams }),
    async (req, res, next) => {
      try {
        const deviceType = await req.db.deviceType.findUnique({
          where: { id: req.params.id }
        })

        if (deviceType == null) return res.sendStatus(404)

        return res.json(deviceType)
      } catch (e) {
        next(e)
      }
    }
  )

  const postBody = Type.Object(
    {
      name: Type.String({ minLength: 1, maxLength: 255 }),
      fqbn: Type.String({ minLength: 1, maxLength: 255 })
    },
    { additionalProperties: false }
  )

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
    }
  )

  const putBody = Type.Object(
    {
      fqbn: Type.Optional(Type.String({ minLength: 1, maxLength: 255 })),
      name: Type.Optional(Type.String({ minLength: 1, maxLength: 255 }))
    },
    { additionalProperties: false }
  )

  router.put(
    '/device-types/:id',
    validate<DeviceType, IdParams, Static<typeof putBody>>({
      params: idParams,
      body: putBody
    }),
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
    }
  )

  router.delete(
    '/device-types/:id',
    validate<DeviceType, IdParams>({ params: idParams }),
    async (req, res, next) => {
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
    }
  )
}
