import { useEffect, useState } from 'react'
import { Seo } from '@/components/seo/Seo'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Button } from '@/components/ui/Button'
import { ArrowRightIcon, QuoteIcon } from '@/components/ui/Icons'
import { SmartImage } from '@/components/ui/SmartImage'
import { WhatsAppCta } from '@/components/home/WhatsAppCta'
// `chef` and `storyValues` are page furniture rather than editable content, so
// they stay bundled; the chapters themselves come from the `story_sections` table.
import { chef, storyValues } from '@/data/story'
import { getStorySections } from '@/services/contentService'
import { useReveal } from '@/hooks/useReveal'
import { cn } from '@/lib/utils'
import type { StorySection } from '@/data/story'

export function OurStoryPage() {
  const [storySections, setStorySections] = useState<StorySection[]>([])

  useEffect(() => {
    let active = true
    getStorySections().then((sections) => {
      if (active) setStorySections(sections)
    })
    return () => {
      active = false
    }
  }, [])

  return (
    <>
      <Seo
        title="Our Story"
        description="From a childhood play pot to a Nigerian kitchen in Feltham — the story behind Dilly Kitchen, our African heritage, our cooking philosophy and the woman who built it."
        type="article"
        image="/images/story/chef-portrait-1000.jpg"
      />

      <PageHero />

      <Section tone="cream" containerSize="default" spacing="lg">
        <div className="flex flex-col gap-16 sm:gap-20">
          {storySections.map((section, index) => (
            <StoryBlock key={section.id} section={section} index={index} />
          ))}
        </div>
      </Section>

      <ValuesSection />
      <MeetTheChef />

      <WhatsAppCta
        title="Come and taste the story"
        description="Book a table, order for collection, or ask us about catering your next celebration."
      />
    </>
  )
}

/**
 * The dining room in Feltham, photographed by the business — the same room the
 * home page opens on. Exported by `scripts/optimize-images.sh` at three widths
 * in both formats.
 */
const roomWidths = [640, 960, 1448]
const roomSrcSet = (extension: 'jpg' | 'webp') =>
  roomWidths.map((w) => `/images/hero/dining-room-${w}.${extension} ${w}w`).join(', ')

const roomAlt =
  'The Dilly Kitchen dining room in Feltham: black leather chairs at brass-trimmed tables, cream tiling and the yellow DK roundel on the wall'

function PageHero() {
  return (
    <section
      aria-labelledby="story-hero-heading"
      className="on-dark surface-dark relative isolate overflow-hidden"
    >
      <Container size="wide" className="py-16 sm:py-20 lg:py-28">
        <div className="lg:grid lg:min-h-[32rem] lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center lg:gap-16">
          <div className="relative z-10">
            <SectionHeading
              id="story-hero-heading"
              eyebrow="Our Story"
              title="It started with a play pot and a wooden spoon"
              align="left"
              tone="dark"
              as="h1"
            />
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-cream-200/80">
              Before Dilly Kitchen had a name, a menu, or a dining table, there was a little girl
              with a tiny play pot, a wooden spoon, and a big dream.
            </p>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-cream-200/65">
              This is how that dream became a Nigerian kitchen in West London.
            </p>
          </div>
        </div>
      </Container>

      {/*
        The room, run bold. On desktop the photograph leaves the container and
        takes the entire right side of the hero — top edge to bottom edge, out
        to the window — so the space the headline never reaches is the dining
        room itself rather than empty black. On phones it drops below the copy
        full-bleed, still edge to edge.
      */}
      <div className="film-grain relative w-full lg:absolute lg:inset-y-0 lg:right-0 lg:z-0 lg:w-1/2 xl:w-[52%]">
        <picture>
          <source
            type="image/webp"
            srcSet={roomSrcSet('webp')}
            sizes="(min-width: 1024px) 52vw, 100vw"
          />
          <img
            src="/images/hero/dining-room-960.jpg"
            srcSet={roomSrcSet('jpg')}
            sizes="(min-width: 1024px) 52vw, 100vw"
            width={1448}
            height={1086}
            alt={roomAlt}
            loading="eager"
            fetchPriority="high"
            decoding="sync"
            className="aspect-[4/3] w-full object-cover object-[55%_center] lg:aspect-auto lg:size-full lg:object-[62%_center]"
          />
        </picture>

        {/*
          One scrim, cut the way the copy runs: top-down on phones where the
          text sits above the photograph, left-to-right on desktop where it
          sits beside it. It only has to bind the photograph to the black —
          past the first third the room is left alone.
        */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-ink-900 via-ink-900/25 via-[30%] to-transparent lg:bg-gradient-to-r lg:via-ink-900/30 lg:via-[24%]"
        />

        {/* The brass table edge, standing the photograph off the black. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgb(207_162_53/0.5)_12%,rgb(207_162_53/0.5)_88%,transparent)] lg:inset-x-auto lg:inset-y-0 lg:left-0 lg:h-auto lg:w-px lg:bg-[linear-gradient(180deg,transparent,rgb(207_162_53/0.5)_12%,rgb(207_162_53/0.5)_88%,transparent)]"
        />
      </div>
    </section>
  )
}

function StoryBlock({ section, index }: { section: StorySection; index: number }) {
  const { ref, isVisible } = useReveal()
  const headingId = `story-${section.id}`

  return (
    <article
      ref={ref}
      aria-labelledby={headingId}
      className={cn(
        'grid gap-6 transition-all duration-700 ease-[var(--ease-out-soft)] sm:grid-cols-[auto_1fr] sm:gap-10',
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0',
      )}
    >
      {/* Chapter marker */}
      <div className="flex items-center gap-4 sm:flex-col sm:items-center sm:gap-3">
        <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-ink-900 font-display text-xl font-semibold text-brand-500">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span
          aria-hidden="true"
          className="h-px flex-1 bg-ink-900/12 sm:h-full sm:w-px sm:flex-1"
        />
      </div>

      <div className="pb-2">
        <p className="eyebrow text-gold-700">{section.eyebrow}</p>
        <h2 id={headingId} className="mt-2.5 text-2xl sm:text-3xl lg:text-[2.1rem]">
          {section.heading}
        </h2>
        <div className="mt-5 flex flex-col gap-4 text-base leading-relaxed text-ink-600 sm:text-[1.05rem]">
          {section.paragraphs.map((paragraph, paragraphIndex) => (
            <p
              key={paragraphIndex}
              className={cn(
                paragraphIndex === 0 &&
                  index === 0 &&
                  'text-lg font-medium text-ink-800 sm:text-xl',
              )}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </article>
  )
}

function ValuesSection() {
  return (
    <Section tone="dark" aria-labelledby="story-values-heading" containerSize="wide">
      <SectionHeading
        id="story-values-heading"
        eyebrow="What never changes"
        title="Three things we refuse to compromise on"
        tone="dark"
      />
      <ul className="mt-11 grid gap-6 md:grid-cols-3">
        {storyValues.map((value, index) => (
          <li
            key={value.id}
            className="rounded-card border border-cream-100/12 bg-ink-800/50 p-7 backdrop-blur-sm"
          >
            <span className="eyebrow text-brand-500">0{index + 1}</span>
            <h3 className="mt-3 font-display text-xl text-cream-50">{value.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-cream-200/70">{value.description}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}

function MeetTheChef() {
  return (
    <Section tone="white" aria-labelledby="meet-chef-heading" containerSize="wide" spacing="lg">
      <div className="grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div className="relative mx-auto max-w-sm lg:max-w-none">
          <SmartImage
            image={chef.image}
            sizes="(min-width: 1024px) 32vw, 88vw"
            className="w-full rounded-card object-cover shadow-lift"
          />
          <span
            aria-hidden="true"
            className="absolute -right-3 -top-3 -z-10 size-32 rounded-2xl bg-brand-500/25 sm:-right-5 sm:-top-5 sm:size-44"
          />
        </div>

        <div>
          <SectionHeading
            id="meet-chef-heading"
            eyebrow="Meet the chef"
            title="The woman behind Dilly Kitchen"
            align="left"
          />

          <figure className="mt-7 rounded-card border-l-4 border-brand-500 bg-cream-50 p-6">
            <QuoteIcon className="size-7 text-brand-500" />
            <blockquote className="mt-3 font-display text-lg leading-relaxed text-ink-800 sm:text-xl">
              “{chef.quote}”
            </blockquote>
            <figcaption className="mt-4 text-sm font-semibold text-ink-600">
              {chef.role}
            </figcaption>
          </figure>

          <div className="mt-7 flex flex-col gap-4 text-base leading-relaxed text-ink-600">
            {chef.bio.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button to="/menu" variant="secondary">
              See what she cooks
              <ArrowRightIcon className="size-[1.1em]" />
            </Button>
            <Button to="/gallery" variant="outline">
              View the gallery
            </Button>
          </div>
        </div>
      </div>
    </Section>
  )
}
