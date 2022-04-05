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

import { PreferenceSchema, PreferenceProxy, PreferenceService, createPreferenceProxy, PreferenceContribution } from '@theia/core/lib/browser/preferences'
import { interfaces } from '@theia/core/shared/inversify'

export const hostingPreferenceSchema: PreferenceSchema = {
  type: 'object',
  properties: {
    'Deployment Server Host': {
      type: 'string',
      default: '127.0.0.1:3001',
      description: 'where should the application be hosted'
    },
    'Deployment Server Secure': {
      type: 'boolean',
      default: 'true',
      description: 'Is it a secure server? (http:// or https://)'
    }
  }
}

export interface HostingConfiguration {
  'Deployment Server Host': string
  'Deployment Server Secure': boolean
}

export const HostingPreferenceContribution = Symbol('HostingPreferenceContribution')
export const HostingPreferencesSymbol = Symbol('HostingPreferences')
export type HostingPreferences = PreferenceProxy<HostingConfiguration>

export function createHostingPreferences (preferences: PreferenceService, schema: PreferenceSchema = hostingPreferenceSchema): HostingPreferences {
  return createPreferenceProxy(preferences, schema)
}

export function bindHostingPreferences (bind: interfaces.Bind): void {
  bind(HostingPreferencesSymbol).toDynamicValue(ctx => {
    const preferences = ctx.container.get<PreferenceService>(PreferenceService)
    const contribution = ctx.container.get<PreferenceContribution>(HostingPreferenceContribution)
    return createHostingPreferences(preferences, contribution.schema)
  }).inSingletonScope()
  bind(HostingPreferenceContribution).toConstantValue({ schema: hostingPreferenceSchema })
  bind(PreferenceContribution).toService(HostingPreferenceContribution)
}
