import { env } from 'process'
import { createApp } from './util/app'

import type { Server } from 'node:http'
import logger from './util/logger'
import connect from './util/prisma'
import { PrismaClient } from '@prisma/client'
import { Application } from 'express'

export async function createServer (): Promise<[Server, Application, PrismaClient]> {
  const db = await connect()
  const app = createApp(db)
  return [app.listen(env.PORT), app, db]
}

export async function closeServer (this: {server: Server, db: PrismaClient}, { err }: { err?: Error } = { }): Promise<void> {
  if (err != null) {
    logger.error(err)
  }

  await this.db.$disconnect()

  await new Promise<void>((resolve, reject) => {
    this.server.close((err) => {
      if (err != null) {
        reject(err)
      } else {
        resolve()
      }
    })
  })

  logger.info('Closed server')
}
