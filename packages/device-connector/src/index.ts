import { closeConnector, createConnector, DeviceConnector } from './deviceConnector'
import { exit } from 'node:process'
import closeWithGrace from 'close-with-grace'

try {
  const connector: DeviceConnector = await createConnector()

  const exitHandler = closeWithGrace({ delay: 1000 }, closeConnector.bind(connector))

  // Process kill pid signal (nodemon)
  process.on('SIGUSR1 ', () => {
    exitHandler.close()
  })
  process.on('SIGUSR2', () => {
    exitHandler.close()
  })

  // Process ctrl+c signal
  process.on('SIGINT', () => {
    exitHandler.close()
  })

  // Process unix termination signal
  process.on('SIGTERM', () => {
    exitHandler.close()
  })

  // Process windows ctrl+break signal
  process.on('SIGBREAK', () => {
    exitHandler.close()
  })

  // Process uncaught exceptions
  process.on('uncaughtException', () => {
    exitHandler.close()
  })
} catch (err) {
  console.error(err)
  exit(1)
}
