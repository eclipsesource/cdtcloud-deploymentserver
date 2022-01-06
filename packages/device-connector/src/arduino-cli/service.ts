import { GRPCClient } from './client'

export const buildCli = async (): Promise<GRPCClient> => {
  const client = await new GRPCClient()
  await client.init()
  await client.createInstance()
  await client.initInstance()
  await client.boardListWatch()

  return client
}
