/**
 * Database row shapes and the mappers that turn them into the domain types in
 * `src/types`. Kept in one file so the snake_case/camelCase boundary lives in
 * exactly one place and no component ever sees a raw row.
 */
import type {
  CateringOption,
  DietaryTag,
  DishImage,
  GalleryItem,
  MenuCategory,
  MenuCategoryId,
  MenuItem,
  SpiceLevel,
  Testimonial,
} from '@/types'
import type { StorySection } from '@/data/story'

export interface MenuCategoryRow {
  id: string
  name: string
  blurb: string
  note: string | null
  sort_order: number
}

export interface MenuItemRow {
  id: string
  category_id: string
  name: string
  description: string
  price: number | string | null
  price_note: string | null
  image_path: string | null
  image_widths: number[] | null
  image_aspect_ratio: number | string | null
  image_alt: string | null
  dietary: string[] | null
  spice_level: number
  options: string[] | null
  is_featured: boolean
  sort_order: number
}

export interface GalleryItemRow {
  id: string
  type: string
  title: string
  caption: string
  image_path: string
  image_widths: number[] | null
  aspect_ratio: number | string
  alt: string
  video_path: string | null
  sort_order: number
}

export interface TestimonialRow {
  id: string
  quote: string
  author: string
  context: string
  rating: number
  is_placeholder: boolean
  sort_order: number
}

export interface StorySectionRow {
  id: string
  eyebrow: string
  heading: string
  paragraphs: string[] | null
  sort_order: number
}

export interface CateringOptionRow {
  id: string
  title: string
  description: string
  icon: string
  sort_order: number
}

export interface SiteLinkRow {
  key: string
  label: string
  href: string
  is_placeholder: boolean
  sort_order: number
}

export interface SiteSettingRow {
  key: string
  value: unknown
}

/** Postgres `numeric` arrives as a string over the wire. */
function toNumber(value: number | string | null | undefined): number | null {
  if (value === null || value === undefined) return null
  const parsed = typeof value === 'number' ? value : Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : null
}

function clampSpice(value: number): SpiceLevel {
  const level = Math.min(3, Math.max(0, Math.round(value || 0)))
  return level as SpiceLevel
}

function clampRating(value: number): Testimonial['rating'] {
  const rating = Math.min(5, Math.max(1, Math.round(value || 5)))
  return rating as Testimonial['rating']
}

/**
 * Builds the `DishImage` the UI expects.
 *
 * Two kinds of path live in `image_path`:
 *   * a base path for the responsive files exported by `scripts/optimize-images.sh`
 *     (`/images/dishes/beef-suya` + widths `[480, 800, 1400]`), and
 *   * a single full URL for a file uploaded to Supabase Storage, which has no
 *     width variants and so arrives with an empty `image_widths`.
 * `src/lib/images.ts` handles both.
 */
function toImage(
  path: string | null,
  widths: number[] | null,
  aspectRatio: number | string | null,
  alt: string | null,
): DishImage | undefined {
  if (!path) return undefined
  return {
    base: path,
    widths: widths ?? [],
    aspectRatio: toNumber(aspectRatio) ?? 1,
    alt: alt ?? '',
  }
}

export function toMenuCategory(row: MenuCategoryRow): MenuCategory {
  return {
    id: row.id as MenuCategoryId,
    name: row.name,
    blurb: row.blurb,
    ...(row.note ? { note: row.note } : {}),
  }
}

export function toMenuItem(row: MenuItemRow): MenuItem {
  const image = toImage(row.image_path, row.image_widths, row.image_aspect_ratio, row.image_alt)
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: toNumber(row.price),
    categoryId: row.category_id as MenuCategoryId,
    dietary: (row.dietary ?? []) as DietaryTag[],
    spiceLevel: clampSpice(row.spice_level),
    ...(row.price_note ? { priceNote: row.price_note } : {}),
    ...(image ? { image } : {}),
    ...(row.options?.length ? { options: row.options } : {}),
    ...(row.is_featured ? { isFeatured: true } : {}),
  }
}

export function toGalleryItem(row: GalleryItemRow): GalleryItem {
  return {
    id: row.id,
    type: row.type === 'video' ? 'video' : 'photo',
    title: row.title,
    caption: row.caption,
    image: {
      base: row.image_path,
      widths: row.image_widths ?? [],
      aspectRatio: toNumber(row.aspect_ratio) ?? 1,
      alt: row.alt,
    },
    ...(row.video_path ? { videoSrc: row.video_path } : {}),
  }
}

export function toTestimonial(row: TestimonialRow): Testimonial {
  return {
    id: row.id,
    quote: row.quote,
    author: row.author,
    context: row.context,
    rating: clampRating(row.rating),
  }
}

export function toStorySection(row: StorySectionRow): StorySection {
  return {
    id: row.id,
    eyebrow: row.eyebrow,
    heading: row.heading,
    paragraphs: row.paragraphs ?? [],
  }
}

export function toCateringOption(row: CateringOptionRow): CateringOption {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    icon: row.icon,
  }
}
