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
import { buildCli } from './arduino-cli/service'
import { GRPCClient } from './arduino-cli/client'
import { openConnectorStream } from './deployment-server/connection'
import { Signals } from 'close-with-grace'
import { Duplex } from 'stream'
import { logger } from './util/logger'

export let arduinoClient: GRPCClient
export let deploymentSocket: Duplex

export interface DeviceConnector {
  arduinoClient: GRPCClient
  deploymentSocket: Duplex
}

export const createConnector = async (): Promise<DeviceConnector> => {
  arduinoClient = await buildCli()
  deploymentSocket = await openConnectorStream()

  return { arduinoClient, deploymentSocket }
}

export async function closeConnector (
  this: {arduinoClient: GRPCClient, deploymentSocket: Duplex},
  { err, signal }: { err?: Error, signal?: Signals | string } = { }
): Promise<void> {
  if (err != null) {
    logger.error(err)
  }

  await this.arduinoClient.removeAllDevices()
  await this.arduinoClient.destroyInstance()
  this.arduinoClient.closeClient()

  this.deploymentSocket.end()

  logger.info(`${signal ?? 'Manual Exit'}: Closed service`)
}
