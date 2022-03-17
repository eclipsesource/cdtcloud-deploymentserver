/********************************************************************************
    Copyright (c) 2022 EclipseSource and others.

    This program and the accompanying materials are made available under the
    terms of the Eclipse Public License v. 2.0 which is available at
    http://www.eclipse.org/legal/epl-2.0.

    This Source Code may also be made available under the following Secondary
    Licenses when the conditions for such availability set forth in the Eclipse
    Public License v. 2.0 are satisfied: GNU General Public License, version 2
    with the GNU Classpath Exception which is available at
    https://www.gnu.org/software/classpath/license.html.

    SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
********************************************************************************/

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
