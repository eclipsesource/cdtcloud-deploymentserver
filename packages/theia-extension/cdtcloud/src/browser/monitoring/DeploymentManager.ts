import { MessageService } from "@theia/core";
import { inject, injectable } from "@theia/core/shared/inversify";
import { OutputChannelManager, OutputChannelSeverity } from "@theia/output/lib/browser/output-channel";

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

  public async postDeploy(deploymentId: string) {
    const channel = this.outputChannelManager.getChannel(`Deployment ${deploymentId}`);

    const socket = new WebSocket(`ws://0.0.0.0:3001/api/deployments/${deploymentId}/stream"`);

    socket.onopen = () => {
      channel.show({preserveFocus: true});
      channel.appendLine('Connected to deployment');
    }

    socket.onmessage = (event) => {
      channel.appendLine(event.data);
    }

    socket.onerror = (_event) => {
      channel.appendLine('Error', OutputChannelSeverity.Error);
    }

    socket.onclose = () => {
      channel.appendLine('Disconnected');
    }
  }
}
