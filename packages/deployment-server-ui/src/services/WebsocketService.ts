import { useEffect, useState } from 'react'

export interface ServerMessage {
  type: string,
  data: any
}

const createWebsocket = async (route: string): Promise<WebSocket> => {
  const url = `${window.location.protocol === 'https' ? 'wss' : 'ws'}://${window.location.host}${route}`
  return new WebSocket(url)
}


export const useWebsocket = (route: string, condition?: boolean) => {
  const [socket, setSocket] = useState<WebSocket>()
  const [open, setOpen] = useState<boolean>(false)
  const [subs, setSubs] = useState<((obj: any) => void)[]>([])
  const [reconAttempts, setReconAttempts] = useState<number>(0)

  useEffect(() => {
    // Object to avoid clones of sockets
    let newSocket = { ws: null } as { ws: WebSocket | null }
    async function openSocket() {
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
      openSocket()
    }

    return () => {
      if (newSocket.ws) {
        newSocket.ws.close()
      }
    }
  }, [route, reconAttempts, condition])

  useEffect(() => {
    if (socket) {
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
    subscribe: (eventFun: (resp: ServerMessage) => void) => {
      if (!subs.includes(eventFun)) {
        setSubs([...subs, eventFun])
      }
      return () => setSubs(subs.filter(sub => sub !== eventFun))
    }
  }
}

export type useWebsocket = typeof useWebsocket
