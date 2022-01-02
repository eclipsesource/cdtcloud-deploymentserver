import { Port__Output as Port } from 'arduino-cli_proto_ts/common/cc/arduino/cli/commands/v1/Port'
import {
  deleteDeviceRequest,
  DeviceResponse,
  fetchAllDeviceTypes,
  fetchDeviceType,
  sendNewDeviceRequest,
  sendNewDeviceTypeRequest,
  setDeviceRequest
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
let deviceTypes: DeviceType[] = []

export const updateDeviceTypes = async (): Promise<void> => {
  try {
    deviceTypes = await fetchAllDeviceTypes()
  } catch (e) {
    console.log(e)
    throw e
  }
}

export const getFQBN = async (typeId: string): Promise<FQBN> => {
  let deviceType = await getStoredDeviceTypeById(typeId)

  if (deviceType == null) {
    deviceType = await fetchDeviceType(typeId)
    deviceTypes.push(deviceType)
  }

  return deviceType.fqbn
}

export const getDeviceTypeId = async (fqbn: FQBN, name: string): Promise<string> => {
  let deviceType = await getStoredDeviceTypeByFQBN(fqbn)

  if (deviceType == null) {
    deviceType = await getRemoteDeviceType(fqbn, name)
  }

  return deviceType.id
}

export const getStoredDeviceTypeByFQBN = async (fqbn: FQBN): Promise<DeviceType | undefined> => {
  return deviceTypes.find((deviceType) => deviceType.fqbn === fqbn)
}

export const getStoredDeviceTypeById = async (typeId: string): Promise<DeviceType | undefined> => {
  return deviceTypes.find((deviceType) => deviceType.id === typeId)
}

export const mapDeviceToType = async (device: Device): Promise<DeviceType> => {
  const typeId = device.deviceTypeId
  let deviceType = deviceTypes.find((devI) => devI.id === typeId)

  if (deviceType == null) {
    deviceType = await fetchDeviceType(typeId)
    deviceTypes.push(deviceType)
  }

  return deviceType
}

export const getRemoteDeviceType = async (fqbn: FQBN, name: string): Promise<DeviceType> => {
  await updateDeviceTypes()
  let deviceType = await getStoredDeviceTypeByFQBN(fqbn)

  if (deviceType == null) {
    logger.warn(`DeviceType with fqbn ${fqbn} not found.`)
    deviceType = await registerNewDeviceType(fqbn, name)
  }

  return deviceType
}

export const registerNewDeviceType = async (fqbn: FQBN, name: string): Promise<DeviceType> => {
  try {
    logger.info(`Trying to register new DeviceType ${name} with fqbn ${fqbn}`)
    return await sendNewDeviceTypeRequest(fqbn, name)
  } catch (e) {
    console.log(e)
    throw e
  }
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

export const deregisterDevice = async (id: string) => {
  logger.info(`Deregistering Device with id ${id}`)
  await deleteDeviceRequest(id)
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

export const findAvailableByType = async (typeId: string) => {
  return storedDevices.find((device) => device.deviceTypeId === typeId && device.status === DeviceStatus.AVAILABLE)
}
