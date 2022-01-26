import { useEffect, useState } from 'react'

export interface ServerMessage {
  type: string
  data: any
}

interface UseWebSocketReturn {

  open: boolean
  subs: Array<(obj: any) => void>
  attempts: number
  send?: ((payload: any) => void)
  subscribe: (eventFun: (resp: ServerMessage) => Promise<void>) => () => void
}

const createWebsocket = async (route: string): Promise<WebSocket> => {
  const url = `${window.location.protocol === 'https' ? 'wss' : 'ws'}://${window.location.host}${route}`
  return new WebSocket(url)
}

export const useWebsocket = (route: string, condition: boolean = true): UseWebSocketReturn => {
  const [socket, setSocket] = useState<WebSocket>()
  const [open, setOpen] = useState<boolean>(false)
  const [subs, setSubs] = useState<Array<(obj: any) => Promise<void>>>([])
  const [reconAttempts, setReconAttempts] = useState<number>(0)

  useEffect(() => {
    // Object to avoid clones of sockets
    const newSocket: { ws: WebSocket | null } = { ws: null }

    async function openSocket (): Promise<void> {
      const ws = await createWebsocket(route)
      ws.onopen = () => setOpen(true)
      ws.onclose = () => {
        setOpen(false)
        setReconAttempts(reconAttempts + 1)
      }
      ws.onerror = console.error
      setSocket(ws)
      newSocket.ws = ws
    }
    if (condition) {
      void openSocket()
    }

    return () => {
      if (newSocket.ws != null) {
        newSocket.ws.close()
      }
    }
  }, [route, reconAttempts, condition])

  useEffect(() => {
    if (socket != null) {
      socket.onmessage = (message) => {
        const resp = JSON.parse(message.data)
        subs.forEach((eventFun: (resp: ServerMessage) => void) => eventFun(resp))
      }
    }
  }, [socket, subs])

  return {
    open,
    subs,
    attempts: reconAttempts,
    send: (payload: any) => socket?.send(JSON.stringify(payload)),
    subscribe: (eventFun: (resp: ServerMessage) => Promise<void>) => {
      if (!subs.includes(eventFun)) {
        setSubs([...subs, eventFun])
      }
      return () => setSubs(subs.filter(sub => sub !== eventFun))
    }
  }
}
