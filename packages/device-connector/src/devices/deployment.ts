import crypto from 'crypto'
import { createWriteStream } from 'fs'
import * as Path from 'path'
import { Readable } from 'stream'
import { request } from 'undici'
import { Device } from './service'
import { promisify } from 'util'

export interface deploymentData {
  device: Device
  artifactUri: string
}

export interface deploymentRequest {
  type: 'deploy'
  data: deploymentData
}

export const downloadFile = async (uri: string, fileName: string, extension: string): Promise<string> => {
  const file = `artifacts/${fileName}${extension}`
  const outStream = createWriteStream(file)
  const resp = await request(uri)
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
