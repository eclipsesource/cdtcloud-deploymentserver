import prisma, { Device } from '@prisma/client'

import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import { Static, Type } from '@sinclair/typebox'
import { Router } from 'express'
import { IdParams, idParams } from '../util/idParams'
import { validate } from '../util/validate'
import { broadcastNewDevice } from '../dashboard/service'
import logger from '../util/logger'

const { DeviceStatus } = prisma

export default function deviceRoutes (router: Router): void {
  router.get('/devices', validate<Device[]>({}), async (req, res, next) => {
    try {
      const devices = await req.db.device.findMany()
      res.json(devices)
    } catch (e) {
      next(e)
    }
  })

  router.get(
    '/devices/:id',
    validate<Device, IdParams>({ params: idParams }),
    async (req, res, next) => {
      try {
        const device = await req.db.device.findUnique({
          where: { id: req.params.id }
        })

        if (device == null) return res.sendStatus(404)

        res.json(device)
      } catch (e) {
        next(e)
      }
    }
  )

  const postBody = Type.Object(
    {
      status: Type.Enum(DeviceStatus, { default: DeviceStatus.AVAILABLE }),
      typeId: Type.String({ format: 'uuid' }),
      connectorId: Type.String({ format: 'uuid' })
    },
    { additionalProperties: false }
  )

  router.post(
    '/devices',
    validate<Device, {}, Static<typeof postBody>>({ body: postBody }),
    async (req, res, next) => {
      try {
        const { connectorId, typeId, status } = req.body

        const device = await req.db.device.create({
          data: {
            status,
            connector: { connect: { id: connectorId } },
            type: { connect: { id: typeId } }
          }
        })

        try {
          await broadcastNewDevice(device)
        } catch (e) {
          logger.error(e)
        }

        return res.json(device)
      } catch (e) {
        next(e)
      }
    }
  )

  const putBody = Type.Object(
    {
      status: Type.Enum(DeviceStatus)
    },
    { additionalProperties: false }
  )

  router.put(
    '/devices/:id',
    validate<Device, IdParams, Static<typeof putBody>>({
      params: idParams,
      body: putBody
    }),
    async (req, res, next) => {
      try {
        const device = await req.db.device.update({
          where: { id: req.params.id },
          data: req.body
        })

        return res.json(device)
      } catch (e) {
        if (e instanceof PrismaClientKnownRequestError && e.code === 'P2025') {
          return res.sendStatus(404)
        }
        next(e)
      }
    }
  )

  router.delete(
    '/devices/:id',
    validate<Device | { message: string, reason?: string }, IdParams>({
      params: idParams
    }),
    async (req, res, next) => {
      try {
        const device = await req.db.device.delete({
          where: { id: req.params.id }
        })

        return res.json(device)
      } catch (e) {
        if (e instanceof PrismaClientKnownRequestError && e.code === 'P2025') {
          return res.sendStatus(404)
        }
        next(e)
      }
    }
  )
}
