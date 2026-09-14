import { Link } from 'react-router-dom'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  /** `dark` for use on the near-black header and footer. */
  tone?: 'dark' | 'light'
  /** Hides the wordmark on very small screens when false. */
  showWordmark?: boolean
}

export function Logo({ className, tone = 'dark', showWordmark = true }: LogoProps) {
  return (
    <Link
      to="/"
      className={cn('group inline-flex items-center gap-3', className)}
      aria-label={`${siteConfig.name} — home`}
    >
      <img
        src="/images/brand/dilly-kitchen-logo-128.jpg"
        srcSet="/images/brand/dilly-kitchen-logo-128.jpg 128w, /images/brand/dilly-kitchen-logo-256.jpg 256w"
        sizes="52px"
        width={52}
        height={52}
        alt=""
        className="size-[46px] shrink-0 rounded-xl object-cover ring-1 ring-brand-500/25 transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:scale-105 sm:size-[52px]"
      />
      {showWordmark && (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              'whitespace-nowrap font-display text-xl font-semibold tracking-tight sm:text-[1.35rem]',
              tone === 'dark' ? 'text-cream-50' : 'text-ink-900',
            )}
          >
            Dilly Kitchen
          </span>
          <span
            className={cn(
              'eyebrow mt-1 whitespace-nowrap text-[0.55rem]',
              tone === 'dark' ? 'text-brand-500' : 'text-gold-700',
            )}
          >
            Nigerian Cuisine
          </span>
        </span>
      )}
    </Link>
  )
}
