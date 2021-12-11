/* eslint-disable @typescript-eslint/no-floating-promises */
import tap from 'tap'
import { fetch } from './util/fetch'
import type { AddressInfo } from 'node:net'
import { Server } from 'node:http'
import dbClient, { DeviceType, PrismaClient } from '@prisma/client'
import { closeServer, createServer } from '../src/server'
import { randomUUID } from 'node:crypto'
import { stringify } from 'node:querystring'

const { DeviceStatus } = dbClient

const { before, teardown, test } = tap

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

test('Retrieves all deviceTypes', async (t) => {
  const deviceType = await db.deviceType.create({
    data: {
      name: 'test',
      fqbn: randomUUID()
    }
  })

  const response = await fetch(`${baseUrl}/device-types`, {
    method: 'GET'
  })

  t.equal(response.status, 200)

  const body = (await response.json()) as DeviceType[]

  t.ok(body.some((x) => x.id === deviceType.id))
})

// Test that adding a connector
test('Adds a device type', async (t) => {
  const response = await fetch(`${baseUrl}/device-types`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      fqbn: randomUUID(),
      name: 'Test device type'
    })
  })
  const body = (await response.json()) as DeviceType

  t.equal(response.status, 200)

  t.ok(body.id)
})

test('Can filter for potentially viable deviceTypes', async (t) => {
  const { id: emptyDeviceTypeId } = await db.deviceType.create({
    data: {
      name: 'test',
      fqbn: randomUUID()
    }
  })

  // Create a running device
  const { deviceTypeId: runningDeviceTypeId } = await db.device.create({
    data: {
      type: {
        create: {
          name: 'test',
          fqbn: randomUUID()
        }
      },
      connector: {
        create: {

        }
      },
      status: DeviceStatus.RUNNING
    }
  })

  const { deviceTypeId: unavailableDeviceTypeId } = await db.device.create({
    data: {
      type: {
        create: {
          name: 'test',
          fqbn: randomUUID()
        }
      },
      connector: {
        create: {}
      },
      status: DeviceStatus.UNAVAILABLE
    }
  })

  // Should be able to contain only the running device's type
  const response = await fetch(
    `${baseUrl}/device-types?${stringify({
      deployable: true
    })}`,
    {
      method: 'GET'
    }
  )

  t.ok(response.ok)
  t.equal(response.status, 200)

  const body = (await response.json()) as DeviceType[]

  t.ok(
    body.some(
      (x) => x.id === runningDeviceTypeId
    )
  )

  t.notOk(
    body.some(
      (x) => x.id === emptyDeviceTypeId
    )
  )

  t.notOk(
    body.some(
      (x) => x.id === unavailableDeviceTypeId
    )
  )
})
