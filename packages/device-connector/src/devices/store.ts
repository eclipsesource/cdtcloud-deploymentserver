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

  onPort (portAddress: string, protocol: string = 'serial'): ConnectedDevice {
    const device = this.store.find((item) => item.port.address === portAddress && item.port.protocol === protocol)

    if (device == null) {
      throw new Error(`No connected Device on port ${portAddress} (${protocol}) registered`)
    }

    return device
  },

  findAvailable (typeId: string): ConnectedDevice {
    const device = this.store.find((item) => item.deviceTypeId === typeId && item.status === DeviceStatus.AVAILABLE)

    if (device == null) {
      throw new Error(`No available Device of type ${typeId} found`)
    }

    return device
  },

  isPortUsed (portAddress: string, protocol: string = 'serial'): boolean {
    try {
      const device = this.onPort(portAddress, protocol)
      return device != null
    } catch {
      return false
    }
  },

  add (device: ConnectedDevice): void {
    this.store.push(device)
  },

  remove (device: ConnectedDevice): void {
    this.store = this.store.filter((item) => item !== device)
  }
}
