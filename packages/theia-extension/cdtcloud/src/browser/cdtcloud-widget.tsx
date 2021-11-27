import * as React from 'react';
import Select from 'react-select'
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
    protected async init(): Promise < void> {
        this.id = CdtcloudWidget.ID;
        this.title.label = CdtcloudWidget.LABEL;
        this.title.caption = CdtcloudWidget.LABEL;
        this.title.closable = true;
        this.title.iconClass = 'fa fa-window-maximize'; // example widget icon.
        this.update();
    }
    
    
/*
    private async getDevices() {
        const response = await fetch("localhost:3001/device-types");
        console.log(response);
        const data = await response.json();
        console.log(data);
    }
    */
    

    

    render(): React.ReactElement {
        const header = `This widget enables you to deploy your code on a remote (Arduino-)board.`;

        const options = [
            { value: 'uniqueId1', label: 'Arduino Uno' },
            { value: 'uniqueId2', label: 'Arduino Due' },
            { value: 'uniqueId3', label: 'Arduino Trio' }
          ]
        
         
         /*
        const numbers = [1, 2, 3, 4, 5];
        const listItems = numbers.map((number) =>
        <li key={number.toString()}>
                {number}
            </li>
        );
        
       
        const myBoards =  ["Arduino Uno ", "Arduino Due ", "Arduino Trio "];
        const BoardList = myBoards.map((myBoards) =>
        <li key={myBoards.toString()}>
            {myBoards}
        </li>
        );
        */

        return <div id='widget-container'>
            <AlertMessage type='INFO' header={header} / >
            
            <h2> Select a Board to deploy your code on from this list</h2>

            <Select options={options} />

            <hr></hr>

            {/* <button className='theia-button secondary' title='Refresh Devices' onClick={_a => this.refreshDevices()}>Refresh Devices</button> */}
            <button className='theia-button secondary' title='Deploy' onClick={_a => this.deployOnBoard()}>Deploy on Board</button>
        </div>
    }

    protected displayMessage(): void {
        this.messageService.info('Congratulations: Button Pressed!');

    }

    protected refreshDevices(): void {
        // Refresh devices
        // add some logic here 
        this.messageService.info('Refresh Devices');

    }
    
    protected deployOnBoard(): void{
        // Deploy
        // add some logic here 
        
        this.messageService.info('Deploying on Board x')
    }


     

}
