import { injectable } from 'inversify'
import { ConfigService } from '../common/protocol'
import { env } from 'process'

@injectable()
export class ConfigServiceImpl implements ConfigService {
  #host = env.DEPLOYMENT_SERVER_HOST ?? 'localhost'
  #port = env.DEPLOYMENT_SERVER_PORT ?? 3001
  #secure = env.DEPLOYMENT_SERVER_SECURE === 'true'

  async getWebsocketHost(): Promise<string> {
    return `${this.#secure ? 'wss' : 'ws'}://${this.#host}:${this.#port}`
  }

  async getDeploymentServerHost(): Promise<string> {
    return `${this.#secure ? 'https' : 'http'}://${this.#host}:${this.#port}`
  }
}
