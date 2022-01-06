import { buildCli } from './arduino-cli/service'
import { GRPCClient } from './arduino-cli/client'
import { openStream } from './deployment-server/connection'
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
  deploymentSocket = await openStream()

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
