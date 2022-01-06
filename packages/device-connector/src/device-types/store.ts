import type { DeviceType } from '@prisma/client'
import { fetchAllDeviceTypes } from '../deployment-server/service'
import { FQBN } from './service'
import logger from '../util/logger'

export const DeviceTypes = {
  store: new Array<DeviceType>(),

  withFQBN (fqbn: FQBN): DeviceType | undefined {
    return this.store.find((item) => item.fqbn === fqbn)
  },

  withId (typeId: string): DeviceType | undefined {
    return this.store.find((item) => item.id === typeId)
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
