import { ExternalActionButton } from '@/components/ui/ExternalActionButton'
import { Chip, DietaryBadge, SpiceBadge } from '@/components/ui/Badge'
import { DishPlaceholder, SmartImage } from '@/components/ui/SmartImage'
import { formatPrice } from '@/lib/utils'
import type { MenuItem } from '@/types'

interface MenuCardProps {
  item: MenuItem
  /** First row of cards on the menu page loads eagerly. */
  priority?: boolean
}

export function MenuCard({ item, priority = false }: MenuCardProps) {
  const price = formatPrice(item.price)
  const headingId = `dish-${item.id}`

  return (
    <article
      aria-labelledby={headingId}
      className="group flex h-full flex-col overflow-hidden rounded-card bg-white shadow-soft ring-1 ring-ink-900/5 transition-all duration-500 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:shadow-lift focus-within:-translate-y-1 focus-within:shadow-lift"
    >
      <div className="relative aspect-4/3 overflow-hidden bg-ink-900">
        {item.image ? (
          <SmartImage
            image={item.image}
            priority={priority}
            sizes="(min-width: 1280px) 22rem, (min-width: 768px) 45vw, 92vw"
            className="size-full object-cover transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-105"
          />
        ) : (
          <DishPlaceholder name={item.name} />
        )}

        {price && (
          <span className="absolute right-3 top-3 rounded-full bg-brand-500 px-3 py-1.5 text-sm font-bold text-ink-900 shadow-soft">
            {price}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 id={headingId} className="text-lg leading-snug text-ink-900">
            {item.name}
          </h3>
          {!price && item.priceNote && (
            <span className="shrink-0 rounded-full bg-ink-900/5 px-2.5 py-1 text-[0.68rem] font-semibold text-ink-600">
              {item.priceNote}
            </span>
          )}
        </div>

        <p className="text-sm leading-relaxed text-ink-600">{item.description}</p>

        {item.options && item.options.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            <span className="text-[0.68rem] font-semibold uppercase tracking-wider text-ink-500">
              Choose:
            </span>
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
          <ExternalActionButton
            link="uberEats"
            variant="secondary"
            size="sm"
            fullWidth
            showIcon={false}
          >
            Order on Uber Eats
          </ExternalActionButton>
        </div>
      </div>
    </article>
  )
}
