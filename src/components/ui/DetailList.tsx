import type { ComponentType, ReactNode, SVGProps } from 'react'
import { cn } from '@/lib/utils'

/**
 * Contact-detail list.
 *
 * `<dl>` may only contain `<dt>`/`<dd>` (or `<div>` wrappers holding only
 * those), so the icon lives inside the `<dt>` and the `<dd>` is indented to
 * line up beneath the label. This keeps the markup valid and the design intact.
 */
export function DetailList({ children, className }: { children: ReactNode; className?: string }) {
  return <dl className={cn('flex flex-col', className)}>{children}</dl>
}

interface DetailItemProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>
  term: string
  children: ReactNode
  /** Dark surfaces need lighter text. */
  tone?: 'light' | 'dark'
}

export function DetailItem({ icon: Icon, term, children, tone = 'light' }: DetailItemProps) {
  const isDark = tone === 'dark'
  return (
    <>
      <dt
        className={cn(
          'mt-6 flex items-center gap-4 text-sm font-semibold first:mt-0',
          isDark ? 'text-cream-50' : 'text-ink-900',
        )}
      >
        <span
          className={cn(
            'flex size-11 shrink-0 items-center justify-center rounded-full',
            isDark ? 'bg-cream-100/10 text-brand-500' : 'bg-ink-900 text-brand-500',
          )}
        >
          <Icon className="size-5" />
        </span>
        {term}
      </dt>
      {/* Indent matches the icon (2.75rem) plus its gap (1rem). */}
      <dd
        className={cn(
          'mt-1.5 pl-15 text-sm leading-relaxed',
          isDark ? 'text-cream-200/75' : 'text-ink-600',
        )}
      >
        {children}
      </dd>
    </>
  )
}
