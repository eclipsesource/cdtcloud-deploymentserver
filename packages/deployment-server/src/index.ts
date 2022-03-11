import { exit } from 'node:process'
import { closeServer, createServer } from './server'
import closeWithGrace from 'close-with-grace'
import logger from './util/logger'
import type { PrismaClient } from '@prisma/client'
import { AddressInfo } from 'node:net'

export let db: PrismaClient

try {
  const [server, , prismaClient] = await createServer()
  db = prismaClient

  const listenAddress = server.address() as AddressInfo
  logger.info(`Listening on ${listenAddress?.address}:${listenAddress.port}`)

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
