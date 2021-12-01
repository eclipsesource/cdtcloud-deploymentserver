import { env } from 'process'
import WebSocket from 'ws'
import { RPCClient } from './cli-rpc/client'

const client = await new RPCClient()
await client.init()
await client.createInstance()
await client.initInstance()

/* TODO
const registrationResponse = await fetch('http://localhost:3001/connectors', {
  method: 'POST'
})

const { id } = await registrationResponse.json() as any;
 */
const address = env.SERVER_URI != null ? env.SERVER_URI : '127.0.0.1:3001'
const id = 'd6ab2191-0366-4d6d-9943-d2c50ad4f924'
const url = `ws://${address}/connectors/${id}/queue`
const socket = new WebSocket(url)

socket.onopen = () => {
  console.log(`Connected to ${address}`)
  socket.send('Hello')
}

socket.onerror = (error) => {
  console.log(`WebSocket error: ${error.message}`)
}

socket.onmessage = (e) => {
  const message = typeof e.data === 'string' ? JSON.parse(e.data) : e.data
  switch (message.type) {
    case 'deploy':
      client.uploadBin(message.deviceType, message.port, message.artifactUri)
        .then(() => console.log('success'))
        .catch((err) => console.log(err))
      break
    default:
      break
  }
}

/*
await client.listAllBoards();
const boards = await client.listBoards();
if (boards) {
  const myBoard = boards[0];
  if (myBoard && myBoard.matching_boards) {
    const fqbn = myBoard.matching_boards[0].fqbn;
    const port = myBoard.port;
    if (fqbn && port) {
      const upload = await client.uploadBin(fqbn, port, "./tests/tests.bin");
      console.log(upload ? "success" : "failed");
    }
  }
}
*/
