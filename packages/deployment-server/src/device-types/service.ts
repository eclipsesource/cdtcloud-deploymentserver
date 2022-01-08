import { DeviceType, DeviceTypeWithCount } from '.'

export function withCount (deviceType: DeviceType & {_count: {devices: number}}): DeviceTypeWithCount {
  const numberOfDevices = deviceType._count.devices
  delete (deviceType as Partial<{_count: unknown}>)._count

  return {
    ...deviceType,
    numberOfDevices
  }
}
