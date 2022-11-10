import * as React from 'react'
import {
  BlurEvent,
  ChangeEvent,
  ErrorMessage,
  ErrorStrings,
  FieldOptions,
  FieldReturn,
  UseFormOptions,
  UseFormReturn,
} from './types'

/** The main hook for using forms. See each option and return property for more information. */
export function useForm<T>({
  initialState = {},
  errorMessages = {},
  autoValidateBehavior = 'onChange',
  onSubmit,
}: UseFormOptions<T> = {}): UseFormReturn<T> {
  errorMessages = {
    required: 'Required',
    minLength: (n) => `Must be at least ${n} characters long`,
    maxLength: (n) => `Must be no more than ${n} characters long`,
    pattern: (p) => `Must match pattern ${p}`,
    ...errorMessages,
  }
  const [state, setState] = React.useState<Partial<T>>(initialState ?? {})
  const [rawState, setRawState] = React.useState<
    Partial<Record<keyof T, string | string[] | number>>
  >(
    Object.entries(state).reduce(
      (acc, [key, value]) => ({ ...acc, [key]: String(value) }),
      {} as Partial<Record<keyof T, string | string[] | number>>,
    ),
  )
  const [errors, setErrors] = React.useState<Partial<Record<keyof T, ErrorMessage>>>({})
  const isValid = React.useMemo(() => !Object.values(errors).some(Boolean), [errors])

  function setValue<K extends keyof T>(
    key: K,
    value: T[K] | string | string[] | number,
    raw: T[K] | string | string[] | number = value,
  ) {
    setRawState((prev) => ({ ...prev, [key]: raw }))
    setState((s) => ({ ...s, [key]: value }))
  }

  function validate<K extends keyof T>(
    key: K,
    value: T[K],
    options: FieldOptions<T, K>,
  ): ErrorMessage | undefined {
    const parseStr = (o: string | ((...args: unknown[]) => string), val: unknown) =>
      typeof o === 'function' ? o(val) : o

    const errorStrings = {
      ...errorMessages,
      ...(options?.errorMessages ?? {}),
    } as ErrorStrings

    // Required
    if (options?.required && !value) {
      return { error: 'required', message: errorStrings.required }
    }

    // Min length
    if (options?.minLength && value && (value as string | string[]).length < options.minLength) {
      return { error: 'minLength', message: parseStr(errorStrings.minLength, options.minLength) }
    }

    // Max length
    if (options?.maxLength && value && (value as string | string[]).length > options.maxLength) {
      return { error: 'maxLength', message: parseStr(errorStrings.maxLength, options.maxLength) }
    }

    // Custom validations
    const validRes = options?.validate?.(value as T[K])

    if (![undefined, null, ''].includes(validRes)) {
      return { error: 'validate', message: validRes }
    }

    return undefined
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function parseValue<K extends keyof T, E extends HTMLElement = HTMLInputElement>(
    value: string | number | string[] | null | undefined,
    options?: FieldOptions<T, K>,
  ): string | number | string[] | undefined | T[K] {
    const parsed = options?.parse ? options.parse(value as string) : value

    if (value !== '' && options?.pattern) {
      if (!new RegExp(options.pattern).test(parsed as string)) {
        return
      }
    }

    return parsed!
  }

  function fieldProps<K extends keyof T, E>(key: K, options?: FieldOptions<T, K>): FieldReturn<E> {
    if (autoValidateBehavior === 'immediate') {
      setErrorsFromRaw<K>(key, rawState[key], options)
    }

    return {
      value: rawState[key] ?? '',
      onChange: (e: ChangeEvent) => {
        const value = parseValue(e.target.value, options)
        if (value === undefined) {
          return
        }
        setValueFromRaw<K>(key, e.target.value, options)

        if (autoValidateBehavior === 'onChange') {
          if (setErrorsFromRaw(key, e.target.value, options)) {
            options?.onChange?.(e, value as T[K])
          }
        }
      },
      onBlur: (e: BlurEvent) => {
        const value = parseValue(e.target.value, options)
        if (value === undefined) {
          return
        }
        setValueFromRaw<K>(key, e.target.value, options)

        if (autoValidateBehavior === 'onBlur') {
          if (setErrorsFromRaw(key, e.target.value, options)) {
            options?.onChange?.(e, value as T[K])
          }
        }
      },
    }
  }

  function setErrorsFromRaw<K extends keyof T>(
    key: K,
    value: string | string[] | number,
    options: FieldOptions<T, K>,
  ): boolean {
    const parsed = parseValue(value, options)
    const error = validate(key, parsed as T[K], options ?? {})

    if (error) {
      setErrors((e) => ({ ...e, [key]: error }))
      return false
    }
    setErrors((e) => {
      const copy = { ...e }
      delete copy[key]
      return copy
    })
    return true
  }

  function setValueFromRaw<K extends keyof T>(
    key: K,
    value: string | string[] | number,
    options: FieldOptions<T, K>,
  ) {
    const parsed = parseValue(value, options)
    setValue(key, parsed as T[K], value)
  }

  function setValues(values: Partial<T>): void {
    Object.entries(values).forEach(([key, value]) => setValue(key as keyof T, value as T[keyof T]))
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault()
    if (isValid) {
      onSubmit?.(state as T, e)
    }
  }

  return {
    field: fieldProps,
    errors,
    state,
    rawState,
    isValid,
    setValue,
    setValues: setValues,
    handleSubmit,
  }
}
