/********************************************************************************
    Copyright (c) 2022 EclipseSource and others.

    This program and the accompanying materials are made available under the
    terms of the Eclipse Public License v. 2.0 which is available at
    http://www.eclipse.org/legal/epl-2.0.

    This Source Code may also be made available under the following Secondary
    Licenses when the conditions for such availability set forth in the Eclipse
    Public License v. 2.0 are satisfied: GNU General Public License, version 2
    with the GNU Classpath Exception which is available at
    https://www.gnu.org/software/classpath/license.html.

    SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
********************************************************************************/

import { ContainerModule } from '@theia/core/shared/inversify'
import { CdtcloudWidget } from './cdtcloud-widget'
import { CdtcloudContribution } from './cdtcloud-contribution'
import {
  bindViewContribution,
  FrontendApplicationContribution,
  WebSocketConnectionProvider,
  WidgetFactory
} from '@theia/core/lib/browser'

import '../../src/browser/style/index.css'
import {
  CompilationService,
  CompilationServiceSymbol,
  COMPILATION_PATH,
  ConfigService,
  ConfigServiceSymbol,
  CONFIG_PATH,
  DeviceTypeService,
  DeviceTypeServiceSymbol,
  DEVICE_TYPES_PATH
} from '../common/protocol'
import { DeploymentManager } from './monitoring/DeploymentManager'

export default new ContainerModule((bind) => {
  bindViewContribution(bind, CdtcloudContribution)
  bind(FrontendApplicationContribution).toService(CdtcloudContribution)
  bind(CdtcloudWidget).toSelf()
  bind(WidgetFactory)
    .toDynamicValue((ctx) => ({
      id: CdtcloudWidget.ID,
      createWidget: () => ctx.container.get<CdtcloudWidget>(CdtcloudWidget)
    }))
    .inSingletonScope()

  bind(DeploymentManager).toSelf().inSingletonScope()

  bind(DeviceTypeServiceSymbol)
    .toDynamicValue((ctx) => {
      const connection = ctx.container.get(WebSocketConnectionProvider)
      return connection.createProxy<DeviceTypeService>(DEVICE_TYPES_PATH)
    })
    .inSingletonScope()

  bind(CompilationServiceSymbol)
    .toDynamicValue((ctx) => {
      const connection = ctx.container.get(WebSocketConnectionProvider)
      return connection.createProxy<CompilationService>(COMPILATION_PATH)
    })
    .inSingletonScope()

  bind(ConfigServiceSymbol)
    .toDynamicValue((ctx) => {
      const connection = ctx.container.get(WebSocketConnectionProvider)
      return connection.createProxy<ConfigService>(CONFIG_PATH)
    })
    .inSingletonScope()
})
