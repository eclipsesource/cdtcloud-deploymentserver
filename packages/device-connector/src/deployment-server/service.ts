import { env } from 'process'
import { fetch } from 'undici'
import logger from '../util/logger'
import { Device } from '../devices/service'

export const sendAllDevices = async (devices: Device[]): Promise<void> => {
  const address = env.SERVER_URI != null ? env.SERVER_URI : '127.0.0.1:3001'
  const url = `http://${address}/devices}`

  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(devices)
  })

  if (!resp.ok) {
    logger.error(resp)
  }
}

export const reportNewDevice = async (device: Device, method: string = 'POST'): Promise<void> => {
  const address = env.SERVER_URI != null ? env.SERVER_URI : '127.0.0.1:3001'
  const url = `http://${address}/devices/${device.serialNumber}`

  const resp = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(device)
  })

  if (!resp.ok) {
    logger.error(resp)
  }
}

export const reportRemovedDevice = async (device: Device): Promise<void> => {
  const address = env.SERVER_URI != null ? env.SERVER_URI : '127.0.0.1:3001'
  const url = `http://${address}/devices/${device.serialNumber}`

  const resp = await fetch(url, {
    method: 'DELETE'
  })

  if (!resp.ok) {
    logger.error(resp)
  }
}
