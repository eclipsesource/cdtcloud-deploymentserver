import { ContainerModule, injectable } from "@theia/core/shared/inversify";
import { CdtcloudWidget } from "./cdtcloud-widget";
import { CdtcloudContribution } from "./cdtcloud-contribution";
import {
  bindViewContribution,
  FrontendApplicationContribution,
  WebSocketConnectionProvider,
  WidgetFactory,
} from "@theia/core/lib/browser";

import "../../src/browser/style/index.css";
import { CdtCloudCommandContribution } from "./cdtcloud-command-contribution";
import { CommandContribution } from "@theia/core";
import {
  BackendClient,
  HelloBackendService,
  HELLO_BACKEND_PATH,
  HelloBackendWithClientService,
  HELLO_BACKEND_WITH_CLIENT_PATH,
} from "../common/protocol";

export default new ContainerModule((bind) => {
  bindViewContribution(bind, CdtcloudContribution);
  bind(FrontendApplicationContribution).toService(CdtcloudContribution);
  bind(CdtcloudWidget).toSelf();
  bind(WidgetFactory)
    .toDynamicValue((ctx) => ({
      id: CdtcloudWidget.ID,
      createWidget: () => ctx.container.get<CdtcloudWidget>(CdtcloudWidget),
    }))
    .inSingletonScope();

  bind(CommandContribution).to(CdtCloudCommandContribution).inSingletonScope();
  bind(BackendClient).to(BackendClientImpl).inSingletonScope();

  bind(HelloBackendService)
    .toDynamicValue((ctx) => {
      const connection = ctx.container.get(WebSocketConnectionProvider);
      return connection.createProxy<HelloBackendService>(HELLO_BACKEND_PATH);
    })
    .inSingletonScope();

  bind(HelloBackendWithClientService)
    .toDynamicValue((ctx) => {
      const connection = ctx.container.get(WebSocketConnectionProvider);
      const backendClient: BackendClient = ctx.container.get(BackendClient);
      return connection.createProxy<HelloBackendWithClientService>(
        HELLO_BACKEND_WITH_CLIENT_PATH,
        backendClient
      );
    })
    .inSingletonScope();
});

@injectable()
class BackendClientImpl implements BackendClient {
  async getName(): Promise<string> {
    return "Theia";
  }
}
