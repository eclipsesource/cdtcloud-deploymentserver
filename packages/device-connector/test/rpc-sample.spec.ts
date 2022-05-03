/* eslint-disable @typescript-eslint/no-floating-promises */
import tap from 'tap'
import { GRPCClient } from '../src/arduino-cli/client'

const { before, test } = tap

let client: GRPCClient

before(async () => {
  client = await new GRPCClient()
  await client.init()
  await client.createInstance()
  await client.initInstance()
})

test('List supported arduino uno mini boards from arduino-cli', async (t) => {
  const boards = await client.listAllBoards(['Uno Mini'])

  t.match(boards[0],
    {
      name: 'Arduino Uno Mini',
      fqbn: 'arduino:avr:unomini',
      is_hidden: false,
      platform: {
        boards: [],
        id: 'arduino:avr',
        installed: /\d+\.\d+\.\d+/,
        latest: /\d+\.\d+\.\d+/,
        name: 'Arduino AVR Boards',
        maintainer: 'Arduino',
        website: 'http://www.arduino.cc/',
        email: 'packages@arduino.cc',
        manually_installed: false,
        deprecated: false
      }
    }

  )
})
