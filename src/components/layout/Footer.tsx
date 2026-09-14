import { Link } from 'react-router-dom'
import { navLinks } from '@/config/navigation'
import { externalLinks, siteConfig, whatsappLink, whatsappMessages } from '@/config/site'
import { Container } from '@/components/ui/Container'
import { ClockIcon, MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from '@/components/ui/Icons'
import { Logo } from './Logo'

const socialKeys = ['instagram', 'facebook', 'tiktok'] as const

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="on-dark surface-dark border-t border-cream-100/10">
      <Container size="wide" className="py-14 sm:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Logo />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-cream-200/70">
              {siteConfig.shortDescription}
            </p>
            <p className="eyebrow mt-5 text-brand-500">
              Est. {siteConfig.established} · {siteConfig.tagline}
            </p>
          </div>

          {/* Navigation */}
          <nav aria-labelledby="footer-nav-heading" className="lg:col-span-2">
            <h2 id="footer-nav-heading" className="eyebrow text-cream-50">
              Explore
            </h2>
            <ul className="mt-5 flex flex-col gap-2.5">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-cream-200/75 transition-colors hover:text-brand-500"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h2 className="eyebrow text-cream-50">Find Us</h2>
            <ul className="mt-5 flex flex-col gap-4 text-sm text-cream-200/75">
              <li className="flex gap-3">
                <PinIcon className="mt-0.5 size-4 shrink-0 text-brand-500" />
                <address className="not-italic leading-relaxed">
                  {siteConfig.address.street}
                  <br />
                  {siteConfig.address.locality}, {siteConfig.address.postalCode}
                  <br />
                  {siteConfig.address.region}, {siteConfig.address.country}
                </address>
              </li>
              <li className="flex gap-3">
                <ClockIcon className="mt-0.5 size-4 shrink-0 text-brand-500" />
                <span>
                  {siteConfig.openingHours.days}
                  <br />
                  <span className="font-semibold text-cream-100">
                    {siteConfig.openingHours.display}
                  </span>
                </span>
              </li>
              <li className="flex gap-3">
                <WhatsAppIcon className="mt-0.5 size-4 shrink-0 text-brand-500" />
                <a
                  href={whatsappLink(whatsappMessages.general)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-brand-500"
                >
                  WhatsApp {siteConfig.contact.phoneDisplay}
                </a>
              </li>
              <li className="flex gap-3">
                <PhoneIcon className="mt-0.5 size-4 shrink-0 text-brand-500" />
                <a
                  href={siteConfig.contact.phoneHref}
                  className="transition-colors hover:text-brand-500"
                >
                  {siteConfig.contact.phoneDisplay}
                </a>
              </li>
              <li className="flex gap-3">
                <MailIcon className="mt-0.5 size-4 shrink-0 text-brand-500" />
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="break-all transition-colors hover:text-brand-500"
                >
                  {siteConfig.contact.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Order & follow */}
          <div className="lg:col-span-3">
            <h2 className="eyebrow text-cream-50">Order &amp; Follow</h2>
            <ul className="mt-5 flex flex-col gap-2.5 text-sm">
              <li>
                <FooterExternal linkKey="uberEats" />
              </li>
              <li>
                <FooterExternal linkKey="googleReviews" />
              </li>
              <li>
                <a
                  href={externalLinks.googleMapsDirections.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cream-200/75 transition-colors hover:text-brand-500"
                >
                  Get directions
                </a>
              </li>
            </ul>

            <h3 className="eyebrow mt-7 text-cream-50">Social</h3>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm">
              {socialKeys.map((key) => (
                <li key={key}>
                  <FooterExternal linkKey={key} />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-cream-100/10 pt-7 text-xs text-cream-200/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.legalName}. All rights reserved.
          </p>
          <p>
            {siteConfig.address.full} · Serving {siteConfig.areaServed}
          </p>
        </div>
      </Container>
    </footer>
  )
}

/**
 * Footer link that degrades to a plain "coming soon" label when the business
 * has not supplied the URL yet — never a dead `href`.
 */
function FooterExternal({ linkKey }: { linkKey: keyof typeof externalLinks }) {
  const config = externalLinks[linkKey]

  if (config.isPlaceholder || !config.href) {
    return (
      <span className="inline-flex items-center gap-2 text-cream-200/40">
        {config.label}
        <span className="rounded-full bg-cream-100/10 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wider">
          Soon
        </span>
      </span>
    )
  }

  return (
    <a
      href={config.href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-cream-200/75 transition-colors hover:text-brand-500"
    >
      {config.label}
    </a>
  )
}
