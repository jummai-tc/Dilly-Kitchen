import { Link } from 'react-router-dom'
import { Section } from '@/components/ui/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Button } from '@/components/ui/Button'
import { ArrowRightIcon } from '@/components/ui/Icons'
import { storyValues } from '@/data/story'
import { useReveal } from '@/hooks/useReveal'
import { cn } from '@/lib/utils'

export function IntroSection() {
  const { ref, isVisible } = useReveal()

  return (
    <Section tone="cream" aria-labelledby="intro-heading" containerSize="wide" spacing="lg">
      <div
        ref={ref}
        className={cn(
          'grid gap-12 transition-all duration-700 ease-[var(--ease-out-soft)] lg:grid-cols-12 lg:gap-16',
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
        )}
      >
        {/*
          One photograph, held inside an offset brass rule — the same trim that
          edges every table in the room. The frame sits behind and below the
          picture so the two read as one object rather than as a border.
        */}
        <figure className="order-2 mx-auto w-full max-w-md lg:order-1 lg:col-span-5 lg:max-w-none lg:self-start">
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute -bottom-4 -left-4 size-full rounded-[1.75rem] border border-gold-500/45 sm:-bottom-6 sm:-left-6"
            />
            <img
              src="/images/story/chef-plating-500.jpg"
              srcSet="/images/story/chef-plating-500.jpg 500w, /images/story/chef-plating-760.jpg 760w, /images/story/chef-plating-1100.jpg 1100w"
              sizes="(min-width: 1024px) 38vw, (min-width: 640px) 28rem, 90vw"
              width={1114}
              height={1411}
              loading="lazy"
              decoding="async"
              alt="Chef's hands adding the final garnish to a plate of grilled peppered fish and fried plantain"
              className="relative w-full rounded-[1.75rem] object-cover shadow-lift"
            />
          </div>
          <figcaption className="eyebrow mt-8 flex items-center gap-3 text-[0.62rem] text-gold-700 sm:mt-10">
            <span className="rule-brass inline-block w-8" aria-hidden="true" />
            Plating the pass, Feltham
          </figcaption>
        </figure>

        {/* Copy */}
        <div className="order-1 lg:order-2 lg:col-span-7 lg:pl-4">
          <SectionHeading
            id="intro-heading"
            eyebrow="Welcome to Dilly Kitchen"
            title="Nigerian food, cooked the way it should be"
            align="left"
          />

          <div className="mt-7 flex max-w-2xl flex-col gap-5 text-[1.02rem] leading-[1.75] text-ink-600">
            <p>
              Dilly Kitchen is a Nigerian and Pan-African kitchen in Feltham, West London. We cook
              the dishes we grew up on — smoky party jollof, egusi built on a proper stock, suya
              rubbed with our own spice blend — and we cook them without shortcuts.
            </p>
            <p>
              Everything is prepared fresh, seasoned by hand and served generously. Come in for
              dinner, collect a takeaway on your way home, or let us cater your celebration
              anywhere across London.
            </p>
          </div>

          {/*
            Ruled rows rather than three matching cards: the three commitments
            are a list you read down, not a set of tiles to compare.
          */}
          <dl className="mt-10 border-t border-ink-900/12">
            {storyValues.map((value) => (
              <div
                key={value.id}
                className="grid gap-1 border-b border-ink-900/12 py-5 sm:grid-cols-[13rem_1fr] sm:gap-6"
              >
                <dt className="font-display text-[1.05rem] font-semibold text-ink-900">
                  {value.title}
                </dt>
                <dd className="text-[0.95rem] leading-relaxed text-ink-600">{value.description}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Button to="/our-story" variant="secondary">
              Read our story
              <ArrowRightIcon className="size-[1.1em]" />
            </Button>
            <Link
              to="/menu"
              className="text-sm font-semibold text-ink-700 underline decoration-brand-500 decoration-2 underline-offset-[6px] transition-colors hover:text-ink-900"
            >
              Browse the full menu
            </Link>
          </div>
        </div>
      </div>
    </Section>
  )
}
