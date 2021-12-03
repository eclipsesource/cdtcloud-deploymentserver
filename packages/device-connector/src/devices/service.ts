import { Port } from 'arduino-cli_proto_ts/common/cc/arduino/cli/commands/v1/Port'
import { fetchAllDeviceTypes } from '../deployment-server/service'

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
