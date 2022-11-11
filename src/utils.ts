import { MessageResolver } from './types'

/** @hidden */
export function parseStr<T>(o: string | MessageResolver<T>, val: T) {
  return typeof o === 'function' ? o(val) : o
}
