import type { Server, Socket } from 'node:net'
import { DeployRequest } from '@prisma/client'
import { WebSocketServer } from 'ws'
import logger from '../util/logger'

const openStreams = new Map<string, WebSocketServer>()

const matchRegex = /^\/api\/deployments\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\/stream$/i

export function handles (url?: string): boolean {
  return ((url?.match(matchRegex)) != null)
}

export function registerDeviceStreamRoutes (server: Server): void {
  server.on('upgrade', (request, socket, head) => {
    const match = request.url?.match(matchRegex)

    if (match == null) {
      return
    }

    const id: string = match[1]

    if (!openStreams.has(id)) {
      return socket.destroy()
    }

    // We just checked
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const matchedServer = openStreams.get(id)!

    matchedServer.handleUpgrade(request, socket as Socket, head, function done (ws) {
      matchedServer.emit('connection', ws, request)
    })
  })
}

export function createDeploymentStream ({ id }: Pick<DeployRequest, 'id'>): WebSocketServer {
  const server = new WebSocketServer({
    noServer: true
  })

  openStreams.set(id, server)
  return server
}

export async function closeDeploymentStream ({ id }: Pick<DeployRequest, 'id'>): Promise<boolean> {
  const server = openStreams.get(id)

  if (server == null) {
    logger.warn(`Tried to close stream for deployment ${id}, but no existing wss was tracked`)
    return false
  }

  for (const client of server.clients) {
    client.close()
  }

  logger.info(`Closed deployment stream for deployment ${id}`)

  return openStreams.delete(id)
}

export function hasDeploymentStream ({ id }: Pick<DeployRequest, 'id'>): boolean {
  return openStreams.has(id)
}

export function getDeploymentStream ({ id }: Pick<DeployRequest, 'id'>): WebSocketServer | null {
  return openStreams.get(id) ?? null
}
