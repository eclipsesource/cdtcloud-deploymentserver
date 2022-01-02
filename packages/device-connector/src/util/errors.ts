import { StatusObject } from '@grpc/grpc-js'
import { GrpcStatus } from './common'

export const GrpcError = {
  notInitialized: new Error(GrpcStatus.notInitialized),
  unknown: new Error(GrpcStatus.unknown)
}

export const grpcStatusToError = (status: StatusObject): string => {
  const details: string = status.details === '' ? (status.code === 0 ? 'Success' : 'Unknown error') : status.details

  return `${details} (code: ${status.code})`
}
