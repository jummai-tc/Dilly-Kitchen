/**
 * Loads `site_links` and `site_settings` once for the whole app and hands them
 * to every call to action through context.
 *
 * Mounted in `components/layout/Layout` so it covers every public page. While
 * the fetch is in flight — and if it fails — the bundled values from
 * `src/config/site.ts` are served, so the buttons behave exactly as they did
 * before Supabase was connected.
 */
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { getSiteLinks, getSiteSettings, fallbackSiteLinks, type SiteLinks, type SiteSettings } from '@/services/siteService'
import { SiteContentContext } from './siteContentContext'

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [links, setLinks] = useState<SiteLinks>(fallbackSiteLinks)
  const [settings, setSettings] = useState<SiteSettings>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true
    Promise.all([getSiteLinks(), getSiteSettings()])
      .then(([nextLinks, nextSettings]) => {
        if (!active) return
        setLinks(nextLinks)
        setSettings(nextSettings)
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const value = useMemo(() => ({ links, settings, isLoading }), [links, settings, isLoading])

  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>
}
