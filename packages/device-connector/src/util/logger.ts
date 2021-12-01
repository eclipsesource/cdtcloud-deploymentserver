import { env } from 'process'
import pino from 'pino'

export const logger = pino({
      prettyPrint: env.NODE_ENV === 'development',
      level: env.NODE_ENV === 'test' ? 'fatal' : 'info'
    }
)

export default logger
