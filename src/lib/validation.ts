/**
 * Lightweight, dependency-free form validation.
 * Kept framework-agnostic so the same rules can be reused server-side later.
 */

export type ValidationErrors<T> = Partial<Record<keyof T, string>>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
/** Permissive: UK mobile, UK landline and international formats all pass. */
const PHONE_RE = /^[+()\d][\d\s\-().]{6,20}$/

export function required(value: string, label: string): string | undefined {
  return value.trim() ? undefined : `${label} is required.`
}

export function validEmail(value: string): string | undefined {
  if (!value.trim()) return 'Email address is required.'
  return EMAIL_RE.test(value.trim()) ? undefined : 'Enter a valid email address.'
}

export function validPhone(value: string): string | undefined {
  if (!value.trim()) return 'Phone number is required.'
  return PHONE_RE.test(value.trim()) ? undefined : 'Enter a valid phone number.'
}

export function minLength(value: string, min: number, label: string): string | undefined {
  if (!value.trim()) return `${label} is required.`
  return value.trim().length >= min ? undefined : `${label} must be at least ${min} characters.`
}

/** Event dates must be today or later. */
export function futureDate(value: string, label: string): string | undefined {
  if (!value) return `${label} is required.`
  const chosen = new Date(`${value}T00:00:00`)
  if (Number.isNaN(chosen.getTime())) return 'Enter a valid date.'
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return chosen >= today ? undefined : 'Choose a date that has not already passed.'
}

/** True when no field carries an error message. */
export function isValid<T>(errors: ValidationErrors<T>): boolean {
  return Object.values(errors).every((error) => !error)
}

/** ISO date string for today — used as the `min` attribute on date inputs. */
export function todayIso(): string {
  return new Date().toISOString().split('T')[0]
}
