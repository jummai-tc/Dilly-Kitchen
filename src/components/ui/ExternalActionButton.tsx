import { useId, useRef, useState } from 'react'
import { whatsappLink, whatsappMessages, type ExternalLinkKey } from '@/config/site'
import { useSiteLink } from '@/context/siteContentContext'
import { useOnClickOutside } from '@/hooks/useOnClickOutside'
import { cn } from '@/lib/utils'
import { Button, type ButtonSize, type ButtonVariant } from './Button'
import { ExternalIcon, InfoIcon, WhatsAppIcon } from './Icons'

interface ExternalActionButtonProps {
  /** Which `site_links` row to use, keyed the same as `config/site.ts`. */
  link: ExternalLinkKey | 'bookTable' | 'discoverMenu'
  children?: React.ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  fullWidth?: boolean
  showIcon?: boolean
}

/**
 * Renders a real link when the URL is configured. When the business has not
 * supplied the URL yet, it renders a button that explains the situation and
 * offers WhatsApp instead — so the page never ships a broken or invented link.
 *
 * The destination comes from the `site_links` table, so filling in the Uber
 * Eats URL in the admin panel switches every one of these buttons over
 * immediately, with no redeploy. Before that fetch resolves the bundled value
 * from `config/site.ts` is used, which is the same behaviour as before.
 */
export function ExternalActionButton({
  link,
  children,
  variant = 'primary',
  size = 'md',
  className,
  fullWidth,
  showIcon = true,
}: ExternalActionButtonProps) {
  const config = useSiteLink(link)
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const panelId = useId()
  useOnClickOutside(wrapperRef, () => setIsOpen(false), isOpen)

  const label = children ?? config.label

  if (!config.isPlaceholder && config.href) {
    return (
      <Button
        href={config.href}
        variant={variant}
        size={size}
        className={className}
        fullWidth={fullWidth}
      >
        {link === 'whatsapp' && showIcon && <WhatsAppIcon className="size-[1.15em]" />}
        {label}
        {link !== 'whatsapp' && showIcon && <ExternalIcon className="size-[1em] opacity-70" />}
      </Button>
    )
  }

  return (
    <div ref={wrapperRef} className={cn('relative', fullWidth && 'w-full')}>
      <Button
        variant={variant}
        size={size}
        className={className}
        fullWidth={fullWidth}
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls={panelId}
      >
        {label}
        {showIcon && <InfoIcon className="size-[1em] opacity-70" />}
      </Button>

      {isOpen && (
        <div
          id={panelId}
          role="dialog"
          aria-label={`${config.label} — not available yet`}
          className="absolute left-1/2 top-[calc(100%+0.65rem)] z-40 w-72 -translate-x-1/2 rounded-2xl border border-ink-900/10 bg-white p-4 text-left shadow-lift"
        >
          <p className="text-sm leading-relaxed text-ink-700">
            Our <strong className="font-semibold text-ink-900">{config.label.replace(/^(Order on|Read Our)\s/, '')}</strong>{' '}
            link is being set up. Message us on WhatsApp and we will take care of you straight away.
          </p>
          <Button
            href={whatsappLink(whatsappMessages.order)}
            variant="primary"
            size="sm"
            fullWidth
            className="mt-3"
          >
            <WhatsAppIcon className="size-[1.15em]" />
            Message us on WhatsApp
          </Button>
        </div>
      )}
    </div>
  )
}
