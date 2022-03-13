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
import type { DeviceType } from '@prisma/client'
export type TypeStatus = SimpleTypeStatus | QueueableTypeStatus

export enum DeviceTypeStatus {
  AVAILABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE',
  BUSY = 'BUSY',
  QUEUEABLE = 'QUEUEABLE'
}

export interface SimpleTypeStatus {
  status: DeviceTypeStatus.AVAILABLE | DeviceTypeStatus.UNAVAILABLE | DeviceTypeStatus.BUSY
}

export interface QueueableTypeStatus {
  status: DeviceTypeStatus.QUEUEABLE
  queueLength: number
}

export interface DeviceTypeWithCount extends DeviceType {
  numberOfDevices: number
}

export interface DeviceTypeResource extends DeviceTypeWithCount {
  status: DeviceTypeStatus
  queueLength?: number
  history: Record<string, {
    issueCount: number
    deploymentCount: {
      SUCCESS: number
      FAILED: number
      TERMINATED: number
    }
  }>

}

export type { DeviceType }
