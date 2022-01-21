import { closeConnector, createConnector, DeviceConnector } from './deviceConnector'
import { env, exit } from 'node:process'
import closeWithGrace from 'close-with-grace'
import { logger } from './util/logger'

try {
  if (env.NODE_ENV === 'development') {
    logger.info('Waiting for deployment server to start...')
    const waitForPort = (await import('wait-on')).default

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await waitForPort({ resources: [`http://${env.DEPLOY_IP!}:${env.DEPLOY_PORT!}`] })
  }

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
