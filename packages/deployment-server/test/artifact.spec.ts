/* eslint-disable @typescript-eslint/no-floating-promises */
import type { PrismaClient } from '@prisma/client'
import { createServer, closeServer } from '../src/server'
import { AddressInfo } from 'node:net'
import tap from 'tap'
import type { Server } from 'node:http'
import { fetch } from './util/fetch'
import { readFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { FormData, File } from 'undici'
import { fileURLToPath } from 'node:url'

const { test, before, teardown } = tap

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

const filePath = join(dirname(fileURLToPath(import.meta.url)), './fixtures/artifact')
const buffer = Buffer.from(await readFile(filePath))
const arraybuffer = Uint8Array.from(buffer)
const formData = new FormData()
const file = new File([arraybuffer], 'artifact', { type: 'text/plain' })
let download: string

test('Can upload', async (t) => {
  formData.append('file', file)

  const response = await fetch(`${baseUrl}/deployment-artifacts`, {
    method: 'POST',
    body: formData
  })
  t.ok(response.ok, 'Response is ok')

  const json = await response.json() as { artifactUrl: string}

  t.match(json.artifactUrl, /^http:\/\/.*\/deployment-artifacts\/[\w]{8}-[\w]{4}-[\w]{4}-[\w]{4}-[\w]{12}/)

  download = json.artifactUrl
})

test('Can download', async (t) => {
  const response = await fetch(download, {
    method: 'GET'
  })
  t.ok(response.ok, 'Response is ok')

  const body = await response.blob()

  t.equal(body.size, file.size, 'Size is correct')
  t.equal(body.arrayBuffer, file.arrayBuffer, 'Content is correct')
})
