import { ContainerModule } from '@theia/core/shared/inversify';
import { CdtcloudWidget } from './cdtcloud-widget';
import { CdtcloudContribution } from './cdtcloud-contribution';
import { bindViewContribution, FrontendApplicationContribution, WidgetFactory } from '@theia/core/lib/browser';

import '../../src/browser/style/index.css';

export default new ContainerModule(bind => {
    bindViewContribution(bind, CdtcloudContribution);
    bind(FrontendApplicationContribution).toService(CdtcloudContribution);
    bind(CdtcloudWidget).toSelf();
    bind(WidgetFactory).toDynamicValue(ctx => ({
        id: CdtcloudWidget.ID,
        createWidget: () => ctx.container.get<CdtcloudWidget>(CdtcloudWidget)
    })).inSingletonScope();
});
