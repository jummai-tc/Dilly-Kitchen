import { cn } from '@/lib/utils'
import type { DietaryTag, SpiceLevel } from '@/types'
import { FlameIcon, LeafIcon } from './Icons'

const dietaryLabels: Record<DietaryTag, string> = {
  vegan: 'Vegan',
  vegetarian: 'Vegetarian',
  'contains-peanuts': 'Contains peanuts',
  'contains-shellfish': 'Contains shellfish',
  'contains-fish': 'Contains fish',
  'gluten-free-option': 'Gluten-free option',
  signature: 'Signature dish',
  'chef-special': "Chef's special",
}

const dietaryStyles: Record<DietaryTag, string> = {
  vegan: 'bg-emerald-50 text-emerald-800 ring-emerald-600/20',
  vegetarian: 'bg-emerald-50 text-emerald-800 ring-emerald-600/20',
  'contains-peanuts': 'bg-amber-50 text-amber-900 ring-amber-600/20',
  'contains-shellfish': 'bg-amber-50 text-amber-900 ring-amber-600/20',
  'contains-fish': 'bg-sky-50 text-sky-900 ring-sky-600/20',
  'gluten-free-option': 'bg-sky-50 text-sky-900 ring-sky-600/20',
  signature: 'bg-brand-500 text-ink-900 ring-brand-600/30',
  'chef-special': 'bg-ink-900 text-brand-500 ring-ink-900/20',
}

const showsLeaf: DietaryTag[] = ['vegan', 'vegetarian']

export function DietaryBadge({ tag, className }: { tag: DietaryTag; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.68rem] font-semibold leading-none ring-1 ring-inset',
        dietaryStyles[tag],
        className,
      )}
    >
      {showsLeaf.includes(tag) && <LeafIcon className="size-3" />}
      {dietaryLabels[tag]}
    </span>
  )
}

const spiceLabels: Record<SpiceLevel, string> = {
  0: 'Not spicy',
  1: 'Mild heat',
  2: 'Medium heat',
  3: 'Hot',
}

/** Three flames, filled to the dish's heat level. */
export function SpiceBadge({ level, className }: { level: SpiceLevel; className?: string }) {
  if (level === 0) return null
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full bg-spice-500/10 px-2.5 py-1 text-[0.68rem] font-semibold leading-none text-spice-600 ring-1 ring-inset ring-spice-500/20',
        className,
      )}
      title={spiceLabels[level]}
    >
      <span className="flex items-center gap-0.5" aria-hidden="true">
        {[1, 2, 3].map((step) => (
          <FlameIcon
            key={step}
            className={cn('size-3', step <= level ? 'opacity-100' : 'opacity-25')}
          />
        ))}
      </span>
      <span className="sr-only">{spiceLabels[level]}</span>
      {spiceLabels[level]}
    </span>
  )
}

/** Neutral pill used for chips such as protein choices. */
export function Chip({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full bg-ink-900/5 px-2.5 py-1 text-[0.68rem] font-medium leading-none text-ink-600',
        className,
      )}
    >
      {children}
    </span>
  )
}
