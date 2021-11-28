/* eslint-disable @typescript-eslint/no-floating-promises */
import tap from 'tap'
import { RPCClient } from '../src/cli-rpc/client'

const { before, test } = tap

let client: RPCClient

before(async () => {
  client = await new RPCClient()
  await client.init()
  await client.createInstance()
  await client.initInstance()
})

test('List all supported arduino uno boards from arduino-cli', async (t) => {
  const boards = await client.listAllBoards(['Arduino Uno'])

  t.match(boards, [
    {
      name: 'Arduino Uno',
      fqbn: 'arduino:avr:uno',
      is_hidden: false,
      platform: {
        boards: [],
        id: 'arduino:avr',
        installed: '1.8.4',
        latest: '1.8.4',
        name: 'Arduino AVR Boards',
        maintainer: 'Arduino',
        website: 'http://www.arduino.cc/',
        email: 'packages@arduino.cc',
        manually_installed: false,
        deprecated: false
      }
    },
    {
      name: 'Arduino Uno WiFi',
      fqbn: 'arduino:avr:unowifi',
      is_hidden: false,
      platform: {
        boards: [],
        id: 'arduino:avr',
        installed: '1.8.4',
        latest: '1.8.4',
        name: 'Arduino AVR Boards',
        maintainer: 'Arduino',
        website: 'http://www.arduino.cc/',
        email: 'packages@arduino.cc',
        manually_installed: false,
        deprecated: false
      }
    },
    {
      name: 'Arduino Uno Mini',
      fqbn: 'arduino:avr:unomini',
      is_hidden: false,
      platform: {
        boards: [],
        id: 'arduino:avr',
        installed: '1.8.4',
        latest: '1.8.4',
        name: 'Arduino AVR Boards',
        maintainer: 'Arduino',
        website: 'http://www.arduino.cc/',
        email: 'packages@arduino.cc',
        manually_installed: false,
        deprecated: false
      }
    }
  ]
  )
})
