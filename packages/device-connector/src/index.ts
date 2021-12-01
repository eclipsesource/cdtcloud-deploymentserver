import { RPCClient } from './cli-rpc/client'
import { openStream } from './deployment-server/connection'

const client = await new RPCClient()
await client.init()
await client.createInstance()
await client.initInstance()

const socket = await openStream()

socket.onmessage = (e) => {
  const message = typeof e.data === 'string' ? JSON.parse(e.data) : e.data
  if (message.type === 'deploy') {
    client.uploadBin(message.deviceType, message.port, message.artifactUri)
      .then(() => console.log('success'))
      .catch((err) => console.log(err))
  }
}

await client.boardListWatch()
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
