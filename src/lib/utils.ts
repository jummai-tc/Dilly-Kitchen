/** Joins class names, dropping falsy values. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}

/** Formats a GBP price. Returns null for "price on request" items. */
export function formatPrice(price: number | null): string | null {
  if (price === null) return null
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: price % 1 === 0 ? 0 : 2,
  }).format(price)
}

/** Normalises a string for accent-insensitive, case-insensitive search. */
export function normalise(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
}
