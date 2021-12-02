import { env } from 'process'
import { fetch } from 'undici'
import { connectorId } from './connection'

export const sendNewDeviceTypeRequest = async (fqbn: string, name: string) => {
  const address = env.SERVER_URI != null ? env.SERVER_URI : '127.0.0.1:3001'
  const url = `http://${address}/device-types`

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

  return await resp.json()
}

export const sendNewDeviceRequest = async (typeId: string) => {
  const address = env.SERVER_URI != null ? env.SERVER_URI : '127.0.0.1:3001'
  const url = `http://${address}/devices`

  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      typeId,
      connectorId
    })
  })

  return await resp.json()
}

export const setDeviceRequest = async (typeId: string) => {
  const address = env.SERVER_URI != null ? env.SERVER_URI : '127.0.0.1:3001'
  const url = `http://${address}/devices/${typeId}`

  const resp = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      typeId,
      connectorId
    })
  })

  return await resp.json()
}

export const fetchAllDeviceTypes = async () => {
  const address = env.SERVER_URI != null ? env.SERVER_URI : '127.0.0.1:3001'
  const url = `http://${address}/device-types`

  const resp = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return await resp.json()
}

export const fetchDeviceType = async (typeId: string) => {
  const address = env.SERVER_URI != null ? env.SERVER_URI : '127.0.0.1:3001'
  const url = `http://${address}/device-types/${typeId}`

  const resp = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return await resp.json()
}

export const deleteDeviceRequest = async (deviceId: string) => {
  const address = env.SERVER_URI != null ? env.SERVER_URI : '127.0.0.1:3001'
  const url = `http://${address}/devices/${deviceId}`

  const resp = await fetch(url, {
    method: 'DELETE'
  })

  return await resp.json()
}
