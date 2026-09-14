/** Shared domain types. These mirror the shape a backend should return. */

export type DietaryTag =
  | 'vegan'
  | 'vegetarian'
  | 'contains-peanuts'
  | 'contains-shellfish'
  | 'contains-fish'
  | 'gluten-free-option'
  | 'signature'
  | 'chef-special'

/** 0 = not spicy, 1 = mild, 2 = medium, 3 = hot. */
export type SpiceLevel = 0 | 1 | 2 | 3

export interface DishImage {
  /** Base path without the width suffix, e.g. `/images/dishes/beef-suya` */
  base: string
  /** Widths that actually exist on disk, ascending. */
  widths: number[]
  /** Intrinsic aspect ratio (width / height) — prevents layout shift. */
  aspectRatio: number
  alt: string
}

export interface MenuItem {
  id: string
  name: string
  description: string
  /** Price in GBP. `null` means "price on request" — never invent a price. */
  price: number | null
  /** Optional note shown instead of, or beside, the price. */
  priceNote?: string
  categoryId: MenuCategoryId
  image?: DishImage
  dietary: DietaryTag[]
  spiceLevel: SpiceLevel
  /** Choices the kitchen offers for this dish (protein, swallow, etc.). */
  options?: string[]
  isFeatured?: boolean
}

export type MenuCategoryId =
  | 'starters'
  | 'rice-dishes'
  | 'traditional-soups'
  | 'swallows'
  | 'grills-and-suya'
  | 'meat-and-fish'
  | 'sides'
  | 'drinks'
  | 'desserts'

export interface MenuCategory {
  id: MenuCategoryId
  name: string
  /** Short line shown under the category heading. */
  blurb: string
  /** Extra guidance from the printed menu, e.g. what a soup is served with. */
  note?: string
}

export interface GalleryItem {
  id: string
  type: 'photo' | 'video'
  title: string
  caption: string
  /** Photos: responsive image. Videos: poster image lives here too. */
  image: DishImage
  /** Videos only — path to the video file. */
  videoSrc?: string
}

export interface Testimonial {
  id: string
  quote: string
  author: string
  context: string
  rating: 1 | 2 | 3 | 4 | 5
}

export interface CateringOption {
  id: string
  title: string
  description: string
  icon: string
}
