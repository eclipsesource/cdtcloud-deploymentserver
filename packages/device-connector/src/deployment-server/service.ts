/********************************************************************************
    Copyright (c) 2022 EclipseSource and others.

    This program and the accompanying materials are made available under the
    terms of the Eclipse Public License v. 2.0 which is available at
    http://www.eclipse.org/legal/epl-2.0.

    This Source Code may also be made available under the following Secondary
    Licenses when the conditions for such availability set forth in the Eclipse
    Public License v. 2.0 are satisfied: GNU General Public License, version 2
    with the GNU Classpath Exception which is available at
    https://www.gnu.org/software/classpath/license.html.

    SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
********************************************************************************/

import type { DeviceType, Device } from 'deployment-server'
import { DeployStatus, DeviceStatus } from '../util/common'
import { fetch } from 'undici'
import { connectorId, deployUri } from './connection'
import { DeploymentData, DeploymentId } from '../devices/deployment'
import { httpError } from '../util/errors'

export const sendNewDeviceTypeRequest = async (fqbn: string, name: string): Promise<DeviceType> => {
  const resp = await fetch(`${deployUri}/device-types`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      fqbn,
      name
    })
  })

  if (!resp.ok) {
    throw httpError(resp)
  }

  return await resp.json() as DeviceType
}

export const sendNewDeviceRequest = async (typeId: string): Promise<Device> => {
  const resp = await fetch(`${deployUri}/devices`, {
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

  if (!resp.ok) {
    throw httpError(resp)
  }

  return await resp.json() as Device
}

export const setDeviceRequest = async (deviceId: string, status: keyof typeof DeviceStatus): Promise<Device> => {
  const resp = await fetch(`${deployUri}/devices/${deviceId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      status: status
    })
  })

  if (!resp.ok) {
    throw httpError(resp)
  }

  return await resp.json() as Device
}

export const getDeviceRequest = async (deviceId: string): Promise<Device> => {
  const resp = await fetch(`${deployUri}/devices/${deviceId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (!resp.ok) {
    throw httpError(resp)
  }

  return await resp.json() as Device
}

export const fetchAllDeviceTypes = async (): Promise<DeviceType[]> => {
  const resp = await fetch(`${deployUri}/device-types`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (!resp.ok) {
    throw httpError(resp)
  }

  return await resp.json() as DeviceType[]
}

export const fetchDeviceType = async (typeId: string): Promise<DeviceType> => {
  const resp = await fetch(`${deployUri}/device-types/${typeId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (!resp.ok) {
    throw httpError(resp)
  }

  return await resp.json() as DeviceType
}

export const deleteDeviceRequest = async (deviceId: string): Promise<void> => {
  const resp = await fetch(`${deployUri}/devices/${deviceId}`, {
    method: 'DELETE'
  })

  if (!resp.ok) {
    throw httpError(resp)
  }
}

export const setDeployRequest = async (deployId: DeploymentId, status: keyof typeof DeployStatus): Promise<DeploymentData> => {
  const resp = await fetch(`${deployUri}/deployments/${deployId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      status: status
    })
  })

  if (!resp.ok) {
    throw httpError(resp)
  }

  return await resp.json() as DeploymentData
}
