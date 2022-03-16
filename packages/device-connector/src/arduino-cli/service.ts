import { GRPCClient } from './client'
import { env } from 'node:process'

const cliIp = env.ARDUINO_CLI_IP ?? '0.0.0.0'
const cliPort = env.ARDUINO_CLI_PORT ?? 50051

export const buildCli = async (): Promise<GRPCClient> => {
  const client = await new GRPCClient(`${cliIp}:${cliPort}`)
  await client.init()
  await client.createInstance()
  await client.initInstance()
  await client.boardListWatch()

  return client
}
