import * as React from "react";
import { TypeSelect } from "./cdtcloud-widget/TypeSelect";
import {
  injectable,
  postConstruct,
  inject,
} from "@theia/core/shared/inversify";
import { AlertMessage } from "@theia/core/lib/browser/widgets/alert-message";
import { ReactWidget } from "@theia/core/lib/browser/widgets/react-widget";
import { MessageService } from "@theia/core";
import { CompilationService, DeviceTypeService } from "../common/protocol";
import { EditorManager } from "@theia/editor/lib/browser/editor-manager";
import { WorkspaceService } from "@theia/workspace/lib/browser/workspace-service";
import { FileUri } from "@theia/core/lib/node/file-uri";
import {
  OutputChannel,
  OutputChannelManager,
  OutputChannelSeverity,
} from "@theia/output/lib/browser/output-channel";

@injectable()
export class CdtcloudWidget extends ReactWidget {
  deviceList: any[] = [];
  options: any[] = [];
  selected: { label: string; value: string };
  static readonly ID = "cdtcloud:widget";
  static readonly LABEL = "Cdtcloud Widget";

  @inject(MessageService)
  protected readonly messageService!: MessageService;

  private channel!: OutputChannel;

  constructor(
    @inject(DeviceTypeService)
    private readonly deviceTypeService: DeviceTypeService,
    @inject(CompilationService)
    private readonly compilationService: CompilationService,
    @inject(EditorManager)
    protected readonly editorManager: EditorManager,
    @inject(WorkspaceService)
    protected readonly workspaceService: WorkspaceService,
    @inject(OutputChannelManager)
    protected readonly outputChannelManager: OutputChannelManager
  ) {
    super();
  }

  @postConstruct()
  protected async init(): Promise<void> {
    this.id = CdtcloudWidget.ID;
    this.title.label = CdtcloudWidget.LABEL;
    this.title.caption = CdtcloudWidget.LABEL;
    this.title.closable = true;
    this.title.iconClass = "fa fa-window-maximize";
    this.update();
    this.getDeviceList();

    this.channel = this.outputChannelManager.getChannel("Device-Monitor");
  }

  render() {
    const header = `This widget enables you to deploy your code on a remote (Arduino-)board.`;

    return (
      <div id="widget-container">
        <AlertMessage type="INFO" header={header} />

        <h2> Select a Board to deploy your code on from this list</h2>
        <TypeSelect
          options={this.options}
          deployOnBoard={this.deployOnBoard.bind(this)}
        />
      </div>
    );
  }

  protected handleChange(option: { label: string; value: string }): void {
    this.selected = option;
  }

  protected async getDeviceList(): Promise<void> {
    try {
      this.deviceList = await this.deviceTypeService.getDeviceList();
      this.options = this.deviceList.map(({ id, name }) => ({
        label: name,
        value: id,
      }));
      this.update();
    } catch (err) {
      console.log(err);
    }
  }

  protected async deployOnBoard(board: any): Promise<void> {
    this.channel.show({ preserveFocus: true });
    this.channel.appendLine("HELLO", OutputChannelSeverity.Error);
    await this.messageService.info("Deployment Request sent.");

    const selectedBoard = this.deviceList.find((obj) => {
      return obj.id === board.value;
    });
    const sketchUri = this.workspaceService.workspace?.resource;
    if (sketchUri === undefined) {
      throw new Error("No Sketch found");
    }
    const sketchPath = FileUri.fsPath(sketchUri);
    await this.compilationService.compile(
      selectedBoard.fqbn,
      board.value,
      sketchPath
    );
  }
}
