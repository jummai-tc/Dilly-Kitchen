import { useEffect, useMemo, useState } from 'react'
import { Seo } from '@/components/seo/Seo'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Button } from '@/components/ui/Button'
import { ExternalActionButton } from '@/components/ui/ExternalActionButton'
import { CloseIcon, InfoIcon, SearchIcon, WhatsAppIcon } from '@/components/ui/Icons'
import { MenuCard } from '@/components/menu/MenuCard'
import { MenuRow } from '@/components/menu/MenuRow'
import { WhatsAppCta } from '@/components/home/WhatsAppCta'
import { getMenuCategories, getMenuItems } from '@/services/menuService'
import { allergenNotice as bundledAllergenNotice } from '@/data/menu'
import { useSetting } from '@/context/siteContentContext'
import { whatsappLink, whatsappMessages } from '@/config/site'
import { cn, normalise } from '@/lib/utils'
import type { MenuCategory, MenuCategoryId, MenuItem } from '@/types'

type Filter = MenuCategoryId | 'all'

export function MenuPage() {
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [items, setItems] = useState<MenuItem[]>([])
  const [activeFilter, setActiveFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')
  // Editable from the admin panel; falls back to the notice bundled with the site.
  const allergenNotice = useSetting('allergen_notice', bundledAllergenNotice)

  useEffect(() => {
    let active = true
    Promise.all([getMenuCategories(), getMenuItems()]).then(([nextCategories, nextItems]) => {
      if (!active) return
      setCategories(nextCategories)
      setItems(nextItems)
    })
    return () => {
      active = false
    }
  }, [])

  const filtered = useMemo(() => {
    const search = normalise(query)
    return items.filter((item) => {
      const matchesCategory = activeFilter === 'all' || item.categoryId === activeFilter
      if (!matchesCategory) return false
      if (!search) return true
      return (
        normalise(item.name).includes(search) ||
        normalise(item.description).includes(search) ||
        item.options?.some((option) => normalise(option).includes(search)) === true
      )
    })
  }, [items, activeFilter, query])

  /** Grouped so an "All" view still reads as a menu, not a flat wall of cards. */
  const grouped = useMemo(() => {
    return categories
      .map((category) => {
        const items = filtered.filter((item) => item.categoryId === category.id)
        return {
          category,
          items,
          photographed: items.filter((item) => item.image),
          listed: items.filter((item) => !item.image),
        }
      })
      .filter((group) => group.items.length > 0)
  }, [categories, filtered])

  const hasResults = filtered.length > 0
  const isSearching = query.trim().length > 0

  return (
    <>
      <Seo
        title="Menu"
        description="Explore the Dilly Kitchen menu — jollof and fried rice, egusi, ogbono, efo riro and other traditional soups, suya, grilled fish, sides, desserts and drinks. Nigerian food in Feltham, London."
      />

      {/* Page hero */}
      <section aria-labelledby="menu-heading" className="on-dark surface-dark">
        <Container size="wide" className="py-14 sm:py-18 lg:py-20">
          <SectionHeading
            id="menu-heading"
            eyebrow="Our Menu"
            title="Freshly prepared. Full of flavour. Made with care."
            description="Every dish is cooked to order using fresh ingredients and traditional recipes. Prices are for a full portion unless stated otherwise."
            tone="dark"
            as="h1"
          />
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ExternalActionButton link="uberEats" showIcon={false}>
              Order on Uber Eats
            </ExternalActionButton>
            <Button
              href={whatsappLink(whatsappMessages.order)}
              variant="outline-dark"
            >
              <WhatsAppIcon className="size-[1.15em]" />
              Order on WhatsApp
            </Button>
          </div>
        </Container>
      </section>

      {/* Controls */}
      <div className="sticky top-[70px] z-30 border-b border-ink-900/8 bg-cream-50/95 backdrop-blur-md sm:top-[76px]">
        <Container size="wide" className="py-4">
          <div className="flex flex-col gap-4">
            <label className="relative block">
              <span className="sr-only">Search the menu</span>
              <SearchIcon className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-ink-500" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search dishes, e.g. jollof, egusi, suya…"
                className="w-full rounded-full border border-ink-900/12 bg-white py-3 pl-12 pr-11 text-[0.95rem] text-ink-900 shadow-soft transition-colors placeholder:text-ink-500 hover:border-ink-900/25 focus:border-brand-500"
              />
              {isSearching && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full bg-ink-900/8 text-ink-600 transition-colors hover:bg-ink-900/15"
                >
                  <CloseIcon className="size-4" />
                </button>
              )}
            </label>

            <div
              role="group"
              aria-label="Filter menu by category"
              className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:flex-wrap lg:overflow-x-visible"
            >
              <FilterChip
                isActive={activeFilter === 'all'}
                onClick={() => setActiveFilter('all')}
                count={items.length}
              >
                All dishes
              </FilterChip>
              {categories.map((category) => {
                const count = items.filter((item) => item.categoryId === category.id).length
                return (
                  <FilterChip
                    key={category.id}
                    isActive={activeFilter === category.id}
                    onClick={() => setActiveFilter(category.id)}
                    count={count}
                  >
                    {category.name}
                  </FilterChip>
                )
              })}
            </div>
          </div>
        </Container>
      </div>

      {/* Results */}
      <Section tone="cream" containerSize="wide" spacing="md">
        <p className="sr-only" role="status" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? 'dish' : 'dishes'} shown
        </p>

        {hasResults ? (
          <div className="flex flex-col gap-16">
            {grouped.map((group, groupIndex) => (
              <section key={group.category.id} aria-labelledby={`category-${group.category.id}`}>
                <div className="border-b border-ink-900/10 pb-5">
                  <h2
                    id={`category-${group.category.id}`}
                    className="text-2xl sm:text-3xl"
                  >
                    {group.category.name}
                  </h2>
                  <p className="mt-2 text-sm text-ink-600">{group.category.blurb}</p>
                  {group.category.note && (
                    <p className="mt-3 inline-flex items-start gap-2 rounded-xl bg-white px-3.5 py-2.5 text-xs leading-relaxed text-ink-600 ring-1 ring-ink-900/8">
                      <InfoIcon className="mt-px size-4 shrink-0 text-gold-600" />
                      {group.category.note}
                    </p>
                  )}
                </div>

                {/* Photographed dishes get image cards. */}
                {group.photographed.length > 0 && (
                  <div className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {group.photographed.map((item, itemIndex) => (
                      <MenuCard
                        key={item.id}
                        item={item}
                        priority={groupIndex === 0 && itemIndex < 4}
                      />
                    ))}
                  </div>
                )}

                {/*
                  Everything else reads as a printed price list rather than a
                  grid of empty photo placeholders.
                */}
                {group.listed.length > 0 && (
                  <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {group.listed.map((item) => (
                      <MenuRow key={item.id} item={item} />
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>
        ) : (
          <div className="mx-auto max-w-md rounded-card bg-white p-10 text-center shadow-soft ring-1 ring-ink-900/5">
            <h2 className="text-xl">No dishes matched that search</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-600">
              Try a different spelling, or clear the filters to see the whole menu. If you are after
              something specific, just ask us on WhatsApp.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button
                onClick={() => {
                  setQuery('')
                  setActiveFilter('all')
                }}
                variant="secondary"
                size="sm"
              >
                Clear filters
              </Button>
              <Button
                href={whatsappLink(whatsappMessages.order)}
                variant="outline"
                size="sm"
              >
                <WhatsAppIcon className="size-[1.15em]" />
                Ask us
              </Button>
            </div>
          </div>
        )}

        {/* Allergen guidance */}
        <aside className="mt-16 flex items-start gap-3.5 rounded-card bg-ink-900/[0.04] p-6 ring-1 ring-ink-900/8">
          <InfoIcon className="mt-0.5 size-5 shrink-0 text-gold-600" />
          <div>
            <h2 className="font-display text-base font-semibold text-ink-900">
              Allergies &amp; dietary requirements
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{allergenNotice}</p>
          </div>
        </aside>
      </Section>

      <WhatsAppCta
        title="Ready to order?"
        description="Send us a message and we will get your food started. Collection and delivery both available."
        message={whatsappMessages.order}
      />
    </>
  )
}

interface FilterChipProps {
  children: React.ReactNode
  isActive: boolean
  onClick: () => void
  count: number
}

function FilterChip({ children, isActive, onClick, count }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={cn(
        'inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-300',
        isActive
          ? 'bg-ink-900 text-cream-50 shadow-soft'
          : 'bg-white text-ink-700 ring-1 ring-ink-900/10 hover:bg-ink-900/5 hover:ring-ink-900/20',
      )}
    >
      {children}
      <span
        className={cn(
          'rounded-full px-1.5 py-0.5 text-[0.65rem] font-semibold',
          isActive ? 'bg-brand-500 text-ink-900' : 'bg-ink-900/8 text-ink-600',
        )}
      >
        {count}
      </span>
    </button>
  )
}
