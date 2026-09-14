import { useState } from 'react'
import { buildSrcSet, largestSrc, smallestSrc } from '@/lib/images'
import { cn } from '@/lib/utils'
import type { DishImage } from '@/types'

interface SmartImageProps {
  image: DishImage
  /** `sizes` attribute — tell the browser how wide the image renders. */
  sizes: string
  className?: string
  /** Above-the-fold images should be eager with high priority. */
  priority?: boolean
  /** Use the widest file as `src` (lightboxes). Defaults to the smallest. */
  preferLarge?: boolean
}

/**
 * Responsive image with a `srcSet` across every exported width, native lazy
 * loading, an aspect-ratio box that prevents layout shift, and a soft fade-in
 * once decoded.
 */
export function SmartImage({
  image,
  sizes,
  className,
  priority = false,
  preferLarge = false,
}: SmartImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  // Empty for a single-file image (e.g. a Storage upload) — `undefined` keeps
  // the attribute off the element entirely rather than emitting srcSet="".
  const srcSet = buildSrcSet(image) || undefined

  return (
    <img
      src={preferLarge ? largestSrc(image) : smallestSrc(image)}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      alt={image.alt}
      width={1000}
      height={Math.round(1000 / image.aspectRatio)}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : 'auto'}
      onLoad={() => setIsLoaded(true)}
      className={cn(
        'transition-opacity duration-700 ease-[var(--ease-out-soft)]',
        isLoaded ? 'opacity-100' : 'opacity-0',
        className,
      )}
    />
  )
}

/**
 * Branded stand-in for dishes the business has not photographed yet.
 * Deliberately not a stock photo — it is clearly a brand pattern.
 */
export function DishPlaceholder({ name, className }: { name: string; className?: string }) {
  return (
    <div
      className={cn(
        'flex h-full w-full items-center justify-center bg-ink-900 bg-[radial-gradient(60%_60%_at_50%_35%,rgb(255_242_0/0.14),transparent_70%)]',
        className,
      )}
      role="img"
      aria-label={`${name} — photograph coming soon`}
    >
      <div className="flex flex-col items-center gap-2 px-4 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-brand-500 font-display text-lg font-bold text-ink-900">
          DK
        </span>
        <span className="eyebrow text-[0.6rem] text-cream-200/50">Photo coming soon</span>
      </div>
    </div>
  )
}
