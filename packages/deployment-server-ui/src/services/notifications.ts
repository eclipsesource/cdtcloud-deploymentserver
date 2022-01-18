import { setTimeout } from 'timers/promises'
import WebSocket, { CloseEvent, ErrorEvent, MessageEvent } from 'ws'

const address = '127.0.0.1:3001' // TODO
const uri = `ws://${address}/dashboard/notifications`

const openStream = async (): Promise<WebSocket> => {
  const socket = new WebSocket(uri)

  socket.onopen = () => {
    console.debug(`Connected to Deployment-Server`)
  }

  socket.onerror = (error: ErrorEvent) => {
    console.error(`Deployment-Server socket: ${error.message}`)
  }

  socket.onclose = async (event: CloseEvent) => {
    console.error(`Connection to Deployment-Server failed: ${event.reason}(${event.code}) - Trying to reconnect`)
    await setTimeout(3000)
    return await openStream()
  }

  socket.onmessage = async (message: MessageEvent) => {
    const servResp = JSON.parse(message.data as string)
    const type: string = servResp.type
    const data = servResp.data

    switch (type) {
      case 'device':
        console.log(data.device)
        // TODO: notify new device from data.device
        break
      case 'connector':
        console.log(data.connector)
        // TODO: notify new connector from data.connector
        break
      default:
        break
    }
  }

    return socket
}

export const notificationStream = await openStream()
