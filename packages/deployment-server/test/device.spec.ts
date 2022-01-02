/* eslint-disable @typescript-eslint/no-floating-promises */
import prisma, { DeployRequest, Device, PrismaClient } from '@prisma/client'
import type { Server } from 'node:http'
import type { AddressInfo } from 'node:net'
import tap from 'tap'
import { getLeastLoadedDevice } from '../src/devices/service'
import { closeServer, createServer } from '../src/server'
import {
  createConnector,
  createDevice,
  createDeviceType
} from './util/factory'
import { fetch } from './util/fetch'

const { before, teardown, test } = tap
const { DeviceStatus, DeployStatus } = prisma

let baseUrl: string
let address: AddressInfo
let server: Server
let db: PrismaClient

before(async () => {
  [server, , db] = await createServer()
  address = server.address() as AddressInfo
  baseUrl = `http://${address.address}:${address.port}`
})

teardown(async () => {
  try {
    await closeServer.apply({ server, db })
  } catch (e) {
    console.error(e)
    throw e
  }
})

test('Can be added', async (t) => {
  // Create a device connector and device type
  const deviceType = await createDeviceType(db)
  const connector = await createConnector(db)

  // Create a device
  const response = await fetch(`${baseUrl}/devices`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      typeId: deviceType.id,
      connectorId: connector.id,
      status: DeviceStatus.RUNNING
    })
  })

  t.ok(response.ok, 'Response is ok')
  t.match(await response.json(), {
    // uuid
    id: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    deviceTypeId: deviceType.id,
    connectorId: connector.id,
    status: DeviceStatus.RUNNING
  })
})

test('Can be retrieved', async (t) => {
  const device = await createDevice(db)

  const response = await fetch(`${baseUrl}/devices`)

  t.ok(response.ok, 'Response is ok')

  const responseBody = (await response.json()) as Device[]

  const deviceMatch = responseBody.find((d) => d.id === device.id)

  t.ok(deviceMatch)
  t.match(deviceMatch, device)
})

test('Are deleted when the managing connector is deleted', async (t) => {
  let device: Device | null = await createDevice(db)

  await fetch(`${baseUrl}/connectors/${device.connectorId}`, {
    method: 'DELETE'
  })

  device = await db.device.findUnique({
    where: {
      id: device.id
    }
  })

  t.notOk(device)
})

test('Are deleted when the device type is deleted', async (t) => {
  let device: Device | null = await createDevice(db)

  await fetch(`${baseUrl}/device-types/${device.deviceTypeId}`, {
    method: 'DELETE'
  })

  device = await db.device.findUnique({
    where: {
      id: device.id
    }
  })

  t.notOk(device)
})

test('Can be removed', async (t) => {
  const device = await createDevice(db)

  const response = await fetch(`${baseUrl}/devices/${device.id}`, {
    method: 'DELETE'
  })

  t.ok(response.ok, 'Response is not ok')
  t.match(await response.json(), device)
})

test('Removes related deployments', async (t) => {
  const device = await createDevice(db)

  let deployment: DeployRequest | null = await db.deployRequest.create({
    data: {
      artifactUrl: 'https://example.com/artifact.zip',
      device: {
        connect: {
          id: device.id
        }
      },
      status: 'PENDING'
    }
  })

  const response = await fetch(`${baseUrl}/devices/${device.id}`, {
    method: 'DELETE'
  })

  t.ok(response.ok, 'Response is not ok')
  t.match(await response.json(), device)

  deployment = await db.deployRequest.findUnique({
    where: {
      id: deployment.id
    }
  })

  t.notOk(deployment)
})

test('Selects the device with the least amount of (relevant) deployments', async (t) => {
  const type = await createDeviceType(db)

  // Create a few devices
  const devices = await Promise.all([
    createDevice(db, {
      type: { connect: { id: type.id } },
      connector: { create: {} },
      status: DeviceStatus.RUNNING
    }),
    createDevice(db, {
      type: { connect: { id: type.id } },
      connector: { create: {} },
      status: DeviceStatus.RUNNING
    }),
    createDevice(db, {
      type: { connect: { id: type.id } },
      connector: { create: {} },
      status: DeviceStatus.RUNNING
    }),
    createDevice(db, {
      type: { connect: { id: type.id } },
      connector: { create: {} },
      status: DeviceStatus.RUNNING
    }),
    createDevice(db, {
      type: { connect: { id: type.id } },
      connector: { create: {} },
      status: DeviceStatus.RUNNING
    })
  ])

  await Promise.all(
    devices.map((device) => {
      return db.deployRequest.create({
        data: {
          artifactUrl: 'https://example.com/artifact.zip',
          device: {
            connect: {
              id: device.id
            }
          },
          status: DeployStatus.PENDING
        }
      })
    })
  )

  await db.deployRequest.create({
    data: {
      artifactUrl: 'https://example.com/artifact.zip',
      device: {
        connect: {
          id: devices[0].id
        }
      },
      status: DeployStatus.PENDING
    }
  })

  await db.deployRequest.create({
    data: {
      artifactUrl: 'https://example.com/artifact.zip',
      device: {
        connect: {
          id: devices[2].id
        }
      },
      status: DeployStatus.PENDING
    }
  })

  await db.deployRequest.create({
    data: {
      artifactUrl: 'https://example.com/artifact.zip',
      device: {
        connect: {
          id: devices[2].id
        }
      },
      status: DeployStatus.PENDING
    }
  })

  // unavailable Device without requests should not be selected
  await createDevice(db, {
    type: { connect: { id: type.id } },
    connector: { create: {} },
    status: DeviceStatus.UNAVAILABLE
  })

  const match = await createDevice(db, {
    type: { connect: { id: type.id } },
    connector: { create: {} },
    status: DeviceStatus.DEPLOYING
  })

  const reqs: Array<Promise<DeployRequest>> = []

  for (let i = 0; i < 5; i++) {
    const base = {
      artifactUrl: 'https://example.com/artifact.zip',
      device: {
        connect: {
          id: match.id
        }
      }
    }

    reqs.push(
      db.deployRequest.create({
        data: {
          ...base,
          status: DeployStatus.SUCCESS
        }
      })
    )

    reqs.push(
      db.deployRequest.create({
        data: {
          ...base,
          status: DeployStatus.FAILED
        }
      })
    )

    reqs.push(
      db.deployRequest.create({
        data: {
          ...base,
          status: DeployStatus.TERMINATED
        }
      })
    )
  }
  await Promise.all(reqs)

  const selectedDevice = await getLeastLoadedDevice(type.id)

  t.match(selectedDevice, match)
})
