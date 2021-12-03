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
