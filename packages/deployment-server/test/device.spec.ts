/* eslint-disable @typescript-eslint/no-floating-promises */
import prisma, { DeployRequest, Device, PrismaClient } from '@prisma/client'
import type { Server } from 'node:http'
import type { AddressInfo } from 'node:net'
import tap from 'tap'
import { closeServer, createServer } from '../src/server'
import { createConnector, createDevice, createDeviceType } from './util/factory'
import { fetch } from './util/fetch'

const { before, teardown, test } = tap
const { DeviceStatus } = prisma

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

  const responseBody = await response.json() as Device[]

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
