import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { ChevronDownIcon, WhatsAppIcon } from '@/components/ui/Icons'
import { ImageStreamHero, type StreamImage } from '@/components/ui/ImageStreamHero'
import { siteConfig } from '@/config/site'
import { useSiteLink } from '@/context/siteContentContext'
import { dishImages } from '@/data/menu'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { buildSrcSet, smallestSrc } from '@/lib/images'
import { cn } from '@/lib/utils'
import type { DishImage } from '@/types'

/**
 * The home hero.
 *
 * Fine-dining sites open on one held photograph. Dilly Kitchen's strength is
 * not one plate — it is the spread, fourteen dishes cooked fresh every
 * afternoon — so the page opens on the whole kitchen instead: the food rides
 * out of the dark toward you, two rails of it, and the room's brass trim and
 * black leather supply the frame. Restraint everywhere else. Centred type,
 * hairline rules, one yellow button, and the four facts a passer-by actually
 * needs held on the brass rail at the bottom.
 */

/** Wraps a dish photograph as a corridor card, using every width on disk. */
function card(image: DishImage, priority = false): StreamImage {
  return {
    src: smallestSrc(image),
    srcSet: buildSrcSet(image),
    alt: image.alt,
    priority,
  }
}

/**
 * Order is deliberate. Cards are dealt out back-to-front, so the last entries
 * are the ones already near the viewer on the first frame — the signature
 * jollof lands at the mouth of the corridor, and it and its neighbour are the
 * two marked `priority` (and preloaded in `index.html`).
 */
const corridor: StreamImage[] = [
  card(dishImages.okraSoup),
  card(dishImages.friedPlantain),
  card(dishImages.isiEwu),
  card(dishImages.spaghettiJollof),
  card(dishImages.grilledCroaker),
  card(dishImages.puffPuff),
  card(dishImages.efoRiro),
  card(dishImages.friedRice),
  card(dishImages.beefSuya, true),
  card(dishImages.jollofChicken, true),
  card(dishImages.tilapiaPepperSoup),
  card(dishImages.meatPie),
]

/** Cards per rail. The frontmost on the first frame is `CARDS - 1`. */
const CARDS = 10

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

/** Quiet second tier, the way a fine-dining hero lists its other rooms. */
const alsoFrom = [
  { label: 'Catering & events', to: '/catering' },
  { label: 'Find us in Feltham', to: '/contact' },
]

const roomWidths = [640, 960, 1448]
const roomSrcSet = (extension: 'jpg' | 'webp') =>
  roomWidths.map((w) => `/images/hero/dining-room-${w}.${extension} ${w}w`).join(', ')

export function StreamHero() {
  /*
   * When motion is unwelcome the corridor is not slowed down, it is dropped:
   * a moving stream frozen mid-flight reads as a bug. The room the food is
   * cooked in stands in for it, held perfectly still.
   */
  const prefersReducedMotion = useReducedMotion()
  const bookTable = useSiteLink('bookTable')
  const discoverMenu = useSiteLink('discoverMenu')

  return (
    <section
      aria-labelledby="hero-heading"
      /*
        Pulled up under the fixed header so the hero runs to the very top of
        the window — the header's translucent black then sits on the imagery
        rather than on a band of empty page.
      */
      className="on-dark relative isolate -mt-[72px] bg-ink-950 sm:-mt-[80px]"
    >
      <div className="film-grain absolute inset-0 -z-10 overflow-hidden">
        {prefersReducedMotion ? (
          <>
            <picture>
              <source type="image/webp" srcSet={roomSrcSet('webp')} sizes="100vw" />
              <img
                src="/images/hero/dining-room-960.jpg"
                srcSet={roomSrcSet('jpg')}
                sizes="100vw"
                width={1448}
                height={1086}
                alt="The Dilly Kitchen dining room in Feltham: black leather chairs at brass-trimmed tables, cream tiling and the yellow DK roundel on the wall"
                loading="eager"
                fetchPriority="high"
                decoding="sync"
                className="size-full object-cover object-[62%_38%]"
              />
            </picture>
            {/*
              The scrims below are cut for a ribbon of cards on black. A whole
              room is far busier than that, so the still gets its own veil or
              the centred type ends up sitting on chair backs.
            */}
            <div aria-hidden="true" className="absolute inset-0 bg-ink-950/55" />
          </>
        ) : (
          <ImageStreamHero
            images={corridor}
            cards={CARDS}
            /* Slow. A rush would sell fast food; this is a dining room. */
            speed={34}
            /* The corridor's mouth sits just above the middle, so the stream
               opens behind the wordmark rather than through it. */
            axis={47}
            /*
              Sized rather than positioned: the component's root already sets
              `relative`, and `cn()` here is a plain join with no Tailwind
              conflict resolution, so an `absolute` passed in would lose to it
              and the corridor would collapse to zero height.
            */
            className="h-full w-full"
          />
        )}

        {/*
          The scrims, in order: a thin overall veil; a deep well at the centre
          so the type never sits on a moving edge — it has to fall away fast,
          or the whole ribbon goes hazy and the food stops looking like food;
          the warm ceiling light of the room spread across the top; the deep
          floor that carries the brass rail; and a corner vignette to bind the
          frame. Phones get one more stop of veil: the text block covers most
          of a narrow frame, so there is nowhere for the food to be bright.
        */}
        <div aria-hidden="true" className="absolute inset-0 bg-ink-950/30" />
        <div aria-hidden="true" className="absolute inset-0 bg-ink-950/20 sm:hidden" />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(56%_54%_at_50%_43%,rgb(8_8_7/0.95),rgb(8_8_7/0.74)_38%,transparent_73%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(75%_45%_at_50%_0%,rgb(207_162_53/0.16),transparent_72%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink-950 via-ink-950/70 to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-ink-950 via-ink-950/85 to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(120%_88%_at_50%_50%,transparent_50%,rgb(8_8_7/0.62))]"
        />
      </div>

      <div className="relative flex min-h-[min(96svh,52rem)] flex-col">
        <div className="flex flex-1 items-center">
          <div className="mx-auto w-full max-w-[88rem] px-5 pt-[calc(72px+3rem)] pb-10 text-center sm:px-8 sm:pt-[calc(80px+3.5rem)] lg:px-10">
            <div className="mx-auto max-w-3xl">
              <p className="eyebrow flex animate-[var(--animate-line-rise)] items-center justify-center gap-3 text-[0.6rem] text-gold-400 sm:gap-5 sm:text-[0.68rem]">
                <span className="rule-brass inline-block w-8 sm:w-16" aria-hidden="true" />
                <span>
                  Est. {siteConfig.established}
                  <span className="mx-2 text-cream-200/25" aria-hidden="true">
                    ·
                  </span>
                  {siteConfig.address.locality}, {siteConfig.address.region}
                </span>
                <span className="rule-brass inline-block w-8 sm:w-16" aria-hidden="true" />
              </p>

              {/*
                Fraunces at its display optical size, set wide. Tight tracking
                makes a headline; open tracking makes a name cut into brass,
                which is what this is.
              */}
              <h1
                id="hero-heading"
                className="mt-7 animate-[var(--animate-line-rise)] font-display text-[clamp(2.1rem,8.6vw,6.25rem)] font-semibold uppercase leading-[0.98] tracking-[0.05em] text-cream-50 [animation-delay:120ms] [font-variation-settings:'opsz'_144] sm:tracking-[0.11em]"
              >
                Dilly Kitchen
              </h1>

              <p className="mt-6 animate-[var(--animate-line-rise)] font-display text-[clamp(1.1rem,3.1vw,1.6rem)] tracking-tight text-gold-300 [animation-delay:220ms]">
                Every meal tells a <span className="text-brand-500">story</span>
              </p>

              <p className="mx-auto mt-7 max-w-xl animate-[var(--animate-line-rise)] text-[0.95rem] leading-relaxed text-cream-200/75 [animation-delay:340ms] sm:text-lg">
                Nigerian and Pan-African cooking in Feltham. Smoky party jollof, soups started from
                the bone and suya rubbed with our own blend — on the{' '}
                <Link
                  to="/menu"
                  className="text-gold-300 underline decoration-gold-500/40 underline-offset-4 transition-colors hover:text-brand-500 hover:decoration-brand-500"
                >
                  à la carte menu
                </Link>{' '}
                every day from 3pm, and on the table at{' '}
                <Link
                  to="/catering"
                  className="text-gold-300 underline decoration-gold-500/40 underline-offset-4 transition-colors hover:text-brand-500 hover:decoration-brand-500"
                >
                  celebrations across London
                </Link>
                .
              </p>

              {/*
                Both destinations come from the `site_links` table, so the owner
                can point "Book a table" at a real booking system later without
                touching this file. Until then they resolve to the bundled
                WhatsApp link and the /menu route exactly as before.
              */}
              <div className="mt-9 flex animate-[var(--animate-line-rise)] flex-col items-center justify-center gap-3 [animation-delay:460ms] sm:flex-row sm:flex-wrap">
                <Button href={bookTable.href} size="lg" className="w-full sm:w-auto">
                  <WhatsAppIcon className="size-[1.15em]" />
                  {bookTable.label}
                </Button>
                {discoverMenu.href.startsWith('/') ? (
                  <Button
                    to={discoverMenu.href}
                    variant="outline-dark"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    {discoverMenu.label}
                  </Button>
                ) : (
                  <Button
                    href={discoverMenu.href}
                    variant="outline-dark"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    {discoverMenu.label}
                  </Button>
                )}
              </div>

              <div className="mt-11 animate-[var(--animate-line-rise)] [animation-delay:580ms]">
                <p className="eyebrow text-[0.58rem] text-cream-100/40">Also from our kitchen</p>
                <div className="mt-3.5 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
                  {alsoFrom.map((item) => (
                    <Link key={item.to} to={item.to} className="group inline-block">
                      <span className="text-sm font-medium tracking-wide text-cream-100 transition-colors group-hover:text-brand-500">
                        {item.label}
                      </span>
                      <span
                        aria-hidden="true"
                        className="mt-1.5 block h-px w-full bg-gold-500/50 transition-colors duration-300 group-hover:bg-brand-500"
                      />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div aria-hidden="true" className="pointer-events-none flex justify-center pb-7">
          <ChevronDownIcon className="size-6 animate-[var(--animate-scroll-cue)] text-cream-100/50" />
        </div>

        {/*
          The brass rail. Every table in the room is a black top bounded by a
          thin brass edge; the same edge closes the hero and carries the four
          facts a passer-by actually needs.
        */}
        <div className="relative animate-[var(--animate-line-rise)] border-t border-gold-500/30 bg-ink-950/70 backdrop-blur-md [animation-delay:700ms]">
          <div className="mx-auto grid w-full max-w-[88rem] grid-cols-2 gap-x-6 gap-y-6 px-5 py-6 text-left sm:px-8 lg:grid-cols-4 lg:gap-x-10 lg:px-10 lg:py-7">
            {rail.map((item, index) => (
              <div
                key={item.label}
                className={cn(index > 0 && 'lg:border-l lg:border-cream-100/10 lg:pl-10')}
              >
                <p className="eyebrow text-[0.6rem] text-gold-400/80">{item.label}</p>
                <p
                  className={cn('mt-1.5 text-sm font-medium text-cream-100', item.numeric && 'tnum')}
                >
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
