import { env } from 'process'
import { createApp } from './util/app'

import type { Server } from 'node:http'
import logger from './util/logger'
import connect from './util/prisma'
import { PrismaClient } from '@prisma/client'
import { Application } from 'express'
import { QueueManager } from './connectors/queue'
import { Signals } from 'close-with-grace'
import { promisify } from 'util'
import http from 'node:http'

export async function createServer (): Promise<[Server, Application, PrismaClient]> {
  try {
    const db = await connect()
    const app = createApp(db)
    const server = http.createServer(app)
    QueueManager.setServer(server)
    const port: number | undefined = env.PORT != null ? parseInt(env.PORT, 10) : undefined
    server.listen(port, '0.0.0.0')
    await QueueManager.start()
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
