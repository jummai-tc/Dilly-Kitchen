import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  description?: string
  /** Sets the heading id so the parent section can be labelled by it. */
  id?: string
  align?: 'left' | 'center'
  tone?: 'light' | 'dark'
  as?: 'h1' | 'h2' | 'h3'
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  id,
  align = 'center',
  tone = 'light',
  as: Tag = 'h2',
  className,
}: SectionHeadingProps) {
  const isDark = tone === 'dark'
  return (
    <div
      className={cn(
        'flex flex-col gap-4',
        align === 'center' ? 'items-center text-center' : 'items-start text-left',
        className,
      )}
    >
      {eyebrow && (
        <span
          className={cn(
            'eyebrow inline-flex items-center gap-3',
            isDark ? 'text-brand-500' : 'text-gold-700',
          )}
        >
          <span className="brand-rule" aria-hidden="true" />
          {eyebrow}
        </span>
      )}
      <Tag
        id={id}
        className={cn(
          // `display-section` picks Fraunces' text-to-display optical size, which
          // tightens the fit and lifts the stroke contrast at heading scale.
          'display-section text-[clamp(2rem,4vw,3.15rem)]',
          isDark ? 'text-cream-50' : 'text-ink-900',
        )}
      >
        {title}
      </Tag>
      {description && (
        <p
          className={cn(
            'max-w-2xl text-base sm:text-lg leading-relaxed',
            isDark ? 'text-cream-200/80' : 'text-ink-600',
          )}
        >
          {description}
        </p>
      )}
    </div>
  )
}
