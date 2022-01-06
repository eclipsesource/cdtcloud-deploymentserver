import crypto from 'crypto'
import { createWriteStream } from 'fs'
import * as Path from 'path'
import { dirname } from 'path'
import { Readable } from 'stream'
import { request } from 'undici'
import { ConnectedDevice, Device } from './device'
import { promisify } from 'util'
import { fileURLToPath } from 'url'
import { RPCClient } from '../arduino-cli/client'
import { DeviceStatus } from '../util/common'
import { ConnectedDevices } from './store'
import { unregisterDevice } from './service'
import logger from '../util/logger'

export interface DeploymentData {
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

export const deployBinary = async (deployData: DeploymentData, client: RPCClient): Promise<ConnectedDevice> => {
  const artifactUri = deployData.artifactUri
  const reqDevice = deployData.device as Device
  let device

  try {
    device = ConnectedDevices.get(reqDevice.id)
  } catch (e) {
    // Requested device not connected - unregistering
    await unregisterDevice(reqDevice.id)

    // Looking for alternative device of same type
    device = ConnectedDevices.findAvailable(reqDevice.deviceTypeId)

    if (device != null) {
      logger.warn(`Requested Device with id ${reqDevice.id} not found - using alternative device`)
    } else {
      throw new Error(`Requested Device with id ${reqDevice.id} not found`)
    }
  }

  const deviceStatus = device.status
  if (deviceStatus !== DeviceStatus.AVAILABLE) {
    device = ConnectedDevices.findAvailable(reqDevice.deviceTypeId)
    if (device != null) {
      logger.warn(`Requested Device with id ${reqDevice.id} busy - using alternative device`)
    } else {
      throw new Error(`Requested Device with id ${reqDevice.id} busy (${deviceStatus})`)
    }
  }

  const fqbn = await device.getFQBN()
  const artifactPath = await downloadArtifact(artifactUri)

  // Update device status and notify server of status-change
  await device.updateStatus(DeviceStatus.DEPLOYING)

  try {
    // Start uploading artifact
    await client.uploadBin(fqbn, device.port, artifactPath)
  } catch (e) {
    await device.updateStatus(DeviceStatus.AVAILABLE)
    throw e
  }

  // Reset device status and notify server of status-change
  await device.updateStatus(DeviceStatus.AVAILABLE) // TODO: Set correct status

  return device
}
