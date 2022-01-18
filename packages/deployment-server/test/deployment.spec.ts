/* eslint-disable @typescript-eslint/no-floating-promises */
import tap from 'tap'
import WebSocket from 'ws'

import type { AddressInfo } from 'node:net'
import { randomUUID } from 'node:crypto'
import { once } from 'node:events'
import { Server } from 'node:http'
import { dirname, join } from 'node:path'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

import { FormData, File } from 'undici'
import prisma, { DeployRequest, Device, DeviceType, PrismaClient } from '@prisma/client'

import { fetch } from './util/fetch'
import { closeServer, createServer } from '../src/server'
import { Connector } from '../src/connectors'
import { registerConnector } from '../src/connectors/queue'

const { before, teardown, test } = tap
const { DeployStatus, DeviceStatus } = prisma

let baseUrl: string
let address: AddressInfo
let server: Server
let db: PrismaClient

before(async () => {
  [server,,db] = await createServer()
  address = server.address() as AddressInfo
  baseUrl = `http://${address.address}:${address.port}/api`
})

teardown(async () => {
  try {
    await closeServer.apply({ server, db })
  } catch (e) {
    console.error(e)
    throw e
  }
})

test('Can deploy', async (t) => {
  // Upload artifact
  const filePath = join(dirname(fileURLToPath(import.meta.url)), './fixtures/artifact')
  const buffer = Buffer.from(await readFile(filePath))
  const arraybuffer = Uint8Array.from(buffer)
  const formData = new FormData()
  const file = new File([arraybuffer], 'artifact', { type: 'text/plain' })
  formData.append('file', file)

  const artifactResponse = await fetch(`${baseUrl}/deployment-artifacts`, {
    method: 'POST',
    body: formData
  })

  const { artifactUri } = await artifactResponse.json() as {artifactUri: string}

  // Create a connector
  const connectorResponse = await fetch(`${baseUrl}/connectors`, {
    method: 'POST'
  })

  const { id: connectorId } = await connectorResponse.json() as Connector

  // Create a deviceType
  const deviceTypeResponse = await fetch(`${baseUrl}/device-types`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      fqbn: randomUUID(),
      name: 'Test device type'
    })
  })

  const deviceType = await deviceTypeResponse.json() as DeviceType

  const { id: typeId } = deviceType

  // Register a device handled by the connector, accepting the deployment requests for the deviceType
  const deviceResponse = await fetch(`${baseUrl}/devices`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      typeId,
      connectorId
    })
  })

  const device = await deviceResponse.json() as Device

  const socket = new WebSocket(`ws://${address.address}:${address.port}/api/connectors/${connectorId}/queue`)

  // Register the listener
  socket.onmessage = (message) => {
    t.match(JSON.parse(message.data as string), {
      type: 'deploy',
      data: {
        device: {
          ...device,
          connector: undefined
        },
        artifactUri,
        id: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
      }
    })
    socket.close()
  }

  // wait for the socket
  await once(socket, 'open')

  // Send a deployment request
  const response = await fetch(`${baseUrl}/deployments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      deviceTypeId: typeId,
      artifactUri
    })
  })
  const result = await response.json() as DeployRequest

  t.equal(response.status, 200)
  t.match(result.id, /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)
  t.equal(result.artifactUrl, artifactUri)
  t.equal(result.status, DeployStatus.PENDING)
})

async function setup (): Promise<DeployRequest> {
  // Create a deviceType in the database
  const deviceType = await db.deviceType.create({
    data: {
      fqbn: randomUUID(),
      name: 'Test device type',
      devices: {
        create: [{
          status: DeviceStatus.AVAILABLE,
          connector: {
            create: {
            }
          }
        }]
      }
    },
    include: {
      devices: {
        include: {
          connector: true
        }
      }
    }
  })

  registerConnector(deviceType.devices[0].connector)

  // Send a deployment request
  const response = await fetch(`${baseUrl}/deployments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      deviceTypeId: deviceType.id,
      artifactUri: 'http://example.com/artifact'
    })
  })

  return await (response.json() as Promise<DeployRequest>)
}

test('Opens an i/o stream after a valid deployment request is created', async (t) => {
  const { id } = await setup()

  // Open the stream
  const socket = new WebSocket(`ws://${address.address}:${address.port}/api/deployments/${id}/stream`)

  t.test('socket opens', t => {
    t.plan(1)

    socket.onopen = () => {
      t.pass('WS opened')
      socket.close()
    }

    socket.onerror = (error) => {
      socket.close()
      t.fail(error.error.message, error.error)
    }
  })
})

test('Closes the i/o stream after a deployment request is cancelled', async (t) => {
  const { id, deviceId } = await setup()

  // Open the stream
  const socket = new WebSocket(`ws://${address.address}:${address.port}/api/deployments/${id}/stream`)

  await once(socket, 'open')

  const response = await fetch(`${baseUrl}/deployments/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      status: DeployStatus.TERMINATED
    })
  })

  t.equal(response.status, 200)
  t.match(await response.json(), {
    id,
    deviceId,
    status: DeployStatus.TERMINATED
  })

  t.test('socket closes', t => {
    t.plan(1)

    socket.onclose = () => {
      t.pass('WS closed')
    }

    socket.onerror = (error) => {
      socket.close()
      t.fail(error.error.message, error.error)
    }
  })
})

test('returns an error when queue is full', async (t) => {
  // Upload artifact
  const filePath = join(dirname(fileURLToPath(import.meta.url)), './fixtures/artifact')
  const buffer = Buffer.from(await readFile(filePath))
  const arraybuffer = Uint8Array.from(buffer)
  const formData = new FormData()
  const file = new File([arraybuffer], 'artifact', { type: 'text/plain' })
  formData.append('file', file)

  const artifactResponse = await fetch(`${baseUrl}/deployment-artifacts`, {
    method: 'POST',
    body: formData
  })

  const { artifactUri } = await artifactResponse.json() as {artifactUri: string}

  // Create a connector
  const connectorResponse = await fetch(`${baseUrl}/connectors`, {
    method: 'POST'
  })

  const { id: connectorId } = await connectorResponse.json() as Connector

  // Create a deviceType
  const deviceTypeResponse = await fetch(`${baseUrl}/device-types`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      fqbn: randomUUID(),
      name: 'Test device type'
    })
  })

  const deviceType = await deviceTypeResponse.json() as DeviceType

  const { id: typeId } = deviceType

  // Register a device handled by the connector, accepting the deployment requests for the deviceType
  const deviceResponse = await fetch(`${baseUrl}/devices`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      typeId,
      connectorId
    })
  })

  const device = await deviceResponse.json() as Device

  const socket = new WebSocket(`ws://${address.address}:${address.port}/api/connectors/${connectorId}/queue`)

  // Register the listener
  socket.onmessage = (message) => {
    t.match(JSON.parse(message.data as string), {
      type: 'deploy',
      data: {
        device: {
          ...device,
          connector: undefined
        },
        artifactUri,
        id: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
      }
    })
    socket.close()
  }

  // wait for the socket
  await once(socket, 'open')

  // Send a deployment request
  await fetch(`${baseUrl}/deployments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      deviceTypeId: typeId,
      artifactUri
    })
  })
  await fetch(`${baseUrl}/deployments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      deviceTypeId: typeId,
      artifactUri
    })
  })
  await fetch(`${baseUrl}/deployments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      deviceTypeId: typeId,
      artifactUri
    })
  })
  await fetch(`${baseUrl}/deployments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      deviceTypeId: typeId,
      artifactUri
    })
  })
  const response = await fetch(`${baseUrl}/deployments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      deviceTypeId: typeId,
      artifactUri
    })
  })
  const result = await response.json() as Error
  console.log(result.message)

  t.equal(response.status, 502)
})
