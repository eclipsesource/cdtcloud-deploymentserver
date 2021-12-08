import { CompilationService } from './../common/protocol';
import {
  Command,
  CommandContribution,
  CommandRegistry,
} from "@theia/core/lib/common";
import { inject, injectable } from "@theia/core/shared/inversify";
import { HelloBackendWithClientService } from "../common/protocol";
import { WorkspaceService } from "@theia/workspace/lib/browser/workspace-service";
import { EditorManager } from '@theia/editor/lib/browser/editor-manager';


const SayHelloViaBackendCommandWithCallBack: Command = {
  id: "sayHelloOnBackendWithCallBack.command",
  label: "Say hello on the backend with a callback to the client",
};
const CompileCommand: Command = {
  id: "compile.command",
  label: "Compile Code",
};
@injectable()
export class CdtCloudCommandContribution implements CommandContribution {
  @inject(WorkspaceService)
  protected readonly workspaceService: WorkspaceService;

  @inject(EditorManager)
  protected readonly editorManager: EditorManager;

  constructor(
    @inject(HelloBackendWithClientService)
    private readonly helloBackendWithClientService: HelloBackendWithClientService,
    
    @inject(CompilationService)
    private readonly compilationService: CompilationService
  ) {}

  registerCommands(registry: CommandRegistry): void {
    registry.registerCommand(SayHelloViaBackendCommandWithCallBack, {
      execute: () => {
        // Get the currently opened path
        console.log(this.workspaceService.workspace?.resource);
        this.helloBackendWithClientService.greet().then((r) => console.log(r));
      },
    });
    registry.registerCommand(CompileCommand, {
      execute: () => {
        const currentEditor = this.editorManager.currentEditor;
        console.log("This is: " + currentEditor?.editor.document.uri);
        // Get the currently opened path
        //console.log(this.workspaceService.workspace?.resource);
        
        this.compilationService.compile("arduino:avr:circuitplay32u4cat", "aa8083dd-4f36-4eeb-8fa3-9ac3c867f55e", "C:\\Users\\kevin\\Documents\\Arduino\\Light_Project_1")
      },
    });
  }
}
