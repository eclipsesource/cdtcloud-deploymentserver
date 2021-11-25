import { Type } from '@sinclair/typebox'

export const idParams = Type.Object({
  id: Type.String({ format: 'uuid' })
})

export type IdParams = typeof idParams
