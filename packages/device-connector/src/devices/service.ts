import type {
  DetectedPort__Output as DetectedPort
} from 'arduino-cli_proto_ts/common/cc/arduino/cli/commands/v1/DetectedPort'
import type { Device } from 'deployment-server'
import { deleteDeviceRequest, sendNewDeviceRequest, setDeviceRequest } from '../deployment-server/service'
import { FQBN, getDeviceTypeId } from '../device-types/service'
import { ConnectedDevice } from './device'
import { ConnectedDevices } from './store'
import { logger } from '../util/logger'
import { DeviceStatus } from '../util/common'

export const registerNewDevice = async (fqbn: FQBN, name: string): Promise<Device> => {
  const typeId = await getDeviceTypeId(fqbn, name)

  return await sendNewDeviceRequest(typeId)
}

export const unregisterDevice = async (id: string): Promise<void> => {
  logger.info(`Unregistering Device with id ${id}`)

  try {
    await deleteDeviceRequest(id)
  } catch (e) {
    logger.error(e)
  }
}

export const addDevice = async (detectedPort: DetectedPort): Promise<void> => {
  if (detectedPort.port == null) {
    logger.warn('Port not defined')
    return
  }

  if (detectedPort?.matching_boards === undefined || detectedPort.matching_boards.length === 0) {
    logger.debug(`Attached unknown device on port ${detectedPort.port.address} (${detectedPort.port.protocol}) - ignoring`)
    return
  }

  const board = detectedPort.matching_boards[0]
  if (board.fqbn == null) {
    logger.warn('Could not register device: No fqbn found')
    return
  }

  if (ConnectedDevices.isPortUsed(detectedPort.port.address, detectedPort.port.protocol)) {
    logger.warn(`Port ${detectedPort.port.address} (${detectedPort.port.protocol}) already has a device registered - replacing with new device ${board.name}`)
    const existingDevice = ConnectedDevices.onPort(detectedPort.port.address, detectedPort.port.protocol)
    await removeDevice(existingDevice)
  }

  const deviceResponse = await registerNewDevice(board.fqbn, board.name ?? 'Unknown Device Name')

  const device = new ConnectedDevice(deviceResponse.id, deviceResponse.deviceTypeId, detectedPort.port, deviceResponse.status)

  ConnectedDevices.add(device)
  logger.info(`Device attached: ${board.name} on ${device.port.address} (${device.port.protocol})`)
}

export const removeDevice = async (device: ConnectedDevice): Promise<void> => {
  ConnectedDevices.remove(device)

  try {
    await setDeviceRequest(device.id, DeviceStatus.UNAVAILABLE)
  } catch (e) {
    logger.error(e)
  }
}
