import { env } from 'process'
import WebSocket, { CloseEvent, createWebSocketStream, ErrorEvent, MessageEvent } from 'ws'
import fs, { createReadStream, createWriteStream } from 'fs'
import { fetch } from 'undici'
import { logger } from '../util/logger'
import { setTimeout } from 'timers/promises'
import { Duplex } from 'stream'
import { deployBinary, DeploymentData } from '../devices/deployment'
import { MonitorData } from '../devices/monitoring'
import { ConnectedDevices } from '../devices/store'
import { DeviceStatus } from '../util/common'
import { unregisterDevice } from '../devices/service'

export interface ConnectorData {
  id: string
  uri: string
}

export let connectorId: string
export const address = env.SERVER_URI != null ? env.SERVER_URI : '127.0.0.1:3001'

const readConnectorData = async (): Promise<ConnectorData> => {
  let data = ''

  return await new Promise((resolve, reject) => {
    const dataStream = createReadStream('.connection.data')

    dataStream.on('data', (chunk: string) => {
      data += chunk
    })

    dataStream.on('end', () => {
      resolve(JSON.parse(data))
    })

    dataStream.on('error', (error: Error) => {
      reject(error)
    })
  })
}

const generateConnectorData = async (): Promise<ConnectorData> => {
  const registrationResponse = await fetch(`http://${address}/connectors`, {
    method: 'POST'
  })
  const { id } = await registrationResponse.json() as any

  return await new Promise<ConnectorData>((resolve, reject) => {
    if (id === '') {
      reject(new Error('No valid id response'))
    }

    const connectorData: ConnectorData = {
      id: id,
      uri: address
    }

    resolve(connectorData)
  })
}

const writeConnectorData = async (connectorData: ConnectorData): Promise<void> => {
  return await new Promise((resolve, reject) => {
    const dataStream = createWriteStream('.connection.data')

    dataStream.on('finish', () => {
      resolve()
    })

    dataStream.on('error', (error: Error) => {
      reject(error)
    })

    dataStream.write(JSON.stringify(connectorData))
    dataStream.end()
  })
}

export const openStream = async (): Promise<Duplex> => {
  let connectorData: ConnectorData | undefined
  if (fs.existsSync('.connection.data')) {
    connectorData = await readConnectorData()
  }

  if ((connectorData == null) || connectorData.uri !== address) {
    connectorData = await generateConnectorData()
    await writeConnectorData(connectorData)
  }

  connectorId = connectorData.id
  const url = `ws://${address}/connectors/${connectorId}/queue`
  const socket = new WebSocket(url)

  socket.onopen = () => {
    logger.info(`Connected to Deployment-Server (${address})`)
  }

  socket.onerror = (error: ErrorEvent) => {
    logger.error(`DeployServ-Stream: ${error.message}`)
  }

  socket.onclose = async (event: CloseEvent) => {
    logger.error(`Connection to Deployment-Server failed: ${event.reason}(${event.code}) - Trying to reconnect`)
    await setTimeout(3000)
    return await openStream()
  }

  socket.onmessage = async (message: MessageEvent) => {
    const servReq = JSON.parse(message.data as string)
    const type: string = servReq.type

    if (type === 'deploy') {
      const data = servReq.data as DeploymentData

      const device = await deployBinary(data)
      await device.monitorOutput(5) // Todo: remove, this is only temporary to test
    } else if (type.startsWith('monitor.')) {
      const command = type.split('.')[1]
      const data = servReq.data as MonitorData

      try {
        const device = ConnectedDevices.get(data.device.id)
        if (command === 'start') {
          if (device.status === DeviceStatus.AVAILABLE) {
            await device.monitorOutput(5) // TODO: monitor currently set to 5sec for testing purposes
          } else {
            const monitoring = device.isMonitoring() ? DeviceStatus.RUNNING : device.status
            logger.error(`Requested Device with id ${device.id} busy (${monitoring})`)
          }
        } else if (command === 'stop') {
          await device.stopMonitoring()
        } else {
          logger.error(`Received unknown monitor command ${command}`)
        }
      } catch (e) {
        // Requested device not connected - unregistering
        unregisterDevice(data.device.id).catch((err) => {
          logger.error(err)
        })

        // TODO: Notify server of error
        logger.error(e)
      }
    } else {
      logger.error(`Received unknown request type ${type}`)
    }
  }

  return createWebSocketStream(socket)
}
