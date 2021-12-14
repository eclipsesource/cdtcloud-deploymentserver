import { env } from 'node:process'
import pino, { HttpLogger } from 'pino-http'

const devTransport = {
  target: 'pino-pretty',
  options: {
    colorize: true,
    translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l'
  }
}

export const pinoHttp = pino({
  transport: env.NODE_ENV === 'development' ? devTransport : undefined,
  level: env.NODE_ENV === 'test' ? 'fatal' : 'info'
})

export const logger: HttpLogger['logger'] = pinoHttp.logger

export default logger
