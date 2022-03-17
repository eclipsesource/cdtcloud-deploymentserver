import { closeConnector, createConnector, DeviceConnector } from './deviceConnector'
import { env, exit } from 'node:process'
import closeWithGrace from 'close-with-grace'
import { logger } from './util/logger'

try {
  if (env.NODE_ENV === 'development' || env.NODE_ENV === 'demo') {
    logger.info('Waiting for deployment server to start...')
    const waitForPort = (await import('wait-on')).default

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await waitForPort({ resources: [`http${env.DEPLOY_SECURE === 'true' ? 's' : ''}://${env.DEPLOY_IP!}:${env.DEPLOY_PORT!}`] })
  }

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
