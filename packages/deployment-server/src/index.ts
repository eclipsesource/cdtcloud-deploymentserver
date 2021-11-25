import { exit } from 'node:process'
import { closeServer, createServer } from './server'
import closeWithGrace from 'close-with-grace'
import logger from './util/logger'

try {
  const [server, , db] = await createServer()
  logger.info('Listening')

  closeWithGrace({ delay: 500 }, closeServer.bind({ server, db }))
} catch (err) {
  logger.error(err)
  exit(1)
}
