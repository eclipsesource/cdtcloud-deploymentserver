import type { DeviceType } from '@prisma/client'
import { sendNewDeviceTypeRequest } from '../deployment-server/service'
import { DeviceTypes } from './store'
import logger from '../util/logger'

export type FQBN = string

export const getRemoteDeviceType = async (fqbn: FQBN, name: string): Promise<DeviceType> => {
  await DeviceTypes.update()
  let deviceType = DeviceTypes.withFQBN(fqbn)

  if (deviceType == null) {
    logger.warn(`DeviceType with fqbn ${fqbn} not found.`)
    deviceType = await registerNewDeviceType(fqbn, name)
  }

  return deviceType
}

export const getDeviceTypeId = async (fqbn: FQBN, name: string): Promise<string> => {
  let deviceType = await DeviceTypes.withFQBN(fqbn)

  if (deviceType == null) {
    deviceType = await getRemoteDeviceType(fqbn, name)
  }

  return deviceType.id
}

export const registerNewDeviceType = async (fqbn: FQBN, name: string): Promise<DeviceType> => {
  try {
    logger.info(`Trying to register new DeviceType ${name} with fqbn ${fqbn}`)
    return await sendNewDeviceTypeRequest(fqbn, name)
  } catch (e) {
    logger.error(e)
    throw e
  }
}
