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

import { useEffect, useState } from 'react'

export interface ServerMessage {
  type: string
  data: any
}

const createWebsocket = async (route: string): Promise<WebSocket> => {
  const url = `${window.location.protocol === 'https' ? 'wss' : 'ws'}://${window.location.host}${route}`
  return new WebSocket(url)
}

export const useWebsocketFunction = (route: string, condition: boolean = true): {
  open: boolean
  subs: Array<(message: ServerMessage) => void>
  attempts: number
  send: (payload: any) => void
  subscribe: (eventFun: (resp: ServerMessage) => void) => () => void
  close: () => void
} => {
  const [socket, setSocket] = useState<WebSocket>()
  const [open, setOpen] = useState<boolean>(false)
  const [subs, setSubs] = useState<Array<((message: ServerMessage) => void)>>([])
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
      openSocket().catch((e) => console.log(e))
    }

    return () => {
      if (newSocket.ws != null) {
        newSocket.ws.close()
      }
    }
  }, [reconAttempts, condition])

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
    subscribe: (eventFun: (resp: ServerMessage) => void) => {
      if (!subs.includes(eventFun)) {
        setSubs([...subs, eventFun])
      }
      return () => setSubs(subs.filter(sub => sub !== eventFun))
    },
    close: () => socket?.close()
  }
}

export type useWebsocket = typeof useWebsocketFunction
