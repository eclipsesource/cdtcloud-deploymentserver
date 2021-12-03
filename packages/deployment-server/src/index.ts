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
