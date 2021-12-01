import { env } from 'process'
import WebSocket from 'ws'
import fs, { createReadStream, createWriteStream } from 'fs'
import { fetch } from "undici";
import logger from "../util/logger";
import { Device } from "../devices/service";

export type ConnectorData = {
    id: string,
    uri: string,
    devices: Device[]
}

const readConnectorData = async (): Promise<ConnectorData> => {
    let data = ''

    return await new Promise((resolve, reject) => {
        const dataStream = createReadStream('.connection.data')

        dataStream.on('data', (chunk: string) => {
            data += chunk
        })

        dataStream.on('end', () => {
            resolve(JSON.parse(data))
        })

        dataStream.on('error', (error: Error) => {
            reject(error)
        })
    })
}

const generateConnectorData = async (address: string): Promise<ConnectorData> => {
    const registrationResponse = await fetch(`http://${address}/connectors`, {
        method: 'POST'
    })
    const { id } = await registrationResponse.json() as any

    return await new Promise<ConnectorData>((resolve, reject) => {
        if (!id) {
            reject('No valid id response')
        }

        const connectorData: ConnectorData = {
            id: id,
            uri: address,
            devices: []
        }

        resolve(connectorData)
    })
}

const writeConnectorData = async (connectorData: ConnectorData): Promise<void> => {
    return await new Promise((resolve, reject) => {
        const dataStream = createWriteStream('.connection.data')

        dataStream.on('finish', () => {
            resolve()
        })

        dataStream.on('error', (error: Error) => {
            reject(error)
        })

        dataStream.write(JSON.stringify(connectorData))
        dataStream.end()
    })
}

export const openStream = async (): Promise<WebSocket> => {
    const address = env.SERVER_URI != null ? env.SERVER_URI : '127.0.0.1:3001'
    let connectorData: ConnectorData | undefined
    if (fs.existsSync('.connection.data')) {
        connectorData = await readConnectorData()
    }

    if (!connectorData || connectorData.uri !== address) {
        connectorData = await generateConnectorData(address)
        await writeConnectorData(connectorData)
    }

    let id = connectorData.id
    const url = `ws://${address}/connectors/${id}/queue`
    const socket = new WebSocket(url)

    socket.onopen = () => {
        logger.info(`Connected to ${address} (Deployment-Server)`)
        socket.send('Hello-World')
    }

    socket.onerror = (error) => {
        logger.error(`WebSocket error: ${error.message}`)
    }

    return socket
}