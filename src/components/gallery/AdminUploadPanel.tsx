/**
 * Gallery uploads — admin only.
 *
 * Rendered exclusively by the protected `/admin` route (see
 * `components/admin/RequireAdmin`), never on a public page. Public visitors can
 * only ever VIEW gallery content: the `gallery` Storage bucket and the
 * `gallery_items` table both refuse writes to anyone not on the `admin_users`
 * allow-list, so this panel would be useless even if it were mounted publicly.
 *
 * Each file is measured in the browser before upload so the gallery grid can
 * reserve the right space, and a video gets a poster captured from its own
 * first moments.
 */
import { useState, type ChangeEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { InfoIcon } from '@/components/ui/Icons'
import { TextField } from '@/components/forms/Field'
import { uploadGalleryItem } from '@/services/admin/galleryAdmin'
import { formatBytes, measureMedia } from '@/lib/media'
import type { GalleryItem } from '@/types'

interface Draft {
  file: File
  title: string
  caption: string
  alt: string
  aspectRatio: number
  poster?: Blob
  status: 'ready' | 'uploading' | 'done' | 'error'
  message?: string
}

/** `beef-suya-final.JPG` → `Beef Suya Final`, as a starting point for the title. */
function titleFromFilename(name: string): string {
  const dot = name.lastIndexOf('.')
  return (dot > 0 ? name.slice(0, dot) : name)
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

export function AdminUploadPanel({ onUploaded }: { onUploaded?: (item: GalleryItem) => void }) {
  const [drafts, setDrafts] = useState<Draft[]>([])
  const [isBusy, setIsBusy] = useState(false)

  async function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? [])
    event.target.value = '' // let the same file be chosen again after a failure
    if (files.length === 0) return

    setIsBusy(true)
    const measured = await Promise.all(
      files.map(async (file): Promise<Draft> => {
        try {
          const { aspectRatio, poster } = await measureMedia(file)
          return {
            file,
            title: titleFromFilename(file.name),
            caption: '',
            alt: '',
            aspectRatio,
            poster,
            status: 'ready',
          }
        } catch (error) {
          return {
            file,
            title: titleFromFilename(file.name),
            caption: '',
            alt: '',
            aspectRatio: 1,
            status: 'error',
            message: error instanceof Error ? error.message : 'That file could not be read.',
          }
        }
      }),
    )
    setDrafts((current) => [...current, ...measured])
    setIsBusy(false)
  }

  function updateDraft(index: number, patch: Partial<Draft>) {
    setDrafts((current) => current.map((d, i) => (i === index ? { ...d, ...patch } : d)))
  }

  async function uploadAll() {
    setIsBusy(true)
    for (const [index, draft] of drafts.entries()) {
      if (draft.status === 'done' || draft.status === 'error') continue
      updateDraft(index, { status: 'uploading', message: undefined })

      const result = await uploadGalleryItem({
        file: draft.file,
        title: draft.title,
        caption: draft.caption,
        // Alt text is what a screen-reader user hears; fall back to the title
        // rather than shipping an empty alt attribute.
        alt: draft.alt.trim() || draft.title,
        aspectRatio: draft.aspectRatio,
        poster: draft.poster,
      })

      updateDraft(index, {
        status: result.ok ? 'done' : 'error',
        message: result.message,
      })
      if (result.ok && result.item) onUploaded?.(result.item)
    }
    setIsBusy(false)
  }

  const pending = drafts.filter((d) => d.status === 'ready')
  const canUpload = pending.length > 0 && pending.every((d) => d.title.trim().length > 1)

  return (
    <section
      aria-labelledby="admin-upload-heading"
      className="rounded-card border border-ink-900/10 bg-white p-7 shadow-soft"
    >
      <div className="flex items-start gap-3">
        <InfoIcon className="mt-0.5 size-5 shrink-0 text-gold-600" />
        <div className="flex-1">
          <h2 id="admin-upload-heading" className="font-display text-lg text-ink-900">
            Add to the gallery
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-600">
            Photographs and videos are uploaded to the <code>gallery</code> storage bucket and
            appear on the public gallery page straight away. A video gets its poster image captured
            automatically.
          </p>

          <div className="mt-5">
            <label className="inline-flex cursor-pointer items-center gap-3 text-sm text-ink-600">
              <span className="sr-only">Choose photographs or videos to upload</span>
              <input
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleFiles}
                disabled={isBusy}
                className="text-sm text-ink-600 file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-ink-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-cream-50 hover:file:bg-ink-800"
              />
            </label>
          </div>

          {drafts.length > 0 && (
            <ul className="mt-6 flex flex-col gap-5">
              {drafts.map((draft, index) => (
                <li
                  key={`${draft.file.name}-${index}`}
                  className="rounded-2xl bg-cream-50 p-5 ring-1 ring-ink-900/8"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-medium text-ink-900">{draft.file.name}</p>
                    <p className="text-xs text-ink-500">
                      {formatBytes(draft.file.size)} · ratio {draft.aspectRatio.toFixed(2)}
                      {draft.file.type.startsWith('video/') ? ' · video' : ''}
                    </p>
                  </div>

                  {draft.status === 'done' ? (
                    <p className="mt-2 text-sm font-medium text-emerald-700">{draft.message}</p>
                  ) : (
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <TextField
                        label="Title"
                        required
                        value={draft.title}
                        onChange={(event) => updateDraft(index, { title: event.target.value })}
                        disabled={draft.status === 'uploading'}
                      />
                      <TextField
                        label="Caption"
                        value={draft.caption}
                        onChange={(event) => updateDraft(index, { caption: event.target.value })}
                        disabled={draft.status === 'uploading'}
                        placeholder="Shown under the title in the lightbox"
                      />
                      <TextField
                        label="Alt text"
                        className="sm:col-span-2"
                        hint="Describe the picture for someone who cannot see it. Defaults to the title."
                        value={draft.alt}
                        onChange={(event) => updateDraft(index, { alt: event.target.value })}
                        disabled={draft.status === 'uploading'}
                      />
                    </div>
                  )}

                  {draft.status === 'error' && draft.message && (
                    <p role="alert" className="mt-3 text-sm text-spice-600">
                      {draft.message}
                    </p>
                  )}
                  {draft.status === 'uploading' && (
                    <p role="status" className="mt-3 text-sm text-ink-600">
                      Uploading…
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button onClick={() => void uploadAll()} disabled={!canUpload || isBusy} size="sm">
              {isBusy ? 'Working…' : `Upload ${pending.length || ''}`.trim()}
            </Button>
            {drafts.length > 0 && (
              <Button onClick={() => setDrafts([])} variant="ghost" size="sm" disabled={isBusy}>
                Clear list
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
