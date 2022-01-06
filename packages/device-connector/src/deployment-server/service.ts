import { env } from 'process'
import { fetch } from 'undici'
import { connectorId } from './connection'
import { DeviceStatus } from '../util/common'
import { DeviceType } from '../device-types/service'
import { DeploymentData } from '../devices/deployment'
import { Device } from '../devices/device'
import { MonitorData } from '../devices/monitoring'

export interface DeployServRequest {
  type: string
  data: DeploymentData | MonitorData
}

export const sendNewDeviceTypeRequest = async (fqbn: string, name: string): Promise<DeviceType> => {
  const address = env.SERVER_URI != null ? env.SERVER_URI : '127.0.0.1:3001'
  const url = `http://${address}/api/device-types`

  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      fqbn,
      name
    })
  })

  return await resp.json() as DeviceType
}

export const sendNewDeviceRequest = async (typeId: string): Promise<Device> => {
  const address = env.SERVER_URI != null ? env.SERVER_URI : '127.0.0.1:3001'
  const url = `http://${address}/api/devices`

  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      typeId,
      connectorId,
      status: DeviceStatus.AVAILABLE
    })
  })

  return await resp.json() as Device
}

export const setDeviceRequest = async (deviceId: string, status: keyof typeof DeviceStatus): Promise<Device> => {
  const address = env.SERVER_URI != null ? env.SERVER_URI : '127.0.0.1:3001'
  const url = `http://${address}/api/devices/${deviceId}`

  const resp = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      status: status
    })
  })

  return await resp.json() as Device
}

export const fetchAllDeviceTypes = async (): Promise<DeviceType[]> => {
  const address = env.SERVER_URI != null ? env.SERVER_URI : '127.0.0.1:3001'
  const url = `http://${address}/api/device-types`

  const resp = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return await resp.json() as DeviceType[]
}

export const fetchDeviceType = async (typeId: string): Promise<DeviceType> => {
  const address = env.SERVER_URI != null ? env.SERVER_URI : '127.0.0.1:3001'
  const url = `http://${address}/api/device-types/${typeId}`

  const resp = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return await resp.json() as DeviceType
}

export const deleteDeviceRequest = async (deviceId: string): Promise<void> => {
  const address = env.SERVER_URI != null ? env.SERVER_URI : '127.0.0.1:3001'
  const url = `http://${address}/api/devices/${deviceId}`

  await fetch(url, {
    method: 'DELETE'
  })
}
