/**
 * Context + hooks for the site-wide content that lives in Supabase: the
 * call-to-action destinations (`site_links`) and the loose settings
 * (`site_settings`).
 *
 * Split from the provider component so the file exports only hooks — components
 * and non-component exports in one module defeat fast refresh.
 */
import { createContext, useContext } from 'react'
import { fallbackSiteLinks, type SiteLink, type SiteLinks, type SiteSettings } from '@/services/siteService'

export interface SiteContentValue {
  links: SiteLinks
  settings: SiteSettings
  /** True until the first fetch settles. The bundled values are served meanwhile. */
  isLoading: boolean
}

export const SiteContentContext = createContext<SiteContentValue>({
  links: fallbackSiteLinks,
  settings: {},
  isLoading: false,
})

export function useSiteContent(): SiteContentValue {
  return useContext(SiteContentContext)
}

/**
 * The destination for one call to action. Always returns something usable: an
 * unknown key, or one whose row has no URL yet, comes back flagged as a
 * placeholder so the existing "coming soon" UI takes over.
 */
export function useSiteLink(key: string): SiteLink {
  const { links } = useSiteContent()
  return (
    links[key] ??
    fallbackSiteLinks[key] ?? { key, label: key, href: '', isPlaceholder: true }
  )
}

/** A `site_settings` value, with the bundled constant as the fallback. */
export function useSetting<T>(key: string, fallback: T): T {
  const { settings } = useSiteContent()
  const value = settings[key]
  return value === undefined || value === null ? fallback : (value as T)
}
