import { FunctionComponent } from 'react'

export type Props<F> = F extends FunctionComponent<infer P> ? P : never

export function defineFunctionalComponent<P = {},> (f: FunctionComponent<P>): FunctionComponent<P> {
  return f
}
export default defineFunctionalComponent
