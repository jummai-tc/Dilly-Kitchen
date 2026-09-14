import { Seo } from '@/components/seo/Seo'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Button } from '@/components/ui/Button'
import { ExternalActionButton } from '@/components/ui/ExternalActionButton'
import { ClockIcon, MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from '@/components/ui/Icons'
import { DetailItem, DetailList } from '@/components/ui/DetailList'
import { ContactForm } from '@/components/forms/ContactForm'
import { WhatsAppCta } from '@/components/home/WhatsAppCta'
import { externalLinks, siteConfig, whatsappLink, whatsappMessages } from '@/config/site'

/** Street-level bounding box around the geocoded postcode, with a marker. */
const { latitude, longitude } = siteConfig.geo
const mapEmbedSrc =
  'https://www.openstreetmap.org/export/embed.html?bbox=' +
  [longitude - 0.006, latitude - 0.003, longitude + 0.006, latitude + 0.003]
    .map((value) => value.toFixed(6))
    .join('%2C') +
  `&layer=mapnik&marker=${latitude}%2C${longitude}`

export function ContactPage() {
  return (
    <>
      <Seo
        title="Contact & Find Us"
        description="Contact Dilly Kitchen — 100 High Street, Feltham, TW13 4EX, London. Open daily 3:00 PM to 12:00 AM. WhatsApp +44 7535 502212 for orders, bookings and catering."
      />

      <section aria-labelledby="contact-heading" className="on-dark surface-dark">
        <Container size="wide" className="py-14 sm:py-18 lg:py-20">
          <SectionHeading
            id="contact-heading"
            eyebrow="Contact"
            title="Come in, call, or message us"
            description="We are on Feltham High Street in West London, open every day from mid-afternoon until midnight."
            tone="dark"
            as="h1"
          />
        </Container>
      </section>

      <Section tone="cream" containerSize="wide" spacing="md">
        <div className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          {/* Details */}
          <div>
            <div className="rounded-card bg-white p-7 shadow-soft ring-1 ring-ink-900/5 sm:p-8">
              <h2 className="font-display text-2xl text-ink-900">{siteConfig.name}</h2>

              <DetailList className="mt-7">
                <DetailItem icon={PinIcon} term="Address">
                  <address className="not-italic">
                    {siteConfig.address.street}
                    <br />
                    {siteConfig.address.locality}, {siteConfig.address.postalCode}
                    <br />
                    {siteConfig.address.region}, {siteConfig.address.country}
                  </address>
                </DetailItem>
                <DetailItem icon={ClockIcon} term="Opening hours">
                  {siteConfig.openingHours.days}
                  <br />
                  <span className="font-semibold text-ink-900">
                    {siteConfig.openingHours.display}
                  </span>
                </DetailItem>
                <DetailItem icon={WhatsAppIcon} term="WhatsApp">
                  <a
                    href={whatsappLink(whatsappMessages.general)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-ink-900"
                  >
                    {siteConfig.contact.phoneDisplay}
                  </a>
                </DetailItem>
                <DetailItem icon={PhoneIcon} term="Phone">
                  <a href={siteConfig.contact.phoneHref} className="transition-colors hover:text-ink-900">
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

              {/* Action buttons */}
              <div className="mt-8 flex flex-col gap-3 border-t border-ink-900/8 pt-7">
                <Button href={whatsappLink(whatsappMessages.general)} fullWidth>
                  <WhatsAppIcon className="size-[1.15em]" />
                  Chat on WhatsApp
                </Button>
                <Button
                  href={externalLinks.googleMapsDirections.href}
                  variant="secondary"
                  fullWidth
                >
                  Get Google Maps Directions
                </Button>
                <ExternalActionButton link="googleReviews" variant="outline" fullWidth>
                  Read Our Google Reviews
                </ExternalActionButton>
                <ExternalActionButton link="uberEats" variant="outline" fullWidth>
                  Order on Uber Eats
                </ExternalActionButton>
              </div>
            </div>

          </div>

          {/* Form */}
          <div>
            <div className="rounded-card bg-white p-7 shadow-soft ring-1 ring-ink-900/5 sm:p-9">
              <h2 className="font-display text-2xl text-ink-900">Send us a message</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                Use the form for general enquiries and feedback. For orders and same-day questions,
                WhatsApp reaches the kitchen fastest.
              </p>
              <div className="mt-7">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>

        {/* Map — full width so neither column is left with dead space. */}
        <div className="mt-10 overflow-hidden rounded-card shadow-soft ring-1 ring-ink-900/8">
          <iframe
            title={`Map showing the location of ${siteConfig.name}, ${siteConfig.address.full}`}
            src={mapEmbedSrc}
            className="h-[22rem] w-full border-0 sm:h-[26rem]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white px-6 py-5">
            <div>
              <p className="font-display text-base font-semibold text-ink-900">
                {siteConfig.name}
              </p>
              <p className="mt-0.5 text-sm text-ink-600">{siteConfig.address.full}</p>
            </div>
            <Button href={externalLinks.googleMapsDirections.href} variant="secondary">
              Get directions
            </Button>
          </div>
        </div>
      </Section>

      <WhatsAppCta
        title="We are open until midnight"
        description="Message us any time during opening hours and we will get straight back to you."
      />
    </>
  )
}
