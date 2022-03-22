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

import { env } from 'process'
import pino from 'pino'
import { grpcStatusToError } from './errors'
import { StatusObject } from '@grpc/grpc-js'

const statusObjectKeys = ['code', 'details', 'metadata'].toString()

const formatters = {
  log (object: object) {
    if (Object.keys(object).toString() === statusObjectKeys) {
      return { msg: grpcStatusToError(object as StatusObject) }
    }
    return object
  }
}

const transport = {
  target: 'pino-pretty',
  options: {
    colorize: env.NODE_ENV === 'development',
    translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l'
  }
}

export const logger = pino({
  name: 'DeviceConnector',
  transport,
  level: env.LOG_LEVEL ?? 'info',
  formatters
})
