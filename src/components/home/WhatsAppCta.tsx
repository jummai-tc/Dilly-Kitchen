import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { BorderBeam } from '@/components/ui/BorderBeam'
import { ExternalActionButton } from '@/components/ui/ExternalActionButton'
import { WhatsAppIcon } from '@/components/ui/Icons'
import { siteConfig, whatsappLink, whatsappMessages } from '@/config/site'

interface WhatsAppCtaProps {
  title?: string
  description?: string
  /** Pre-filled WhatsApp message — defaults to a general enquiry. */
  message?: string
}

/** Closing call-to-action used at the bottom of every main page. */
export function WhatsAppCta({
  title = 'Hungry? Let’s talk.',
  description = 'Message us on WhatsApp for orders, table bookings and catering enquiries. We reply quickly during opening hours.',
  message = whatsappMessages.general,
}: WhatsAppCtaProps) {
  return (
    <section aria-labelledby="whatsapp-cta-heading" className="on-dark bg-cream-50 pb-16 sm:pb-20">
      <Container size="wide">
        <div className="film-grain surface-dark relative overflow-hidden rounded-[2rem] px-6 py-16 text-center ring-1 ring-gold-500/20 sm:px-12 sm:py-20">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-brand-500/10 blur-3xl"
          />
          <div className="relative mx-auto flex max-w-2xl flex-col items-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-whatsapp text-white">
              <WhatsAppIcon className="size-7" />
            </span>
            <span className="rule-brass mt-8 w-16" aria-hidden="true" />
            <h2
              id="whatsapp-cta-heading"
              className="display-section mt-6 text-[clamp(1.85rem,3.6vw,2.85rem)] text-cream-50"
            >
              {title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-cream-200/75">{description}</p>

            <div className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <BorderBeam size="pulse-outside" strength={0.75} className="flex w-full sm:w-auto">
                <Button href={whatsappLink(message)} size="lg" className="w-full">
                  <WhatsAppIcon className="size-[1.15em]" />
                  WhatsApp <span className="tnum">{siteConfig.contact.phoneDisplay}</span>
                </Button>
              </BorderBeam>
              <ExternalActionButton
                link="uberEats"
                variant="outline-dark"
                size="lg"
                showIcon={false}
                className="w-full sm:w-auto"
              >
                Order on Uber Eats
              </ExternalActionButton>
            </div>

            <p className="mt-6 text-xs text-cream-200/50">
              Open {siteConfig.openingHours.days.toLowerCase()}, {siteConfig.openingHours.display}
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}
