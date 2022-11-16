import * as React from 'react'
import {
  BlurEvent,
  ChangeEvent,
  ErrorMessage,
  ErrorStrings,
  FieldOptions,
  FieldReturn,
  InputType,
  UseFormOptions,
  UseFormReturn,
} from './types'
import { parseStr } from './utils'

/**
 * The main hook for using forms. See each option and return property for more information
 *
 * @typeParam T - The type of the form state.
 * @param options Form options
 * @returns Object containing the form state, errors, and field registration.
 * @see {@link UseFormOptions}
 * @see {@link UseFormReturn}
 */
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
    ...errorMessages,
  }
  const fields = React.useRef<Record<keyof T, FieldOptions<keyof T>>>(
    {} as unknown as Record<keyof T, FieldOptions<keyof T>>,
  )
  const [state, setState] = React.useState<Partial<T>>(initialState ?? {})
  const [dirty, setDirty] = React.useState<Partial<Record<keyof T, boolean>>>({})
  const [rawState, setRawState] = React.useState<Partial<Record<keyof T, InputType>>>(
    Object.entries(state).reduce(
      (acc, [key, value]) => ({ ...acc, [key]: value }),
      {} as Partial<Record<keyof T, InputType>>,
    ),
  )
  const [errors, setErrors] = React.useState<Partial<Record<keyof T, ErrorMessage>>>({})
  const isValid = React.useMemo(() => !Object.values(errors).some(Boolean), [errors])

  function setValue<K extends keyof T>(
    key: K,
    value: T[K] | InputType,
    raw: T[K] | InputType = value,
  ) {
    setRawState((prev) => ({ ...prev, [key]: raw }))
    setState((prev) => ({ ...prev, [key]: value }))
    setDirty((prev) => ({ ...prev, [key]: true }))
  }

  function validate<K extends keyof T>(
    key: K,
    value: T[K],
    options: FieldOptions<T, K>,
  ): ErrorMessage | undefined {
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
    value: InputType | null | undefined,
    options?: FieldOptions<T, K>,
  ): InputType | InputType[] | undefined | T[K] | T[K][] {
    const parsed = options?.parse ? options.parse(value) : value

    if (value !== '' && options?.pattern) {
      if (!new RegExp(options.pattern).test(parsed as string)) {
        return
      }
    }

    return parsed!
  }

  function fieldProps<K extends keyof T, E>(key: K, options?: FieldOptions<T, K>): FieldReturn<E> {
    const isArrayField =
      options?.multiple || (initialState[key] && Array.isArray(initialState[key]))
    options = { ...options, multiple: options?.multiple ?? isArrayField }

    fields.current = {
      ...fields.current,
      [key]: options,
    }

    if (autoValidateBehavior === 'immediate') {
      setErrorsFromRaw<K>(key, rawState[key], options)
    }

    return {
      name: key as string,
      value: rawState[key] ?? (isArrayField ? [] : ''),
      onChange: (e: ChangeEvent) => {
        e.persist?.()
        const value = parseValue(e.target.value, options)
        if (value === undefined) {
          return
        }
        const isValid =
          !['immediate', 'onChange'].includes(autoValidateBehavior) ||
          !setErrorsFromRaw<K>(key, value, options)

        if (isValid) {
          options?.onChange?.(e, value as T[K])
        }

        if (!e.defaultPrevented) {
          setValueFromRaw<K>(key, e.target.value, options)
        }
      },
      onBlur: (e: BlurEvent) => {
        e.persist?.()
        const value = parseValue(e.target.value, options)
        if (value === undefined) {
          return
        }

        const isValid =
          !['immediate', 'onBlur'].includes(autoValidateBehavior) ||
          !setErrorsFromRaw<K>(key, value, options)

        if (isValid) {
          options?.onBlur?.(e, value as T[K])
        }
      },
    }
  }

  function setErrorsFromRaw<K extends keyof T>(
    key: K,
    value: InputType,
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
    value: InputType,
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

  function validateAll(): boolean {
    const errors = Object.entries(rawState).reduce((acc, [key, value]) => {
      const error = validate(
        key as keyof T,
        value as T[keyof T],
        (fields.current[key as keyof T] ?? {}) as FieldOptions<T, keyof T>,
      )
      if (error) {
        return { ...acc, [key]: error }
      }
      return acc
    }, {} as Partial<Record<keyof T, ErrorMessage>>)

    setErrors(errors)
    return Object.values(errors).length === 0
  }

  return {
    field: fieldProps,
    errors,
    state,
    rawState,
    isValid,
    dirty,
    setValue,
    setValues: setValues,
    handleSubmit,
    validate: validateAll,
  }
}
