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
import type { DeviceType } from 'deployment-server'
import { sendNewDeviceTypeRequest } from '../deployment-server/service'
import { DeviceTypes } from './store'
import { logger } from '../util/logger'

export type FQBN = string

export const getRemoteDeviceType = async (fqbn: FQBN, name: string): Promise<DeviceType> => {
  await DeviceTypes.update()
  let deviceType: DeviceType

  try {
    deviceType = DeviceTypes.getByFQBN(fqbn)
  } catch (e) {
    logger.warn(e)
    deviceType = await registerNewDeviceType(fqbn, name)
  }

  return deviceType
}

export const getDeviceTypeId = async (fqbn: FQBN, name: string): Promise<string> => {
  let deviceType: DeviceType

  try {
    deviceType = await DeviceTypes.getByFQBN(fqbn)
  } catch (e) {
    logger.trace(e)
    deviceType = await getRemoteDeviceType(fqbn, name)
  }

  return deviceType.id
}

export const registerNewDeviceType = async (fqbn: FQBN, name: string): Promise<DeviceType> => {
  logger.info(`Trying to register new DeviceType ${name} with fqbn ${fqbn}`)
  return await sendNewDeviceTypeRequest(fqbn, name)
}
