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

import WebSocket, { WebSocketServer } from 'ws'
import { Server, Socket } from 'node:net'
import { Connector, Device } from '@prisma/client'
import logger from '../util/logger'

const matchRegex = /^\/api\/dashboard\/notifications$/i

const notificationStream = new WebSocketServer({ noServer: true })

export const handles = (url?: string): boolean => {
  return ((url?.match(matchRegex)) != null)
}

export const registerNotificationStreamRoutes = (server: Server): void => {
  server.on('upgrade', function upgrade (request, socket, head) {
    const match = request.url?.match(matchRegex)

    if (match == null) {
      return
    }

    notificationStream.handleUpgrade(request, socket as Socket, head, function done (ws) {
      server.emit('connection', ws, request)
    })
  })
}

export const broadcastDeviceChange = async (device: Device, event: 'add' | 'remove'): Promise<void> => {
  notificationStream.clients.forEach(function each (client) {
    if (client.readyState === WebSocket.OPEN) {
      try {
        client.send(JSON.stringify({
          type: 'device',
          data: {
            event,
            device
          }
        }))
      } catch (e) {
        logger.error(e)
        client.close()
      }
    }
  })
}

export const broadcastConnectorChange = async (connector: Connector, event: 'add' | 'remove' | 'connect' | 'disconnect'): Promise<void> => {
  notificationStream.clients.forEach(function each (client) {
    if (client.readyState === WebSocket.OPEN) {
      try {
        client.send(JSON.stringify({
          type: 'connector',
          data: {
            event,
            connector
          }
        }))
      } catch (e) {
        logger.error(e)
        client.close()
      }
    }
  })
}
