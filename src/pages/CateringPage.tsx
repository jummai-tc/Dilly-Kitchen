import { useEffect, useState } from 'react'
import { Seo } from '@/components/seo/Seo'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Button } from '@/components/ui/Button'
import { ArrowRightIcon, CheckIcon, WhatsAppIcon } from '@/components/ui/Icons'
import { cateringIcons, type CateringIconKey } from '@/components/ui/cateringIcons'
import { CateringEnquiryForm } from '@/components/forms/CateringEnquiryForm'
import { WhatsAppCta } from '@/components/home/WhatsAppCta'
import { cateringIntro } from '@/data/catering'
import { getCateringOptions } from '@/services/contentService'
import { whatsappLink, whatsappMessages } from '@/config/site'
import type { CateringOption } from '@/types'

const process = [
  {
    step: '01',
    title: 'Tell us about your event',
    description: 'Send the date, guest numbers and the kind of celebration you are planning.',
  },
  {
    step: '02',
    title: 'We build your menu',
    description: 'We suggest dishes and quantities that suit your guests, then confirm a price.',
  },
  {
    step: '03',
    title: 'We cook and deliver',
    description: 'Everything is prepared fresh and arrives hot, on time and ready to serve.',
  },
]

export function CateringPage() {
  const [cateringOptions, setCateringOptions] = useState<CateringOption[]>([])

  useEffect(() => {
    let active = true
    getCateringOptions().then((options) => {
      if (active) setCateringOptions(options)
    })
    return () => {
      active = false
    }
  }, [])

  return (
    <>
      <Seo
        title="Nigerian Catering Services in London"
        description="Nigerian catering in London from Dilly Kitchen — weddings, birthdays, corporate events, family gatherings and large celebrations. Signature jollof rice, traditional soups, suya and more."
      />

      {/* Hero */}
      <section aria-labelledby="catering-heading" className="on-dark surface-dark">
        <Container size="wide" className="py-16 sm:py-20 lg:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div>
              <SectionHeading
                id="catering-heading"
                eyebrow="Catering"
                title={cateringIntro.heading}
                align="left"
                tone="dark"
                as="h1"
              />
              <div className="mt-6 flex flex-col gap-4 text-base leading-relaxed text-cream-200/80 sm:text-lg">
                {cateringIntro.paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button to="/menu" size="lg">
                  Discover Our Menu
                  <ArrowRightIcon className="size-[1.1em]" />
                </Button>
                <Button
                  href={whatsappLink(whatsappMessages.catering)}
                  variant="outline-dark"
                  size="lg"
                >
                  <WhatsAppIcon className="size-[1.15em]" />
                  WhatsApp enquiry
                </Button>
              </div>
            </div>

            <div className="relative mx-auto max-w-sm lg:max-w-md">
              <img
                src="/images/hero/jollof-rice-hero-720.jpg"
                srcSet="/images/hero/jollof-rice-hero-480.jpg 480w, /images/hero/jollof-rice-hero-720.jpg 720w"
                sizes="(min-width: 1024px) 28rem, 88vw"
                width={720}
                height={1080}
                loading="eager"
                fetchPriority="high"
                alt="Smoky Nigerian jollof rice topped with grilled chicken and a wedge of lime, steam rising from the plate"
                className="w-full rounded-[2rem] object-cover shadow-lift ring-1 ring-cream-100/10"
              />
              <span
                aria-hidden="true"
                className="absolute -bottom-4 -right-4 -z-10 size-32 rounded-2xl border-2 border-brand-500/35 sm:size-40"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Occasions */}
      <Section tone="cream" aria-labelledby="occasions-heading" containerSize="wide">
        <SectionHeading
          id="occasions-heading"
          eyebrow="What we cater"
          title="Celebrations of every size"
          description="Whatever the occasion, we scale the kitchen to match it."
        />

        <ul className="mt-11 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cateringOptions.map((option) => {
            const Icon = cateringIcons[option.icon as CateringIconKey]
            return (
              <li
                key={option.id}
                className="group rounded-card bg-white p-7 shadow-soft ring-1 ring-ink-900/5 transition-all duration-500 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:shadow-lift"
              >
                <span className="flex size-12 items-center justify-center rounded-2xl bg-ink-900 text-brand-500 transition-colors duration-500 group-hover:bg-brand-500 group-hover:text-ink-900">
                  {Icon ? <Icon className="size-6" /> : null}
                </span>
                <h3 className="mt-5 font-display text-xl text-ink-900">{option.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-600">{option.description}</p>
              </li>
            )
          })}
        </ul>
      </Section>

      {/* How it works */}
      <Section tone="dark" aria-labelledby="process-heading" containerSize="wide">
        <SectionHeading
          id="process-heading"
          eyebrow="How it works"
          title="Three steps to a full table"
          tone="dark"
        />
        <ol className="mt-11 grid gap-6 md:grid-cols-3">
          {process.map((item) => (
            <li
              key={item.step}
              className="rounded-card border border-cream-100/12 bg-ink-800/50 p-7 backdrop-blur-sm"
            >
              <span className="font-display text-3xl font-semibold text-brand-500">
                {item.step}
              </span>
              <h3 className="mt-3 font-display text-lg text-cream-50">{item.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-cream-200/70">{item.description}</p>
            </li>
          ))}
        </ol>

        <div className="mt-11 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-cream-200/70">
          {['Fresh ingredients', 'Trusted recipes', 'Serving across London'].map((point) => (
            <span key={point} className="inline-flex items-center gap-2">
              <CheckIcon className="size-4 text-brand-500" />
              {point}
            </span>
          ))}
        </div>
      </Section>

      {/* Enquiry form */}
      <Section tone="cream" id="enquiry" aria-labelledby="enquiry-heading" containerSize="default">
        <SectionHeading
          id="enquiry-heading"
          eyebrow="Enquire"
          title="Tell us about your event"
          description="Fill in the details below and we will come back to you with a menu and a price."
        />

        <div className="mt-10 rounded-card bg-white p-6 shadow-soft ring-1 ring-ink-900/5 sm:p-9">
          <CateringEnquiryForm />
        </div>

        <div className="mt-8 flex flex-col items-center gap-3 rounded-card bg-ink-900/[0.04] p-6 text-center ring-1 ring-ink-900/8 sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h3 className="font-display text-base font-semibold text-ink-900">
              Need an answer today?
            </h3>
            <p className="mt-1 text-sm text-ink-600">
              WhatsApp is the fastest way to reach the kitchen.
            </p>
          </div>
          <Button href={whatsappLink(whatsappMessages.catering)} className="shrink-0">
            <WhatsAppIcon className="size-[1.15em]" />
            WhatsApp us now
          </Button>
        </div>
      </Section>

      <WhatsAppCta
        title="Let’s plan your celebration"
        description="Send us the date and guest count and we will build a menu around it."
        message={whatsappMessages.catering}
      />
    </>
  )
}
