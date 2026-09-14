import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { ExternalActionButton } from '@/components/ui/ExternalActionButton'
import { ArrowRightIcon } from '@/components/ui/Icons'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'

/**
 * NOT ROUTED. This is the previous home hero, kept as a reference and as a
 * one-line way back: swap `StreamHero` for `Hero` in `pages/HomePage.tsx`.
 * Delete this file once the dish-corridor hero (`home/StreamHero.tsx`) is
 * settled — nothing else imports it.
 */

/**
 * The dining room in Feltham, photographed by the business. It is the most
 * characteristic thing the brand owns — black leather, brass table trim and
 * the yellow DK roundel — so the page opens on the room itself rather than on
 * a plated dish.
 */
const room = {
  widths: [640, 960, 1448],
  alt: 'The Dilly Kitchen dining room in Feltham: black leather chairs at brass-trimmed tables, cream tiling and the yellow DK roundel on the wall',
}

const srcSet = (extension: 'jpg' | 'webp') =>
  room.widths.map((w) => `/images/hero/dining-room-${w}.${extension} ${w}w`).join(', ')

interface RailItem {
  label: string
  value: string
  /** Internal route. */
  to?: string
  /** `tel:` link. */
  href?: string
  /** Aligns digits so hours and phone numbers sit in even columns. */
  numeric?: boolean
}

/** Read off the window of the shop, in the order a passer-by would want them. */
const rail: RailItem[] = [
  { label: 'Find us', value: `${siteConfig.address.street}, ${siteConfig.address.locality}` },
  { label: 'Open', value: `Every day · ${siteConfig.openingHours.display}`, numeric: true },
  {
    label: 'Call or WhatsApp',
    value: siteConfig.contact.phoneDisplay,
    href: siteConfig.contact.phoneHref,
    numeric: true,
  },
  { label: 'Catering', value: 'Across London', to: '/catering' },
]

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      /*
        Pulled up under the fixed header so the photograph runs to the very top
        of the window — the header's translucent black then sits on the room
        rather than on a band of empty page.
      */
      className="on-dark relative isolate -mt-[72px] bg-ink-950 sm:-mt-[80px]"
    >
      {/* The room */}
      <div className="film-grain absolute inset-0 -z-10 overflow-hidden">
        <picture>
          <source type="image/webp" srcSet={srcSet('webp')} sizes="100vw" />
          <img
            src="/images/hero/dining-room-960.jpg"
            srcSet={srcSet('jpg')}
            sizes="100vw"
            width={1448}
            height={1086}
            alt={room.alt}
            loading="eager"
            fetchPriority="high"
            decoding="sync"
            className="size-full animate-[var(--animate-room-settle)] object-cover object-[62%_38%] lg:object-[71%_center]"
          />
        </picture>

        {/*
          Two scrims. The first carries the copy: bottom-up on phones where the
          text sits low, left-to-right on desktop where it sits beside the room.
          The second is the warm ceiling light, pulled out of the photograph and
          spread back across it.
        */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/85 to-ink-950/28 lg:bg-gradient-to-r lg:from-ink-950 lg:from-[18%] lg:via-ink-950/72 lg:via-[55%] lg:to-ink-950/10"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(60%_45%_at_72%_28%,rgb(224_150_20/0.20),transparent_70%)]"
        />
      </div>

      <div className="relative flex min-h-[min(96svh,52rem)] flex-col">
        <div className="flex flex-1 items-end pt-[calc(72px+3.5rem)] sm:pt-[calc(80px+4rem)]">
          <div className="mx-auto w-full max-w-[88rem] px-5 pb-12 sm:px-8 lg:px-10 lg:pb-20">
            <div className="max-w-[38rem] lg:max-w-[42rem]">
              <p className="eyebrow flex animate-[var(--animate-line-rise)] flex-wrap items-center gap-x-3 gap-y-2 text-gold-400">
                <span className="rule-brass inline-block w-10" aria-hidden="true" />
                Est. {siteConfig.established}
                <span className="text-cream-200/25" aria-hidden="true">
                  ·
                </span>
                <span className="text-cream-100/75">
                  {siteConfig.address.locality}, {siteConfig.address.region}
                </span>
              </p>

              {/*
                Fraunces at its display optical size: the strokes thin out and
                the fit tightens, which only reads correctly this large.
              */}
              <h1
                id="hero-heading"
                className="display-hero mt-6 text-[clamp(2.9rem,10.5vw,5.75rem)] text-cream-50"
              >
                <span className="block animate-[var(--animate-line-rise)] [animation-delay:120ms]">
                  Every meal
                </span>
                <span className="block animate-[var(--animate-line-rise)] [animation-delay:240ms]">
                  tells a <span className="text-brand-500">story</span>
                </span>
              </h1>

              <p className="mt-7 max-w-lg animate-[var(--animate-line-rise)] text-base leading-relaxed text-cream-200/80 [animation-delay:360ms] sm:text-lg">
                Smoky party jollof, soups started from the bone, suya rubbed with our own blend.
                Cooked fresh in Feltham, every day from 3pm.
              </p>

              <div className="mt-9 flex animate-[var(--animate-line-rise)] flex-col gap-3 [animation-delay:480ms] sm:flex-row sm:flex-wrap sm:items-center">
                <Button to="/menu" size="lg" className="w-full sm:w-auto">
                  Discover our menu
                  <ArrowRightIcon className="size-[1.1em]" />
                </Button>
                <ExternalActionButton
                  link="uberEats"
                  variant="outline-dark"
                  size="lg"
                  showIcon={false}
                  className="w-full sm:w-auto"
                >
                  Order on Uber Eats
                </ExternalActionButton>
              </div>
            </div>
          </div>
        </div>

        {/*
          The brass rail. Every table in the room is a black top bounded by a
          thin brass edge; the same edge closes the hero and carries the four
          facts a passer-by actually needs.
        */}
        <div className="relative animate-[var(--animate-line-rise)] border-t border-gold-500/30 bg-ink-950/70 backdrop-blur-md [animation-delay:620ms]">
          <div className="mx-auto grid w-full max-w-[88rem] grid-cols-2 gap-x-6 gap-y-6 px-5 py-6 sm:px-8 lg:grid-cols-4 lg:gap-x-10 lg:px-10 lg:py-7">
            {rail.map((item, index) => (
              <div
                key={item.label}
                className={cn(index > 0 && 'lg:border-l lg:border-cream-100/10 lg:pl-10')}
              >
                <p className="eyebrow text-[0.6rem] text-gold-400/80">{item.label}</p>
                <p className={cn('mt-1.5 text-sm font-medium text-cream-100', item.numeric && 'tnum')}>
                  {item.to ? (
                    <Link to={item.to} className="transition-colors hover:text-brand-500">
                      {item.value}
                    </Link>
                  ) : item.href ? (
                    <a href={item.href} className="transition-colors hover:text-brand-500">
                      {item.value}
                    </a>
                  ) : (
                    item.value
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
