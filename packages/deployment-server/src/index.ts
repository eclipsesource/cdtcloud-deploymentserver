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

  closeWithGrace({ delay: 500 }, closeServer.bind({ server, db }))
} catch (err) {
  logger.error(err)
  exit(1)
}
