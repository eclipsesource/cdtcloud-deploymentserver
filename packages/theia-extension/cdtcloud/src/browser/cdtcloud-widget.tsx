import * as React from 'react';
import Select from 'react-select';
import { injectable, postConstruct, inject } from '@theia/core/shared/inversify';
import { AlertMessage } from '@theia/core/lib/browser/widgets/alert-message';
import { ReactWidget } from '@theia/core/lib/browser/widgets/react-widget';
import { MessageService } from '@theia/core';
import { CompilationService, DeviceTypeService } from "../common/protocol";
import { EditorManager } from '@theia/editor/lib/browser/editor-manager';

@injectable()
export class CdtcloudWidget extends ReactWidget {
  options: any[] = [];
  selected: {label: string, value: string};
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
    let [board, setBoard] = React.useState({label: "No board Selected", value: ""});
    return (<div>
       <Select 
      value= {board} 
      options={this.options} 
      onChange = {e => {
        if (!e) return
        const newBoard = {label: e.label, value: e.value}
        setBoard(newBoard);
        }}
      />
      <button className='theia-button secondary' title='Display Message' onClick={_a => this.deployOnBoard(board)}>Deploy on Board</button>
    </div>)
  }
  

  render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> {
    const header = `This widget enables you to deploy your code on a remote (Arduino-)board.`;
    //hier availableDevices einfügen
    return <div id='widget-container'>
      <AlertMessage type='INFO' header={header} />

      <h2> Select a Board to deploy your code on from this list</h2>
      <this.Selector/>
      <Select 
      options={this.options} 
      />
      <button className='theia-button secondary' title='Display Message' onClick={_a => this.deployOnBoard(this.selected)}>Deploy on Board</button>
    </div>
  }

  protected handleChange(option: { label: string; value: string }): void {
    console.log(option)
    this.selected = option
  }

  protected async getDeviceList(): Promise<void> {
    try {
      this.options = (await this.deviceTypeService.getDeviceList()).map(({id, name}) => ({label: name, value: id}))
      this.update()
    }catch (err) {
      console.error(err)
    }
    

  }

  protected async deployOnBoard(board: any): Promise<void> {

    const data = { deviceTypeId: '37dcb3ab-071d-43e1-935a-1e70403e4720', artifactUri: 'https://sanctum-dev.com/tests.bin' };
    
    const currentEditor = this.editorManager.currentEditor;
        console.log("This is: " + currentEditor?.editor.document.uri);
        const sketchPath = currentEditor?.editor.document.uri
        console.log(board.value)
        if (sketchPath) {
          this.compilationService.compile("arduino:avr:mega", board.value, sketchPath).then((result) =>{
              //Todo: Handle result
              console.log(result)
        });
        }
        
    
    try {
      await fetch('http://127.0.0.1:3001/deployments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    }
    catch { }

    this.messageService.info('Deployment Request send.');
  }

}