import type { DeviceType } from 'deployment-server'
import { sendNewDeviceTypeRequest } from '../deployment-server/service'
import { DeviceTypes } from './store'
import { logger } from '../util/logger'

export type FQBN = string

export const getRemoteDeviceType = async (fqbn: FQBN, name: string): Promise<DeviceType> => {
  await DeviceTypes.update()
  let deviceType: DeviceType

  try {
    deviceType = DeviceTypes.getByFQBN(fqbn)
  } catch (e) {
    logger.warn(e)
    deviceType = await registerNewDeviceType(fqbn, name)
  }

  return deviceType
}

export const getDeviceTypeId = async (fqbn: FQBN, name: string): Promise<string> => {
  let deviceType: DeviceType

  try {
    deviceType = await DeviceTypes.getByFQBN(fqbn)
  } catch (e) {
    logger.trace(e)
    deviceType = await getRemoteDeviceType(fqbn, name)
  }

  return deviceType.id
}

export const registerNewDeviceType = async (fqbn: FQBN, name: string): Promise<DeviceType> => {
  logger.info(`Trying to register new DeviceType ${name} with fqbn ${fqbn}`)
  return await sendNewDeviceTypeRequest(fqbn, name)
}
