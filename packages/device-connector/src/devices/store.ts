import { ConnectedDevice } from './device'
import { DeviceStatus } from '../util/common'

export const ConnectedDevices = {
  store: new Array<ConnectedDevice>(),

  get (id: string): ConnectedDevice {
    const device = this.store.find((item) => item.id === id)

    if (device == null) {
      throw new Error(`No connected Device with id ${id} registered`)
    }

    return device
  },

  has (device: ConnectedDevice): boolean {
    return this.store.includes(device)
  },

  onPort (portAddress: string, protocol: string = 'serial'): ConnectedDevice | undefined {
    return this.store.find((item) => item.port.address === portAddress && item.port.protocol === protocol)
  },

  findAvailable (typeId: string): ConnectedDevice | undefined {
    return this.store.find((item) => item.deviceTypeId === typeId && item.status === DeviceStatus.AVAILABLE)
  },

  add (device: ConnectedDevice): void {
    this.store.push(device)
  },

  remove (device: ConnectedDevice): void {
    this.store = this.store.filter((item) => item !== device)
  }
}
