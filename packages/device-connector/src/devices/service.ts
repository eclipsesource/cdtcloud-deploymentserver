import { Port } from 'arduino-cli_proto_ts/common/cc/arduino/cli/commands/v1/Port'
import { RPCClient } from '../cli-rpc/client'
import {
  fetchAllDeviceTypes,
  sendNewDeviceRequest,
  sendNewDeviceTypeRequest
} from '../deployment-server/service'
import logger from '../util/logger'
import { downloadArtifact } from './deployment'

export interface Device {
  id: string
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

export const getDeviceTypeId = async (fqbn: string, name: string): Promise<string> => {
  let allDeviceTypes: DeviceType[]
  try {
    allDeviceTypes = await fetchAllDeviceTypes()
  } catch (e) {
    console.log(e)
    throw e
  }

  let deviceId: string
  const deviceType = allDeviceTypes.find((device) => device.fqbn === fqbn)

  if (deviceType == null) {
    logger.warn(`DeviceType with fqbn ${fqbn} not found.`)
    try {
      logger.info(`Trying to register new DeviceType ${name} with fqbn ${fqbn}`)
      const resp = await sendNewDeviceTypeRequest(fqbn, name)
      deviceId = resp.id
    } catch (e) {
      console.log(e)
      throw e
    }
  } else {
    deviceId = deviceType.id
  }

  return deviceId
}

export const getPortForDevice = async (deviceId: string): Promise<Port> => {
  const device = storedDevices.find((deviceItem) => deviceItem.id === deviceId)
  if (device == null) {
    // const error = new Error(`No Port for device with id ${deviceId} found`)
    // logger.error(error)
    // return Promise.reject(error)
    return storedDevices[0].port
  }

  return device.port
}

export const setDevices = (devices: Device[]): void => {
  storedDevices = devices
}

export const registerNewDevice = async (fqbn: string, name: string): Promise<string> => {
  const typeId = await getDeviceTypeId(fqbn, name)

  try {
    const resp = await sendNewDeviceRequest(typeId)

    return resp.id
  } catch (e) {
    console.log(e)
    throw e
  }
}

export const getAttachedDeviceOnPort = async (portAddress: string, protocol: string = 'serial'): Promise<Device> => {
  const device = storedDevices.find((device) => device.port.address === portAddress && device.port.protocol === protocol)

  return await new Promise((resolve, reject) => {
    if (device == null) {
      const error = new Error(`Device on ${protocol} Port ${portAddress} not attached`)
      return reject(error)
    }

    return resolve(device)
  })
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
        if (error !== '') {
          logger.error(error)
        }

        process.stdout.write(data)
      })
      await setTimeout(() => {
        console.log('Closing Monitor Stream')
        monitorStream.end()
      }, 5000)
    }
  }
}
