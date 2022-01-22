import { Connector, Device, DeviceType, PrismaClient } from '@prisma/client'
import { randomUUID } from 'crypto'
import { registerConnector } from '../../src/connectors/queue'

const randomDeviceTypeData = (): {name: string, fqbn: string} => ({
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
