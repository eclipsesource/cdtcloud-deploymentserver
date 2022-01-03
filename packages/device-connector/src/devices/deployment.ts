import crypto from 'crypto'
import { createWriteStream } from 'fs'
import * as Path from 'path'
import { dirname } from 'path'
import { Readable } from 'stream'
import { request } from 'undici'
import { deregisterDevice, Device, findAvailableByType, getFQBN, getStoredDevice, updateDeviceStatus } from './service'
import { promisify } from 'util'
import { fileURLToPath } from 'url'
import { RPCClient } from '../arduino-cli/client'
import { DeviceResponse } from '../deployment-server/service'
import { DeviceStatus } from '../util/common'
import logger from '../util/logger'

export interface DeploymentData {
  device: DeviceResponse
  artifactUri: string
}

export const downloadFile = async (uri: string, fileName: string, extension: string): Promise<string> => {
  const file = Path.join(dirname(fileURLToPath(import.meta.url)), '../../artifacts', `${fileName}${extension}`)
  const outStream = createWriteStream(file)
  const url = new URL(uri)
  const resp = await request(url)
  const downStream = Readable.from(resp.body)

  downStream.pipe(outStream)
  await promisify<'close'>(outStream.on).bind(outStream)('close')

  return file
}

export const downloadArtifact = async (uri: string): Promise<string> => {
  const uid = crypto.randomBytes(32).toString('hex')
  const extension = Path.extname(uri)
  const file = await downloadFile(uri, uid, extension)

  return Path.resolve(file)
}

export const deployBinary = async (deployData: DeploymentData, client: RPCClient): Promise<Device> => {
  const artifactUri = deployData.artifactUri
  const reqDevice = deployData.device as Device

  let device = await getStoredDevice(reqDevice.id)

  if (device == null) {
    await deregisterDevice(reqDevice.id)
  }

  if (device == null || device.status !== DeviceStatus.AVAILABLE) {
    device = await findAvailableByType(reqDevice.deviceTypeId)
    if (device != null) {
      logger.warn(`Requested Device with id ${reqDevice.id} busy or not found - using alternative device`)
    } else {
      throw new Error(`Requested Device with id ${reqDevice.id} busy or not found`)
    }
  }

  const fqbn = await getFQBN(device.deviceTypeId)
  const artifactPath = await downloadArtifact(artifactUri)

  // Notify server that device is busy deploying
  await updateDeviceStatus(device, DeviceStatus.DEPLOYING)

  // Start uploading artifact
  await client.uploadBin(fqbn, device.port, artifactPath)

  return device
}
