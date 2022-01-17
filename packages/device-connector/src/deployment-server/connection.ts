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
import { unregisterDevice } from '../devices/service'
import { httpError } from '../util/errors'

export interface ConnectorData {
  id: string
  uri: string
}

export let connectorId: string
const deployUrl = `${env.DEPLOY_IP ?? '127.0.0.1'}:${env.DEPLOY_PORT ?? '3001'}`
export const deployUri = `http${env.DEPLOY_SECURE === 'true' ? 's' : ''}://${deployUrl}/api`

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
  const registrationResponse = await fetch(`${deployUri}/connectors`, {
    method: 'POST'
  })

  if (!registrationResponse.ok) {
    throw httpError(registrationResponse)
  }

  const { id } = await registrationResponse.json() as {id: string}

  if (id === '') {
    throw new Error('No valid id response')
  }

  return {
    id,
    uri: deployUri
  }
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
    logger.debug(`Found previous connection on ${connectorData.uri} with id ${connectorData.id}`)
  }

  if (connectorData == null || connectorData.id == null || connectorData.uri !== deployUri) {
    logger.debug('No or invalid previous connection found for requested deployment-server')
    try {
      connectorData = await generateConnectorData()
    } catch (e) {
      logger.error(e)
      await setTimeout(3000)
      return await openStream()
    }
    try {
      await writeConnectorData(connectorData)
      logger.debug(`New connection on ${connectorData.uri} with id ${connectorData.id}`)
    } catch (e) {
      logger.warn(e)
    }
  }

  connectorId = connectorData.id
  const uri = `ws${env.DEPLOY_SECURE === 'true' ? 's' : ''}://${deployUrl}/api/connectors/${connectorId}/queue`
  const socket = new WebSocket(uri)

  socket.onopen = () => {
    logger.info(`Connected to Deployment-Server (${deployUrl})`)
  }

  socket.onerror = (error: ErrorEvent) => {
    logger.error(`Deployment-Server socket: ${error.message}`)
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

      try {
        await deployBinary(data)
      } catch (e) {
        logger.error(e)
      }
    } else if (type.startsWith('monitor.')) {
      const command = type.split('.')[1]
      const data = servReq.data as MonitorData

      try {
        const device = ConnectedDevices.get(data.device.id)
        if (command === 'start') {
          try {
            await device.monitorOutput()
          } catch (e) {
            logger.error(e)
          }
        } else if (command === 'stop') {
          await device.stopMonitoring()
        } else {
          logger.debug(`Received unknown monitor command ${command} - ignoring`)
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
      logger.debug(`Received unknown request type ${type} - ignoring`)
    }
  }

  let duplex = createWebSocketStream(socket)

  duplex.on('close', () => {
    duplex = createWebSocketStream(socket)
  })

  return duplex
}
