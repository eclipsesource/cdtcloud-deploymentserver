/* eslint-disable @typescript-eslint/no-floating-promises */
import tap from 'tap'
import { fetch } from './util/fetch'
import type { AddressInfo } from 'node:net'
import { Server } from 'node:http'
import dbClient, { PrismaClient } from '@prisma/client'
import { closeServer, createServer } from '../src/server'
import { Connector } from '../src/connectors'
import WebSocket from 'ws'
import { once } from 'node:events'
import { addDeployRequest } from '../src/connectors/queue'
import { randomUUID } from 'node:crypto'

const { DeviceStatus } = dbClient

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

test('Retrieves all connectors', async (t) => {
  const connector = await db.connector.create({
    data: {}
  })

  const response = await fetch(`${baseUrl}/connectors`, {
    method: 'GET'
  })

  t.equal(response.status, 200)

  const body = await response.json() as Connector[]

  t.ok(body.filter(x => x.id === connector.id))
})

// Test that adding a connector
test('Adds a connector', async (t) => {
  const response = await fetch(`${baseUrl}/connectors`, {
    method: 'POST'
  })

  t.equal(response.status, 200)

  const body = await response.json() as Connector

  t.ok(body.id)
})

test('Responds to the websocket connection after create', async (t) => {
  t.plan(1)
  const response = await fetch(`${baseUrl}/connectors`, {
    method: 'POST'
  })

  const { id } = await response.json() as Connector

  const socket = new WebSocket(`ws://0.0.0.0:${port}/connectors/${id}/queue`)

  socket.onopen = () => {
    t.pass('Socket opened')
    socket.close()
  }

  await once(socket, 'close')
})

test('Receives deployment requests', async (t) => {
  // Create a connector
  const response = await fetch(`${baseUrl}/connectors`, {
    method: 'POST'
  })

  const { id: connectorId } = await response.json() as Connector

  const deviceType = await db.deviceType.create({
    data: {
      name: 'test',
      fqbn: randomUUID()
    }
  })

  // Register a device handled by the connector
  const device = await db.device.create({
    data: {
      status: DeviceStatus.AVAILABLE,
      type: {
        connect: {
          id: deviceType.id
        }
      },
      connector: {
        connect: {
          id: connectorId
        }
      }
    }
  })

  const socket = new WebSocket(`ws://0.0.0.0:${port}/connectors/${connectorId}/queue`)

  // Simulate a deployment request once we can be sure the socket is listening
  socket.onopen = () => {
    // Specifically send the request only to this connector
    addDeployRequest(connectorId, device, 'http://google.com')
  }

  // Check the response, close the socket
  socket.onmessage = (message) => {
    t.equal(message.data, JSON.stringify({
      type: 'deploy',
      data: {
        device,
        artifactUri: 'http://google.com'
      }
    }))

    socket.close()
  }

  await once(socket, 'close')
})
