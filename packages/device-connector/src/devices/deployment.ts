import type { Device } from '@prisma/client'
import crypto from 'crypto'
import { createWriteStream } from 'fs'
import Path, { dirname, basename } from 'path'
import { Readable } from 'stream'
import { request } from 'undici'
import { promisify } from 'util'
import { fileURLToPath, URL } from 'node:url'
import { DeviceStatus } from '../util/common'
import { ConnectedDevices } from './store'
import { unregisterDevice } from './service'
import { logger } from '../util/logger'

export type DeploymentId = string

export interface Deployment {
  id: DeploymentId
  artifactPath: string
}

export interface DeploymentData {
  id: DeploymentId
  device: Device
  artifactUri: string
}

export const downloadFile = async (uri: string, fileName: string, extension: string): Promise<string> => {
  const file = Path.join(dirname(fileURLToPath(import.meta.url)), '../../artifacts', `${fileName}${extension}`)
  const outStream = createWriteStream(file)
  const url = new URL(uri)
  const resp = await request(url)
  const downStream = Readable.from(resp.body)

  // Pipe data from artifactURL into writeStream
  downStream.pipe(outStream)

  // Wait for all data written and file closed
  await promisify<'close'>(outStream.on).bind(outStream)('close')

  return file
}

export const downloadArtifact = async (uri: string): Promise<string> => {
  const uid = crypto.randomBytes(32).toString('hex')
  const extension = Path.extname(uri)
  const file = await downloadFile(uri, uid, extension)

  return Path.resolve(file)
}

export const deployBinary = async (deployData: DeploymentData): Promise<void> => {
  const artifactUri = deployData.artifactUri
  const reqDevice = deployData.device
  let device

  try {
    device = ConnectedDevices.get(reqDevice.id)
  } catch (e) {
    // Requested device not connected - unregistering
    await unregisterDevice(reqDevice.id)

    throw new Error(`Requested Device with id ${reqDevice.id} not found`)
  }

  const artifactPath = await downloadArtifact(artifactUri)
  logger.debug(`Deployment: ${deployData.id} - Downloaded artifact from ${artifactUri} to ${basename(artifactPath)}`)

  const deployment = {
    id: deployData.id,
    artifactPath
  }

  if (device.status === DeviceStatus.AVAILABLE) {
    return await device.deploy(deployment)
  }

  await device.queue(deployment)
  logger.info(`Queued deployment ${deployData.id} on device ${device.id}`)
}
