import { useEffect, useState } from 'react'

/**
 * Tracks a CSS media query from JavaScript.
 *
 * Tailwind's own variants are the right tool whenever both branches are cheap
 * markup. This is for the case where they are not: the home hero swaps one
 * whole backdrop for another, and `hidden lg:block` would still mount both —
 * pulling a corridor of eager dish photographs onto a phone that never shows
 * it. Reading the query here means only the branch on screen is ever built.
 */
export function useMediaQuery(query: string): boolean {
  // Derived at mount rather than in an effect, so no extra render is triggered.
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches,
  )

  useEffect(() => {
    const media = window.matchMedia(query)
    const onChange = () => setMatches(media.matches)
    onChange()
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [query])

  return matches
}
