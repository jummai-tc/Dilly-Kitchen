import { useEffect, useMemo, useState } from 'react'
import { Seo } from '@/components/seo/Seo'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Button } from '@/components/ui/Button'
import { PlayIcon } from '@/components/ui/Icons'
import { SmartImage } from '@/components/ui/SmartImage'
import { Lightbox } from '@/components/gallery/Lightbox'
import { WhatsAppCta } from '@/components/home/WhatsAppCta'
import { getGalleryItems } from '@/services/galleryService'
import { cn } from '@/lib/utils'
import type { GalleryItem } from '@/types'

type Filter = 'all' | 'photo' | 'video'

const filters: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All media' },
  { id: 'photo', label: 'Photos' },
  { id: 'video', label: 'Videos' },
]

export function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [activeFilter, setActiveFilter] = useState<Filter>('all')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  useEffect(() => {
    let active = true
    getGalleryItems().then((result) => {
      if (active) setItems(result)
    })
    return () => {
      active = false
    }
  }, [])

  const visible = useMemo(
    () => (activeFilter === 'all' ? items : items.filter((item) => item.type === activeFilter)),
    [items, activeFilter],
  )

  const counts = useMemo(
    () => ({
      all: items.length,
      photo: items.filter((item) => item.type === 'photo').length,
      video: items.filter((item) => item.type === 'video').length,
    }),
    [items],
  )

  return (
    <>
      <Seo
        title="Gallery"
        description="Photographs from the Dilly Kitchen pass — jollof rice, suya, traditional soups, grilled fish and our dining room in Feltham, London."
      />

      <section aria-labelledby="gallery-heading" className="on-dark surface-dark">
        <Container size="wide" className="py-14 sm:py-18 lg:py-20">
          <SectionHeading
            id="gallery-heading"
            eyebrow="Gallery"
            title="Every plate, photographed in our own kitchen"
            description="Real food, real portions, real dining room. Select any image to view it full size."
            tone="dark"
            as="h1"
          />
        </Container>
      </section>

      <Section tone="cream" containerSize="wide" spacing="md">
        {/* Filters */}
        <div
          role="group"
          aria-label="Filter gallery by media type"
          className="flex flex-wrap justify-center gap-2.5"
        >
          {filters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => setActiveFilter(filter.id)}
              aria-pressed={activeFilter === filter.id}
              className={cn(
                'inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300',
                activeFilter === filter.id
                  ? 'bg-ink-900 text-cream-50 shadow-soft'
                  : 'bg-white text-ink-700 ring-1 ring-ink-900/10 hover:bg-ink-900/5 hover:ring-ink-900/20',
              )}
            >
              {filter.label}
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.5 text-[0.65rem] font-semibold',
                  activeFilter === filter.id
                    ? 'bg-brand-500 text-ink-900'
                    : 'bg-ink-900/8 text-ink-600',
                )}
              >
                {counts[filter.id]}
              </span>
            </button>
          ))}
        </div>

        <p className="sr-only" role="status" aria-live="polite">
          {visible.length} {visible.length === 1 ? 'item' : 'items'} shown
        </p>

        {/* Masonry via CSS columns — keeps natural aspect ratios. */}
        {visible.length > 0 ? (
          <ul className="mt-10 columns-2 gap-3 sm:gap-4 lg:columns-3 xl:columns-4 [&>li]:mb-3 sm:[&>li]:mb-4">
            {visible.map((item, index) => (
              <li key={item.id} className="break-inside-avoid">
                <button
                  type="button"
                  onClick={() => setLightboxIndex(index)}
                  className="group relative block w-full overflow-hidden rounded-2xl bg-ink-900 shadow-soft transition-all duration-500 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:shadow-lift"
                  aria-label={`View ${item.title}${item.type === 'video' ? ' (video)' : ''}`}
                >
                  <SmartImage
                    image={item.image}
                    sizes="(min-width: 1280px) 21vw, (min-width: 1024px) 28vw, 46vw"
                    className="w-full object-cover transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-105"
                  />

                  {item.type === 'video' && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <span className="flex size-14 items-center justify-center rounded-full bg-brand-500/95 text-ink-900 shadow-lift transition-transform duration-500 group-hover:scale-110">
                        <PlayIcon className="ml-0.5 size-6" />
                      </span>
                    </span>
                  )}

                  <span
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
                  />
                  <span className="absolute inset-x-0 bottom-0 translate-y-2 p-4 text-left opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                    <span className="block font-display text-base font-semibold text-cream-50">
                      {item.title}
                    </span>
                    <span className="mt-0.5 block text-xs text-cream-200/75">{item.caption}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mx-auto mt-12 max-w-md rounded-card bg-white p-10 text-center shadow-soft ring-1 ring-ink-900/5">
            <h2 className="text-xl">
              {activeFilter === 'video' ? 'Videos are coming soon' : 'Nothing to show here yet'}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-600">
              {activeFilter === 'video'
                ? 'We are filming in the kitchen. In the meantime, browse the photographs — there are plenty of them.'
                : 'Please try another filter.'}
            </p>
            <Button
              onClick={() => setActiveFilter('photo')}
              variant="secondary"
              size="sm"
              className="mt-6"
            >
              View photographs
            </Button>
          </div>
        )}

        <p className="mt-12 text-center text-xs text-ink-500">
          All photographs are of food prepared and served at Dilly Kitchen.
        </p>
      </Section>

      {lightboxIndex !== null && (
        <Lightbox
          items={visible}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}

      <WhatsAppCta
        title="Seen something you like?"
        description="Message us to order any dish in the gallery, or to plan catering for your event."
      />
    </>
  )
}
