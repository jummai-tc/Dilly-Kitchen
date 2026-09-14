import { useEffect, useRef, useState } from 'react'

/** True when the browser cannot observe intersections or the user prefers less motion. */
function shouldRevealImmediately(): boolean {
  if (typeof window === 'undefined') return true
  if (typeof IntersectionObserver === 'undefined') return true
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Reveals an element once it scrolls into view. Content is shown immediately
 * when the user has asked for reduced motion, so nothing is ever hidden by it.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(threshold = 0.15) {
  const ref = useRef<T>(null)
  // Derived at mount rather than in an effect, so no extra render is triggered.
  const [isVisible, setIsVisible] = useState(shouldRevealImmediately)

  useEffect(() => {
    if (isVisible) return
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold, rootMargin: '0px 0px -60px 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold, isVisible])

  return { ref, isVisible }
}
