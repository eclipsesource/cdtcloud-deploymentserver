import pino from 'pino-http'

const devTransport = {
  target: 'pino-pretty',
  options: {
    colorize: true
  }
}

export const pinoHttp = pino({
  transport: process.env.NODE_ENV === 'production' ? undefined : devTransport
})

export const logger = pinoHttp.logger

export default logger
