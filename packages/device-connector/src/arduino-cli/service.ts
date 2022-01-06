import { RPCClient } from './client'

export const connectCli = async (): Promise<RPCClient> => {
  const client = await new RPCClient()
  await client.init()
  await client.createInstance()
  await client.initInstance()
  await client.boardListWatch()

  return client
}
