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
import { fetchAllDeviceTypes } from '../deployment-server/service'
import { FQBN } from './service'
import { logger } from '../util/logger'

export const DeviceTypes = {
  store: new Array<DeviceType>(),

  getByFQBN (fqbn: FQBN): DeviceType {
    const devType = this.store.find((item) => item.fqbn === fqbn)

    if (devType == null) {
      throw new Error(`No DeviceType with fqbn ${fqbn} found locally`)
    }

    return devType
  },

  getById (typeId: string): DeviceType {
    const devType = this.store.find((item) => item.id === typeId)

    if (devType == null) {
      throw new Error(`No DeviceType with id ${typeId} found locally`)
    }

    return devType
  },

  add (deviceType: DeviceType): void {
    this.store.push(deviceType)
  },

  remove (deviceType: DeviceType): void {
    this.store = this.store.filter((item) => item !== deviceType)
  },

  async update (): Promise<void> {
    try {
      this.store = await fetchAllDeviceTypes()
    } catch (e) {
      logger.warn(e)
    }
  },

  get (): DeviceType[] {
    return this.store
  },

  has (deviceType: DeviceType): boolean {
    return this.store.includes(deviceType)
  }
}
