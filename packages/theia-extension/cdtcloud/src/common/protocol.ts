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

export const DeviceTypeServiceSymbol = Symbol('DeviceType')
export const DEVICE_TYPES_PATH = '/services/device-types'

export interface DeviceTypeService {
  getDeviceList: () => Promise<any[]>
}

export const CompilationServiceSymbol = Symbol('Compilation')
export const COMPILATION_PATH = '/services/compilation'
export interface CompilationService {
  binaryFile: string
  artifactUri: string
  compile: (fqbn: string, id: string, sketchPath: string) => Promise<Deployment | DeploymentError>
}

export interface Deployment {
  kind: 'deployment'
  id: string
  status: string
  createdAt: Date
  updatedAt: Date
  artifactUrl: string | null
  deviceId: string
}

export interface DeploymentError {
  kind: 'deployment-error'
  statusMessage: string | undefined
  data: {
    name: string
    message: string
  }
}

export const ConfigServiceSymbol = Symbol('Config')
export const CONFIG_PATH = '/services/config'
export interface ConfigService {
  getWebsocketHost: () => Promise<string>
  getDeploymentServerHost: () => Promise<string>
}
