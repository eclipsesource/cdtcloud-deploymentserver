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
import { exit } from 'node:process'
import { closeServer, createServer } from './server'
import closeWithGrace from 'close-with-grace'
import logger from './util/logger'
import type { PrismaClient } from '@prisma/client'

export let db: PrismaClient

try {
  const [server, , prismaClient] = await createServer()
  db = prismaClient

  logger.info('Listening')

  const handler = closeWithGrace({ delay: 1000 }, closeServer.bind({ server, db }))

  // Nodemon sends SIGUSR2 when it restarts
  process.once('SIGUSR2', () => {
    handler.close()
  })
} catch (err) {
  console.error(err)
  exit(1)
}

export * from './connectors'
export * from './deployment-artifacts'
export * from './device-types'
export * from './devices'
export * from './deployments'
export * from './dashboard'
