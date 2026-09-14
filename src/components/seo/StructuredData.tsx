import { useEffect } from 'react'
import { externalLinks, siteConfig } from '@/config/site'

const SCRIPT_ID = 'dilly-kitchen-structured-data'

/**
 * schema.org `Restaurant` (a subtype of LocalBusiness) describing the business.
 * Rendered once from the app shell. Only real, supplied details are included —
 * placeholder URLs are omitted rather than guessed.
 */
export function StructuredData() {
  useEffect(() => {
    const socialProfiles = [externalLinks.instagram, externalLinks.facebook, externalLinks.tiktok]
      .filter((link) => !link.isPlaceholder && link.href)
      .map((link) => link.href)

    const data: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'Restaurant',
      '@id': `${siteConfig.url}/#restaurant`,
      name: siteConfig.name,
      description: siteConfig.metaDescription,
      url: siteConfig.url,
      image: `${siteConfig.url}${siteConfig.ogImage}`,
      logo: `${siteConfig.url}/images/brand/dilly-kitchen-logo-512.jpg`,
      telephone: siteConfig.contact.phoneDisplay,
      email: siteConfig.contact.email,
      servesCuisine: ['Nigerian', 'West African', 'Pan-African'],
      priceRange: '££',
      currenciesAccepted: 'GBP',
      address: {
        '@type': 'PostalAddress',
        streetAddress: siteConfig.address.street,
        addressLocality: siteConfig.address.locality,
        postalCode: siteConfig.address.postalCode,
        addressRegion: siteConfig.address.region,
        addressCountry: siteConfig.address.countryCode,
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: siteConfig.geo.latitude,
        longitude: siteConfig.geo.longitude,
      },
      areaServed: {
        '@type': 'City',
        name: 'London',
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
          ],
          opens: '15:00',
          closes: '24:00',
        },
      ],
      hasMenu: `${siteConfig.url}/menu`,
      acceptsReservations: 'True',
      ...(socialProfiles.length > 0 ? { sameAs: socialProfiles } : {}),
      makesOffer: {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Nigerian catering services in London',
          description:
            'Catering for weddings, birthdays, corporate events, family gatherings and large celebrations across London.',
          areaServed: siteConfig.areaServed,
        },
      },
    }

    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null
    if (!script) {
      script = document.createElement('script')
      script.id = SCRIPT_ID
      script.type = 'application/ld+json'
      document.head.appendChild(script)
    }
    script.textContent = JSON.stringify(data)
  }, [])

  return null
}
