import { Validator } from 'express-json-validator-middleware'
import { RequestHandler } from 'express'

export const validate = new Validator({
  coerceTypes: true,
  useDefaults: 'empty'
}).validate as <Params = any, ResBody = any, ReqBody = any, Locals = Record<string, any>>(
  ...args: Parameters<Validator['validate']>
) => RequestHandler<Params, ResBody, ReqBody, Locals>
