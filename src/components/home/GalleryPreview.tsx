import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Section } from '@/components/ui/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Button } from '@/components/ui/Button'
import { ArrowRightIcon } from '@/components/ui/Icons'
import { SmartImage } from '@/components/ui/SmartImage'
import { getGalleryPhotos } from '@/services/galleryService'
import { cn } from '@/lib/utils'
import type { GalleryItem } from '@/types'

/**
 * A hand-picked, visually varied selection from the full gallery. The first
 * entry is the lead plate and is given four times the space on desktop — a
 * photo wall is edited, not tiled.
 */
const previewIds = [
  'jollof-rice-chicken',
  'beef-suya',
  'isi-ewu',
  'grilled-croaker-fish',
  'puff-puff',
  'efo-riro',
  'fried-plantain',
  'okra-soup',
  'tilapia-pepper-soup',
]

export function GalleryPreview() {
  const [photos, setPhotos] = useState<GalleryItem[]>([])

  useEffect(() => {
    let active = true
    getGalleryPhotos().then((result) => {
      if (active) setPhotos(result)
    })
    return () => {
      active = false
    }
  }, [])

  /*
   * Keep the hand-picked running order when those ids are present, then top up
   * with whatever else the gallery holds — so photographs uploaded through the
   * admin panel still reach the homepage instead of the section thinning out.
   */
  const preferred = previewIds
    .map((id) => photos.find((photo) => photo.id === id))
    .filter((photo): photo is GalleryItem => Boolean(photo))
  const items = [
    ...preferred,
    ...photos.filter((photo) => !preferred.includes(photo)),
  ].slice(0, previewIds.length)

  return (
    <Section tone="dark" aria-labelledby="gallery-preview-heading" containerSize="wide" spacing="lg">
      <div className="flex flex-col items-start justify-between gap-7 sm:flex-row sm:items-end">
        <SectionHeading
          id="gallery-preview-heading"
          eyebrow="Straight from the pass"
          title="A look at what we serve"
          description="Real plates, photographed in our own kitchen — never stock imagery."
          align="left"
          tone="dark"
          className="max-w-2xl"
        />
        <Button to="/gallery" variant="outline-dark" className="shrink-0">
          Open the gallery
          <ArrowRightIcon className="size-[1.1em]" />
        </Button>
      </div>

      <div className="rule-brass mt-10" aria-hidden="true" />

      <ul className="mt-11 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {items.map((item, index) => (
          <li
            key={item.id}
            className={cn(index === 0 && 'col-span-2 lg:row-span-2')}
          >
            <Link
              to="/gallery"
              className="group relative block size-full overflow-hidden rounded-xl bg-ink-950 ring-1 ring-cream-100/10 transition-all duration-500 hover:ring-gold-500/50"
            >
              <div className="aspect-square">
                <SmartImage
                  image={item.image}
                  sizes={
                    index === 0
                      ? '(min-width: 1024px) 42vw, 92vw'
                      : '(min-width: 1024px) 21vw, 45vw'
                  }
                  className="size-full object-cover transition-transform duration-[900ms] ease-[var(--ease-out-soft)] group-hover:scale-[1.07]"
                />
              </div>
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/15 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-95"
              />
              <span className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                <span
                  className={cn(
                    'block font-display font-semibold text-cream-50',
                    index === 0 ? 'text-base sm:text-xl' : 'text-sm sm:text-base',
                  )}
                >
                  {item.title}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  )
}
