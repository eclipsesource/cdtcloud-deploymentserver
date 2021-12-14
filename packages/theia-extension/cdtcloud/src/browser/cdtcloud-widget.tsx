import * as React from 'react';
import Select from 'react-select';
import { injectable, postConstruct, inject } from '@theia/core/shared/inversify';
import { AlertMessage } from '@theia/core/lib/browser/widgets/alert-message';
import { ReactWidget } from '@theia/core/lib/browser/widgets/react-widget';
import { MessageService } from '@theia/core';
import { CompilationService, DeviceTypeService } from "../common/protocol";
import { EditorManager } from '@theia/editor/lib/browser/editor-manager';
import { WorkspaceService } from '@theia/workspace/lib/browser/workspace-service';
import { FileUri } from "@theia/core/lib/node/file-uri";

@injectable()
export class CdtcloudWidget extends ReactWidget {
  deviceList: any[] = [];
  options: any[] = [];
  selected: { label: string, value: string };
  static readonly ID = 'cdtcloud:widget';
  static readonly LABEL = 'Cdtcloud Widget';

  @inject(MessageService)
  protected readonly messageService!: MessageService;

  constructor(
    @inject(DeviceTypeService)
    private readonly deviceTypeService: DeviceTypeService,
    @inject(CompilationService)
    private readonly compilationService: CompilationService,
    @inject(EditorManager)
    protected readonly editorManager: EditorManager,
    @inject(WorkspaceService)
    protected readonly workspaceService: WorkspaceService,
  ) {
    super()
  }

  @postConstruct()
  protected async init(): Promise<void> {
    this.id = CdtcloudWidget.ID;
    this.title.label = CdtcloudWidget.LABEL;
    this.title.caption = CdtcloudWidget.LABEL;
    this.title.closable = true;
    this.title.iconClass = 'fa fa-window-maximize';
    this.update();
    this.getDeviceList();
  }

  Selector = () => {
    let [board, setBoard] = React.useState({ label: "No board Selected", value: "" });
    return (<div>
      <Select
        value={board}
        options={this.options}
        onChange={e => {
          if (!e) return
          const newBoard = { label: e.label, value: e.value }
          setBoard(newBoard);
        }}
      />
      <button className='theia-button secondary' title='Display Message' onClick={_a => this.deployOnBoard(board)}>Deploy on Board</button>
    </div>)
  }


  render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> {
    const header = `This widget enables you to deploy your code on a remote (Arduino-)board.`;
    
    return <div id='widget-container'>
      <AlertMessage type='INFO' header={header} />

      <h2> Select a Board to deploy your code on from this list</h2>
      <this.Selector />
    </div>
  }

  protected handleChange(option: { label: string; value: string }): void {
    this.selected = option
  }

  protected async getDeviceList(): Promise<void> {
    try {
      this.deviceList = await this.deviceTypeService.getDeviceList()
      this.options = this.deviceList.map(({ id, name }) => ({ label: name, value: id }))
      this.update()
    } catch (err) {
      console.log(err)
    }


  }

  protected async deployOnBoard(board: any): Promise<void> {
    const selectedBoard = this.deviceList.find(obj => {
      return obj.id === board.value
    })
    const workspaceService = this.workspaceService;
    let sketchPath = "" + workspaceService.workspace?.resource.path
    sketchPath = sketchPath.substring(sketchPath.indexOf('/') + 1);
    console.log(sketchPath)
    if (sketchPath) {
      this.compilationService.compile(selectedBoard.fqbn, board.value, sketchPath)
    }

    this.messageService.info('Deployment Request send.');
  }
}