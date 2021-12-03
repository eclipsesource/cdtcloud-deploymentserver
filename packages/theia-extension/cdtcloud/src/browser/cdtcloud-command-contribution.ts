import {
  Command,
  CommandContribution,
  CommandRegistry,
} from "@theia/core/lib/common";
import { inject, injectable } from "@theia/core/shared/inversify";
import { HelloBackendWithClientService } from "../common/protocol";
import { WorkspaceService } from "@theia/workspace/lib/browser/workspace-service";

const SayHelloViaBackendCommandWithCallBack: Command = {
  id: "sayHelloOnBackendWithCallBack.command",
  label: "Say hello on the backend with a callback to the client",
};

@injectable()
export class CdtCloudCommandContribution implements CommandContribution {
  @inject(WorkspaceService)
  protected readonly workspaceService: WorkspaceService;

  constructor(
    @inject(HelloBackendWithClientService)
    private readonly helloBackendWithClientService: HelloBackendWithClientService
  ) {}

  registerCommands(registry: CommandRegistry): void {
    registry.registerCommand(SayHelloViaBackendCommandWithCallBack, {
      execute: () => {
        // Get the currently opened path
        console.log(this.workspaceService.workspace?.resource);
        this.helloBackendWithClientService.greet().then((r) => console.log(r));
      },
    });
  }
}
