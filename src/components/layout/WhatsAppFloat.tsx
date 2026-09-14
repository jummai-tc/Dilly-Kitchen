import { useEffect, useState } from 'react'
import { siteConfig, whatsappLink, whatsappMessages } from '@/config/site'
import { cn } from '@/lib/utils'
import { WhatsAppIcon } from '@/components/ui/Icons'

/**
 * Fixed WhatsApp action, present on every page. Appears after a short scroll so
 * it never competes with the hero call-to-actions on first paint.
 */
export function WhatsAppFloat() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    function onScroll() {
      setIsVisible(window.scrollY > 300)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    /* Wrapped in a landmark so the control is not orphaned outside page regions. */
    <aside aria-label="Quick contact">
      <a
      href={whatsappLink(whatsappMessages.general)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with ${siteConfig.name} on WhatsApp`}
      className={cn(
        'group fixed bottom-5 right-5 z-40 flex items-center gap-3 rounded-full bg-whatsapp py-3.5 pl-3.5 pr-4 font-semibold text-white shadow-lift',
        'transition-all duration-500 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:bg-whatsapp-dark',
        'sm:bottom-7 sm:right-7',
        isVisible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0',
      )}
    >
        <WhatsAppIcon className="size-6 shrink-0" />
        <span className="hidden text-sm sm:inline">Chat with us</span>
      </a>
    </aside>
  )
}
