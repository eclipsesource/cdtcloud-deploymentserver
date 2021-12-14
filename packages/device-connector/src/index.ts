import { closeConnector, createConnector, DeviceConnector } from './deviceConnector'
import { exit } from 'node:process'
import closeWithGrace from 'close-with-grace'

try {
  const connector: DeviceConnector = await createConnector()

  const handler = closeWithGrace({ delay: 1000 }, closeConnector.bind(connector))

  // Nodemon sends SIGUSR2 when it restarts
  process.once('SIGUSR2', () => {
    handler.close()
  })

  // Process SIGINT signal
  process.once('SIGINT', () => {
    handler.close()
  })
} catch (err) {
  console.error(err)
  exit(1)
}
