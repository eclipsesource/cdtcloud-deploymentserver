import { Port } from 'arduino-cli_proto_ts/common/cc/arduino/cli/commands/v1/Port'
import { RPCClient } from '../cli-rpc/client'
import { fetchAllDeviceTypes } from '../deployment-server/service'
import { downloadArtifact } from './deployment'

export interface Device {
  name: string
  fqbn: string
  port: Port
}

interface DeviceType {
  id: string
  name: string
  fqbn: string
}

let storedDevices: Device[] = []

export const getFQBN = async (typeId: string): Promise<string> => {
  let allDeviceTypes: DeviceType[]
  try {
    allDeviceTypes = await fetchAllDeviceTypes()
  } catch (e) {
    console.log(e)
    throw e
  }

  return await new Promise((resolve, reject) => {
    const deviceType = allDeviceTypes.find((device) => device.id === typeId)
    if (deviceType == null) {
      return reject(new Error(`No fqbn of typeId ${typeId} found`))
    }

    return resolve(deviceType.fqbn)
  })
}

export const getPortForDevice = async (deviceId: string): Promise<Port> => {
  const myBoard = storedDevices[0]
  return myBoard.port
}

export const setDevices = (devices: Device[]): void => {
  storedDevices = devices
}

export const deployBinary = async (resp: any, client: RPCClient): Promise<void> => {
  const type = resp.type
  const data = resp.data
  if (type === 'deploy') {
    const fqbn = await getFQBN(data.device.deviceTypeId)
    const port = await getPortForDevice(data.device.id)
    const artifactPath = await downloadArtifact(data.artifactUri)
    const uploaded = await client.uploadBin(fqbn, port, artifactPath)
    if (uploaded) {
      const monitorStream = await client.monitor(port)
      monitorStream.on('data', ({ _, error, rx_data: data }) => {
        if (error !== undefined) {
          console.log(error)
        }

        process.stdout.write(data)
      })
      await setTimeout(() => {
        console.log('Closing Monitor Stream')
        monitorStream.end()
      }, 3000)
    }
  }
}
