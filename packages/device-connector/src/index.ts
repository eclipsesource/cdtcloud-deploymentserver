import WebSocket from "ws"
import { RPCClient } from "./cli-rpc/client"

const client = await new RPCClient()
await client.init()
await client.createInstance()
await client.initInstance()

const registrationResponse = await fetch("http://localhost:3001/connectors", {
  method: "POST"
})

const { id } = await registrationResponse.json() as any;

const url = "ws://localhost:3001/connectors/" + id + "/queue"
const socket = new WebSocket(url)

socket.onopen = () => {
  socket.send("Hello")
}

socket.onerror = (error) => {
  console.log(`WebSocket error: ${error.message}`)
}

socket.onmessage = (e) => {
  const message = typeof e.data === "string" ? JSON.parse(e.data) : e.data
  switch (message.type) {
    case "deploy":
      client.uploadBin(message.deviceType, message.port, message.artifactUri)
        .then(() => console.log("success"))
        .catch((err) => console.log(err))
      break
    default:
      break
  }
}
