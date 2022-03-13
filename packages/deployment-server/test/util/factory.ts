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
import { Connector, Device, DeviceType, PrismaClient } from '@prisma/client'
import { randomUUID } from 'crypto'
import { registerConnector } from '../../src/connectors/queue'

export const randomDeviceTypeData = (): {name: string, fqbn: string} => ({
  name: 'Test Device Type',
  fqbn: randomUUID()
})

export async function createDeviceType (db: PrismaClient): Promise<DeviceType & {
  _count: {devices: number}
}> {
  return await db.deviceType.create({
    data: randomDeviceTypeData(),
    include: { _count: { select: { devices: true } } }
  })
}

type CreateConnectorDevicesArg = Parameters<PrismaClient['connector']['create']>[0]['data']['devices']

export async function createConnector (
  db: PrismaClient,
  devices?: CreateConnectorDevicesArg
): Promise<Connector> {
  const connector = await db.connector.create({
    data: {
      devices
    }
  })

  registerConnector(connector)

  return connector
}

export async function createDevice (
  db: PrismaClient,
  data: Parameters<PrismaClient['device']['create']>[0]['data'] = {
    connector: {
      create: {}
    },
    type: {
      create: randomDeviceTypeData()
    }
  }
): Promise<Device> {
  return await db.device.create({
    data
  })
}
