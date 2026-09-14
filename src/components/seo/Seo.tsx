import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { siteConfig } from '@/config/site'

interface SeoProps {
  title: string
  description: string
  /** Path to an image under /public — turned into an absolute OG URL. */
  image?: string
  /** `article` for story-style pages, `website` otherwise. */
  type?: 'website' | 'article'
  /** Set true on the 404 page so search engines do not index it. */
  noIndex?: boolean
}

/** Creates or updates a meta tag, tracking it so it can be reverted on unmount. */
function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

/**
 * Per-page document head management. Deliberately dependency-free.
 *
 * NOTE: this is a client-rendered SPA, so these tags are applied after hydration.
 * `index.html` carries sensible defaults for crawlers that do not run JavaScript.
 * For full per-route SEO, move to SSR/SSG (Vite SSR, Next.js or prerendering)
 * when the backend is added.
 */
export function Seo({ title, description, image, type = 'website', noIndex = false }: SeoProps) {
  const { pathname } = useLocation()

  useEffect(() => {
    const fullTitle = `${title} | ${siteConfig.name}`
    const url = `${siteConfig.url.replace(/\/$/, '')}${pathname}`
    const ogImage = `${siteConfig.url.replace(/\/$/, '')}${image ?? siteConfig.ogImage}`

    document.title = fullTitle
    setMeta('name', 'description', description)
    setMeta('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow')
    setLink('canonical', url)

    setMeta('property', 'og:title', fullTitle)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:type', type)
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:image', ogImage)
    setMeta('property', 'og:image:alt', `${siteConfig.name} — ${title}`)
    setMeta('property', 'og:site_name', siteConfig.name)
    setMeta('property', 'og:locale', 'en_GB')

    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', fullTitle)
    setMeta('name', 'twitter:description', description)
    setMeta('name', 'twitter:image', ogImage)
  }, [title, description, image, type, noIndex, pathname])

  return null
}
