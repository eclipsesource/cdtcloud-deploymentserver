import { env } from 'process'
import { app } from './util/app'

import type { Server } from 'node:net'
import logger from './util/logger'

export let server: Server

export async function createServer (): Promise<void> {
  server = app.listen(env.PORT)
}

export async function closeServer ({ err }: { err?: Error }): Promise<void> {
  if (err != null) {
    logger.error(err)
  }

  await new Promise<void>((resolve, reject) => {
    server.close((err) => {
      if (err != null) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}
