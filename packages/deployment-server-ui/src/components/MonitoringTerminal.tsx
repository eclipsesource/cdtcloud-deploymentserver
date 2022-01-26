import { useEffect, useState } from 'react'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import type { DeployStatus } from 'deployment-server'
import { Modal } from 'antd'

interface Props {
  deploymentId: string
  deviceName: string
  deployStatus: keyof typeof DeployStatus
  open: boolean
}

const createWebsocket = async (route: string): Promise<WebSocket> => {
  const url = `${window.location.protocol === 'https' ? 'wss' : 'ws'}://${window.location.host}${route}`
  return new WebSocket(url)
}

let terminal: Terminal
const fitAddon = new FitAddon()

const MonitoringTerminal = (props: Props): JSX.Element => {
  const [socketOpen, setSocketOpen] = useState<boolean>(false)
  const [terminalOpen, setTerminalOpen] = useState<boolean>(false)
  const [socket, setSocket] = useState<WebSocket>()
  const [reconAttempts, setReconAttempts] = useState<number>(0)

  // TODO: fix
  // const prefix = `${c.red("Monitor")}${c.bgYellow("@")}${c.blueBright("DevieName")}${c.bgYellow("$")} `
  const prefix = `Monitor@${props.deviceName}$`

  useEffect(() => {
    if (props.open) {
      terminal = new Terminal({
        fontFamily: '\'Fira Mono\', monospace',
        fontSize: 15,
        fontWeight: 900,
        theme: {
          background: 'black',
          foreground: '#5eff00'
        }
      })

      terminal.loadAddon(fitAddon)

      terminal.open(document.getElementById('xterm') as HTMLElement)

      setTerminalOpen(true)

      terminal.write(`${prefix} huhu`)

      fitAddon.fit()
    }
  }, [props.open])

  // TODO: temporary hackfix
  useEffect(() => {
    const newSocket: { ws: WebSocket | null } = { ws: null }

    async function openSocket (): Promise<void> {
      const ws = await createWebsocket(`/api/deployments/${props.deploymentId}/stream`)
      ws.onopen = () => setSocketOpen(true)
      ws.onclose = () => {
        if (props.deployStatus === 'RUNNING') {
          setSocketOpen(false)
          setReconAttempts(reconAttempts + 1)
        }
      }
      ws.onmessage = (message: MessageEvent<string>) => {
        const data = message.data.toString().trim()
        if (data != null && data !== '') {
          console.log(message.data.toString())
          terminal.writeln(`${prefix}${message.data.toString()}`)
        }
      }
      ws.onerror = console.error
      setSocket(ws)
      newSocket.ws = ws
    }

    if (terminalOpen && props.deployStatus === 'RUNNING') {
      openSocket().catch(console.log)
    }

    if (props.deployStatus !== 'RUNNING' && socketOpen) {
      socket?.close()
    }

    return () => {
      if (newSocket.ws != null) {
        newSocket.ws.close()
      }
    }
  }, [reconAttempts, terminalOpen, props.deployStatus])

  return (
    <Modal
      title={`${props.deviceName} Monitor`}
      centered
      visible={props.open}
    >
      <div id='xterm' style={{ height: '100%', width: '100%' }} />
    </Modal>
  )
}

export default MonitoringTerminal
