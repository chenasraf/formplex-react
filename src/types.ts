/**
 * Options for the `useForm` hook
 */
export interface UseFormOptions<T> {
  /**
   * The initial state of the form. This will cause the form inputs to be pre-filled with the given data.
   * Any missing field will be empty.
   */
  initialState?: Partial<T>

  /**
   * Callback that will be fired when the form is submitted. The callback will receive the form data.
   */
  onSubmit?: (values: T, e: React.FormEvent<HTMLFormElement>) => void

  /**
   * Map of custom error messages for the default validation methods.
   * @see {ErrorStrings}
   */
  errorMessages?: Partial<ErrorStrings>

  /**
   * Decide when to auto validate the form. Defaults to `onChange`.
   *
   * `immediate` - Show validation errors as soon as the hook mounts.
   *
   * `onChange` - Show validations after the user has changed the input.
   *
   * `onBlur` - Show validations after the user has blurred the input.
   *
   * `never` - Show validations after the user has submitted the form only, or on manual trigger.
   */
  autoValidateBehavior?: 'immediate' | 'onChange' | 'onBlur' | 'never'
}

export interface UseFormReturn<T> {
  /**
   * Register a field input named `key` to the form. This will return props that should be injected into the input.
   * See each of the options for more information.
   */
  field: <K extends keyof T, E>(key: K, options?: FieldOptions<T, K>) => FieldReturn<E>

  /**
   * A mapping of the error messages given for each field.
   * Each property is the name of the field and the value is the error message, if any.
   *
   * If there is no error, the value will be `undefined`.
   */
  errors: Partial<Record<keyof T, ErrorMessage>>

  /**
   * The current form data, after parsing.
   */
  state: Partial<T>

  /**
   * The current form data, before parsing.
   */
  rawState: Partial<Record<keyof T, string | string[] | number>>

  /**
   * Indicates whether the form is valid.
   */
  isValid: boolean

  /**
   * A callback that will submit the form. This will also call `onSubmit` if it was provided.
   * You should inject this into the form's `onSubmit` prop.
   */
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void

  /**
   * Set multiple fields at once. This will cause the form to re-render.
   */
  setValues: (values: Partial<T>) => void

  /**
   * Set a single field. This will cause the form to re-render.
   */
  setValue: <K extends keyof T>(key: K, value: T[K]) => void
}

export interface FieldOptions<T, K extends keyof T = keyof T> {
  /**
   * If `true`, the field will be required.
   *
   * This will cause the form to be invalid if the field is empty
   *  and an error message will be provided in `errors`.
   */
  required?: boolean

  /**
   * Minimum length (in characters) for the field.
   *
   * This will cause the form to be invalid if the field is shorter than the given length,
   * and an error message will be provided in `errors`.
   */
  minLength?: number

  /**
   * Maximum length (in characters) for the field.
   *
   * This will cause the form to be invalid if the field is longer than the given length,
   * and an error message will be provided in `errors`.
   */
  maxLength?: number

  /**
   * A regular expression that the field must match.
   *
   * This will cause the input to not update if the value does not match the given pattern.
   * To cause a validation error for a pattern, use `validate` instead.
   */
  pattern?: string | RegExp

  /**
   * Map of custom error messages for the default validation methods.
   */
  errorMessages?: Partial<ErrorStrings>

  /**
   * A custom validation function for the field.
   *
   * If it returns an empty string, `null` or `undefined`, the field is valid.
   *
   * Otherwise, the field is invalid and the returned string will be the error message.
   */
  validate?: (value: T[K]) => string | undefined | null

  /**
   * A custom parser for the field. This will be called when the field is updated, and will cause the `state` object
   * to be updated with the result of this function.
   *
   * `rawState` will always contain the raw value of the field as it was placed here.
   */
  parse?: (value: string) => T[K]

  /**
   * A callback for changing the input, which also contains the parsed value.
   *
   * Never use `onChange` on the input field directly, or it will not work to update the form state.
   * Use this callback instead, which acts right after the input's `onChange` callback.
   */
  onChange?: (event: ChangeEvent, value: T[K]) => void
}

export interface ErrorMessage {
  /**
   * The type of validation error on the field, such as `required`, `minLength`, `maxLength`, and `pattern`, or
   * `validate` for custom validations
   */
  error: keyof ErrorStrings | 'validate'
  /**
   * The error message for the field.
   */
  message: string
}

/** @internal */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type FieldReturn<E> = {
  /**
   * The value of the field.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any
  /**
   * Whether field is required.
   */
  required?: boolean
  /**
   * Change event callback
   */
  onChange: (event: ChangeEvent) => void
  /**
   * Blur event callback
   */
  onBlur: (event: ChangeEvent) => void
}

/** @internal */
export type ChangeEvent = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  target: any
}
/** @internal */
export type BlurEvent = ChangeEvent

/**
 * Map of custom error messages for the default validation methods.
 */
export interface ErrorStrings {
  /**
   * Error message for when the field is required but missing.
   *
   * Default: `"Required"`
   */
  required: string
  /**
   * Error message for when the field length is too short.
   *
   * Can either be a string, or a function resolving to a string.
   *
   * Default:
   * ```ts
   * (n) => `Must be at least ${n} characters long`
   * ```
   */
  minLength: string | ((length: number) => string)
  /**
   * Error message for when the field length is too long.
   *
   * Can either be a string, or a function resolving to a string.
   *
   * Default:
   * ```ts
   * (n) => `Must be no more than ${n} characters long`
   * ```
   */
  maxLength: string | ((length: number) => string)
  /**
   * Error message for when the field value does not match the given pattern.
   *
   * Can either be a string, or a function resolving to a string.
   *
   * Default:
   * ```ts
   * (p) => `Must match pattern ${p}`
   * ```
   */
  pattern: string | ((pattern: string | RegExp) => string)
}
