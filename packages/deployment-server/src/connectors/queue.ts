import type { Connector, Device } from '@prisma/client'
import WebSocket, { WebSocketServer } from 'ws'
import type { AddressInfo, Server as WSServer } from 'ws'
import type { Server } from 'node:http'
import { db } from '../util/prisma'
import { Socket } from 'node:net'
import logger from '../util/logger'
import { promisify } from 'node:util'

type ConnectorId = string

export const QueueManager = {
  queueMap: new Map<ConnectorId, WSServer>(),

  setServer (server: Server) {
    server.on('upgrade', (request, socket, head) => {
      const match = request.url?.match(/^\/connectors\/(.+)\/queue$/)

      if (match == null) {
        return socket.destroy()
      }

      const id = match[1]

      if (this.queueMap.has(id) == null) {
        return socket.destroy()
      }

      // We just checked
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const matchedServer = this.queueMap.get(id)!

      matchedServer.handleUpgrade(request, socket as Socket, head, function done (ws) {
        matchedServer.emit('connection', ws, request)
      })
    })
  },

  register (uuid: ConnectorId): WSServer {
    const wsServer = new WebSocketServer({ noServer: true })
    this.queueMap.set(uuid, wsServer)

    wsServer.on('error', (error) => {
      logger.error(error)
      this.queueMap.delete(uuid)
    })

    wsServer.on('connection', () => {
      logger.info(arguments)
    })

    return wsServer
  },

  has (uuid: ConnectorId): boolean {
    return this.queueMap.has(uuid)
  },

  get (uuid: ConnectorId): WSServer | null {
    return this.queueMap.get(uuid) ?? null
  },

  remove (uuid: ConnectorId): boolean {
    const wsServer = this.queueMap.get(uuid)
    if (wsServer != null) {
      wsServer.close()
    }
    return this.queueMap.delete(uuid)
  },

  // Reconnects all the queues
  async start (): Promise<WSServer[]> {
    const connectors = await db.connector.findMany()

    return connectors.map(({ id }) => this.register(id))
  }
}

export function registerConnector ({ id: connectorId }: {id: ConnectorId}): WSServer {
  return QueueManager.register(connectorId)
}

export function unregisterConnector ({ id: connectorId }: {id: ConnectorId}): void {
  QueueManager.remove(connectorId)
}

export function getServerForConnector ({ id: connectorId }: {id: ConnectorId}): WSServer | null {
  return QueueManager.get(connectorId)
}

export function getPortForConnector ({ id: connectorId }: {id: ConnectorId}): number | null {
  return (QueueManager.get(connectorId)?.address() as AddressInfo | undefined)?.port ?? null
}

export async function addDeployRequest (device: (Device & { connector: Connector }), artifactUri: string): Promise<void> {
  const { connector: { id: connectorId } } = device

  const queue = QueueManager.get(connectorId)

  if (queue == null) {
    throw new Error(`No queue for connector ${connectorId}`)
  }

  await Promise.all(
    Array.from(queue.clients).map(async (client) => {
      const send = promisify(client.send.bind(client)) as (data: string) => Promise<void>

      if (client.readyState === WebSocket.OPEN) {
        await send(JSON.stringify({
          type: 'deploy',
          data: {
            device: {
              ...device,
              connector: undefined
            },
            artifactUri
          }
        }))
      }
    })
  )
}
