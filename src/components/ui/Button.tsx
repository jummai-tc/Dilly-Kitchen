import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'outline-dark' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-full text-center font-semibold tracking-tight ' +
  'transition-all duration-300 ease-[var(--ease-out-soft)] disabled:opacity-55 ' +
  'disabled:cursor-not-allowed disabled:hover:translate-y-0'

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-500 text-ink-900 shadow-soft hover:bg-brand-400 hover:-translate-y-0.5 hover:shadow-glow',
  secondary:
    'bg-ink-900 text-cream-50 shadow-soft hover:bg-ink-800 hover:-translate-y-0.5 hover:shadow-lift',
  outline:
    'border-2 border-ink-900/15 bg-transparent text-ink-900 hover:border-ink-900/40 hover:bg-ink-900/5 hover:-translate-y-0.5',
  'outline-dark':
    'border-2 border-cream-100/25 bg-transparent text-cream-50 hover:border-brand-500 hover:text-brand-500 hover:-translate-y-0.5',
  ghost: 'bg-transparent text-ink-700 hover:bg-ink-900/5',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-[0.95rem]',
  lg: 'px-8 py-4 text-base',
}

interface CommonProps {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  fullWidth?: boolean
}

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & {
    to?: never
    href?: never
  }

type ButtonAsLink = CommonProps & {
  /** Internal route — renders a react-router `Link`. */
  to: string
  href?: never
}

type ButtonAsAnchor = CommonProps & {
  /** External URL — renders an anchor that opens in a new tab. */
  href: string
  to?: never
  /** Set false for `tel:` / `mailto:` links that should stay in the same tab. */
  external?: boolean
}

export type ButtonProps = ButtonAsButton | ButtonAsLink | ButtonAsAnchor

export function Button(props: ButtonProps) {
  const { children, variant = 'primary', size = 'md', className, fullWidth } = props
  const classes = cn(base, variants[variant], sizes[size], fullWidth && 'w-full', className)

  if ('to' in props && props.to) {
    const { to } = props
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    )
  }

  if ('href' in props && props.href) {
    const { href, external = true } = props
    const opensNewTab = external && /^https?:/.test(href)
    return (
      <a
        href={href}
        className={classes}
        {...(opensNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    )
  }

  const {
    children: _children,
    variant: _v,
    size: _s,
    className: _c,
    fullWidth: _f,
    ...rest
  } = props as ButtonAsButton
  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  )
}
