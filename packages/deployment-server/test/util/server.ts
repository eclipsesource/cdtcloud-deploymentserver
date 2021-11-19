import { app } from '../../src/util/app'
import { createServer } from 'http'

export const server = createServer(app)

export const close = async (): Promise<void> => {
  await new Promise<void>((resolve, reject) => {
    server.close((err) => {
      if (err != null) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}
