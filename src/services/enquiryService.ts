/**
 * Form submissions — Supabase-backed.
 *
 * Both forms insert into tables whose RLS grants the public INSERT and nothing
 * else: no visitor can read back an enquiry, including their own. `status` is
 * pinned to 'new' by the insert policy.
 *
 * There is deliberately no fallback here. If the write fails, the visitor is
 * told plainly and offered the WhatsApp route with their details pre-filled —
 * nobody is ever left thinking a message was delivered when it was not.
 *
 * The admin inbox reads live in `services/admin/enquiryAdmin.ts`, so the auth
 * client they need never reaches the public bundle.
 */
import { db, friendlyError, isSupabaseConfigured } from './supabaseClient'

export interface SubmitResult {
  ok: boolean
  message: string
}

export interface CateringEnquiryPayload {
  fullName: string
  email: string
  phone: string
  eventType: string
  eventDate: string
  guestCount: string
  preferredDishes: string
  additionalInfo: string
}

export interface ContactMessagePayload {
  fullName: string
  email: string
  phone: string
  subject: string
  message: string
}

const NOT_CONNECTED =
  'Online submissions are unavailable right now. Please send this enquiry to us on WhatsApp and we will reply straight away.'

const CATERING_SUCCESS =
  'Thank you — your catering enquiry has reached us. We usually reply within one working day. If your event is soon, message us on WhatsApp and we will come back to you faster.'

const CONTACT_SUCCESS =
  'Thank you — your message has reached us and we will reply by email shortly. For anything urgent, WhatsApp reaches the kitchen fastest.'

export async function submitCateringEnquiry(
  payload: CateringEnquiryPayload,
): Promise<SubmitResult> {
  if (!db) {
    if (import.meta.env.DEV) console.info('[catering enquiry — not sent]', payload)
    return { ok: false, message: NOT_CONNECTED }
  }

  const { error } = await db.from('catering_enquiries').insert({
    name: payload.fullName.trim(),
    email: payload.email.trim().toLowerCase(),
    phone: payload.phone.trim(),
    event_type: payload.eventType,
    event_date: payload.eventDate,
    guest_count: payload.guestCount,
    preferred_dishes: payload.preferredDishes.trim(),
    notes: payload.additionalInfo.trim(),
    status: 'new',
  })

  if (error) {
    console.error('[dilly] catering enquiry insert failed', error)
    return { ok: false, message: friendlyError(new Error(error.message)) }
  }
  return { ok: true, message: CATERING_SUCCESS }
}

export async function submitContactMessage(
  payload: ContactMessagePayload,
): Promise<SubmitResult> {
  if (!db) {
    if (import.meta.env.DEV) console.info('[contact message — not sent]', payload)
    return { ok: false, message: NOT_CONNECTED }
  }

  const { error } = await db.from('contact_messages').insert({
    name: payload.fullName.trim(),
    email: payload.email.trim().toLowerCase(),
    phone: payload.phone.trim(),
    subject: payload.subject,
    message: payload.message.trim(),
    status: 'new',
  })

  if (error) {
    console.error('[dilly] contact message insert failed', error)
    return { ok: false, message: friendlyError(new Error(error.message)) }
  }
  return { ok: true, message: CONTACT_SUCCESS }
}

/** Whether the forms can submit at all — used only for developer messaging. */
export const submissionsEnabled = isSupabaseConfigured

/**
 * Builds a WhatsApp message from a catering enquiry so a visitor can send the
 * details they just typed without re-entering them.
 */
export function cateringEnquiryToWhatsApp(payload: CateringEnquiryPayload): string {
  return [
    'Hello Dilly Kitchen, I would like to enquire about catering.',
    '',
    `Name: ${payload.fullName}`,
    `Email: ${payload.email}`,
    `Phone: ${payload.phone}`,
    `Event: ${payload.eventType}`,
    `Date: ${payload.eventDate}`,
    `Guests: ${payload.guestCount}`,
    payload.preferredDishes ? `Preferred dishes: ${payload.preferredDishes}` : '',
    payload.additionalInfo ? `Extra details: ${payload.additionalInfo}` : '',
  ]
    .filter(Boolean)
    .join('\n')
}

/** Same idea for the contact form. */
export function contactMessageToWhatsApp(payload: ContactMessagePayload): string {
  return [
    'Hello Dilly Kitchen,',
    '',
    `Name: ${payload.fullName}`,
    `Email: ${payload.email}`,
    payload.phone ? `Phone: ${payload.phone}` : '',
    `Subject: ${payload.subject}`,
    '',
    payload.message,
  ]
    .filter(Boolean)
    .join('\n')
}
