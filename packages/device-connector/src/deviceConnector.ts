import { connectCli, registerDevices } from './arduino-cli/service'
import { RPCClient } from './arduino-cli/client'
import { deployBinary } from './devices/deployment'
import { openStream } from './deployment-server/connection'
import logger from './util/logger'
import { Signals } from 'close-with-grace'
import { Duplex } from 'stream'
import { DeployServRequest } from './deployment-server/service'
import { monitorDevice } from './devices/monitoring'

export interface DeviceConnector {
  client: RPCClient
  socket: Duplex
}

export const createConnector = async (): Promise<DeviceConnector> => {
  const client = await connectCli()
  const socket = await openStream()

  await registerDevices(client)

  socket.on('data', (message) => {
    const servReq = JSON.parse(message) as DeployServRequest
    const type = servReq.type
    const data = servReq.data

    if (type === 'deploy') {
      deployBinary(data, client).then(async (device) => {
        await monitorDevice(client, device)
      }).catch((e) => {
        socket.write(e.message)
        logger.error(e.message)
      })
    } else if (type === 'monitor.start') {
      // TODO: start monitor
    } else if (type === 'monitor.close') {
      // TODO: stop monitor
    } else {
      logger.error(`Received unknown request type ${type}`)
    }
  })

  return { client, socket }
}

export async function closeConnector (
  this: {client: RPCClient, socket: Duplex},
  { err, signal }: { err?: Error, signal?: Signals | string } = { }
): Promise<void> {
  if (err != null) {
    logger.error(err)
  }

  await this.client.removeAllDevices()
  await this.client.destroyInstance()
  this.client.closeClient()

  this.socket.end()

  logger.info(`${signal ?? 'Manual Exit'}: Closed service`)
}
