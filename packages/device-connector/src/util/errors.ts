import { StatusObject } from '@grpc/grpc-js'
import { grpcStatus } from './common'

export const grpcError = {
  notInitialized: new Error(grpcStatus.notInitialized),
  unknown: new Error(grpcStatus.unknown)
}

export const grpcStatusToError = (status: StatusObject): string => {
  const details: string = status.details === '' ? (status.code === 0 ? 'Success' : 'Unknown error') : status.details

  return `${details} (code: ${status.code})`
}
