import { RPCClient } from './cli-rpc/client'
import { openStream } from './deployment-server/connection'
import { deployBinary, setDevices } from './devices/service'

const client = await new RPCClient()
await client.init()
await client.createInstance()
await client.initInstance()

const socket = await openStream()

await client.boardListWatch()
const ourDevices = await client.getDevices()
setDevices(ourDevices)

socket.onmessage = (e) => {
  const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data

  deployBinary(data, client).then(() => {
    console.log('done')
  }).catch((e) => {
    console.log(e)
  })
}
