"use strict";
exports.__esModule = true;
var client_1 = require("./cli-rpc/client");
var connection_1 = require("./deployment-server/connection");
var service_1 = require("./devices/service");
var client = await new client_1.RPCClient();
await client.init();
await client.createInstance();
await client.initInstance();
await client.boardListWatch();
var ourDevices = await client.getDevices();
(0, service_1.setDevices)(ourDevices);
var socket = await (0, connection_1.openStream)();
socket.onmessage = function (e) {
    var data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
    (0, service_1.deployBinary)(data, client).then(function () {
        console.log('done');
    })["catch"](function (e) {
        console.log(e);
    });
};
/*
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
  interface TestDeviceType {
    id: string
    name: string
    fqbn: string
  }

  const newArduinoMegaType = await sendNewDeviceTypeRequest('arduino:avr:mega', 'Arduino Mega or Mega 2560')
  const newArduinoDueType = await sendNewDeviceTypeRequest('arduino:sam:arduino_due_x_dbg', 'Arduino Due (Programming Port)')
  console.log(newArduinoMegaType)
  console.log(newArduinoDueType)

  const allDeviceTypes: TestDeviceType[] = await fetchAllDeviceTypes()
  const arduinoUnoType = allDeviceTypes.find((device) => device.fqbn === 'arduino:avr:uno')
  const arduinoMegaType = allDeviceTypes.find((device) => device.fqbn === 'arduino:avr:mega')
  const arduinoDueType = allDeviceTypes.find((device) => device.fqbn === 'arduino:sam:arduino_due_x_dbg')
  console.log(arduinoUnoType)
  console.log(arduinoMegaType)
  console.log(arduinoDueType)

  if (arduinoDueType?.id !== undefined) {
    const registerDue = await sendNewDeviceRequest(arduinoDueType.id)
    console.log(registerDue)
  }
} catch (e) {
  console.log(e)
}
 */
