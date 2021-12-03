/* eslint-disable @typescript-eslint/no-floating-promises */
import tap from 'tap'
import { fetch } from './util/fetch'
import type { AddressInfo } from 'node:net'
import { Server } from 'node:http'
import { DeviceType, PrismaClient } from '@prisma/client'
import { closeServer, createServer } from '../src/server'
import { randomUUID } from 'node:crypto'

const { before, teardown, test } = tap

let baseUrl: string
let port: number
let server: Server
let db: PrismaClient

before(async () => {
  [server,,db] = await createServer()
  const address = server.address() as AddressInfo
  port = address.port
  baseUrl = `http://0.0.0.0:${port}`
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

  const body = await response.json() as DeviceType[]

  t.ok(body.filter(x => x.id === deviceType.id))
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
  const body = await response.json() as DeviceType

  t.equal(response.status, 200)

  t.ok(body.id)
})
