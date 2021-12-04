import { ConnectionHandler, JsonRpcConnectionHandler } from "@theia/core";
import { ContainerModule } from "@theia/core/shared/inversify";
import {
  BackendClient,
  HelloBackendWithClientService,
  DeviceTypeService,
  DEVICE_TYPES_PATH,
  HELLO_BACKEND_WITH_CLIENT_PATH,
} from "../common/protocol";
import { HelloBackendWithClientServiceImpl } from "./hello-backend-with-client-service";
import { DeviceTypeServiceImpl } from "./device-types-service";

export default new ContainerModule((bind) => {
  bind(DeviceTypeService).to(DeviceTypeServiceImpl).inSingletonScope();
  bind(ConnectionHandler)
    .toDynamicValue(
      (ctx) =>
        new JsonRpcConnectionHandler(DEVICE_TYPES_PATH, () => {
          return ctx.container.get<DeviceTypeService>(DeviceTypeService);
        })
    )
    .inSingletonScope();

  bind(HelloBackendWithClientService)
    .to(HelloBackendWithClientServiceImpl)
    .inSingletonScope();
  bind(ConnectionHandler)
    .toDynamicValue(
      (ctx) =>
        new JsonRpcConnectionHandler<BackendClient>(
          HELLO_BACKEND_WITH_CLIENT_PATH,
          (client) => {
            const server = ctx.container.get<HelloBackendWithClientServiceImpl>(
              HelloBackendWithClientService
            );
            server.setClient(client);
            client.onDidCloseConnection(() => server.dispose());
            return server;
          }
        )
    )
    .inSingletonScope();
});
