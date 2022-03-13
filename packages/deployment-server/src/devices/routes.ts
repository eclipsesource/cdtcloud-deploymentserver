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
import prisma, { Device } from '@prisma/client'

import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import { Static, Type } from '@sinclair/typebox'
import { Router } from 'express'
import { IdParams, idParams } from '../util/idParams'
import { validate } from '../util/validate'
import { broadcastDeviceChange } from '../dashboard/service'
import logger from '../util/logger'
import { closeDeploymentStream } from '../deployments/service'

const { DeviceStatus, DeployStatus } = prisma

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
          await broadcastDeviceChange(device, 'add')
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
        let device = await req.db.device.findUnique({
          where: { id: req.params.id }
        })

        if (device == null) return res.sendStatus(404)

        if (req.body.status === DeviceStatus.UNAVAILABLE) {
          // Teardown all deployments and update their status before updating the device
          // Then, we can broadcast the change to the notification channel
          try {
            const deployments = await req.db.deployRequest.findMany({
              where: {
                deviceId: req.params.id,
                status: {
                  in: [
                    DeployStatus.PENDING,
                    DeployStatus.RUNNING
                  ]
                }
              }
            })

            // Close all deployment streams
            await Promise.all(deployments.map(closeDeploymentStream))

            await req.db.deployRequest.updateMany({
              where: {
                device: { id: req.params.id },
                status: {
                  in: [
                    DeployStatus.PENDING,
                    DeployStatus.RUNNING
                  ]
                }
              },
              data: { status: DeployStatus.TERMINATED }
            })

            await broadcastDeviceChange(device, 'remove')
          } catch (e) {
            logger.error(e)
          }
        }

        device = await req.db.device.update({
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

        try {
          await broadcastDeviceChange(device, 'remove')
        } catch (e) {
          logger.error(e)
        }

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
