import { connectCli } from './arduino-cli/service'
import { RPCClient } from './arduino-cli/client'
import { deployBinary, DeploymentData } from './devices/deployment'
import { openStream } from './deployment-server/connection'
import logger from './util/logger'
import { Signals } from 'close-with-grace'
import { Duplex } from 'stream'
import { DeployServRequest } from './deployment-server/service'
import { MonitorData } from './devices/monitoring'
import { ConnectedDevices } from './devices/store'
import { unregisterDevice } from './devices/service'
import { DeviceStatus } from './util/common'

export interface DeviceConnector {
  client: RPCClient
  socket: Duplex
}

export const createConnector = async (): Promise<DeviceConnector> => {
  const client = await connectCli()
  const socket = await openStream()

  // TODO: move to socket when client is reworked
  socket.on('data', (message) => {
    const servReq = JSON.parse(message) as DeployServRequest
    const type = servReq.type

    if (type === 'deploy') {
      const data = servReq.data as DeploymentData

      deployBinary(data, client).then(async (device) => {
        socket.write(JSON.stringify({ // TODO: Add deploy id
          type: 'deploy',
          status: 'OK'
        }))
        await device.monitorOutput(client, socket, 5) // TODO: monitor currently set to 5sec for testing purposes - move to other file when client is reworked
      }).catch((e) => {
        socket.write(JSON.stringify({ // TODO: Add deploy id
          type: 'deploy',
          error: e
        }))
        logger.error(e)
      })
    } else if (type.startsWith('monitor.')) {
      const command = type.split('.')[1]
      const data = servReq.data as MonitorData

      try {
        const device = ConnectedDevices.get(data.device.id)
        if (command === 'start') {
          if (device.status === DeviceStatus.AVAILABLE) {
            // TODO: monitor currently set to 5sec for testing purposes - move to other file when client is reworked
            device.monitorOutput(client, socket, 5).catch((err) => {
              throw err
            })
          } else {
            const monitoring = device.isMonitoring() ? DeviceStatus.MONITORING : device.status
            logger.error(`Requested Device with id ${device.id} busy (${monitoring})`)
          }
        } else if (command === 'stop') {
          // TODO: move to other file when client is reworked - check status
          device.stopMonitoring().catch((err) => {
            throw err
          })
        } else {
          logger.error(`Received unknown monitor command ${command}`)
        }
      } catch (e) {
        // Requested device not connected - unregistering
        unregisterDevice(data.device.id).catch((err) => {
          logger.error(err)
        })

        // Notify server of error
        socket.write(JSON.stringify({
          type: `monitor.${command}`,
          error: e
        }))

        logger.error(e)
      }
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
