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

import prisma from '@prisma/client'
import type { PrismaClient, Prisma } from '@prisma/client'
import logger from './logger'

declare module 'http' {
  interface IncomingMessage {
    db: PrismaClient
  }
}

export let db: PrismaClient

export default async function connect (opts: Prisma.PrismaClientOptions = {}): Promise<PrismaClient> {
  const client = new prisma.PrismaClient(opts)
  db = client
  await client.$connect()
  logger.info('Connected to Prisma')
  return client
}
