import { connectCli, registerDevices } from './arduino-cli/service'
import { RPCClient } from './arduino-cli/client'
import { MessageEvent, WebSocket } from 'ws'
import { deployBinary } from './devices/service'
import { openStream } from './deployment-server/connection'
import logger from './util/logger'
import { Signals } from 'close-with-grace'

export interface DeviceConnector {
  client: RPCClient
  socket: WebSocket
}

export const createConnector = async (): Promise<DeviceConnector> => {
  const client = await connectCli()
  const socket = await openStream()

  await registerDevices(client)

  socket.onmessage = (e: MessageEvent) => {
    const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data

    deployBinary(data, client).catch((e) => {
      logger.error(e)
    })
  }

  return { client, socket }
}

export async function closeConnector (
  this: {client: RPCClient, socket: WebSocket},
  { err, signal }: { err?: Error, signal?: Signals | string } = { }
): Promise<void> {
  if (err != null) {
    logger.error(err)
  }

  await this.client.removeAllDevices()
  await this.client.destroyInstance()
  this.client.closeClient()

  this.socket.close()

  logger.info(`${signal ?? 'Manual Exit'}: Closed service`)
}