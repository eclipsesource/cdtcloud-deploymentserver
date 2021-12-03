import { env } from 'node:process'
import pino from 'pino-http'

const devTransport = {
  target: 'pino-pretty',
  options: {
    colorize: true
  }
}

export const pinoHttp = pino({
  transport: env.NODE_ENV === 'development' ? devTransport : undefined,
  level: env.NODE_ENV === 'test' ? 'fatal' : 'info'
})

export const logger = pinoHttp.logger

export default logger
