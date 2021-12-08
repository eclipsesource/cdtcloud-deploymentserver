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
        widget['deployOnBoard']();
        expect(spy).toBeCalled();
    });

});
