/* eslint-disable @typescript-eslint/no-floating-promises */
import tap from 'tap'
import { fetch } from './util/fetch'
import type { AddressInfo } from 'node:net'
import { Server } from 'node:http'
import { PrismaClient } from '@prisma/client'
import { closeServer, createServer } from '../src/server'
import { Connector } from '../src/connectors'
import WebSocket from 'ws'
import { once } from 'node:events'

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
