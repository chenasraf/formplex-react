# FormPlex - React

<h2><a href="https://chenasraf.github.io/formplex-react/">Full documentation</a></h2>

Handle forms in your React apps with incredible ease.

FormPlex lets you use React forms without the hassle; including easy validations, predictable and
simple usage & API, and great flexibility.

## Quick-start

See the [full documentation](https://chenasraf.github.io/formplex-react/) for all the available
options, return values and more examples.

### Use the hook

Start by calling the hook, passing in any options you would like for the form, and get the return
values as needed.

This is a full example of a hook usage with all the available options and return values. All options
are optional, see the docs for each for more information.

```tsx
const { field, handleSubmit, isValid, errors, state, rawState, setValue, setValues } =
  useForm<MyFormData>({
    initialState: {
      firstName: 'John',
      lastName: 'Doe',
    },
    autoValidateBehavior: 'onChange',
    errorMessages: {
      required: 'This field is required',
      minLength: (n) => `Must be more than ${n} chars long`,
      maxLength: (n) => `Must be less than ${n} chars long`,
    },
    onSubmit(values, e) {
      console.log('Form submitted:', values)
      fetch('/submit', { method: 'POST', body: JSON.stringify(values) })
    },
  })
```

### Register an input

Use `field()` from the previous hook on your inputs, should support most input types:

```tsx
<input type="text" {...field('firstName', { required: true, minLength: 2 })} />
<input type="number" {...field('age', {
  required: true,
  validate: (n) => n < 18 ? "Must be 18 or over" : null,
  parse: Number,
})} />
<select {...field('gender', { required: true })}>
  ...
</select>
```

## Quick-start

See the [full documentation](https://chenasraf.github.io/formplex-react/) for all the available
options, return values and more examples.

### Use the hook

Start by calling the hook, passing in any options you would like for the form, and get the return
values as needed.

This is a full example of a hook usage with all the available options and return values. All options
are optional, see the docs for each for more information.

```tsx
const { field, handleSubmit, isValid, errors, state, rawState, setValue, setValues } =
  useForm<MyFormData>({
    initialState: {
      firstName: 'John',
      lastName: 'Doe',
    },
    autoValidateBehavior: 'onChange',
    errorMessages: {
      required: 'This field is required',
      minLength: (n) => `Must be more than ${n} chars long`,
      maxLength: (n) => `Must be less than ${n} chars long`,
    },
    onSubmit(values, e) {
      console.log('Form submitted:', values)
      fetch('/submit', { method: 'POST', body: JSON.stringify(values) })
    },
  })
```

### Register an input

Use `field()` from the previous hook on your inputs, should support most input types:

```tsx
<input type="text" {...field('firstName', { required:true, minLength: 2 })}>
<select {...field('gender', { required: true })}>
  ...
</select>
```

### Full form example

Below is a full example of a simple form.

```tsx
import React from 'react'
import { useForm } from 'formplex-react'

interface MyFormData {
  companyName: string
  employeesCount: number
  revenueRange: '$0-$50K' | '$50-$500K' | '$500K-$1M' | '$1M+'
}

export const MyForm: React.FC = () => {
  const { field, handleSubmit, isValid, errors } = useForm<MyFormData>({
    onSubmit(values, e) {
      console.log('Form submitted:', values)
      fetch('/submit', { method: 'POST', body: JSON.stringify(values) })
    },
  })

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="text"
          {...field('companyName', {
            minLength: 5,
            maxLength: 50,
            required: true,
          })}
        />
        {errors.companyName && <div style={{ color: 'red' }}>{errors.companyName.message}</div>}
      </div>
      <div>
        <input
          type="number"
          {...field('employeesCount', {
            parse: Number,
            pattern: /^\d+$/,
            required: true,
            validate: (n) => (n < 1 ? 'Must have at least 1 employee.' : null),
          })}
        />
        {errors.employeesCount && (
          <div style={{ color: 'red' }}>{errors.employeesCount.message}</div>
        )}
      </div>
      <div>
        <select {...field('revenueRange', { required: true })}>
          <option value="$0-$50K">$0-$50K</option>
          <option value="$50-$500K">$50-$500K</option>
          <option value="$500K-$1M">$500K-$1M</option>
          <option value="$1M+">$1M+</option>
        </select>
        {errors.revenueRange && <div style={{ color: 'red' }}>{errors.revenueRange.message}</div>}
      </div>
      <div>
        <button type="submit" disabled={!isValid}>
          Save
        </button>
      </div>
    </form>
  )
}
```

### Tips

- You normally don't need to use `state` to return the values of the form, you can use `onSubmit`
  for most use-cases; however it is available when you need it.
- Use `setValue` or `setValues` when you manually need to change input values.
- You can check for the existence of each field inside `errors` to know if there are any errors on
  that field. You can then check the type and message of said error if it exists.

## Contributing

I am developing this package on my free time, so any support, whether code, issues, or just stars is
very helpful to sustaining its life. If you are feeling incredibly generous and would like to donate
just a small amount to help sustain this project, I would be very very thankful!

<a href='https://ko-fi.com/casraf' target='_blank'>
  <img height='36' style='border:0px;height:36px;'
    src='https://cdn.ko-fi.com/cdn/kofi1.png?v=3'
    alt='Buy Me a Coffee at ko-fi.com' />
</a>

I welcome any issues or pull requests on GitHub. If you find a bug, or would like a new feature,
don't hesitate to open an appropriate issue and I will do my best to reply promptly.

If you are a developer and want to contribute code, here are some starting tips:

1. Fork this repository
2. Run `yarn install`
3. Run `yarn start` to start file watch mode
4. Make any changes you would like
5. Create tests for your changes
6. Update the relevant documentation (readme, code comments, type comments)
7. Create a PR on upstream
