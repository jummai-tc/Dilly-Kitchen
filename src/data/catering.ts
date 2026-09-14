/** Catering page content and options. */
import type { CateringOption } from '@/types'

export const cateringIntro = {
  heading: 'Nigerian Catering Services in London',
  paragraphs: [
    'Bring the rich taste of Nigeria to your celebration with Dilly Kitchen. We prepare fresh, flavourful dishes for weddings, birthdays, corporate events, family gatherings, and celebrations of every size.',
    'From our signature jollof rice and traditional soups to suya and other Nigerian favourites, every dish reflects our African heritage and passion for good food. We use quality ingredients and trusted recipes to give your guests a memorable dining experience.',
  ],
}

export const cateringOptions: CateringOption[] = [
  {
    id: 'weddings',
    title: 'Weddings',
    description:
      'Traditional and white weddings, from the small-chops table to full hot buffets for hundreds of guests.',
    icon: 'rings',
  },
  {
    id: 'birthdays',
    title: 'Birthdays',
    description:
      'Milestone parties and family birthdays, with celebration packages and crowd-pleasing party jollof.',
    icon: 'cake',
  },
  {
    id: 'corporate-events',
    title: 'Corporate Events',
    description:
      'Office launches, away days and client dinners delivered on time, plated or buffet-style.',
    icon: 'briefcase',
  },
  {
    id: 'family-gatherings',
    title: 'Family Gatherings',
    description:
      'Naming ceremonies, christenings and Sunday get-togethers — the food you grew up on, made properly.',
    icon: 'home',
  },
  {
    id: 'private-parties',
    title: 'Private Parties',
    description:
      'Intimate dinners and house parties, with a menu built around exactly what your guests love.',
    icon: 'sparkle',
  },
  {
    id: 'large-celebrations',
    title: 'Large Celebrations',
    description:
      'Hall events and community celebrations at scale, with serving staff and equipment arranged on request.',
    icon: 'users',
  },
]

export const eventTypes = [
  'Wedding',
  'Birthday',
  'Corporate event',
  'Family gathering',
  'Private party',
  'Large celebration',
  'Other',
] as const

export const guestCountRanges = [
  '1 – 20 guests',
  '21 – 50 guests',
  '51 – 100 guests',
  '101 – 200 guests',
  '200+ guests',
] as const
