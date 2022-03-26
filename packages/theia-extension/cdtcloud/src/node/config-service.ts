/********************************************************************************
    Copyright (c) 2022 EclipseSource and others.

    This program and the accompanying materials are made available under the
    terms of the Eclipse Public License v. 2.0 which is available at
    http://www.eclipse.org/legal/epl-2.0.

    This Source Code may also be made available under the following Secondary
    Licenses when the conditions for such availability set forth in the Eclipse
    Public License v. 2.0 are satisfied: GNU General Public License, version 2
    with the GNU Classpath Exception which is available at
    https://www.gnu.org/software/classpath/license.html.

    SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
********************************************************************************/

import { injectable } from 'inversify'
import { ConfigService } from '../common/protocol'
import { env } from 'process'

@injectable()
export class ConfigServiceImpl implements ConfigService {
  #host = env.DEPLOYMENT_SERVER_HOST ?? 'localhost'
  #port = env.DEPLOYMENT_SERVER_PORT ?? 3001
  #secure = env.DEPLOYMENT_SERVER_SECURE === 'true'

  async getWebsocketHost (): Promise<string> {
    return `${this.#secure ? 'wss' : 'ws'}://${this.#host}:${this.#port}`
  }

  async getDeploymentServerHost(): Promise<string> {
    return `${this.#secure ? 'https' : 'http'}://${this.#host}:${this.#port}`
  }
}
