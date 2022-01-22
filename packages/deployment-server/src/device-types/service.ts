import { DeviceType, DeviceTypeResource, DeviceTypeStatus, DeviceTypeWithCount, TypeStatus } from '.'
import { getAvailableDevice, getLeastLoadedDevice, isDeployable } from '../devices/service'

export function withCount <T extends DeviceType & {_count: {devices: number}}> (deviceType: T): Omit<T, '_count'> & {numberOfDevices: number} {
  const numberOfDevices = deviceType._count.devices
  delete (deviceType as Partial<{_count: unknown}>)._count

  return {
    ...deviceType,
    numberOfDevices
  }
}

export async function determineStatus (deviceType: DeviceTypeWithCount): Promise<TypeStatus> {
  if (deviceType.numberOfDevices === 0) {
    return { status: DeviceTypeStatus.UNAVAILABLE }
  }

  const availableDevice = await getAvailableDevice(deviceType.id)
  if (availableDevice != null) {
    return { status: DeviceTypeStatus.AVAILABLE }
  }

  const [leastLoadedDevice, queueLength] = await getLeastLoadedDevice(deviceType.id)
  if (leastLoadedDevice != null && await isDeployable(leastLoadedDevice)) {
    return { status: DeviceTypeStatus.QUEUEABLE, queueLength }
  }

  return { status: DeviceTypeStatus.BUSY }
}

export async function toJSON (deviceType: DeviceType & {_count: {devices: number}}): Promise<DeviceTypeResource> {
  const deviceWithCount = withCount(deviceType)
  const status = await determineStatus(deviceWithCount)

  return {
    ...deviceWithCount,
    ...status
  }
}
