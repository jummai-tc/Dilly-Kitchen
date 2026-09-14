import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Section } from '@/components/ui/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Button } from '@/components/ui/Button'
import { ArrowRightIcon } from '@/components/ui/Icons'
import { DishPlaceholder, SmartImage } from '@/components/ui/SmartImage'
import { getFeaturedItems } from '@/services/menuService'
import { formatPrice } from '@/lib/utils'
import type { MenuItem } from '@/types'

/**
 * A dish on the board. Set the way a printed menu sets it — name, dashed
 * leader, price — because that is the convention the content already follows,
 * and it keeps six dishes reading as one list rather than six identical cards.
 */
function BoardDish({ item, priority }: { item: MenuItem; priority: boolean }) {
  const price = formatPrice(item.price)

  return (
    <li>
      <Link
        to={`/menu#category-${item.categoryId}`}
        className="group block rounded-xl focus-visible:outline-offset-6"
      >
        <div className="film-grain relative aspect-5/4 overflow-hidden rounded-xl bg-ink-800 ring-1 ring-cream-100/10 transition-shadow duration-500 group-hover:ring-gold-500/45">
          {item.image ? (
            <SmartImage
              image={item.image}
              priority={priority}
              sizes="(min-width: 1024px) 27vw, (min-width: 640px) 44vw, 90vw"
              className="size-full object-cover transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-105"
            />
          ) : (
            <DishPlaceholder name={item.name} />
          )}
        </div>

        <div className="mt-5 flex items-baseline gap-3">
          <h3 className="font-display text-[1.15rem] font-semibold text-cream-50 transition-colors group-hover:text-brand-500">
            {item.name}
          </h3>
          <span className="leader mb-1.5 flex-1 self-end text-cream-200" aria-hidden="true" />
          <span className="tnum shrink-0 text-[0.95rem] font-semibold text-gold-400">
            {price ?? item.priceNote ?? 'On request'}
          </span>
        </div>

        <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-cream-200/60">
          {item.description}
        </p>
      </Link>
    </li>
  )
}

export function FeaturedDishes() {
  const [items, setItems] = useState<MenuItem[]>([])

  useEffect(() => {
    let active = true
    getFeaturedItems(6).then((result) => {
      if (active) setItems(result)
    })
    return () => {
      active = false
    }
  }, [])

  return (
    <Section tone="dark" aria-labelledby="featured-heading" containerSize="wide" spacing="lg">
      <div className="flex flex-col items-start justify-between gap-7 sm:flex-row sm:items-end">
        <SectionHeading
          id="featured-heading"
          eyebrow="From our kitchen"
          title="Dishes our guests come back for"
          description="A short taste of the menu. Every plate is cooked to order and seasoned by hand."
          align="left"
          tone="dark"
          className="max-w-2xl"
        />
        <Button to="/menu" variant="outline-dark" className="shrink-0">
          View full menu
          <ArrowRightIcon className="size-[1.1em]" />
        </Button>
      </div>

      {/* The brass edge, running the width of the board. */}
      <div className="rule-brass mt-10" aria-hidden="true" />

      <ul className="mt-11 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <BoardDish key={item.id} item={item} priority={index < 3} />
        ))}
      </ul>
    </Section>
  )
}
