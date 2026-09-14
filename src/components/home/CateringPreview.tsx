import { useEffect, useState } from 'react'
import { Section } from '@/components/ui/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Button } from '@/components/ui/Button'
import { ArrowRightIcon, WhatsAppIcon } from '@/components/ui/Icons'
import { cateringIcons, type CateringIconKey } from '@/components/ui/cateringIcons'
import { getCateringOptions } from '@/services/contentService'
import { whatsappLink, whatsappMessages } from '@/config/site'
import type { CateringOption } from '@/types'

export function CateringPreview() {
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
    <Section
      tone="white"
      aria-labelledby="catering-preview-heading"
      containerSize="wide"
      spacing="lg"
    >
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <SectionHeading
            id="catering-preview-heading"
            eyebrow="Catering across London"
            title="Let us cook for your celebration"
            align="left"
          />
          <p className="mt-7 max-w-xl text-[1.02rem] leading-[1.75] text-ink-600">
            From intimate family gatherings to halls of several hundred guests, we bring fresh
            Nigerian cooking to weddings, birthdays and corporate events across London — jollof by
            the tray, soups kept hot, suya carved on site.
          </p>

          {/*
            An index of what we cater, ruled like a services list. Each row keeps
            its own icon so the six read as distinct occasions, not a checklist.
          */}
          <ul className="mt-10 grid border-t border-ink-900/12 sm:grid-cols-2 sm:gap-x-10">
            {cateringOptions.map((option) => {
              const Icon = cateringIcons[option.icon as CateringIconKey]
              return (
                <li
                  key={option.id}
                  className="flex items-center gap-3.5 border-b border-ink-900/12 py-4"
                >
                  <Icon className="size-[1.15rem] shrink-0 text-gold-600" />
                  <span className="font-display text-[1.02rem] font-semibold text-ink-900">
                    {option.title}
                  </span>
                </li>
              )
            })}
          </ul>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button to="/catering" size="lg" className="w-full sm:w-auto">
              Explore catering
              <ArrowRightIcon className="size-[1.1em]" />
            </Button>
            <Button
              href={whatsappLink(whatsappMessages.catering)}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              <WhatsAppIcon className="size-[1.15em]" />
              Enquire on WhatsApp
            </Button>
          </div>
        </div>

        <div className="lg:col-span-5">
          <figure className="mx-auto w-full max-w-sm lg:max-w-none">
            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute -right-4 -top-4 size-full rounded-[1.75rem] border border-gold-500/45 sm:-right-6 sm:-top-6"
              />
              <img
                src="/images/catering/birthday-package-480.jpg"
                srcSet="/images/catering/birthday-package-480.jpg 480w, /images/catering/birthday-package-720.jpg 720w"
                sizes="(min-width: 1024px) 32vw, (min-width: 640px) 24rem, 88vw"
                width={720}
                height={1280}
                loading="lazy"
                decoding="async"
                alt="A Dilly Kitchen birthday celebration hamper with black and gold balloons, chocolates, grapes and sparkling wine"
                className="relative max-h-[36rem] w-full rounded-[1.75rem] object-cover shadow-lift"
              />
            </div>
          </figure>

          {/* Brass rule instead of a filled panel — a note in the margin. */}
          <div className="mx-auto mt-10 max-w-sm border-l-2 border-gold-500/60 pl-5 lg:max-w-none">
            <p className="eyebrow text-[0.62rem] text-gold-700">Celebration packages</p>
            <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ink-600">
              Birthday and celebration packages can be prepared alongside your catering order — tell
              us the occasion and we will build it around you.
            </p>
          </div>
        </div>
      </div>
    </Section>
  )
}
