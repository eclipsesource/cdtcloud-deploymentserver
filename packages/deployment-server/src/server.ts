import { env } from 'process'
import { createApp } from './util/app'

import type { Server } from 'node:http'
import logger from './util/logger'
import connect from './util/prisma'
import { PrismaClient } from '@prisma/client'
import { Application } from 'express'
import { QueueManager as ConnectorQueue } from './connectors/queue'
import { Signals } from 'close-with-grace'
import { promisify } from 'util'
import http from 'node:http'

export async function createServer (): Promise<[Server, Application, PrismaClient]> {
  try {
    const db = await connect()
    const app = createApp(db)
    const server = http.createServer(app)
    ConnectorQueue.setServer(server)
    //registerDeviceStreamRoutes(server)

    const { HOST, PORT } = env

    let port: number | undefined = PORT != null ? parseInt(PORT, 10) : undefined
    if (port == null && env.NODE_ENV !== 'test') {
      port = 3001
    }

    server.listen(port, HOST)
    await ConnectorQueue.start()
    return [server, app, db]
  } catch (e) {
    logger.error(e)
    throw e
  }
}

export async function closeServer (
  this: {server: Server, db: PrismaClient},
  { err, signal }: { err?: Error, signal?: Signals | string } = { }
): Promise<void> {
  if (err != null) {
    logger.error(err)
  }

  await this.db.$disconnect()

  await promisify(this.server.close).bind(this.server)()

  logger.info(`${signal ?? 'Manual Exit'}: Closed server`)
}
