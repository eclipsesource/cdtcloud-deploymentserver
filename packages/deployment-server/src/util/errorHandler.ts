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

import type { Request, Response, NextFunction } from 'express'
import { ValidationError } from 'express-json-validator-middleware'
import { logger } from './logger'

export function errorHandler (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response {
  if (err instanceof Error) {
    if (err instanceof SyntaxError) {
      return res.status(400).json(err)
    } else if (err instanceof ValidationError) {
      return res
        .status(400)
        .json({
          message: err.message.length > 0 ? err.message : 'Bad Request',
          errors: err.validationErrors
        })
    }
  }

  logger.error(err, 'Caught Error')
  return res.sendStatus(500)
}
