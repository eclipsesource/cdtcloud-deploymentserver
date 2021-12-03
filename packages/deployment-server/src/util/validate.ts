import { Validator } from 'express-json-validator-middleware'
import { RequestHandler } from 'express'

export const validate = new Validator({
  coerceTypes: true,
  useDefaults: 'empty'
}).validate as <ResBody = never, Params = {}, ReqBody = never, Locals = never>(
  ...args: Parameters<Validator['validate']>
) => RequestHandler<Params, ResBody, ReqBody, Locals>
