import { MessageResolver, Validator } from './types'
import { parseStr } from './utils'

/**
 * Combine multiple validators into one. The first validator to return an error message will be used.
 *
 * @param validators - The validators to combine.
 * @returns A validator that combines the given validators.
 */
export function combine(...validators: Validator[]): Validator {
  return (value: unknown) => {
    for (const validator of validators) {
      const error = validator(value)
      if (error) {
        return error
      }
    }
  }
}

/**
 * Create a validator that checks if the value is at or above a certain number.
 * @param n The number to check against.
 * @param message The error message to use if the value is below `n`.
 * @returns A validator that checks if the value is `n` or above.
 */
export function min(n: number, message: string | MessageResolver<number>): Validator<number> {
  return (value) => (value < n ? parseStr(message, n) : null)
}

/**
 * Create a validator that checks if the value is at or below a certain number.
 * @param n The number to check against.
 * @param message The error message to use if the value is above `n`.
 * @returns A validator that checks if the value is `n` or below.
 */
export function max(n: number, message: string | MessageResolver<number>): Validator<number> {
  return (value) => (value > n ? parseStr(message, n) : null)
}

/**
 * Create a validator that checks if the string is no less than `n` characters long.
 * @param n The minimum length of the string.
 * @param message The error message to use if the string is too short.
 * @returns A validator that checks if the string is at least `n` characters long.
 */
export function minLength(n: number, message: string | MessageResolver<number>): Validator<string> {
  return (value) => (value.length < n ? parseStr(message, n) : null)
}

/**
 * Create a validator that checks if the string is no more than `n` characters long.
 * @param n The maximum length of the string.
 * @param message The error message to use if the string is too long.
 * @returns A validator that checks if the string is at most `n` characters long.
 */
export function maxLength(n: number, message: string | MessageResolver<number>): Validator<string> {
  return (value) => (value.length > n ? parseStr(message, n) : null)
}

/**
 * Create a validator that checks if the string matches a regular expression.
 * @param regex The regular expression to match against.
 * @param message The error message to use if the string does not match the regular expression.
 * @returns A validator that checks if the string matches the regular expression.
 */
export function pattern(
  regex: RegExp,
  message: string | MessageResolver<RegExp>,
): Validator<string> {
  return (value) => (regex.test(value) ? null : parseStr(message, regex))
}
