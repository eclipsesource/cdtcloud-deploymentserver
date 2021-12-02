import { RPCClient } from './cli-rpc/client'
import { connectorId, openStream } from './deployment-server/connection'
import { fetchAllDeviceTypes, sendNewDeviceRequest, sendNewDeviceTypeRequest } from './deployment-server/service'
import { downloadArtifact } from './devices/deployment'

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
      }, 3000);
    }
  }
}

await client.boardListWatch()

const boards = client.getDevices()
if (boards) {
  const myBoard = boards[0];
  if (myBoard) {
    try {
      const upload = await client.uploadBin(myBoard.fqbn, myBoard.port, "./tests/tests.bin")
      socket.send(JSON.stringify({type: 'upload', success: upload}))
      const monitorStream = await client.monitor(myBoard.port)
      monitorStream.on('data', ({ error, rx_data }) => {
        if (error) {
          console.log(error)
        }
        process.stdout.write(rx_data)
        socket.send(JSON.stringify({ type: 'monitor', rx_data }))
      })
      setTimeout(() => {
        console.log('Closing Monitor Stream')
        monitorStream.end()
      }, 3000);
    } catch (e) {
      socket.send(JSON.stringify({type: 'upload', error: e}))
      console.log(e)
    }
  }
}
try {
  const newArduinoMegaType = await sendNewDeviceTypeRequest('arduino:avr:mega', 'Arduino Mega or Mega 2560')
  const newArduinoDueType = await sendNewDeviceTypeRequest('arduino:sam:arduino_due_x_dbg', 'Arduino Due (Programming Port)')

  const allDeviceTypes = await fetchAllDeviceTypes()
  const arduinoUnoType = allDeviceTypes.find((device) => device.fqbn === 'arduino:avr:uno')
  const arduinoMegaType = allDeviceTypes.find((device) => device.fqbn === 'arduino:avr:mega')
  const arduinoDueType = allDeviceTypes.find((device) => device.fqbn === 'arduino:sam:arduino_due_x_dbg')

  const registerDue = await sendNewDeviceRequest(connectorId, arduinoDueType.id)
} catch (e) {
  console.log(e)
}
