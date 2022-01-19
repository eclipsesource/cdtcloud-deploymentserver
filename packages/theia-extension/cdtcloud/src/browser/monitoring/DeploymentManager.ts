import { MessageService } from "@theia/core";
import { inject, injectable } from "@theia/core/shared/inversify";
import { OutputChannel, OutputChannelManager, OutputChannelSeverity } from "@theia/output/lib/browser/output-channel";
import { Deployment } from "../../common/protocol";

@injectable()
export class DeploymentManager {


  constructor(
    @inject(OutputChannelManager)
    protected readonly outputChannelManager: OutputChannelManager,

    @inject(MessageService)
    protected readonly messageService: MessageService

  ) {
    this.messageService.info('DeploymentManager initialized');
  }

  public async postDeploy(deployment: Deployment): Promise<void> {
    const channel = this.outputChannelManager.getChannel(`Deployment ${deployment.id}`);

    this.registerWebSocket(deployment.id, channel);

  }

  private registerWebSocket(deploymentId: string, channel: OutputChannel) {
    const socket = new WebSocket(`ws://localhost:3001/api/deployments/${deploymentId}/stream`);

    socket.onopen = () => {
      channel.show({preserveFocus: true});
      channel.appendLine('Connected to deployment');
    }

    socket.onmessage = (event) => {
      channel.appendLine(event.data);

      if (event.data === 'Deployment RUNNING') {
        socket.send('monitor.start');
      }
    }

    socket.onerror = (_event) => {
      channel.appendLine('Error', OutputChannelSeverity.Error);
    }

    socket.onclose = () => {
      channel.appendLine('Disconnected');
    }
  }
}
