import React, { CSSProperties, useEffect, useRef, useState } from 'react'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import type { DeployStatus } from 'deployment-server'
import { useMonitor } from '../services/MonitoringService'

import './xterm.css'

interface Props {
  deploymentId: string,
  deviceName: string,
  deployStatus: keyof typeof DeployStatus,
  style?: CSSProperties,
  className?: string
}

const MonitoringTerminal = (props: Props) => {
  const [created, setCreated] = useState<boolean>(false)
  const terminalDivRef = useRef<HTMLDivElement | null>(null)
  const terminalRef = useRef<Terminal>()
  const { open, subscribe } = useMonitor(props.deploymentId, props.deployStatus)
  const fitAddon = new FitAddon()
  const prefix = `\u001b[1;31mMonitor\u001b[1;33m\@\u001b[1;36m${props.deviceName}\u001b[1;33m\$\u001b[0m `

  useEffect(() => {
    const term = (terminalRef.current = new Terminal({
      fontFamily: `'Fira Mono', monospace`,
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
    term.onLineFeed((() => {
      // Add prefix to new line
      term.write(prefix)
    }))

    terminalRef.current.loadAddon(fitAddon)
    terminalRef.current.open(terminalDivRef.current!)
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
      subscribe((message) => {
        const data = typeof message.data === 'string' ? message.data.trim() : new Uint8Array(message.data)

        if (data != null && data !== '' && data.length != 0) {
          terminalRef.current?.writeln(data)
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
