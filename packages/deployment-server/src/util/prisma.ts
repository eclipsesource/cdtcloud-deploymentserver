import prisma from '@prisma/client'
import type { PrismaClient, Prisma } from '@prisma/client'
import logger from './logger'

declare module 'http' {
  interface IncomingMessage {
    db: PrismaClient
  }
}

export let db: PrismaClient

export default async function connect (opts: Prisma.PrismaClientOptions = {}): Promise<PrismaClient> {
  const client = new prisma.PrismaClient(opts)
  db = client
  await client.$connect()
  logger.info('Connected to Prisma')
  return client
}
