/**
 * Testimonial data access — Supabase-backed.
 *
 * `testimonials` is public-readable for published rows only (RLS), so an
 * unpublished review is never sent to the browser.
 */
import { isPlaceholderSet, testimonials } from '@/data/testimonials'
import type { Testimonial } from '@/types'
import { readWithFallback, unwrap } from './supabaseClient'
import { toTestimonial, type TestimonialRow } from './rows'

/**
 * Set by the most recent successful fetch so `testimonialsArePlaceholders()`
 * can stay synchronous for its existing call site.
 */
let livePlaceholderFlag: boolean | null = null

export async function getTestimonials(): Promise<Testimonial[]> {
  return readWithFallback(
    'getTestimonials',
    async (client) => {
      const rows = unwrap(
        await client
          .from('testimonials')
          .select('id, quote, author, context, rating, is_placeholder, sort_order')
          .eq('is_published', true)
          .order('sort_order', { ascending: true })
          .returns<TestimonialRow[]>(),
      )
      if (rows.length === 0) throw new Error('testimonials is empty')
      // The honest "sample layout" label stays on while ANY published review is
      // still placeholder copy.
      livePlaceholderFlag = rows.some((row) => row.is_placeholder)
      return rows.map(toTestimonial)
    },
    () => testimonials,
  )
}

/** True while the site is still showing sample copy rather than real reviews. */
export function testimonialsArePlaceholders(): boolean {
  return livePlaceholderFlag ?? isPlaceholderSet
}
