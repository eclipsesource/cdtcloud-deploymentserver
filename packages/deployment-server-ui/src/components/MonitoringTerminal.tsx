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

import React, { CSSProperties, ReactElement, useEffect, useRef, useState } from 'react'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import type { DeployStatus } from 'deployment-server'
import { useMonitorFunction } from '../services/MonitoringService'

import './xterm.css'

interface Props {
  deploymentId: string
  deviceName: string
  deployStatus: keyof typeof DeployStatus
  style?: CSSProperties
  className?: string
}

const MonitoringTerminal = (props: Props): ReactElement => {
  const [created, setCreated] = useState<boolean>(false)
  const terminalDivRef = useRef<HTMLDivElement | null>(null)
  const terminalRef = useRef<Terminal>()
  const { open, subscribe } = useMonitorFunction(props.deploymentId, props.deployStatus)
  const fitAddon = new FitAddon()
  const prefix = `\u001b[1;31mMonitor\u001b[1;33m@\u001b[1;36m${props.deviceName}\u001b[1;33m$\u001b[0m `

  useEffect(() => {
    const term = (terminalRef.current = new Terminal({
      fontFamily: '\'Fira Mono\', monospace',
      fontSize: 14,
      convertEol: true,
      disableStdin: true,
      rendererType: 'dom',
      cursorBlink: false,
      theme: {
        background: 'black',
        foreground: 'white',
        cursor: undefined
      }
    }))

    // Handle EOL events
    term.onLineFeed(() => {
      // Add prefix to new line
      term.write(prefix)
    })

    terminalRef.current.loadAddon(fitAddon)

    if (terminalDivRef.current !== null) {
      terminalRef.current.open(terminalDivRef.current)
    } else {
      throw Error('terminalDivRef.current is null')
    }

    fitAddon.fit()

    setCreated(true)

    return () => {
      if (terminalRef.current != null) {
        terminalRef.current.dispose()
      }
    }
  }, [])

  useEffect(() => {
    if (created && terminalRef.current != null) {
      terminalRef.current.clear()
      terminalRef.current.writeln(`${prefix}Start Monitoring`)
    }
  }, [props.deploymentId, created])

  useEffect(() => {
    if (open && created) {
      subscribe((message: MessageEvent) => {
        const data = typeof message.data === 'string' ? message.data.trim() : new Uint8Array(message.data)

        if (data != null && data !== '' && data.length !== 0) {
          if (data === 'Deployment SUCCESS') {
            terminalRef.current?.write(data)
          } else {
            terminalRef.current?.writeln(data)
          }
        }
      })
    }
  }, [open, created])

  return (
    <div style={props.style} className={props.className}>
      <div ref={terminalDivRef} id={`xterm-${props.deploymentId}`}/>
    </div>
  )
}

export default MonitoringTerminal
