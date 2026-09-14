/**
 * Gallery reads for the public site.
 *
 * RLS allows anon SELECT of published rows only. The admin operations — upload,
 * publish, delete — live in `services/admin/galleryAdmin.ts` so that the
 * Storage and auth clients they need stay out of the public bundle.
 */
import { galleryItems, galleryPhotos, galleryVideos } from '@/data/gallery'
import type { GalleryItem } from '@/types'
import { readWithFallback, unwrap } from './supabaseClient'
import { toGalleryItem, type GalleryItemRow } from './rows'

export const GALLERY_COLUMNS =
  'id, type, title, caption, image_path, image_widths, aspect_ratio, alt, video_path, sort_order'

export const GALLERY_BUCKET = 'gallery'

async function fetchItems(type?: 'photo' | 'video'): Promise<GalleryItem[]> {
  const fallback = type === 'photo' ? galleryPhotos : type === 'video' ? galleryVideos : galleryItems

  return readWithFallback(
    `getGalleryItems(${type ?? 'all'})`,
    async (client) => {
      let query = client
        .from('gallery_items')
        .select(GALLERY_COLUMNS)
        .eq('is_published', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true })
      if (type) query = query.eq('type', type)

      const rows = unwrap(await query.returns<GalleryItemRow[]>())
      /*
       * An empty *video* result is a real answer — the business has not supplied
       * any videos, and the Videos filter is built to show its own empty state.
       * An empty photo/all result means the seed has not run, so fall back.
       */
      if (rows.length === 0 && type !== 'video') throw new Error('gallery_items is empty')
      return rows.map(toGalleryItem)
    },
    () => fallback,
  )
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  return fetchItems()
}

export async function getGalleryPhotos(): Promise<GalleryItem[]> {
  return fetchItems('photo')
}

export async function getGalleryVideos(): Promise<GalleryItem[]> {
  return fetchItems('video')
}
