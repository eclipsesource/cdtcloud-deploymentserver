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

import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import { registerConnector, unregisterConnector } from './queue'
import { idParams, IdParams } from '../util/idParams'
import { validate } from '../util/validate'

import type { Router } from 'express'
import type { Connector } from '.'
import { broadcastConnectorChange } from '../dashboard/service'
import logger from '../util/logger'

export default function connectorRoutes (router: Router): void {
  router.get('/connectors',
    validate<Connector[]>({}),
    async (req, res, next) => {
      try {
        const connectors = await req.db.connector.findMany()

        return res.json(connectors)
      } catch (e) {
        next(e)
      }
    })

  router.post('/connectors',
    validate<Connector>({}),
    async (req, res, next) => {
      try {
        const connector = await req.db.connector.create({
          data: {

          }
        })

        registerConnector(connector)

        try {
          await broadcastConnectorChange(connector, 'add')
        } catch (e) {
          logger.error(e)
        }

        return res.json({
          ...connector
        })
      } catch (e) {
        next(e)
      }
    })

  router.delete('/connectors/:id',
    validate<never, IdParams>({ params: idParams }),
    async (req, res, next) => {
      try {
        unregisterConnector({ id: req.params.id })
        const connector = await req.db.connector.delete({ where: { id: req.params.id } })

        try {
          await broadcastConnectorChange(connector, 'remove')
        } catch (e) {
          logger.error(e)
        }

        return res.sendStatus(204)
      } catch (e) {
        if (e instanceof PrismaClientKnownRequestError && e.code === 'P2025') {
          return res.sendStatus(404)
        }
        next(e)
      }
    })
}
