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

import { ConnectedDevice } from './device'
import { DeviceStatus } from '../util/common'

export const ConnectedDevices = {
  store: new Array<ConnectedDevice>(),

  get (id: string): ConnectedDevice {
    const device = this.store.find((item) => item.id === id)

    if (device == null) {
      throw new Error(`No connected Device with id ${id} registered`)
    }

    return device
  },

  has (device: ConnectedDevice): boolean {
    return this.store.includes(device)
  },

  onPort (portAddress: string, protocol: string = 'serial'): ConnectedDevice {
    const device = this.store.find((item) => item.port.address === portAddress && item.port.protocol === protocol)

    if (device == null) {
      throw new Error(`No connected Device on port ${portAddress} (${protocol}) registered`)
    }

    return device
  },

  findAvailable (typeId: string): ConnectedDevice {
    const device = this.store.find((item) => item.deviceTypeId === typeId && item.status === DeviceStatus.AVAILABLE)

    if (device == null) {
      throw new Error(`No available Device of type ${typeId} found`)
    }

    return device
  },

  isPortUsed (portAddress: string, protocol: string = 'serial'): boolean {
    try {
      const device = this.onPort(portAddress, protocol)
      return device != null
    } catch {
      return false
    }
  },

  add (device: ConnectedDevice): void {
    this.store.push(device)
  },

  remove (device: ConnectedDevice): void {
    this.store = this.store.filter((item) => item !== device)
  }
}
