import { ConnectionHandler, JsonRpcConnectionHandler } from "@theia/core";
import { ContainerModule } from "@theia/core/shared/inversify";
import {
  DeviceTypeService,
  DEVICE_TYPES_PATH,
  CompilationService,
  COMPILATION_PATH,
} from "../common/protocol";
import { CompilationServiceImpl } from "./compilation-service";
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

  bind(CompilationService).to(CompilationServiceImpl).inSingletonScope();
  bind(ConnectionHandler)
    .toDynamicValue(
      (ctx) =>
        new JsonRpcConnectionHandler(COMPILATION_PATH, () => {
          return ctx.container.get<CompilationService>(CompilationService);
        })
    )
    .inSingletonScope();
});
