import { useState, type FormEvent } from 'react'
import { SelectField, TextAreaField, TextField } from './Field'
import { FormNotice } from './FormNotice'
import { Button } from '@/components/ui/Button'
import { ArrowRightIcon } from '@/components/ui/Icons'
import { eventTypes, guestCountRanges } from '@/data/catering'
import {
  cateringEnquiryToWhatsApp,
  submitCateringEnquiry,
  type CateringEnquiryPayload,
  type SubmitResult,
} from '@/services/enquiryService'
import { whatsappLink } from '@/config/site'
import {
  futureDate,
  isValid,
  minLength,
  required,
  validEmail,
  validPhone,
  todayIso,
  type ValidationErrors,
} from '@/lib/validation'

const emptyForm: CateringEnquiryPayload = {
  fullName: '',
  email: '',
  phone: '',
  eventType: '',
  eventDate: '',
  guestCount: '',
  preferredDishes: '',
  additionalInfo: '',
}

function validate(values: CateringEnquiryPayload): ValidationErrors<CateringEnquiryPayload> {
  return {
    fullName: minLength(values.fullName, 2, 'Full name'),
    email: validEmail(values.email),
    phone: validPhone(values.phone),
    eventType: required(values.eventType, 'Event type'),
    eventDate: futureDate(values.eventDate, 'Event date'),
    guestCount: required(values.guestCount, 'Number of guests'),
  }
}

export function CateringEnquiryForm() {
  const [values, setValues] = useState<CateringEnquiryPayload>(emptyForm)
  const [errors, setErrors] = useState<ValidationErrors<CateringEnquiryPayload>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<SubmitResult | null>(null)

  function update<K extends keyof CateringEnquiryPayload>(
    key: K,
    value: CateringEnquiryPayload[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }))
    // Clear the error for a field as soon as the visitor starts fixing it.
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)

    if (!isValid(nextErrors)) {
      // Move focus to the first invalid control for keyboard and screen-reader users.
      const firstInvalid = event.currentTarget.querySelector<HTMLElement>('[aria-invalid="true"]')
      firstInvalid?.focus()
      setResult(null)
      return
    }

    setIsSubmitting(true)
    const response = await submitCateringEnquiry(values)
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
          required
          value={values.phone}
          error={errors.phone}
          onChange={(event) => update('phone', event.target.value)}
          placeholder="07000 000000"
        />
        <SelectField
          label="Event type"
          name="eventType"
          required
          options={eventTypes}
          value={values.eventType}
          error={errors.eventType}
          onChange={(event) => update('eventType', event.target.value)}
        />
        <TextField
          label="Event date"
          name="eventDate"
          type="date"
          required
          min={todayIso()}
          value={values.eventDate}
          error={errors.eventDate}
          onChange={(event) => update('eventDate', event.target.value)}
        />
        <SelectField
          label="Number of guests"
          name="guestCount"
          required
          options={guestCountRanges}
          placeholder="Choose a range…"
          value={values.guestCount}
          error={errors.guestCount}
          onChange={(event) => update('guestCount', event.target.value)}
        />
      </div>

      <TextAreaField
        label="Preferred dishes"
        name="preferredDishes"
        rows={3}
        hint="For example: party jollof, egusi with assorted meat, beef suya, puff puff."
        value={values.preferredDishes}
        onChange={(event) => update('preferredDishes', event.target.value)}
        placeholder="Tell us what you would like on the table"
      />

      <TextAreaField
        label="Additional information"
        name="additionalInfo"
        rows={4}
        hint="Venue, serving times, dietary requirements, equipment or staff needed."
        value={values.additionalInfo}
        onChange={(event) => update('additionalInfo', event.target.value)}
        placeholder="Anything else we should know"
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? 'Sending…' : 'Send enquiry'}
          {!isSubmitting && <ArrowRightIcon className="size-[1.1em]" />}
        </Button>
        <p className="text-xs leading-relaxed text-ink-500 sm:max-w-xs">
          Fields marked <span className="text-spice-500">*</span> are required. We usually reply
          within one working day.
        </p>
      </div>

      {result && (
        <FormNotice
          ok={result.ok}
          message={result.message}
          whatsappHref={whatsappLink(cateringEnquiryToWhatsApp(values))}
        />
      )}
    </form>
  )
}
