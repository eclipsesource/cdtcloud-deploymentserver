import { env } from 'process'
import pino, { LogFn } from 'pino'

const statusObjectKeys = ['code', 'details', 'metadata'].toString()

const hooks = {
  logMethod (inputArgs: any[], method: LogFn) {
    const args = inputArgs.map((arg) => {
      if (Object.keys(arg).toString() === statusObjectKeys) {
        const code: number = arg.code
        const details: string = arg.details === '' ? (arg.code === 0 ? 'Success' : 'Unknown error') : arg.details
        return `${details} (code: ${code})`
      }

      return arg
    })
    return method.apply(this, [args[0], ...args])
  }
}

export const logger = pino({
  name: 'DeviceConnector',
  prettyPrint: env.NODE_ENV === 'development',
  level: env.NODE_ENV === 'test' ? 'fatal' : 'info',
  hooks
}
)

export default logger
