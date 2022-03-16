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
import { DeployStatus } from 'deployment-server/dist/src'

const createWebsocket = async (route: string): Promise<WebSocket> => {
  const url = `${window.location.protocol === 'https' ? 'wss' : 'ws'}://${window.location.host}${route}`
  return new WebSocket(url)
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useMonitor = (deploymentId: string, deployStatus: keyof typeof DeployStatus, condition: boolean = true) => {
  const [socket, setSocket] = useState<WebSocket>()
  const [open, setOpen] = useState<boolean>(false)
  const [subs, setSubs] = useState<Array<((message: MessageEvent) => void)>>([])
  const [reconAttempts, setReconAttempts] = useState<number>(0)

  useEffect(() => {
    // Object to avoid clones of sockets
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const newSocket = { ws: null } as { ws: WebSocket | null }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    async function openSocket () {
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
      void openSocket()
    } else {
      socket?.close()
    }

    return () => {
      if (newSocket.ws != null) {
        newSocket.ws.close()
      }
    }
  }, [reconAttempts, deployStatus, deploymentId, condition])

  useEffect(() => {
    if (socket != null) {
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

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type useMonitor = typeof useMonitor
