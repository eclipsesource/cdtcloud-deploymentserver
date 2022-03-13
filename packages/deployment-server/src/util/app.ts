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
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        'script-src': ["'self'", "'unsafe-inline'"],
        'img-src': ["'self'", 'data:', 'storage.googleapis.com', 'raw.githubusercontent.com']
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
