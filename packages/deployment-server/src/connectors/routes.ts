import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import { registerConnector, unregisterConnector } from './queue'
import { idParams, IdParams } from '../util/idParams'
import { validate } from '../util/validate'

import type { Router } from 'express'
import type { Connector } from '.'

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
        await req.db.connector.delete({ where: { id: req.params.id } })

        return res.sendStatus(204)
      } catch (e) {
        if (e instanceof PrismaClientKnownRequestError && e.code === 'P2025') {
          return res.sendStatus(404)
        }
        next(e)
      }
    })
}
