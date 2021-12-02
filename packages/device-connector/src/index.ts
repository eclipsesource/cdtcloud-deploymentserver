import { RPCClient } from './cli-rpc/client'
import { connectorId, openStream } from './deployment-server/connection'
import { fetchAllDeviceTypes, sendNewDeviceRequest, sendNewDeviceTypeRequest } from './deployment-server/service'
import { downloadArtifact } from './devices/deployment'
import { Device } from './devices/service'

const client = await new RPCClient()
await client.init()
await client.createInstance()
await client.initInstance()

const socket = await openStream()

socket.onmessage = (e) => async () => {
  const message = typeof e.data === 'string' ? JSON.parse(e.data) : e.data
  if (message.type === 'deploy') {
    const artifactPath = await downloadArtifact(message.artifactUri)
    const uploaded = await client.uploadBin(message.deviceType, message.port, artifactPath)
    if (uploaded) {
      const monitorStream = await client.monitor(message.port)
      setInterval(() => {
        console.log('Closing Monitor Stream')
        monitorStream.end()
      }, 3000)
    }
  }
}

await client.boardListWatch()

const boards = client.getDevices()
if (boards.length > 0) {
  const myBoard = boards[0]
  if (myBoard !== undefined) {
    try {
      const artifactPath = await downloadArtifact('https://sanctum-dev.com/tests.bin')
      const upload = await client.uploadBin(myBoard.fqbn, myBoard.port, artifactPath)
      socket.send(JSON.stringify({ type: 'upload', success: upload }))
      const monitorStream = await client.monitor(myBoard.port)
      monitorStream.on('data', ({ _, error, rx_data: data }) => {
        if (error !== undefined) {
          console.log(error)
        }
        process.stdout.write(data)
        socket.send(JSON.stringify({ type: 'monitor', data }))
      })
      setTimeout(() => {
        console.log('Closing Monitor Stream')
        monitorStream.end()
      }, 3000)
    } catch (e) {
      socket.send(JSON.stringify({ type: 'upload', error: e }))
      console.log(e)
    }
  }
}

try {
  const newArduinoMegaType = await sendNewDeviceTypeRequest('arduino:avr:mega', 'Arduino Mega or Mega 2560')
  const newArduinoDueType = await sendNewDeviceTypeRequest('arduino:sam:arduino_due_x_dbg', 'Arduino Due (Programming Port)')
  console.log(newArduinoMegaType)
  console.log(newArduinoDueType)

  const allDeviceTypes: Device[] = await fetchAllDeviceTypes()
  const arduinoUnoType = allDeviceTypes.find((device) => device.fqbn === 'arduino:avr:uno')
  const arduinoMegaType = allDeviceTypes.find((device) => device.fqbn === 'arduino:avr:mega')
  const arduinoDueType = allDeviceTypes.find((device) => device.fqbn === 'arduino:sam:arduino_due_x_dbg')
  console.log(arduinoUnoType)
  console.log(arduinoMegaType)
  console.log(arduinoDueType)

  const registerDue = await sendNewDeviceRequest(connectorId, arduinoDueType.id)
  console.log(registerDue)
} catch (e) {
  console.log(e)
}
