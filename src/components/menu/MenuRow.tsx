import { ExternalActionButton } from '@/components/ui/ExternalActionButton'
import { Chip, DietaryBadge, SpiceBadge } from '@/components/ui/Badge'
import { formatPrice } from '@/lib/utils'
import type { MenuItem } from '@/types'

/**
 * Compact price-list row, used for dishes the business has not photographed.
 * Reads like a printed menu rather than showing an empty image placeholder.
 */
export function MenuRow({ item }: { item: MenuItem }) {
  const price = formatPrice(item.price)
  const headingId = `dish-${item.id}`

  return (
    <article
      aria-labelledby={headingId}
      className="group flex h-full flex-col gap-2.5 rounded-2xl bg-white p-5 shadow-soft ring-1 ring-ink-900/5 transition-all duration-400 ease-[var(--ease-out-soft)] hover:-translate-y-0.5 hover:shadow-lift focus-within:-translate-y-0.5 focus-within:shadow-lift"
    >
      <div className="flex flex-wrap items-baseline gap-x-3">
        <h3 id={headingId} className="font-display text-base font-semibold text-ink-900">
          {item.name}
        </h3>
        {/* Dotted leader, the way a printed menu sets prices. */}
        <span
          aria-hidden="true"
          className="mb-1 min-w-4 flex-1 border-b border-dotted border-ink-900/25"
        />
        {price ? (
          <span className="shrink-0 font-display text-base font-bold text-ink-900">{price}</span>
        ) : (
          <span className="text-xs font-semibold text-ink-500">
            {item.priceNote ?? 'On request'}
          </span>
        )}
      </div>

      <p className="text-sm leading-relaxed text-ink-600">{item.description}</p>

      {item.options && item.options.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {item.options.map((option) => (
            <Chip key={option}>{option}</Chip>
          ))}
        </div>
      )}

      {(item.dietary.length > 0 || item.spiceLevel > 0) && (
        <div className="flex flex-wrap gap-1.5">
          <SpiceBadge level={item.spiceLevel} />
          {item.dietary.map((tag) => (
            <DietaryBadge key={tag} tag={tag} />
          ))}
        </div>
      )}

      <div className="mt-auto pt-2">
        <ExternalActionButton link="uberEats" variant="outline" size="sm" showIcon={false}>
          Order on Uber Eats
        </ExternalActionButton>
      </div>
    </article>
  )
}
