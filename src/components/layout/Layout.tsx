import { Outlet } from 'react-router-dom'
import { SiteContentProvider } from '@/context/SiteContentProvider'
import { StructuredData } from '@/components/seo/StructuredData'
import { Footer } from './Footer'
import { Header } from './Header'
import { ScrollToTop } from './ScrollToTop'
import { WhatsAppFloat } from './WhatsAppFloat'

export function Layout() {
  return (
    /*
      Loads the call-to-action destinations and site settings from Supabase once
      for the whole site. Until they arrive — and if they never do — the bundled
      values in config/site.ts are served, so every button keeps working.
    */
    <SiteContentProvider>
      <ScrollToTop />
      <StructuredData />
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Header />
      {/* Padding clears the fixed header on every page. */}
      <main id="main-content" className="pt-[72px] sm:pt-[80px]">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFloat />
    </SiteContentProvider>
  )
}
