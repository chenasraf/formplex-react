import * as React from 'react'
import { useForm } from '../src/use-form'

interface MyFormData {
  companyName: string
  employeesCount: number
  revenueRange: '$0-$50K' | '$50-$500K' | '$500K-$1M' | '$1M+'
}

export const MyForm: React.FC = () => {
  const { field, handleSubmit, isValid, errors } = useForm<MyFormData>({
    onSubmit(values, e) {
      console.log('Form submitted', values)
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
