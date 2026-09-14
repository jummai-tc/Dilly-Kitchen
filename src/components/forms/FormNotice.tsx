import { Button } from '@/components/ui/Button'
import { CheckIcon, InfoIcon, WhatsAppIcon } from '@/components/ui/Icons'

interface FormNoticeProps {
  ok: boolean
  message: string
  /** WhatsApp link pre-filled with the submitted details. */
  whatsappHref?: string
}

/**
 * Result panel shown after a form submission. While the backend is not
 * connected, `ok` is false and the panel explains that clearly rather than
 * pretending the message was delivered.
 */
export function FormNotice({ ok, message, whatsappHref }: FormNoticeProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={
        ok
          ? 'rounded-card border border-emerald-600/25 bg-emerald-50 p-5'
          : 'rounded-card border border-gold-500/35 bg-gold-300/15 p-5'
      }
    >
      <div className="flex gap-3.5">
        <span
          className={
            ok
              ? 'flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white'
              : 'flex size-9 shrink-0 items-center justify-center rounded-full bg-gold-500 text-ink-900'
          }
        >
          {ok ? <CheckIcon className="size-5" /> : <InfoIcon className="size-5" />}
        </span>
        <div className="flex-1">
          <p className="font-display text-base font-semibold text-ink-900">
            {ok ? 'Message sent' : 'Almost there — send it to us directly'}
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-700">{message}</p>

          {!ok && whatsappHref && (
            <Button href={whatsappHref} size="sm" className="mt-4">
              <WhatsAppIcon className="size-[1.15em]" />
              Send these details on WhatsApp
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
