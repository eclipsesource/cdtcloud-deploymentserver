import { Connector } from '@prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import { Router } from 'express'
import { idParams, IdParams } from '../util/idParams'
import { validate } from '../util/validate'

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
        return res.json(await req.db.connector.create({ data: {} }))
      } catch (e) {
        next(e)
      }
    })

  router.delete('/connectors/:id',
    validate<never, IdParams>({ params: idParams }),
    async (req, res, next) => {
      try {
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
