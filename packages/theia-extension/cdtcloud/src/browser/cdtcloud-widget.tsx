import * as React from 'react';
import Select from 'react-select';
import { injectable, postConstruct, inject } from '@theia/core/shared/inversify';
import { AlertMessage } from '@theia/core/lib/browser/widgets/alert-message';
import { ReactWidget } from '@theia/core/lib/browser/widgets/react-widget';
import { MessageService } from '@theia/core';


@injectable()
export class CdtcloudWidget extends ReactWidget {

  static readonly ID = 'cdtcloud:widget';
  static readonly LABEL = 'Cdtcloud Widget';

  @inject(MessageService)
  protected readonly messageService!: MessageService;



  @postConstruct()
  protected async init(): Promise<void> {
    this.id = CdtcloudWidget.ID;
    this.title.label = CdtcloudWidget.LABEL;
    this.title.caption = CdtcloudWidget.LABEL;
    this.title.closable = true;
    this.title.iconClass = 'fa fa-window-maximize';
    this.update();
  }




  render(): React.ReactElement {

    const header = `This widget enables you to deploy your code on a remote (Arduino-)board.`;

    //hier availableDevices einfügen
    const options = [
      { value: 'uniqueId1', label: 'Arduino Uno' },
      { value: 'uniqueId2', label: 'Arduino Due' },
      { value: 'uniqueId3', label: 'Arduino Trio' }
    ]

    return <div id='widget-container'>
      <AlertMessage type='INFO' header={header} />

      <h2> Select a Board to deploy your code on from this list</h2>

      <Select options={options} />
      <button className='theia-button secondary' title='Display Message' onClick={_a => this.deployOnBoard()}>Deploy on Board</button>
    </div>
  }

  protected async deployOnBoard(): Promise<void> {

    const data = { deviceTypeId: '37dcb3ab-071d-43e1-935a-1e70403e4720', artifactUri: 'https://sanctum-dev.com/tests.bin' };

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