import { env } from 'process'
import pino from 'pino'
import { grpcStatusToError } from './errors'
import { StatusObject } from '@grpc/grpc-js'

const statusObjectKeys = ['code', 'details', 'metadata'].toString()

const formatters = {
  log (object: object) {
    if (Object.keys(object).toString() === statusObjectKeys) {
      return { msg: grpcStatusToError(object as StatusObject) }
    }
    return object
  }
}

const transport = {
  target: 'pino-pretty',
  options: {
    colorize: env.NODE_ENV === 'development' ,
    translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l'
  }
}

const logger = pino({
  name: 'DeviceConnector',
  transport,
  level: env.NODE_ENV === 'test' ? 'fatal' : 'info',
  formatters
})

export default logger
