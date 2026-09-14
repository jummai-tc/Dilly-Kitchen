/**
 * The admin dashboard — everything behind `/admin`.
 *
 * Four panels: the two enquiry inboxes (which is where a submitted form shows
 * up), gallery uploads, and the call-to-action links that the public buttons
 * read from. Reachable only through `RequireAdmin`, and every query here is
 * additionally gated by Row Level Security.
 */
import { useCallback, useEffect, useState } from 'react'
import { Seo } from '@/components/seo/Seo'
import { Button } from '@/components/ui/Button'
import { AdminUploadPanel } from '@/components/gallery/AdminUploadPanel'
import { useAuth } from '@/context/authContext'
import {
  listCateringEnquiries,
  listContactMessages,
  setEnquiryStatus,
  type CateringEnquiryRecord,
  type ContactMessageRecord,
} from '@/services/admin/enquiryAdmin'
import {
  deleteGalleryItem,
  listGalleryItemsForAdmin,
  setGalleryItemPublished,
  type AdminGalleryItem,
} from '@/services/admin/galleryAdmin'
import { getSiteLinks, type SiteLinks } from '@/services/siteService'
import { saveSiteLink } from '@/services/admin/siteAdmin'
import { cn } from '@/lib/utils'

type Tab = 'catering' | 'messages' | 'gallery' | 'links'

const tabs: { id: Tab; label: string }[] = [
  { id: 'catering', label: 'Catering enquiries' },
  { id: 'messages', label: 'Contact messages' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'links', label: 'Links' },
]

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export function AdminPage() {
  const { user, signOut } = useAuth()
  const [tab, setTab] = useState<Tab>('catering')

  return (
    <>
      {/* The admin area must never be indexed or previewed anywhere. */}
      <Seo title="Admin" description="Dilly Kitchen staff area." noIndex />

      <div className="min-h-screen bg-cream-50">
        <header className="border-b border-ink-900/10 bg-white">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-5">
            <div>
              <p className="eyebrow text-[0.6rem] text-ink-500">Dilly Kitchen</p>
              <h1 className="font-display text-xl text-ink-900">Staff dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-sm text-ink-600">{user?.email}</p>
              <Button onClick={() => void signOut()} variant="secondary" size="sm">
                Sign out
              </Button>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-6xl px-5 py-8">
          <nav aria-label="Dashboard sections" className="flex flex-wrap gap-2">
            {tabs.map((entry) => (
              <button
                key={entry.id}
                type="button"
                onClick={() => setTab(entry.id)}
                aria-current={tab === entry.id ? 'page' : undefined}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                  tab === entry.id
                    ? 'bg-ink-900 text-cream-50'
                    : 'bg-white text-ink-700 ring-1 ring-ink-900/10 hover:bg-ink-900/5',
                )}
              >
                {entry.label}
              </button>
            ))}
          </nav>

          <div className="mt-8">
            {tab === 'catering' && <CateringInbox />}
            {tab === 'messages' && <MessagesInbox />}
            {tab === 'gallery' && <GalleryManager />}
            {tab === 'links' && <LinksManager />}
          </div>
        </div>
      </div>
    </>
  )
}

/** Shared empty/error/loading frame so all four panels behave the same. */
function Panel({
  isLoading,
  error,
  isEmpty,
  emptyText,
  children,
}: {
  isLoading: boolean
  error: string | null
  isEmpty: boolean
  emptyText: string
  children: React.ReactNode
}) {
  if (isLoading) return <p className="text-sm text-ink-600">Loading…</p>
  if (error)
    return (
      <p role="alert" className="rounded-2xl bg-spice-500/10 px-4 py-3 text-sm text-spice-600">
        {error}
      </p>
    )
  if (isEmpty)
    return (
      <div className="rounded-card bg-white p-8 text-center shadow-soft ring-1 ring-ink-900/8">
        <p className="text-sm text-ink-600">{emptyText}</p>
      </div>
    )
  return <>{children}</>
}

function CateringInbox() {
  const [rows, setRows] = useState<CateringEnquiryRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(() => {
    listCateringEnquiries()
      .then((next) => {
        setRows(next)
        setError(null)
      })
      .catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(load, [load])

  return (
    <Panel
      isLoading={isLoading}
      error={error}
      isEmpty={rows.length === 0}
      emptyText="No catering enquiries yet. Submissions from the catering form land here."
    >
      <ul className="flex flex-col gap-4">
        {rows.map((row) => (
          <li key={row.id} className="rounded-card bg-white p-6 shadow-soft ring-1 ring-ink-900/8">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="font-display text-lg text-ink-900">{row.name}</h2>
              <p className="text-xs text-ink-500">{formatDate(row.created_at)}</p>
            </div>
            <dl className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
              <Detail term="Email" value={row.email} href={`mailto:${row.email}`} />
              <Detail term="Phone" value={row.phone} href={`tel:${row.phone}`} />
              <Detail term="Event" value={row.event_type} />
              <Detail term="Date" value={row.event_date} />
              <Detail term="Guests" value={row.guest_count} />
              <Detail term="Status" value={row.status} />
            </dl>
            {row.preferred_dishes && (
              <p className="mt-4 text-sm text-ink-700">
                <span className="font-semibold text-ink-900">Preferred dishes: </span>
                {row.preferred_dishes}
              </p>
            )}
            {row.notes && (
              <p className="mt-2 text-sm leading-relaxed text-ink-700">
                <span className="font-semibold text-ink-900">Notes: </span>
                {row.notes}
              </p>
            )}
            <div className="mt-5 flex gap-2">
              {(['new', 'contacted', 'closed'] as const)
                .filter((status) => status !== row.status)
                .map((status) => (
                  <Button
                    key={status}
                    variant="ghost"
                    size="sm"
                    onClick={async () => {
                      await setEnquiryStatus('catering_enquiries', row.id, status)
                      load()
                    }}
                  >
                    Mark {status}
                  </Button>
                ))}
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  )
}

function MessagesInbox() {
  const [rows, setRows] = useState<ContactMessageRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(() => {
    listContactMessages()
      .then((next) => {
        setRows(next)
        setError(null)
      })
      .catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(load, [load])

  return (
    <Panel
      isLoading={isLoading}
      error={error}
      isEmpty={rows.length === 0}
      emptyText="No messages yet. Submissions from the contact form land here."
    >
      <ul className="flex flex-col gap-4">
        {rows.map((row) => (
          <li key={row.id} className="rounded-card bg-white p-6 shadow-soft ring-1 ring-ink-900/8">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="font-display text-lg text-ink-900">{row.subject}</h2>
              <p className="text-xs text-ink-500">{formatDate(row.created_at)}</p>
            </div>
            <dl className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
              <Detail term="From" value={row.name} />
              <Detail term="Email" value={row.email} href={`mailto:${row.email}`} />
              {row.phone && <Detail term="Phone" value={row.phone} href={`tel:${row.phone}`} />}
              <Detail term="Status" value={row.status} />
            </dl>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-ink-700">
              {row.message}
            </p>
            <div className="mt-5 flex gap-2">
              {(['new', 'read', 'replied'] as const)
                .filter((status) => status !== row.status)
                .map((status) => (
                  <Button
                    key={status}
                    variant="ghost"
                    size="sm"
                    onClick={async () => {
                      await setEnquiryStatus('contact_messages', row.id, status)
                      load()
                    }}
                  >
                    Mark {status}
                  </Button>
                ))}
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  )
}

function Detail({ term, value, href }: { term: string; value: string; href?: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-ink-500">{term}</dt>
      <dd className="text-ink-800">
        {href ? (
          <a href={href} className="underline underline-offset-4 hover:text-ink-900">
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  )
}

function GalleryManager() {
  const [items, setItems] = useState<AdminGalleryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(() => {
    listGalleryItemsForAdmin()
      .then((next) => {
        setItems(next)
        setError(null)
      })
      .catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(load, [load])

  return (
    <div className="flex flex-col gap-8">
      <AdminUploadPanel onUploaded={load} />

      <Panel
        isLoading={isLoading}
        error={error}
        isEmpty={items.length === 0}
        emptyText="The gallery is empty."
      >
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="overflow-hidden rounded-card bg-white shadow-soft ring-1 ring-ink-900/8"
            >
              <img
                src={item.image.widths.length ? `${item.image.base}-${item.image.widths[0]}.jpg` : item.image.base}
                alt={item.image.alt}
                loading="lazy"
                className="aspect-[4/3] w-full bg-ink-900/5 object-cover"
              />
              <div className="p-4">
                <p className="font-medium text-ink-900">{item.title}</p>
                <p className="mt-1 text-xs text-ink-500">
                  {item.type}
                  {item.isPublished ? '' : ' · hidden'}
                </p>
                <div className="mt-3 flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={async () => {
                      await setGalleryItemPublished(item.id, !item.isPublished)
                      load()
                    }}
                  >
                    {item.isPublished ? 'Hide' : 'Publish'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={async () => {
                      if (!confirm(`Delete “${item.title}” from the gallery?`)) return
                      await deleteGalleryItem(item)
                      load()
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  )
}

/**
 * Where "Order on Uber Eats", "WhatsApp Us", "Book a table" and "Discover our
 * menu" get their destinations. Saving here changes every one of those buttons
 * across the site without a redeploy.
 */
function LinksManager() {
  const [links, setLinks] = useState<SiteLinks>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)

  useEffect(() => {
    getSiteLinks()
      .then(setLinks)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setIsLoading(false))
  }, [])

  async function save(key: string, href: string) {
    const result = await saveSiteLink(key, href)
    if (!result.ok) {
      setError(result.message)
      return
    }
    setError(null)
    setSaved(key)
    setLinks((current) => ({
      ...current,
      [key]: { ...current[key], href: href.trim(), isPlaceholder: result.isPlaceholder },
    }))
  }

  const entries = Object.values(links).sort((a, b) => a.key.localeCompare(b.key))

  return (
    <Panel
      isLoading={isLoading}
      error={error}
      isEmpty={entries.length === 0}
      emptyText="No links configured."
    >
      <ul className="flex flex-col gap-3">
        {entries.map((link) => (
          <li
            key={link.key}
            className="flex flex-wrap items-end gap-3 rounded-card bg-white p-5 shadow-soft ring-1 ring-ink-900/8"
          >
            <label className="flex min-w-64 flex-1 flex-col gap-1.5">
              <span className="text-sm font-semibold text-ink-800">
                {link.label}
                {link.isPlaceholder && (
                  <span className="ml-2 text-xs font-normal text-gold-700">not set yet</span>
                )}
              </span>
              <input
                type="url"
                defaultValue={link.href}
                placeholder="https://…"
                onBlur={(event) => void save(link.key, event.target.value)}
                className="w-full rounded-2xl border border-ink-900/12 bg-white px-4 py-2.5 text-sm text-ink-900 focus:border-brand-500"
              />
            </label>
            {saved === link.key && <p className="pb-3 text-xs text-emerald-700">Saved</p>}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-ink-500">
        Changes save when you leave a field. Clearing a URL returns that button to its “coming
        soon” state instead of showing a broken link.
      </p>
    </Panel>
  )
}
