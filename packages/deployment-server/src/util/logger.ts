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
import { env } from 'node:process'
import pino, { HttpLogger } from 'pino-http'

const devTransport = {
  target: 'pino-pretty',
  options: {
    colorize: true,
    translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l'
  }
}

export const pinoHttp = pino({
  transport: env.NODE_ENV === 'development' ? devTransport : undefined,
  redact: env.NODE_ENV === 'development' ? ['req.headers', 'res.headers'] : undefined,
  level: env.NODE_ENV === 'test' ? 'fatal' : 'info'
})

export const logger: HttpLogger['logger'] = pinoHttp.logger

export default logger
