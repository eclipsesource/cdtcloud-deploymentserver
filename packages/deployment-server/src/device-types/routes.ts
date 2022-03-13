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
import dbClient, { DeviceType } from '@prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import { Static, Type } from '@sinclair/typebox'
import { Router } from 'express'
import { DeviceTypeResource } from '.'
import { IdParams, idParams } from '../util/idParams'
import { validate } from '../util/validate'
import { toJSON } from './service'

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
    validate<DeviceTypeResource[], {}, never, Static<typeof getQuery>>({
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
                    DeviceStatus.RUNNING,
                    DeviceStatus.MONITORING
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

        const deviceTypes = await req.db.deviceType.findMany(
          req.query.deployable != null
            ? selectDeployable
            : { include: { _count: { select: { devices: true } } } }
        ) as Array<(DeviceType & {
          _count: {
            devices: number
          }
        })>

        const deviceTypeResources = await Promise.all(deviceTypes.map(toJSON))

        res.json(deviceTypeResources)
      } catch (e) {
        next(e)
      }
    }
  )

  router.get(
    '/device-types/:id',
    validate<DeviceTypeResource, IdParams>({ params: idParams }),
    async (req, res, next) => {
      try {
        const deviceType = await req.db.deviceType.findUnique({
          where: { id: req.params.id },
          include: {
            issues: true,
            _count: {
              select: { devices: true }
            }
          }
        })

        if (deviceType == null) return res.sendStatus(404)

        return res.json(await toJSON(deviceType))
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
    validate<DeviceTypeResource, {}, Static<typeof postBody>>({ body: postBody }),
    async (req, res, next) => {
      try {
        const deviceType = await req.db.deviceType.create({
          data: req.body,
          include: {
            _count: {
              select: { devices: true }
            }
          }
        })

        return res.json(await toJSON(deviceType))
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
    validate<DeviceTypeResource, IdParams, Static<typeof putBody>>({
      params: idParams,
      body: putBody
    }),
    async (req, res, next) => {
      try {
        const deviceType = await req.db.deviceType.update({
          where: { id: req.params.id },
          data: req.body,
          include: {
            _count: {
              select: { devices: true }
            }
          }
        })

        return res.json(await toJSON(deviceType))
      } catch (e) {
        next(e)
      }
    }
  )

  router.delete(
    '/device-types/:id',
    validate<DeviceTypeResource, IdParams>({ params: idParams }),
    async (req, res, next) => {
      try {
        const deviceType = await req.db.deviceType.delete({
          where: { id: req.params.id },
          include: {
            _count: {
              select: { devices: true }
            }
          }
        })

        return res.json(await toJSON(deviceType))
      } catch (e) {
        if (e instanceof PrismaClientKnownRequestError && e.code === 'P2025') {
          return res.sendStatus(404)
        }

        next(e)
      }
    }
  )
}
