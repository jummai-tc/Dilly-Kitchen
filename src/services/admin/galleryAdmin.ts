/**
 * Gallery writes — admin only.
 *
 * Reached only from the `/admin` chunk. Every operation here would be refused
 * by Row Level Security for anyone not on the `admin_users` allow-list, in both
 * the `gallery_items` policies and the `gallery` Storage bucket policies, so a
 * visitor can only ever VIEW gallery content.
 */
import type { GalleryItem } from '@/types'
import { friendlyError, unwrap } from '../supabaseClient'
import { GALLERY_BUCKET, GALLERY_COLUMNS } from '../galleryService'
import { toGalleryItem, type GalleryItemRow } from '../rows'
import { adminClient, requireAdminClient } from './adminClient'

export interface AdminGalleryItem extends GalleryItem {
  isPublished: boolean
  sortOrder: number
}

/** Every gallery row, including unpublished ones. Requires an admin session. */
export async function listGalleryItemsForAdmin(): Promise<AdminGalleryItem[]> {
  const client = requireAdminClient()
  const rows = unwrap(
    await client
      .from('gallery_items')
      .select(`${GALLERY_COLUMNS}, is_published`)
      .order('sort_order', { ascending: true })
      .returns<(GalleryItemRow & { is_published: boolean })[]>(),
  )
  return rows.map((row) => ({
    ...toGalleryItem(row),
    isPublished: row.is_published,
    sortOrder: row.sort_order,
  }))
}

export interface GalleryUploadInput {
  file: File
  title: string
  caption: string
  alt: string
  /** Measured in the browser so the grid never shifts once the image loads. */
  aspectRatio: number
  /** Videos only: a still captured from the file, uploaded as the poster. */
  poster?: Blob
}

export interface UploadResult {
  ok: boolean
  message: string
  item?: GalleryItem
}

/** `Beef Suya (2).JPG` → `beef-suya-2`, with a timestamp so nothing collides. */
function storageKey(name: string, prefix: string): string {
  const dot = name.lastIndexOf('.')
  const stem = (dot > 0 ? name.slice(0, dot) : name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
  const extension = dot > 0 ? name.slice(dot + 1).toLowerCase() : 'bin'
  return `${prefix}/${stem || 'item'}-${Date.now().toString(36)}.${extension}`
}

/** `id` for the new row — slugged title, uniquified. */
function rowId(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
  return `${slug || 'gallery-item'}-${Date.now().toString(36)}`
}

/**
 * Uploads one file to the `gallery` bucket and records it in `gallery_items`.
 *
 * If the row insert fails the just-uploaded object is removed again, so a
 * refused write never leaves an orphan file sitting in Storage.
 */
export async function uploadGalleryItem(input: GalleryUploadInput): Promise<UploadResult> {
  if (!adminClient) {
    return { ok: false, message: 'Supabase is not configured, so uploads are unavailable.' }
  }

  const isVideo = input.file.type.startsWith('video/')
  const uploaded: string[] = []

  try {
    const mediaKey = storageKey(input.file.name, isVideo ? 'videos' : 'photos')
    const upload = await adminClient.storage
      .from(GALLERY_BUCKET)
      .upload(mediaKey, input.file, { cacheControl: '31536000', upsert: false })
    if (upload.error) throw new Error(upload.error.message)
    uploaded.push(mediaKey)

    const mediaUrl = adminClient.storage.from(GALLERY_BUCKET).getPublicUrl(mediaKey).data.publicUrl

    // A video needs a still to show in the grid before it is played.
    let imageUrl = mediaUrl
    if (isVideo) {
      if (!input.poster) throw new Error('A video needs a poster image.')
      const posterKey = storageKey(`${input.file.name}-poster.jpg`, 'posters')
      const posterUpload = await adminClient.storage
        .from(GALLERY_BUCKET)
        .upload(posterKey, input.poster, { cacheControl: '31536000', contentType: 'image/jpeg' })
      if (posterUpload.error) throw new Error(posterUpload.error.message)
      uploaded.push(posterKey)
      imageUrl = adminClient.storage.from(GALLERY_BUCKET).getPublicUrl(posterKey).data.publicUrl
    }

    const row = unwrap(
      await adminClient
        .from('gallery_items')
        .insert({
          id: rowId(input.title),
          type: isVideo ? 'video' : 'photo',
          title: input.title.trim(),
          caption: input.caption.trim(),
          image_path: imageUrl,
          // No width variants exist for an uploaded original, so the UI treats
          // image_path as a complete URL — see `src/lib/images.ts`.
          image_widths: [],
          aspect_ratio: input.aspectRatio,
          alt: input.alt.trim(),
          video_path: isVideo ? mediaUrl : null,
          sort_order: 0,
          is_published: true,
        })
        .select(GALLERY_COLUMNS)
        .single<GalleryItemRow>(),
    )

    return { ok: true, message: `“${row.title}” is live in the gallery.`, item: toGalleryItem(row) }
  } catch (error) {
    if (uploaded.length > 0) await adminClient.storage.from(GALLERY_BUCKET).remove(uploaded)
    return { ok: false, message: friendlyError(error) }
  }
}

/** Publishes or unpublishes a gallery item without deleting anything. */
export async function setGalleryItemPublished(
  id: string,
  isPublished: boolean,
): Promise<{ ok: boolean; message: string }> {
  if (!adminClient) return { ok: false, message: 'Supabase is not configured.' }
  const { error } = await adminClient
    .from('gallery_items')
    .update({ is_published: isPublished })
    .eq('id', id)
  if (error) return { ok: false, message: friendlyError(new Error(error.message)) }
  return { ok: true, message: isPublished ? 'Item published.' : 'Item hidden from the gallery.' }
}

/**
 * Removes a gallery row, and the Storage objects behind it when the item was
 * uploaded rather than shipped with the site.
 */
export async function deleteGalleryItem(
  item: GalleryItem,
): Promise<{ ok: boolean; message: string }> {
  if (!adminClient) return { ok: false, message: 'Supabase is not configured.' }

  const { error } = await adminClient.from('gallery_items').delete().eq('id', item.id)
  if (error) return { ok: false, message: friendlyError(new Error(error.message)) }

  // Bundled items point at /images/… in the repo and own nothing in Storage.
  const keys = [item.image.base, item.videoSrc]
    .filter((url): url is string => Boolean(url))
    .map(objectKeyFromUrl)
    .filter((key): key is string => Boolean(key))
  if (keys.length > 0) await adminClient.storage.from(GALLERY_BUCKET).remove(keys)

  return { ok: true, message: `“${item.title}” was deleted.` }
}

/** Pulls `photos/beef-suya-x.jpg` back out of a public Storage URL. */
function objectKeyFromUrl(url: string): string | null {
  const marker = `/storage/v1/object/public/${GALLERY_BUCKET}/`
  const index = url.indexOf(marker)
  return index === -1 ? null : decodeURIComponent(url.slice(index + marker.length))
}
