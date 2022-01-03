import { MonitorResponse } from 'arduino-cli_proto_ts/common/cc/arduino/cli/commands/v1/MonitorResponse'
import logger from '../util/logger'
import { Device, updateDeviceStatus } from './service'
import { RPCClient } from '../arduino-cli/client'
import { DeviceStatus } from '../util/common'

const monitorCallback = (monitorResponse: MonitorResponse): void => {
  const { error, rx_data: data } = monitorResponse
  if (error !== undefined && error !== '') {
    logger.error(error)
  }

  if (data === undefined) {
    return
  }

  process.stdout.write(data)
}

export const monitorDevice = async (client: RPCClient, device: Device): Promise<void> => {
  const monitorStream = await client.monitor(device.port)
  monitorStream.on('data', monitorCallback)
  await updateDeviceStatus(device, DeviceStatus.RUNNING)
}
