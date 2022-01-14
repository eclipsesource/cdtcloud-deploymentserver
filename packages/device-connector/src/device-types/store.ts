import type { DeviceType } from '@prisma/client'
import { fetchAllDeviceTypes } from '../deployment-server/service'
import { FQBN } from './service'
import { logger } from '../util/logger'

export const DeviceTypes = {
  store: new Array<DeviceType>(),

  getByFQBN (fqbn: FQBN): DeviceType {
    const devType = this.store.find((item) => item.fqbn === fqbn)

    if (devType == null) {
      throw new Error(`No DeviceType with fqbn ${fqbn} found locally`)
    }

    return devType
  },

  getById (typeId: string): DeviceType {
    const devType = this.store.find((item) => item.id === typeId)

    if (devType == null) {
      throw new Error(`No DeviceType with id ${typeId} found locally`)
    }

    return devType
  },

  add (deviceType: DeviceType): void {
    this.store.push(deviceType)
  },

  remove (deviceType: DeviceType): void {
    this.store = this.store.filter((item) => item !== deviceType)
  },

  async update (): Promise<void> {
    try {
      this.store = await fetchAllDeviceTypes()
    } catch (e) {
      logger.warn(e)
    }
  },

  get (): DeviceType[] {
    return this.store
  },

  has (deviceType: DeviceType): boolean {
    return this.store.includes(deviceType)
  }
}
