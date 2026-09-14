import { useState, type FormEvent } from 'react'
import { SelectField, TextAreaField, TextField } from './Field'
import { FormNotice } from './FormNotice'
import { Button } from '@/components/ui/Button'
import { ArrowRightIcon } from '@/components/ui/Icons'
import {
  contactMessageToWhatsApp,
  submitContactMessage,
  type ContactMessagePayload,
  type SubmitResult,
} from '@/services/enquiryService'
import { whatsappLink } from '@/config/site'
import {
  isValid,
  minLength,
  required,
  validEmail,
  type ValidationErrors,
} from '@/lib/validation'

const subjects = [
  'General enquiry',
  'Table booking',
  'Takeaway or delivery order',
  'Catering enquiry',
  'Feedback',
  'Other',
] as const

const emptyForm: ContactMessagePayload = {
  fullName: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
}

function validate(values: ContactMessagePayload): ValidationErrors<ContactMessagePayload> {
  return {
    fullName: minLength(values.fullName, 2, 'Full name'),
    email: validEmail(values.email),
    subject: required(values.subject, 'Subject'),
    message: minLength(values.message, 10, 'Message'),
  }
}

export function ContactForm() {
  const [values, setValues] = useState<ContactMessagePayload>(emptyForm)
  const [errors, setErrors] = useState<ValidationErrors<ContactMessagePayload>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<SubmitResult | null>(null)

  function update<K extends keyof ContactMessagePayload>(key: K, value: ContactMessagePayload[K]) {
    setValues((current) => ({ ...current, [key]: value }))
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)

    if (!isValid(nextErrors)) {
      const firstInvalid = event.currentTarget.querySelector<HTMLElement>('[aria-invalid="true"]')
      firstInvalid?.focus()
      setResult(null)
      return
    }

    setIsSubmitting(true)
    const response = await submitContactMessage(values)
    setIsSubmitting(false)
    setResult(response)
    if (response.ok) setValues(emptyForm)
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Full name"
          name="fullName"
          autoComplete="name"
          required
          value={values.fullName}
          error={errors.fullName}
          onChange={(event) => update('fullName', event.target.value)}
          placeholder="Your name"
        />
        <TextField
          label="Email address"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={values.email}
          error={errors.email}
          onChange={(event) => update('email', event.target.value)}
          placeholder="you@example.com"
        />
        <TextField
          label="Phone number"
          name="phone"
          type="tel"
          autoComplete="tel"
          value={values.phone}
          error={errors.phone}
          onChange={(event) => update('phone', event.target.value)}
          placeholder="07000 000000"
        />
        <SelectField
          label="Subject"
          name="subject"
          required
          options={subjects}
          value={values.subject}
          error={errors.subject}
          onChange={(event) => update('subject', event.target.value)}
        />
      </div>

      <TextAreaField
        label="Message"
        name="message"
        rows={5}
        required
        value={values.message}
        error={errors.message}
        onChange={(event) => update('message', event.target.value)}
        placeholder="How can we help?"
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? 'Sending…' : 'Send message'}
          {!isSubmitting && <ArrowRightIcon className="size-[1.1em]" />}
        </Button>
        <p className="text-xs leading-relaxed text-ink-500 sm:max-w-xs">
          Fields marked <span className="text-spice-500">*</span> are required.
        </p>
      </div>

      {result && (
        <FormNotice
          ok={result.ok}
          message={result.message}
          whatsappHref={whatsappLink(contactMessageToWhatsApp(values))}
        />
      )}
    </form>
  )
}
