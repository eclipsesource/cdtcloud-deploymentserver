import express, { Application } from 'express'
import statusMessage from 'statuses'

import connectorRoutes from '../connectors/routes'
import deviceRoutes from '../devices/routes'
import deviceTypeRoutes from '../device-types/routes'
import deploymentRequestsRoutes from '../deployments/routes'
import deploymentArtifactsRoutes from '../deployment-artifacts/routes'

import { errorHandler } from './errorHandler'
import { pinoHttp } from './logger'
import type { PrismaClient } from '@prisma/client'

export function createApp (db: PrismaClient): Application {
  const app = express()

  app.response.sendStatus = function (code: number) {
    return this.contentType('application/json')
      .status(code)
      .json({ message: statusMessage(code) })
  }

  app.disable('x-powered-by')
  app.disable('etag')

  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(pinoHttp)
  app.use(function setClient (req, _res, next) {
    req.db = db
    next()
  })

  deviceRoutes(app)
  deviceTypeRoutes(app)
  connectorRoutes(app)
  deploymentRequestsRoutes(app)
  deploymentArtifactsRoutes(app)

  app.use(errorHandler)

  return app
}
