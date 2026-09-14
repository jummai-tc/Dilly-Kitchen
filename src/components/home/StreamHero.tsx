import { Link } from 'react-router-dom'
import { BorderBeam } from '@/components/ui/BorderBeam'
import { Button } from '@/components/ui/Button'
import { ChevronDownIcon, WhatsAppIcon } from '@/components/ui/Icons'
import {
  ImageStreamHero,
  type CorridorPath,
  type StreamImage,
} from '@/components/ui/ImageStreamHero'
import { siteConfig } from '@/config/site'
import { useSiteLink } from '@/context/siteContentContext'
import { dishImages } from '@/data/menu'
import { useMediaQuery } from '@/hooks/useMediaQuery'
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
 *
 * Phones run that same corridor, not a substitute for it. Every length in it
 * is `cqw` — a share of the container's width — so the shape is already
 * resolution-independent. What a narrow window cannot take is the desktop
 * *geometry*, which sends the rails out through dead centre and lays a band of
 * cards across the type. `phonePath` re-aims that geometry rather than
 * replacing it: cards are born out near the edges instead of on the axis, so
 * each rail hugs its own side of the window and the middle stays black for the
 * words. Same component, same keyframes, same motion — smaller cards on a
 * different line. Everything from `lg` up is untouched.
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

/**
 * The same corridor, re-aimed for a tall, narrow window.
 *
 * `railBirth` does most of the work, and it is positive here where the
 * desktop's is negative: a card is born out on its own side of the frame
 * rather than across the axis, so the centre is never opened and never has to
 * be plugged — it is simply never used. The number looks enormous next to the
 * desktop's -11 because `rail` is multiplied by the card's own projected
 * scale, and a newborn's is 0.133: 248 world units out lands 33cqw from centre
 * on screen. The card then holds that line as it grows and only runs for the
 * edge over the last third of the trip.
 *
 * What that buys is a floor, not an average. Feeding these numbers back
 * through the projection, the inner edge of the ribbon — `rail * scale` less
 * half the card's projected width — bottoms out at 32cqw from the axis and
 * spends most of the cycle around 35cqw. So the middle ~64% of the window is
 * clear of cards at every instant and at every width, which is the lane the
 * type is given below. The desktop hero holds the same discipline: its text
 * column ends where its rails begin.
 *
 * `exitHeight` is the card-size dial. 88cqw is a 343px-tall card at the mouth
 * of the rail on a 390px phone, against the desktop's 46cqw of a 1440px
 * window — 662px. The images and the card count are the desktop's, untouched:
 * only the flight path and the pace are re-cut for the shape of the window.
 */
const phonePath: CorridorPath = {
  /*
    A taller, narrower card than the desktop's 18x25. A phone hero is a tall
    box viewed through a thin lane, and trading width for height buys the rail
    more of the edge for the same intrusion toward the type.
  */
  cardWidth: 15,
  cardHeight: 30,
  birthHeight: 4,
  exitHeight: 88,
  railBirth: 248,
  railExit: 28,
  fan: 2.6,
}

/**
 * Quicker than the desktop's 34s because the on-screen journey is shorter; the
 * same figure in seconds would read as a stall. Cards reaching the edge per
 * second then lands within a tenth of the desktop rate.
 */
const PHONE_SPEED = 30

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

/**
 * Both hero buttons. `size="md"` carries the phone and tablet proportions and
 * the `lg:` overrides restore the `lg` size the desktop hero has always used.
 */
const ctaClass =
  'w-full max-w-[18rem] lg:w-auto lg:max-w-none lg:px-8 lg:py-4 lg:text-base'

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
  /*
   * Read in JavaScript rather than with `lg:` variants: the two backdrops are
   * a dozen photographs each, and `hidden`/`block` would mount both.
   */
  const isDesktop = useMediaQuery('(min-width: 1024px)')
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
        {isDesktop ? (
          <>
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
              floor that carries the brass rail; and a corner vignette to bind
              the frame.
            */}
            <div aria-hidden="true" className="absolute inset-0 bg-ink-950/30" />
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
          </>
        ) : (
          /*
            Phones and tablets: the same corridor, flown on `phonePath`, so the
            two rails run down the left and right edges with the type in the
            clear middle.

            It keeps running under `prefers-reduced-motion` — see
            `ignoreReducedMotion` below. That is a deliberate exception to the
            rule the rest of this file follows, and it is scoped to this branch
            alone: the desktop hero above still swaps to a held photograph when
            the setting is on.
          */
          <>
            <ImageStreamHero
              images={corridor}
              cards={CARDS}
              speed={PHONE_SPEED}
              /* A shade above the desktop's 47: the rails then sit across the
                 wordmark and the paragraph rather than down by the buttons. */
              axis={46}
              path={phonePath}
              /*
                On a phone the corridor is not decoration laid over a hero — it
                is the whole backdrop, and the only imagery on the first screen.
                Held still it reads as a broken image rather than as a chosen
                still, so here the loop outranks the preference and runs on.
                The desktop branch, which has a real photograph to fall back to,
                keeps respecting it.
              */
              ignoreReducedMotion
              /* Sized, not positioned — see the note on the desktop corridor. */
              className="h-full w-full"
            />

            {/*
              The scrims, in the desktop hero's order but cut for a narrow
              frame: an overall veil; a centre well deep enough to carry the
              type and no wider, since the rails are only 25cqw out and the
              food has to stay legible as food; the warm ceiling light across
              the top; the black band the fixed header dissolves into; the
              deep floor that carries the brass rail; and a vignette to bind
              the frame.
            */}
            <div aria-hidden="true" className="absolute inset-0 bg-ink-950/22" />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(58%_48%_at_50%_44%,rgb(8_8_7/0.95),rgb(8_8_7/0.8)_46%,rgb(8_8_7/0.36)_74%,transparent_100%)]"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(85%_36%_at_50%_0%,rgb(207_162_53/0.15),transparent_72%)]"
            />
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink-950 via-ink-950/75 to-transparent"
            />
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-ink-950 via-ink-950/85 to-transparent"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(120%_82%_at_50%_50%,transparent_58%,rgb(8_8_7/0.34))]"
            />
          </>
        )}
      </div>

      <div className="relative flex min-h-[min(96svh,52rem)] flex-col">
        <div className="flex flex-1 items-center">
          <div className="mx-auto w-full max-w-[88rem] px-6 pt-[calc(72px+2.5rem)] pb-9 text-center sm:px-8 sm:pt-[calc(80px+3.5rem)] sm:pb-10 lg:px-10">
            {/*
              The lane. `phonePath` keeps the rails clear of the middle ~64% of
              the window at every instant, so the column the type is set in is
              capped to exactly that and the two never meet — the same
              arrangement the desktop hero has always had, where the text
              column stops short of where the corridor opens out. Released at
              `lg`, where the desktop corridor and its own wider channel take
              over.
            */}
            <div className="mx-auto max-w-[64vw] lg:max-w-3xl">
              {/*
                The two brass rules are dropped on phones. Set beside them, the
                line needs about 340px to stay on one line, which a 320px
                window does not have — and a wrapped eyebrow with a hairline
                stranded on each end looks like a mistake rather than a trim.
              */}
              <p className="eyebrow flex animate-[var(--animate-line-rise)] items-center justify-center gap-3 text-[0.58rem] text-gold-400 sm:gap-5 sm:text-[0.68rem]">
                <span className="rule-brass hidden w-8 sm:inline-block sm:w-16" aria-hidden="true" />
                <span>
                  Est. {siteConfig.established}
                  <span className="mx-2 text-cream-200/25" aria-hidden="true">
                    ·
                  </span>
                  {siteConfig.address.locality}, {siteConfig.address.region}
                </span>
                <span className="rule-brass hidden w-8 sm:inline-block sm:w-16" aria-hidden="true" />
              </p>

              {/*
                Fraunces at its display optical size, set wide. Tight tracking
                makes a headline; open tracking makes a name cut into brass,
                which is what this is.

                Below `lg` the name breaks over two lines, which is what the
                desktop hero does anyway once the wordmark fills its column —
                and it is the only way a narrow window can hold the name at a
                size worth setting *and* leave the plates either side of it
                visible. Set on one line, DILLY KITCHEN wants 7.5em of width;
                KITCHEN alone wants 4.5em, so the same 320px window can carry
                it a third larger with room to spare at both margins.

                The sizes are measured rather than guessed: 13.5vw keeps the
                longer line at 61% of the window on every phone from 320px up,
                and 9.6vw does the same job on a tablet. Tracking opens as the
                window widens — tight tracking makes a headline, open tracking
                makes a name cut into brass.
              */}
              <h1
                id="hero-heading"
                className="mt-6 animate-[var(--animate-line-rise)] font-display text-[min(13.5vw,3.6rem)] font-semibold uppercase leading-[0.95] tracking-[0.03em] text-cream-50 [animation-delay:120ms] [font-variation-settings:'opsz'_144] sm:mt-7 sm:text-[min(9.6vw,5rem)] sm:tracking-[0.05em] lg:text-[clamp(2.1rem,8.6vw,6.25rem)] lg:leading-[0.98] lg:tracking-[0.11em]"
              >
                Dilly
                <br className="lg:hidden" /> Kitchen
              </h1>

              <p className="mt-4 animate-[var(--animate-line-rise)] font-display text-[clamp(1rem,4.4vw,1.35rem)] tracking-tight text-gold-300 [animation-delay:220ms] sm:mt-6 sm:text-[clamp(1.1rem,3.1vw,1.6rem)]">
                Every meal tells a <span className="text-brand-500">story</span>
              </p>

              <p className="mx-auto mt-5 max-w-xl animate-[var(--animate-line-rise)] text-[0.875rem] leading-[1.75] text-cream-200/75 [animation-delay:340ms] sm:mt-7 sm:text-base lg:text-lg lg:leading-relaxed">
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
              {/*
                One under the other, and capped at 18rem, until the row has
                room to sit side by side at `lg`. Two full-bleed pills stacked
                on a phone read as a form, not as an invitation. The size prop
                drops a step for the same reason and the `lg:` overrides put
                the desktop button back exactly where it was.
              */}
              <div className="mt-7 flex animate-[var(--animate-line-rise)] flex-col items-center justify-center gap-3 [animation-delay:460ms] sm:mt-9 lg:flex-row lg:flex-wrap">
                <Button href={bookTable.href} size="md" className={ctaClass}>
                  <WhatsAppIcon className="size-[1.15em]" />
                  {bookTable.label}
                </Button>
                {discoverMenu.href.startsWith('/') ? (
                  <Button
                    to={discoverMenu.href}
                    variant="outline-dark"
                    size="md"
                    className={ctaClass}
                  >
                    {discoverMenu.label}
                  </Button>
                ) : (
                  <Button
                    href={discoverMenu.href}
                    variant="outline-dark"
                    size="md"
                    className={ctaClass}
                  >
                    {discoverMenu.label}
                  </Button>
                )}
              </div>

              <div className="mt-9 animate-[var(--animate-line-rise)] [animation-delay:580ms] sm:mt-11">
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

          The entry animation stays on this outer div. `BorderBeam` sets an
          `animation` shorthand on the element it renders, from a selector no
          utility class can outrank, so a beam placed on the animated element
          would swallow the rise.
        */}
        <div className="animate-[var(--animate-line-rise)] [animation-delay:700ms]">
          {/*
            One warm light travels the rail, the way the room's ceiling lamps
            run along real brass trim. It stays inside the strip: the beam
            wrapper clips to its own box, so nothing bleeds onto the cream
            section below. Square corners are passed rather than auto-detected
            — the rail is full-bleed and has no radius to read. Slow, and at
            half strength: the hero's one loud element is the yellow button
            above, and this has to stay behind it.
          */}
          <BorderBeam size="md" borderRadius={0} duration={9} strength={0.5}>
            <div className="relative border-t border-gold-500/30 bg-ink-950/70 backdrop-blur-md">
              <div className="mx-auto grid w-full max-w-[88rem] grid-cols-2 gap-x-6 gap-y-6 px-6 py-6 text-left sm:px-8 lg:grid-cols-4 lg:gap-x-10 lg:px-10 lg:py-7">
                {rail.map((item, index) => (
                  <div
                    key={item.label}
                    className={cn(index > 0 && 'lg:border-l lg:border-cream-100/10 lg:pl-10')}
                  >
                    <p className="eyebrow text-[0.6rem] text-gold-400/80">{item.label}</p>
                    <p
                      className={cn(
                        'mt-1.5 text-sm font-medium text-cream-100',
                        item.numeric && 'tnum',
                      )}
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
          </BorderBeam>
        </div>
      </div>
    </section>
  )
}
