import express, { Application, Router, static as serveStatic } from 'express'
import statusMessage from 'statuses'

import connectorRoutes from '../connectors/routes'
import deviceRoutes from '../devices/routes'
import deviceTypeRoutes from '../device-types/routes'
import deploymentRequestsRoutes from '../deployments/routes'
import deploymentArtifactsRoutes from '../deployment-artifacts/routes'
import dashboardRoutes from '../dashboard/routes'

import { errorHandler } from './errorHandler'
import { pinoHttp } from './logger'
import type { PrismaClient } from '@prisma/client'
import cors from 'cors'
import helmet from 'helmet'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

export function createApp (db: PrismaClient): Application {
  const app = express()

  app.response.sendStatus = function (code: number) {
    return this.contentType('application/json')
      .status(code)
      .json({ message: statusMessage(code) })
  }

  app.disable('x-powered-by')
  app.disable('etag')

  app.use(cors())
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(pinoHttp)
  app.use(function setClient (req, _res, next) {
    req.db = db
    next()
  })

  app.use(helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        'script-src': ["'self'", "'unsafe-inline'"],
        'img-src': ["'self'", 'data:', 'storage.googleapis.com', 'raw.githubusercontent.com'],
        'connect-src': ["'self'", 'data:', 'storage.googleapis.com']
      }
    }
  }))

  const apiRouter = Router()

  dashboardRoutes(apiRouter)
  deviceRoutes(apiRouter)
  deviceTypeRoutes(apiRouter)
  connectorRoutes(apiRouter)
  deploymentRequestsRoutes(apiRouter)
  deploymentArtifactsRoutes(apiRouter)

  app.use(serveStatic('public'))
  app.use('/api', apiRouter)

  app.get('/*', function (_, res) {
    res.sendFile(join(dirname(fileURLToPath(import.meta.url)), '../../public', 'index.html'))
  })

  app.use(function notFoundResponse (_req, res) {
    res.sendStatus(404)
  })

  app.use(errorHandler)

  return app
}
