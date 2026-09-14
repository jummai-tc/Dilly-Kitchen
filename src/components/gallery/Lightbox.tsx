import { useCallback, useEffect, useRef } from 'react'
import { largestSrc } from '@/lib/images'
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll'
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon } from '@/components/ui/Icons'
import type { GalleryItem } from '@/types'

interface LightboxProps {
  items: GalleryItem[]
  index: number
  onClose: () => void
  onNavigate: (nextIndex: number) => void
}

/**
 * Accessible modal viewer: Escape closes, arrow keys navigate, focus is trapped
 * while open and returned to the trigger on close.
 */
export function Lightbox({ items, index, onClose, onNavigate }: LightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)

  const item = items[index]
  const hasMultiple = items.length > 1

  useLockBodyScroll(true)

  const goNext = useCallback(() => {
    onNavigate((index + 1) % items.length)
  }, [index, items.length, onNavigate])

  const goPrevious = useCallback(() => {
    onNavigate((index - 1 + items.length) % items.length)
  }, [index, items.length, onNavigate])

  /* Remember what was focused, then focus the close button. */
  useEffect(() => {
    previouslyFocused.current = document.activeElement as HTMLElement
    closeButtonRef.current?.focus()
    return () => previouslyFocused.current?.focus()
  }, [])

  /* Keyboard controls. */
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      } else if (event.key === 'ArrowRight' && hasMultiple) {
        event.preventDefault()
        goNext()
      } else if (event.key === 'ArrowLeft' && hasMultiple) {
        event.preventDefault()
        goPrevious()
      } else if (event.key === 'Tab') {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, a[href], video',
        )
        if (!focusable || focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose, goNext, goPrevious, hasMultiple])

  if (!item) return null

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${item.title} — image ${index + 1} of ${items.length}`}
      className="on-dark fixed inset-0 z-[70] flex flex-col bg-ink-950/95 backdrop-blur-sm animate-[var(--animate-fade-in)]"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <p className="text-sm font-medium text-cream-200/70">
          {index + 1} / {items.length}
        </p>
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Close image viewer"
          className="flex size-11 items-center justify-center rounded-full border border-cream-100/20 text-cream-50 transition-colors hover:border-brand-500 hover:bg-cream-100/5 hover:text-brand-500"
        >
          <CloseIcon className="size-5" />
        </button>
      </div>

      {/* Media */}
      <div
        className="flex flex-1 items-center justify-center overflow-hidden px-4 pb-2 sm:px-6"
        onClick={(event) => {
          if (event.target === event.currentTarget) onClose()
        }}
      >
        {item.type === 'video' && item.videoSrc ? (
          <video
            key={item.id}
            src={item.videoSrc}
            poster={largestSrc(item.image)}
            controls
            playsInline
            preload="metadata"
            className="max-h-full max-w-full rounded-2xl shadow-lift"
          >
            <track kind="captions" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img
            key={item.id}
            src={largestSrc(item.image)}
            alt={item.image.alt}
            className="max-h-full max-w-full rounded-2xl object-contain shadow-lift"
          />
        )}
      </div>

      {/* Caption + navigation */}
      <div className="flex items-center justify-between gap-4 px-4 pb-6 pt-3 sm:px-6">
        {hasMultiple ? (
          <button
            type="button"
            onClick={goPrevious}
            aria-label="Previous image"
            className="flex size-12 shrink-0 items-center justify-center rounded-full border border-cream-100/20 text-cream-50 transition-colors hover:border-brand-500 hover:bg-cream-100/5 hover:text-brand-500"
          >
            <ArrowLeftIcon className="size-5" />
          </button>
        ) : (
          <span className="size-12" aria-hidden="true" />
        )}

        <div className="min-w-0 flex-1 text-center">
          <h2 className="truncate font-display text-lg text-cream-50 sm:text-xl">{item.title}</h2>
          <p className="mt-1 line-clamp-2 text-sm text-cream-200/65">{item.caption}</p>
        </div>

        {hasMultiple ? (
          <button
            type="button"
            onClick={goNext}
            aria-label="Next image"
            className="flex size-12 shrink-0 items-center justify-center rounded-full border border-cream-100/20 text-cream-50 transition-colors hover:border-brand-500 hover:bg-cream-100/5 hover:text-brand-500"
          >
            <ArrowRightIcon className="size-5" />
          </button>
        ) : (
          <span className="size-12" aria-hidden="true" />
        )}
      </div>
    </div>
  )
}
