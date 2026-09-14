/**
 * Testimonials.
 *
 * IMPORTANT — these are PLACEHOLDER entries written to demonstrate the layout.
 * They are NOT real customer reviews and the UI labels the section accordingly
 * (see `components/home/TestimonialsSection`). Replace them with genuine Google
 * reviews before launch, then remove `isPlaceholderSet`.
 *
 * BACKEND SEAM: swap for a `testimonials` table or a Google Places API feed via
 * `services/testimonialService.ts`.
 */
import type { Testimonial } from '@/types'

/** Flips the honest "sample layout" label in the UI. Set to false with real reviews. */
export const isPlaceholderSet = true

export const testimonials: Testimonial[] = [
  {
    id: 'sample-1',
    quote:
      'The jollof rice tasted exactly like home. Portions were generous and the plantain was perfectly caramelised.',
    author: 'Sample review',
    context: 'Dine in, Feltham',
    rating: 5,
  },
  {
    id: 'sample-2',
    quote:
      'We booked Dilly Kitchen for a 60th birthday and the egusi and suya disappeared before the speeches finished.',
    author: 'Sample review',
    context: 'Birthday catering, West London',
    rating: 5,
  },
  {
    id: 'sample-3',
    quote:
      'Ordered the pepper soup on a cold evening and it did exactly what it was supposed to do. Proper spice, proper flavour.',
    author: 'Sample review',
    context: 'Takeaway order',
    rating: 5,
  },
]
