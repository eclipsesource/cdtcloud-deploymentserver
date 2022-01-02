import { Port__Output as Port } from 'arduino-cli_proto_ts/common/cc/arduino/cli/commands/v1/Port'
import {
  DeviceResponse,
  fetchAllDeviceTypes,
  fetchDeviceType,
  sendNewDeviceRequest,
  sendNewDeviceTypeRequest, setDeviceRequest
} from '../deployment-server/service'
import logger from '../util/logger'
import { DeviceStatus } from '../util/common'
import { connectorId } from '../deployment-server/connection'

export type FQBN = string

export interface Device {
  id: string
  status: keyof typeof DeviceStatus
  deviceTypeId: string
  port: Port
}

export interface DeviceType {
  id: string
  name: string
  fqbn: FQBN
}

let storedDevices: Device[] = []

export const getFQBN = async (typeId: string): Promise<FQBN> => {
  const deviceType = await fetchDeviceType(typeId)

  return deviceType.fqbn
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

export const registerNewDevice = async (fqbn: FQBN, name: string): Promise<DeviceResponse> => {
  const typeId = await getDeviceTypeId(fqbn, name)

  try {
    return await sendNewDeviceRequest(typeId)
  } catch (e) {
    console.log(e)
    throw e
  }
}

export const updateDeviceStatus = async (device: Device, status: DeviceStatus): Promise<void> => {
  const id = device.id
  const typeId = device.deviceTypeId

  const data = {
    typeId,
    connectorId,
    status
  }

  await setDeviceRequest(id, data)
}

export const getAttachedDeviceOnPort = async (portAddress: string, protocol: string = 'serial'): Promise<Device | undefined> => {
  return storedDevices.find((device) => device.port.address === portAddress && device.port.protocol === protocol)
}

export const getStoredDevice = async (id: string): Promise<Device | undefined> => {
  return storedDevices.find((devI) => devI.id === id)
}
