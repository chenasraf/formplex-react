import React from 'react'

/**
 * Options for the `useForm` hook
 *
 * @typeParam T - The type of the form state.
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
  onSubmit?(values: T, e: React.FormEvent<HTMLFormElement>): void

  /**
   * Map of custom error messages for the default validation methods.
   * @see {@link ErrorStrings} for definition of error messages
   * @see {@link FieldOptions.errorMessages | FieldOptions.errorMessages} for field-specific error messages
   * @see {@link FieldOptions.required | FieldOptions.required} for defining a field as required
   * @see {@link FieldOptions.minLength | FieldOptions.minLength} for defining a minimum length for the field
   * @see {@link FieldOptions.maxLength | FieldOptions.maxLength} for defining a maximum length for the field
   * @see {@link FieldOptions.validate | FieldOptions.validate} for defining a custom validation function
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
   *
   * @see {@link UseFormReturn.validate} for manual validation trigger
   */
  autoValidateBehavior?: 'immediate' | 'onChange' | 'onBlur' | 'never'
}

/**
 * Return value of the `useForm` hook. See each property for more information.
 */
export interface UseFormReturn<T> {
  /**
   * Register a field input named `key` to the form. This will return props that should be injected into the input.
   * See each of the options for more information.
   *
   * @typeParam K - The key of the field in the form state.
   * @typeParam E - The type of the input element.
   * @param key The name of the field.
   * @param options Options for the field.
   * @returns Props that should be injected into the input.
   * @see {@link FieldOptions}
   */
  field<K extends keyof T, E>(key: K, options?: FieldOptions<T, K>): FieldReturn<E>

  /**
   * A mapping of the error messages given for each field.
   * Each property is the name of the field and the value is the error message, if any.
   *
   * If there is no error, the value will be `undefined`.
   *
   * @see {@link ErrorMessage}
   */
  errors: Partial<Record<keyof T, ErrorMessage>>

  /**
   * The current form data, after parsing.
   */
  state: Partial<T>

  /**
   * The current form data, before parsing.
   */
  rawState: Partial<Record<keyof T, InputType>>

  /**
   * A mapping of all the fields that have been modified by the user.
   *
   * If a field is dirty, its key will be `true` in this object.
   */
  dirty: Partial<Record<keyof T, boolean>>

  /**
   * Indicates whether the form is valid.
   */
  isValid: boolean

  /**
   * A callback that will submit the form. This will also call `onSubmit` if it was provided.
   * You should inject this into the form's `onSubmit` prop.
   *
   * @param e The form submit event.
   */
  handleSubmit(e: React.FormEvent<HTMLFormElement>): void

  /**
   * Set multiple fields at once. This will cause the form to re-render.
   *
   * @param values The values to set, as an object of `{ field: value }`.
   * @see {@link UseFormReturn.setValue | UseFormReturn.setValue} for setting a single value
   */
  setValues(values: Partial<T>): void

  /**
   * Set a single field. This will cause the form to re-render.
   *
   * @param key The name of the field.
   * @param value The value to set.
   * @see {@link UseFormReturn.setValues | UseFormReturn.setValues} for setting multiple values at once
   */
  setValue<K extends keyof T>(key: K, value: T[K]): void

  /**
   * Perform validation on all fields, and return whether the form is valid.
   *
   * @see {@link FieldOptions.validate | FieldOptions.validate} for custom validation on a field.
   * @see {@link UseFormOptions.errorMessages | UseFormOptions.errorMessages} for custom error messages.
   * @returns Whether the form is valid.
   */
  validate(): boolean
}
/**
 * Options for every field. See each property for more information.
 */
export interface FieldOptions<T, K extends keyof T = keyof T> {
  /**
   * If `true`, the field will be required.
   *
   * This will cause the form to be invalid if the field is empty and an error message will be provided in
   * {@link UseFormReturn.errors | UseFormReturn.errors}.
   *
   * To provide a custom error message, use {@link FieldOptions.errorMessages}.
   */
  required?: boolean

  /**
   * If `true`, handlers will treat the field as an array and not a single value.
   *
   * If you supply an array as the initial value, this will be set to `true` automatically.
   */
  multiple?: boolean

  /**
   * Minimum length (in characters) for the field.
   *
   * This will cause the form to be invalid if the field is shorter than the given length, and an error message will
   * be provided in {@link UseFormReturn.errors | UseFormReturn.errors}.
   *
   * To provide a custom error message, use {@link FieldOptions.errorMessages}.
   */
  minLength?: number

  /**
   * Maximum length (in characters) for the field.
   *
   * This will cause the form to be invalid if the field is longer than the given length, and an error message will
   * be provided in {@link UseFormReturn.errors | UseFormReturn.errors}.
   *
   * To provide a custom error message, use {@link FieldOptions.errorMessages}.
   */
  maxLength?: number

  /**
   * A regular expression that the field must match.
   *
   * This will cause the input to not update if the value does not match the given pattern. To cause a validation
   * error for a pattern, use {@link FieldOptions.validate} instead.
   */
  pattern?: string | RegExp

  /**
   * Map of custom error messages for the default validation methods.
   *
   * @see {@link ErrorStrings} for definition of error messages
   * @see {@link UseFormOptions.errorMessages | UseFormOptions.errorMessages} for global error messages (for the entire form)
   * @see {@link FieldOptions.required} for defining a field as required
   * @see {@link FieldOptions.minLength} for defining a minimum length for the field
   * @see {@link FieldOptions.maxLength} for defining a maximum length for the field
   * @see {@link FieldOptions.validate} for defining a custom validation function
   */
  errorMessages?: Partial<ErrorStrings>

  /**
   * A custom validation function for the field.
   *
   * If it returns an empty string, `null` or `undefined`, the field is valid.
   *
   * Otherwise, the field is invalid and the returned string will be the error message.
   *
   * @param value The value of the field.
   * @returns The error message, if any, or undefined/null if the field is valid.
   * @see {@link ErrorStrings} for definition of error messages
   * @see {@link UseFormOptions.errorMessages | UseFormOptions.errorMessages} for global error messages for the default validation methods
   * @see {@link FieldOptions.errorMessages} for field-specific error messages for the default validation methods
   */
  validate?: Validator<T[K]>

  /**
   * Parse the value of the field before it is set in the form state.
   *
   * @param value The value of the field.
   * @returns The parsed value.
   *
   * @see {@link UseFormReturn.state} for the parsed form state
   * @see {@link UseFormReturn.rawState} for the raw form state
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parse?(value: InputType | any): T[K]

  /**
   * A callback for changing the input, which also contains the parsed value.
   *
   * Never use `onChange` on the input field directly, or it will not work to update the form state.
   *
   * Use this callback instead, which acts right after the input's `onChange` callback.
   *
   * @param event The input change event.
   * @param value The parsed value of the field.
   */
  onChange?(event: ChangeEvent, value: T[K]): void

  /**
   * A callback for leaving focus from the input, which also contains the parsed value.
   *
   * Never use `onBlur` on the input field directly, or it will break validation for `onBlur`.
   *
   * Use this callback instead, which acts right after the input's `onBlur` callback.
   *
   * @param event The input change event.
   * @param value The parsed value of the field.
   */
  onBlur?(event: ChangeEvent, value: T[K]): void
}

/**
 * A single error message. If an error exists on a field, this will be in the {@link UseFormReturn.errors} object
 * under the field's key. Otherwise, it is `undefined`.
 *
 * @see {@link ErrorStrings} for definition of error messages
 * @see {@link UseFormOptions.errorMessages | UseFormOptions.errorMessages} for global error messages (for the entire form)
 * @see {@link FieldOptions.required | FieldOptions.required} for defining a field as required
 * @see {@link FieldOptions.minLength | FieldOptions.minLength} for defining a minimum length for the field
 * @see {@link FieldOptions.maxLength | FieldOptions.maxLength} for defining a maximum length for the field
 * @see {@link FieldOptions.validate | FieldOptions.validate} for defining a custom validation function
 */
export interface ErrorMessage {
  /**
   * The type of validation error on the field, such as `required`, `minLength`, `maxLength`, and `pattern`, or
   * `validate` for custom validations
   *
   * @see {@link ErrorStrings} for definition of error messages
   * @see {@link UseFormOptions.errorMessages | UseFormOptions.errorMessages} for global error messages for the default validation methods
   * @see {@link FieldOptions.errorMessages | FieldOptions.errorMessages} for field-specific error messages for the default validation methods
   */
  error: keyof ErrorStrings | 'validate'

  /**
   * The error message for the field.
   */
  message: string
}

/**
 * Validation function for a field.
 *
 * @typeParam T - The type of the form field.
 */
export type Validator<T = unknown> = (value: T) => string | undefined | null

/**
 * A function that receives the validation argument of a field, such as the minimum length or the regular expression,
 * and returns the error message for the field.
 *
 * @typeParam T The type of the validation argument (e.g. `minLength` has `number` to represent the minimum length).
 * @param validation The validation that was not met.
 */
export type MessageResolver<T> = (validation: T) => string

/**
 * Map of custom error messages for the default validation methods.
 *
 * @see {@link UseFormOptions.errorMessages | UseFormOptions.errorMessages} for global error messages for the default validation methods
 * @see {@link FieldOptions.errorMessages | FieldOptions.errorMessages} for field-specific error messages for the default validation methods
 */
export interface ErrorStrings {
  /**
   * Error message for when the field is required but missing.
   *
   * Default: `"Required"`
   *
   * @see {@link FieldOptions.required | FieldOptions.required} for defining a field as required
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
   *
   * @see {@link FieldOptions.minLength | FieldOptions.minLength} for defining a minimum length for the field
   * @see {@link MessageResolver} for the function signature
   */
  minLength: string | MessageResolver<number>

  /**
   * Error message for when the field length is too long.
   *
   * Can either be a string, or a function resolving to a string.
   *
   * Default:
   * ```ts
   * (n) => `Must be no more than ${n} characters long`
   * ```
   *
   * @see {@link FieldOptions.maxLength | FieldOptions.maxLength} for defining a maximum length for the field
   * @see {@link MessageResolver} for the function signature
   */
  maxLength: string | MessageResolver<number>
}

export type InputType = unknown

/** @hidden */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type FieldReturn<E> = {
  /**
   * The name of the field.
   */
  name: string

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
  onChange(event: ChangeEvent): void

  /**
   * Blur event callback
   */
  onBlur(event: ChangeEvent): void
}

/** @hidden */
export type ChangeEvent = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  target: any
  defaultPrevented: boolean
  persist?(): void
}

/** @hidden */
export type BlurEvent = ChangeEvent
