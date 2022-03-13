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
import { Device } from '@prisma/client'
import { DeployRequest, DeviceType } from '..'

export type RecentDeployment = (DeployRequest & {
  device: Device & {
    type: DeviceType
  }
})

export interface Dashboard {
  recentDeployments: RecentDeployment[]
  deployRequestCount: number
  deviceCount: number
  deploymentOverview: Record<DeployRequest['status'], number>
  deviceOverview: Record<Device['status'], number>
  deploymentsPerBucket: Record<string, number>
  mostUsedDeviceType: string
  averageQueueTime: number
}
