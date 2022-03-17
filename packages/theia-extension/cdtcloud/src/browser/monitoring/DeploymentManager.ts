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

import { MessageService } from '@theia/core'
import { inject, injectable } from '@theia/core/shared/inversify'
import { OutputChannel, OutputChannelManager, OutputChannelSeverity } from '@theia/output/lib/browser/output-channel'
import { ConfigService, Deployment } from '../../common/protocol'

@injectable()
export class DeploymentManager {
  constructor (
    @inject(OutputChannelManager)
    protected readonly outputChannelManager: OutputChannelManager,

    @inject(MessageService)
    protected readonly messageService: MessageService,

    @inject(ConfigService)
    protected readonly configService: ConfigService

  ) {
    this.messageService.info('DeploymentManager initialized')
  }

  public async postDeploy (deployment: Deployment): Promise<void> {
    const channel = this.outputChannelManager.getChannel(`Deployment ${deployment.id}`)

    this.registerWebSocket(deployment.id, channel)
  }

  private async registerWebSocket (deploymentId: string, channel: OutputChannel) {
    const socket = new WebSocket(`${await this.configService.getWebsocketHost()}/api/deployments/${deploymentId}/stream`)

    socket.onopen = () => {
      channel.show({ preserveFocus: true })
      channel.appendLine('Connected to deployment')
    }

    socket.onmessage = (event) => {
      const data = event.data.toString().trim()
      if (data != '') {
        channel.appendLine(data)
      }
    }

    socket.onerror = (_event) => {
      channel.appendLine('Error', OutputChannelSeverity.Error)
    }

    socket.onclose = () => {
      channel.appendLine('Disconnected')
    }
  }
}
