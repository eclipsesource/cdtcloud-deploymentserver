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
