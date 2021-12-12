import { RPCClient } from './client'
import { setDevices } from '../devices/service'

export const connectCli = async (): Promise<RPCClient> => {
  const client = await new RPCClient()
  await client.init()
  await client.createInstance()
  await client.initInstance()

  return client
}

export const registerDevices = async (client: RPCClient): Promise<void> => {
  await client.boardListWatch()
  const devices = client.getDevices()

  setDevices(devices)
}