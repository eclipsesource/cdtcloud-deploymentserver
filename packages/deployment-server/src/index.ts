import { exit } from 'node:process'
import { closeServer, createServer } from './server'
import closeWithGrace from 'close-with-grace'
import logger from './util/logger'

closeWithGrace({ delay: 500 }, closeServer)

createServer()
  .then(() => logger.info('Listening'))
  .catch((err) => {
    closeServer({ err }).catch((err) => {
      logger.error(err)
      exit(1)
    })
  })
