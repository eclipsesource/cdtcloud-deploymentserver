import { StatusObject } from '@grpc/grpc-js'
import { Status } from '@grpc/grpc-js/build/src/constants'
import { Response } from 'undici'

export const grpcStatusToError = (status: StatusObject): string => {
  const details: string = status.details === '' ? (status.code === 0 ? 'Success' : 'Unknown error') : status.details
  const statusCode = grpcStatusCodeToName(status.code)

  return `${details} (code: ${status.code} - ${statusCode})`
}

export const grpcStatusCodeToName = (code: Status): string => {
  return Status[code]
}

export const httpError = (resp: Response): Error => {
  return new Error(`Request failed: ${resp.url} - ${resp.status} (${resp.statusText})`)
}
