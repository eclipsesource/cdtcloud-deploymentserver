import { useEffect, useState } from 'react'
import { DeployStatus } from 'deployment-server/dist/src'

const createWebsocket = async (route: string): Promise<WebSocket> => {
  const url = `${window.location.protocol === 'https' ? 'wss' : 'ws'}://${window.location.host}${route}`
  return new WebSocket(url)
}

export const useMonitor = (deploymentId: string, deployStatus: keyof typeof DeployStatus, condition: boolean = true) => {
  const [socket, setSocket] = useState<WebSocket>()
  const [open, setOpen] = useState<boolean>(false)
  const [subs, setSubs] = useState<((message: MessageEvent) => void)[]>([])
  const [reconAttempts, setReconAttempts] = useState<number>(0)

  useEffect(() => {
    // Object to avoid clones of sockets
    let newSocket = { ws: null } as { ws: WebSocket | null }

    async function openSocket() {
      const ws = await createWebsocket(`/api/deployments/${deploymentId}/stream`)
      ws.onopen = () => setOpen(true)
      ws.onclose = () => {
        setOpen(false)
        setReconAttempts(reconAttempts + 1)
      }
      ws.onerror = console.error
      setSocket(ws)
      newSocket.ws = ws
    }

    if (deployStatus === 'RUNNING' && condition) {
      openSocket()
    } else {
      socket?.close()
    }

    return () => {
      if (newSocket.ws) {
        newSocket.ws.close()
      }
    }
  }, [reconAttempts, deployStatus, deploymentId, condition])

  useEffect(() => {
    if (socket) {
      socket.onmessage = (message) => {
        subs.forEach((eventFun: (resp: MessageEvent) => void) => eventFun(message))
      }
    }
  }, [socket, subs])

  return {
    open,
    subs,
    attempts: reconAttempts,
    send: (payload: any) => socket?.send(JSON.stringify(payload)),
    subscribe: (eventFun: (resp: MessageEvent) => void) => {
      if (!subs.includes(eventFun)) {
        setSubs([...subs, eventFun])
      }
      return () => setSubs(subs.filter(sub => sub !== eventFun))
    },
    close: () => socket?.close()
  }
}

export type useMonitor = typeof useMonitor
