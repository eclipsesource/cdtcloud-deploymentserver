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
import { StatusObject } from '@grpc/grpc-js'
import { Status } from '@grpc/grpc-js/build/src/constants'
import { Response } from 'undici'

export const grpcStatusToError = (status: StatusObject): string => {
  const details: string = status.details === '' ? (status.code === 0 ? 'Success' : 'Unknown error') : status.details
  const statusCode = grpcStatusCodeToName(status.code)

  return `${details} (code: ${status.code} - ${statusCode})`
}

export const grpcStatusCodeToName = (code: Status): string => {
  return Status[code]
}

export const httpError = (resp: Response): Error => {
  return new Error(`Request failed: ${resp.url} - ${resp.status} (${resp.statusText})`)
}
