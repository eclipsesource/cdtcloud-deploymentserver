import { Connector } from '@prisma/client'
import { once } from 'events'
import { fetch } from 'undici'
import WebSocket from 'ws'

const registrationResponse = await fetch('http://0.0.0.0:3001/connectors', {
  method: 'POST'
})

const { id } = await registrationResponse.json() as Connector

console.log(id)

const wsClient = new WebSocket('ws://0.0.0.0:3001/connectors/' + id + '/queue')

await once(wsClient, 'open')
console.log('Connected')

wsClient.onmessage = (event) => {
  console.log(event.data)
}
