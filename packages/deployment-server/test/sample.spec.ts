/* eslint-disable @typescript-eslint/no-floating-promises */
import tap from 'tap'
import { server, close } from './util/server'
import { fetch } from './util/fetch'
import type { AddressInfo } from 'node:net'

const { before, teardown, test } = tap

let baseUrl: string

before(async () => {
  server.listen()
  const { port } = server.address() as AddressInfo
  baseUrl = `http://localhost:${port}`
})

teardown(async () => {
  close()
})

test('GET retrieves according to primary preference if possible', async (t) => {
  const response = await fetch(`${baseUrl}/devices`, {
    method: 'GET'
  })

  t.equal(response.status, 200)

  const body = await response.json()

  t.match(body, [{
    id: '1',
    name: 'Device 1',
    type: 'device',
    status: 'online',
    last_seen: '2020-01-01T00:00:00.000Z',
    last_seen_at: '2020-01-01T00:00:00.000Z',
    last_seen_ip: ''
  }])
})
