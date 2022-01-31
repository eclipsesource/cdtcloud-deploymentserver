import React, { CSSProperties, useEffect, useState } from "react"
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import type { DeployStatus } from "deployment-server"
import { useMonitor } from "../services/MonitoringService"

import "./xterm.css";

interface Props {
  deploymentId: string,
  deviceName: string,
  deployStatus: keyof typeof DeployStatus,
  style?: CSSProperties,
  className?: string
}

const MonitoringTerminal = (props: Props) => {
  const [terminalElement, setTerminalElement] = useState<JSX.Element>()
  const [terminal, setTerminal] = useState<Terminal>()
  const [created, setCreated] = useState<boolean>(false)
  const fitAddon = new FitAddon()
  const prefix = `\u001b[1;31mMonitor\u001b[1;33m\@\u001b[1;36m${props.deviceName}\u001b[1;33m\$\u001b[0m `

  useEffect(() => {
    // Object to avoid clones of sockets
    let newTerminal = { term: null } as { term: Terminal | null }
    if (terminal == null) {
      const term = new Terminal({
        fontFamily: `'Fira Mono', monospace`,
        fontSize: 14,
        convertEol: true,
        disableStdin: true,
        rendererType: "dom",
        cursorBlink: false,
        theme: {
          background: "black",
          foreground: "white",
          cursor: undefined
        }
      })

      // Handle EOL events
      term.onLineFeed((() => {
        // Add prefix to new line
        term.write(prefix)
      }))

      setTerminal(term)
      newTerminal.term = term

      setCreated(true)
    }
  }, [])

  useEffect(() => {
    setTerminalElement(<div id={`xterm-${props.deploymentId}`} style={props.style} className={props.className}/>)

    return () => {
      setTerminalElement(undefined)
    }
  }, [])

  useEffect(() => {
    if (terminal != null && terminalElement != null) {
    const parent = document.getElementById(`xterm-${props.deploymentId}`)
      if (parent != null) {
        terminal.loadAddon(fitAddon)
        terminal.open(parent)
        fitAddon.fit()
      }
    }
  }, [created, terminalElement])

  useEffect(() => {
    if (terminal != null) {
      terminal.clear()
      terminal.writeln(`${prefix}Start Monitoring`)
    }
  }, [props.deploymentId, created])

  const { open, subscribe } = useMonitor(props.deploymentId, props.deployStatus)

  useEffect(() => {
    if (open && created) {
      subscribe((message) => {
        const data = typeof message.data === 'string' ? message.data.trim() : new Uint8Array(message.data)

        if (data != null && data !== "" && data.length != 0) {
          terminal?.writeln(data);
        }
      })
    }
  }, [open, created])

  return (
    <div style={{height: "100%", width: "100%"}}>
      {terminalElement}
    </div>
  )
}

export default MonitoringTerminal
