/**
 * Site-wide settings and call-to-action destinations.
 *
 * Every outward-facing button — "Order on Uber Eats", "WhatsApp Us", "Book a
 * table", "Discover our menu", the social links and the map link — reads its
 * destination from the `site_links` table, so the owner can fill in or change a
 * URL from the admin panel without a redeploy. Until a row says otherwise, the
 * values in `src/config/site.ts` are used, which keeps the existing
 * "coming soon" behaviour for links the business has not supplied yet.
 *
 * `site_settings` holds the loose strings that are not links: the allergen
 * notice and the pre-filled WhatsApp message templates.
 */
import { externalLinks, siteConfig, whatsappMessages } from '@/config/site'
import { readWithFallback, unwrap } from './supabaseClient'
import type { SiteLinkRow, SiteSettingRow } from './rows'

export interface SiteLink {
  key: string
  label: string
  href: string
  /** True when no real URL is configured yet — the UI offers WhatsApp instead. */
  isPlaceholder: boolean
}

export type SiteLinks = Record<string, SiteLink>

/** Keys the app builds itself when there is no `site_links` row for them. */
function whatsappHref(message: string): string {
  return `https://wa.me/${siteConfig.contact.whatsappNumber}?text=${encodeURIComponent(message)}`
}

/**
 * What the site shows before — or instead of — a successful fetch. Derived from
 * `src/config/site.ts` so the bundled behaviour is identical to before Supabase
 * was connected.
 */
export const fallbackSiteLinks: SiteLinks = {
  ...Object.fromEntries(
    Object.entries(externalLinks).map(([key, link]) => [
      key,
      { key, label: link.label, href: link.href, isPlaceholder: link.isPlaceholder },
    ]),
  ),
  bookTable: {
    key: 'bookTable',
    label: 'Book a table',
    href: whatsappHref(whatsappMessages.booking),
    isPlaceholder: false,
  },
  discoverMenu: {
    key: 'discoverMenu',
    label: 'Discover our menu',
    href: '/menu',
    isPlaceholder: false,
  },
}

export type SiteSettings = Record<string, unknown>

export async function getSiteLinks(): Promise<SiteLinks> {
  return readWithFallback(
    'getSiteLinks',
    async (client) => {
      const rows = unwrap(
        await client
          .from('site_links')
          .select('key, label, href, is_placeholder, sort_order')
          .order('sort_order', { ascending: true })
          .returns<SiteLinkRow[]>(),
      )
      if (rows.length === 0) throw new Error('site_links is empty')
      const links: SiteLinks = { ...fallbackSiteLinks }
      for (const row of rows) {
        links[row.key] = {
          key: row.key,
          label: row.label,
          // A blank href always counts as a placeholder, whatever the flag says,
          // so the UI can never render an empty link.
          href: row.href,
          isPlaceholder: row.is_placeholder || !row.href.trim(),
        }
      }
      return links
    },
    () => fallbackSiteLinks,
  )
}

export async function getSiteSettings(): Promise<SiteSettings> {
  return readWithFallback(
    'getSiteSettings',
    async (client) => {
      const rows = unwrap(
        await client.from('site_settings').select('key, value').returns<SiteSettingRow[]>(),
      )
      return Object.fromEntries(rows.map((row) => [row.key, row.value])) as SiteSettings
    },
    () => ({}) as SiteSettings,
  )
}
