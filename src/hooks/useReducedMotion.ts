import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

function prefersReduced(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia(QUERY).matches
}

/**
 * Tracks the operating system's "reduce motion" setting.
 *
 * The global rule in `index.css` already flattens every animation, which is the
 * right answer when the motion is decoration on top of something static. It is
 * the wrong answer when the motion *is* the thing — a flattened animation
 * freezes on its last keyframe, which can look broken. Read this instead and
 * render the still version on purpose.
 */
export function useReducedMotion(): boolean {
  // Derived at mount rather than in an effect, so no extra render is triggered.
  const [reduced, setReduced] = useState(prefersReduced)

  useEffect(() => {
    const media = window.matchMedia(QUERY)
    const onChange = () => setReduced(media.matches)
    onChange()
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  return reduced
}
