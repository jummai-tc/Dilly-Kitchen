import { Section } from '@/components/ui/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Button } from '@/components/ui/Button'
import { ExternalActionButton } from '@/components/ui/ExternalActionButton'
import { ArrowRightIcon, ClockIcon, MailIcon, PhoneIcon, PinIcon } from '@/components/ui/Icons'
import { DetailItem, DetailList } from '@/components/ui/DetailList'
import { externalLinks, siteConfig } from '@/config/site'

export function VisitSection() {
  return (
    <Section tone="white" aria-labelledby="visit-heading" containerSize="wide" spacing="lg">
      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div>
          <SectionHeading
            id="visit-heading"
            eyebrow="Opening hours & location"
            title="Come and eat with us"
            align="left"
          />
          <p className="mt-7 max-w-md text-[1.02rem] leading-[1.75] text-ink-600">
            Our dining room is on Feltham High Street, a few minutes from Feltham station. Walk
            in, order ahead for collection, or have it delivered.
          </p>

          <DetailList className="mt-9">
            <DetailItem icon={ClockIcon} term="Opening hours">
              <span className="tnum">
                {siteConfig.openingHours.days} · {siteConfig.openingHours.display}
              </span>
            </DetailItem>
            <DetailItem icon={PinIcon} term="Address">
              <address className="not-italic">
                {siteConfig.address.street}, {siteConfig.address.locality},{' '}
                {siteConfig.address.postalCode}
                <br />
                {siteConfig.address.region}, {siteConfig.address.country}
              </address>
            </DetailItem>
            <DetailItem icon={PhoneIcon} term="Call or WhatsApp">
              <a
                href={siteConfig.contact.phoneHref}
                className="tnum transition-colors hover:text-ink-900"
              >
                {siteConfig.contact.phoneDisplay}
              </a>
            </DetailItem>
            <DetailItem icon={MailIcon} term="Email">
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="break-all transition-colors hover:text-ink-900"
              >
                {siteConfig.contact.email}
              </a>
            </DetailItem>
          </DetailList>

          <div className="mt-9 flex flex-wrap gap-3">
            <Button href={externalLinks.googleMapsDirections.href} variant="secondary">
              Get directions
              <ArrowRightIcon className="size-[1.1em]" />
            </Button>
            <ExternalActionButton link="googleReviews" variant="outline" showIcon={false}>
              Google reviews
            </ExternalActionButton>
          </div>
        </div>

        <figure className="lg:self-start">
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute -bottom-4 -right-4 size-full rounded-[1.75rem] border border-gold-500/45 sm:-bottom-6 sm:-right-6"
            />
            <img
              src="/images/hero/restaurant-interior-960.jpg"
              srcSet="/images/hero/restaurant-interior-640.jpg 640w, /images/hero/restaurant-interior-960.jpg 960w, /images/hero/restaurant-interior-1440.jpg 1440w"
              sizes="(min-width: 1024px) 52vw, 92vw"
              width={1448}
              height={1086}
              loading="lazy"
              decoding="async"
              alt="Inside the Dilly Kitchen restaurant in Feltham — black leather chairs, gold-trimmed tables and the yellow DK logo on the wall"
              className="relative w-full rounded-[1.75rem] object-cover shadow-lift"
            />
          </div>
          <figcaption className="eyebrow mt-8 flex items-center gap-3 text-[0.62rem] text-gold-700 sm:mt-10">
            <span className="rule-brass inline-block w-8" aria-hidden="true" />
            The dining room · {siteConfig.address.street}
          </figcaption>
        </figure>
      </div>
    </Section>
  )
}
