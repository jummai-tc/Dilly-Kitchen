import { useEffect, useState } from 'react'
import { Section } from '@/components/ui/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ExternalActionButton } from '@/components/ui/ExternalActionButton'
import { QuoteIcon, StarIcon } from '@/components/ui/Icons'
import { getTestimonials, testimonialsArePlaceholders } from '@/services/testimonialService'
import type { Testimonial } from '@/types'

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  // Read after the fetch resolves, so the honest label reflects the live rows.
  const [isPlaceholderSet, setIsPlaceholderSet] = useState(testimonialsArePlaceholders())

  useEffect(() => {
    let active = true
    getTestimonials().then((rows) => {
      if (!active) return
      setTestimonials(rows)
      setIsPlaceholderSet(testimonialsArePlaceholders())
    })
    return () => {
      active = false
    }
  }, [])

  return (
    <Section tone="cream" aria-labelledby="testimonials-heading" containerSize="wide" spacing="lg">
      <SectionHeading id="testimonials-heading" eyebrow="Kind words" title="What our guests say" />

      {/*
        Honest labelling: until real Google reviews are imported, the quotes below
        demonstrate the layout only. Clear `is_placeholder` on the testimonials
        rows in Supabase (or `isPlaceholderSet` in data/testimonials.ts) to drop it.
      */}
      {isPlaceholderSet && (
        <p className="mx-auto mt-5 max-w-xl rounded-full border border-ink-900/10 px-5 py-2.5 text-center text-xs font-medium text-ink-500">
          Sample layout — verified Google reviews will be shown here once connected.
        </p>
      )}

      {/*
        Set as press quotes divided by hairlines rather than as three cards: a
        review is something you read, not a tile you compare.
      */}
      <ul className="mt-12 grid gap-11 lg:mt-14 lg:grid-cols-3 lg:gap-0">
        {testimonials.map((testimonial) => (
          <li
            key={testimonial.id}
            className="flex flex-col lg:border-l lg:border-ink-900/12 lg:px-10 lg:first:border-l-0 lg:first:pl-0 lg:last:pr-0"
          >
            <QuoteIcon className="size-7 text-gold-500" />
            <blockquote className="mt-5 flex-1 font-display text-[1.12rem] leading-[1.62] text-ink-800">
              “{testimonial.quote}”
            </blockquote>
            <div className="mt-7 flex items-center gap-4">
              <div
                className="flex gap-0.5 text-gold-500"
                role="img"
                aria-label={`${testimonial.rating} out of 5 stars`}
              >
                {Array.from({ length: testimonial.rating }, (_, index) => (
                  <StarIcon key={index} className="size-[0.9rem]" />
                ))}
              </div>
              <span className="rule-brass hidden w-8 sm:block" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-ink-900">{testimonial.author}</p>
                <p className="text-xs text-ink-500">{testimonial.context}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-12 flex justify-center">
        <ExternalActionButton link="googleReviews" variant="outline">
          Read our Google reviews
        </ExternalActionButton>
      </div>
    </Section>
  )
}
