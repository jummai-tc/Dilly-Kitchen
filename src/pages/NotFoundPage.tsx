import { Seo } from '@/components/seo/Seo'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { ArrowRightIcon, WhatsAppIcon } from '@/components/ui/Icons'
import { navLinks } from '@/config/navigation'
import { whatsappLink, whatsappMessages } from '@/config/site'

export function NotFoundPage() {
  return (
    <>
      <Seo
        title="Page Not Found"
        description="The page you were looking for could not be found. Browse the Dilly Kitchen menu, catering services and gallery instead."
        noIndex
      />

      <section className="on-dark surface-dark">
        <Container size="default" className="py-20 text-center sm:py-28">
          <p className="eyebrow text-brand-500">Error 404</p>
          <h1 className="mt-5 text-4xl text-cream-50 sm:text-5xl lg:text-6xl">
            This plate is empty
          </h1>
          <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-cream-200/75 sm:text-lg">
            We could not find the page you were looking for. It may have moved, or the link may have
            been mistyped. The kitchen is still open though.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button to="/" size="lg">
              Back to home
              <ArrowRightIcon className="size-[1.1em]" />
            </Button>
            <Button to="/menu" variant="outline-dark" size="lg">
              Browse the menu
            </Button>
          </div>

          <nav aria-label="All pages" className="mt-14 border-t border-cream-100/10 pt-9">
            <h2 className="eyebrow text-cream-200/60">Or try one of these</h2>
            <ul className="mt-5 flex flex-wrap justify-center gap-2.5">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Button to={link.to} variant="outline-dark" size="sm">
                    {link.label}
                  </Button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-12">
            <Button href={whatsappLink(whatsappMessages.general)} variant="primary">
              <WhatsAppIcon className="size-[1.15em]" />
              Message us on WhatsApp
            </Button>
          </div>
        </Container>
      </section>
    </>
  )
}
