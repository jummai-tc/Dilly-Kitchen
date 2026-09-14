import type { RefAttributes } from 'react'
import { BorderBeam as BorderBeamBase } from 'border-beam'
import type {
  BorderBeamColorVariant,
  BorderBeamProps as BorderBeamBaseProps,
  BorderBeamSize,
  BorderBeamTheme,
} from 'border-beam'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export type { BorderBeamColorVariant, BorderBeamSize, BorderBeamTheme }
export type BorderBeamProps = BorderBeamBaseProps & RefAttributes<HTMLDivElement>

/**
 * Animated border glow, wrapped for Dilly Kitchen.
 *
 * Two project defaults are applied on top of the upstream `border-beam`
 * package, which is why this is a wrapper rather than a bare re-export:
 *
 * 1. `colorVariant` defaults to `sunset` (warm orange/gold/red) instead of
 *    the package's `colorful` rainbow. The site's palette is brass and signal
 *    yellow on ink — a rainbow beam reads as someone else's component.
 * 2. The animation stops when the visitor asks for reduced motion. The beam
 *    loops forever, so the global `index.css` rule that flattens animations
 *    would freeze it mid-travel on a random keyframe. Driving the package's
 *    own `active` prop instead fades it out cleanly and leaves the element's
 *    static edge, which is the honest still version of this effect.
 *
 * Everything else is passed straight through — see the package's types for
 * `size`, `strength`, `duration`, `brightness` and friends.
 */
export function BorderBeam({
  active = true,
  colorVariant = 'sunset',
  ...props
}: BorderBeamProps) {
  const reduced = useReducedMotion()
  return <BorderBeamBase active={active && !reduced} colorVariant={colorVariant} {...props} />
}

export default BorderBeam
