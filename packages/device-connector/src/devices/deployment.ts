import crypto from 'crypto'
import { createWriteStream } from 'fs'
import * as Path from 'path'
import { Readable } from 'stream'
import { request } from 'undici'
import { Device } from './service'

export interface deploymentData {
  device: Device
  artifactUri: string
}

export interface deploymentRequest {
  type: 'deploy'
  data: deploymentData
}

export const downloadArtifact = async (uri: string): Promise<string> => {
  const uid = crypto.randomBytes(32).toString('hex')
  const file = `artifacts/${uid}.bin`
  const outStream = createWriteStream(file)

  const resp = await request(uri)
  const downStream = Readable.from(resp.body)
  downStream.pipe(outStream)

  return Path.resolve(file)
}
