/**
 * Single source of truth for business details and external links.
 *
 * NOTE FOR HANDOVER: every value marked `PLACEHOLDER` must be replaced with the
 * real business URL before launch. Nothing here is invented — placeholders point
 * at safe, generic destinations and are surfaced in the UI as "coming soon"
 * where a real link does not yet exist.
 */

export const siteConfig = {
  name: 'Dilly Kitchen',
  legalName: 'Dilly Kitchen',
  tagline: 'Nigerian & Pan-African Cuisine',
  established: '2025',
  shortDescription:
    'Fresh Nigerian and Pan-African cuisine prepared with treasured family recipes, bold spices and genuine hospitality. Dine in, take away or let us cater your celebration across London.',
  metaDescription:
    'Dilly Kitchen serves fresh Nigerian and Pan-African food in Feltham, London. Jollof rice, traditional soups, suya and full catering for weddings, birthdays and corporate events.',

  url: 'https://www.dillykitchen.co.uk', // PLACEHOLDER — replace with the live domain
  ogImage: '/images/dishes/jollof-rice-chicken-1400.jpg',

  contact: {
    phoneDisplay: '+44 7535 502212',
    phoneHref: 'tel:+447535502212',
    whatsappNumber: '447535502212',
    email: 'dillykitchen07@gmail.com',
  },

  address: {
    street: '100 High Street',
    locality: 'Feltham',
    postalCode: 'TW13 4EX',
    region: 'London',
    country: 'United Kingdom',
    countryCode: 'GB',
    /** Full address on one line, used for schema.org and map links. */
    full: '100 High Street, Feltham, TW13 4EX, London, United Kingdom',
  },

  /**
   * The shopfront pin, from the OpenStreetMap node for Dilly Kitchen at
   * 100 High Street, Feltham, TW13 4EX — not the postcode centroid, so the
   * contact-page map and schema.org geo land on the door.
   */
  geo: {
    latitude: 51.4430814,
    longitude: -0.4125028,
  },

  /** Opening hours supplied by the business: 3:00 PM – 12:00 AM, every day. */
  openingHours: {
    display: '3:00 PM – 12:00 AM',
    days: 'Monday – Sunday',
    /** schema.org openingHours format */
    schema: ['Mo-Su 15:00-24:00'],
  },

  areaServed: 'London and surrounding areas',
} as const

/**
 * External links. Swap the PLACEHOLDER entries once the business supplies the
 * real URLs. `isPlaceholder: true` makes the UI show a polite "coming soon"
 * state instead of a broken link — see `components/ui/ExternalActionButton`.
 */
export const externalLinks = {
  whatsapp: {
    label: 'WhatsApp Us',
    href: `https://wa.me/${siteConfig.contact.whatsappNumber}`,
    isPlaceholder: false,
  },
  googleMapsDirections: {
    label: 'Get Google Maps Directions',
    href: 'https://www.google.com/maps/dir/?api=1&destination=Dilly+Kitchen+100+High+Street+Feltham+TW13+4EX',
    isPlaceholder: false,
  },
  googleReviews: {
    label: 'Read Our Google Reviews',
    /** PLACEHOLDER — replace with the Google Business Profile review link. */
    href: '',
    isPlaceholder: true,
  },
  uberEats: {
    label: 'Order on Uber Eats',
    /** The Dilly Kitchen store on Uber Eats, supplied by the business. */
    href: 'https://www.ubereats.com/store-browse-uuid/fcd5e175-b3ae-4bff-bb7e-631f563d1035?diningMode=DELIVERY',
    isPlaceholder: false,
  },
  instagram: {
    label: 'Instagram',
    /** PLACEHOLDER — replace with the Instagram profile URL. */
    href: '',
    isPlaceholder: true,
  },
  facebook: {
    label: 'Facebook',
    /** PLACEHOLDER — replace with the Facebook page URL. */
    href: '',
    isPlaceholder: true,
  },
  tiktok: {
    label: 'TikTok',
    /** PLACEHOLDER — replace with the TikTok profile URL. */
    href: '',
    isPlaceholder: true,
  },
} as const

export type ExternalLinkKey = keyof typeof externalLinks

/** Builds a WhatsApp deep link with a pre-filled message. */
export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${siteConfig.contact.whatsappNumber}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

export const whatsappMessages = {
  general: `Hello Dilly Kitchen! I would like to know more about your menu.`,
  order: `Hello Dilly Kitchen! I would like to place an order.`,
  catering: `Hello Dilly Kitchen! I would like to enquire about catering for an event.`,
  booking: `Hello Dilly Kitchen! I would like to book a table.`,
} as const
