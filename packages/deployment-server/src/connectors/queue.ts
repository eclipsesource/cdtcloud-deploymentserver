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
import type { Connector, DeployRequest, Device } from '@prisma/client'
import WebSocket, { WebSocketServer } from 'ws'
import type { AddressInfo, Server as WSServer } from 'ws'
import type { Server } from 'node:http'
import { db } from '../util/prisma'
import { Socket } from 'node:net'
import logger from '../util/logger'
import { promisify } from 'node:util'
import { broadcastConnectorChange } from '../dashboard/service'

type ConnectorId = string

export const QueueManager = {
  queueMap: new Map<ConnectorId, WSServer>(),
  test: /^\/api\/connectors\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\/queue$/,

  handles (url?: string): boolean {
    return url?.match(this.test) != null
  },

  registerConnectorQueueRoutes (server: Server) {
    server.on('upgrade', (request, socket, head) => {
      const match = request.url?.match(this.test)

      if (match == null) {
        return
      }

      const id = match[1]

      if (!this.queueMap.has(id)) {
        return socket.destroy()
      }

      // We just checked
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const matchedServer = this.queueMap.get(id)!

      matchedServer.handleUpgrade(
        request,
        socket as Socket,
        head,
        function done (ws) {
          ws.onclose = () => {
            broadcastConnectorChange({ id }, 'disconnect').catch(logger.error)
          }
          matchedServer.emit('connection', ws, request)
        }
      )
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
      broadcastConnectorChange({ id: arguments[0] }, 'connect').catch(logger.error)
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

export async function addDeployRequest (
  device: Device & { connector: Connector },
  { id, artifactUrl }: Pick<DeployRequest, 'artifactUrl' | 'id'>
): Promise<void> {
  const {
    connector: { id: connectorId }
  } = device

  const queue = QueueManager.get(connectorId)

  if (queue == null) {
    throw new Error(`No queue for connector ${connectorId}`)
  }

  await Promise.all(
    Array.from(queue.clients).map(async (client) => {
      const send = promisify(client.send.bind(client)) as (data: string) => Promise<void>

      if (client.readyState === WebSocket.OPEN) {
        await send(
          JSON.stringify({
            type: 'deploy',
            data: {
              device: {
                ...device,
                connector: undefined
              },
              artifactUri: artifactUrl,
              id
            }
          })
        )
      }
    })
  )
}
