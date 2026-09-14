import type { DishImage } from '@/types'

/**
 * An image with no `widths` is a single file rather than a set exported by
 * `scripts/optimize-images.sh` — that is how a gallery upload stored in
 * Supabase Storage arrives, since it has no width variants. In that case
 * `base` is already the complete URL.
 */
function isSingleFile(image: DishImage): boolean {
  return image.widths.length === 0
}

/**
 * Builds the `srcSet` string for an image that has been exported at several
 * widths by `scripts/optimize-images.sh`. Empty for a single-file image, which
 * leaves the browser with just `src`.
 */
export function buildSrcSet(image: DishImage): string {
  if (isSingleFile(image)) return ''
  return image.widths.map((w) => `${image.base}-${w}.jpg ${w}w`).join(', ')
}

/** Largest available file — used as the `src` fallback and for lightboxes. */
export function largestSrc(image: DishImage): string {
  if (isSingleFile(image)) return image.base
  const widest = image.widths[image.widths.length - 1]
  return `${image.base}-${widest}.jpg`
}

/** Smallest available file — used for `src` so old browsers load the light one. */
export function smallestSrc(image: DishImage): string {
  if (isSingleFile(image)) return image.base
  return `${image.base}-${image.widths[0]}.jpg`
}

/** Absolute URL for Open Graph tags. */
export function absoluteUrl(path: string, origin: string): string {
  if (path.startsWith('http')) return path
  return `${origin.replace(/\/$/, '')}${path}`
}
