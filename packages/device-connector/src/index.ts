import { closeConnector, createConnector, DeviceConnector } from './deviceConnector'
import { exit } from 'node:process'
import closeWithGrace from 'close-with-grace'

try {
  const connector: DeviceConnector = await createConnector()

  const handler = closeWithGrace({ delay: 1000 }, closeConnector.bind(connector))

  // Process kill pid signal (nodemon)
  process.once('SIGUSR1 ', () => {
    handler.close()
  })
  process.once('SIGUSR2', () => {
    handler.close()
  })

  // Process ctrl+c signal
  process.once('SIGINT', () => {
    handler.close()
  })

  // Process uncaught exceptions
  process.once('uncaughtException', () => {
    handler.close()
  })
} catch (err) {
  console.error(err)
  exit(1)
}
