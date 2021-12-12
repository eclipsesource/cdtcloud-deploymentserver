import 'reflect-metadata';
import { MessageService } from '@theia/core';
import { ContainerModule, Container } from '@theia/core/shared/inversify';
import { CdtcloudWidget } from './cdtcloud-widget';

describe('CdtcloudWidget', () => {

    let widget: CdtcloudWidget;

    beforeEach(async () => {
        const module = new ContainerModule( bind => {
            bind(MessageService).toConstantValue({
                info(message: string): void {
                    console.log(message);
                }
            } as MessageService);
            bind(CdtcloudWidget).toSelf();
        });
        const container = new Container();
        container.load(module);
        widget = container.resolve<CdtcloudWidget>(CdtcloudWidget);
    });

    it('should inject \'MessageService\'', () => {
        const spy = jest.spyOn(widget as any, 'deployOnBoard')
        widget['deployOnBoard']({ deviceTypeId: '37dcb3ab-071d-43e1-935a-1e70403e4720', artifactUri: 'https://sanctum-dev.com/tests.bin' });
        expect(spy).toBeCalled();
    });

});
