import { useId } from 'react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface BaseFieldProps {
  label: string
  error?: string
  hint?: string
  required?: boolean
  className?: string
}

interface FieldShellProps extends BaseFieldProps {
  children: (props: {
    id: string
    describedBy: string | undefined
    isInvalid: boolean
    className: string
  }) => ReactNode
}

const controlBase =
  'w-full rounded-2xl border bg-white px-4 py-3 text-[0.95rem] text-ink-900 shadow-soft ' +
  'transition-colors placeholder:text-ink-500'

/** Shared label / hint / error scaffolding so every control behaves identically. */
export function FieldShell({
  label,
  error,
  hint,
  required,
  className,
  children,
}: FieldShellProps) {
  const id = useId()
  const errorId = `${id}-error`
  const hintId = `${id}-hint`
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ')

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-sm font-semibold text-ink-800">
        {label}
        {required ? (
          <span className="ml-1 text-spice-500" aria-hidden="true">
            *
          </span>
        ) : (
          <span className="ml-1.5 text-xs font-normal text-ink-500">(optional)</span>
        )}
      </label>

      {children({
        id,
        describedBy: describedBy || undefined,
        isInvalid: Boolean(error),
        className: cn(
          controlBase,
          error
            ? 'border-spice-500 focus:border-spice-600'
            : 'border-ink-900/12 hover:border-ink-900/25 focus:border-brand-500',
        ),
      })}

      {hint && !error && (
        <p id={hintId} className="text-xs text-ink-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-xs font-medium text-spice-600">
          {error}
        </p>
      )}
    </div>
  )
}

type InputProps = BaseFieldProps &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className' | 'id'>

export function TextField({ label, error, hint, required, className, ...rest }: InputProps) {
  return (
    <FieldShell label={label} error={error} hint={hint} required={required} className={className}>
      {({ id, describedBy, isInvalid, className: controlClass }) => (
        <input
          id={id}
          aria-describedby={describedBy}
          aria-invalid={isInvalid || undefined}
          aria-required={required || undefined}
          className={controlClass}
          {...rest}
        />
      )}
    </FieldShell>
  )
}

type TextAreaProps = BaseFieldProps &
  Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'className' | 'id'>

export function TextAreaField({
  label,
  error,
  hint,
  required,
  className,
  rows = 4,
  ...rest
}: TextAreaProps) {
  return (
    <FieldShell label={label} error={error} hint={hint} required={required} className={className}>
      {({ id, describedBy, isInvalid, className: controlClass }) => (
        <textarea
          id={id}
          rows={rows}
          aria-describedby={describedBy}
          aria-invalid={isInvalid || undefined}
          aria-required={required || undefined}
          className={cn(controlClass, 'resize-y')}
          {...rest}
        />
      )}
    </FieldShell>
  )
}

type SelectProps = BaseFieldProps &
  Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'className' | 'id'> & {
    options: readonly string[]
    placeholder?: string
  }

export function SelectField({
  label,
  error,
  hint,
  required,
  className,
  options,
  placeholder = 'Please choose…',
  ...rest
}: SelectProps) {
  return (
    <FieldShell label={label} error={error} hint={hint} required={required} className={className}>
      {({ id, describedBy, isInvalid, className: controlClass }) => (
        <select
          id={id}
          aria-describedby={describedBy}
          aria-invalid={isInvalid || undefined}
          aria-required={required || undefined}
          className={cn(controlClass, 'appearance-none bg-[length:1.1rem] bg-no-repeat pr-10')}
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2338332c' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
            backgroundPosition: 'right 1rem center',
          }}
          {...rest}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}
    </FieldShell>
  )
}
