import type { ElementType, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Container } from './Container'

interface SectionProps {
  children: ReactNode
  id?: string
  className?: string
  containerClassName?: string
  containerSize?: 'narrow' | 'default' | 'wide'
  /** `dark` uses the warm near-black brand surface. */
  tone?: 'cream' | 'white' | 'dark'
  /** Vertical rhythm. */
  spacing?: 'sm' | 'md' | 'lg'
  as?: ElementType
  'aria-labelledby'?: string
}

const tones = {
  cream: 'bg-cream-50 text-ink-800',
  white: 'bg-white text-ink-800',
  dark: 'surface-dark on-dark',
}

const spacings = {
  sm: 'py-12 sm:py-16',
  md: 'py-16 sm:py-20 lg:py-24',
  lg: 'py-20 sm:py-28 lg:py-32',
}

export function Section({
  children,
  id,
  className,
  containerClassName,
  containerSize = 'default',
  tone = 'cream',
  spacing = 'md',
  as: Tag = 'section',
  ...rest
}: SectionProps) {
  return (
    <Tag id={id} className={cn(tones[tone], spacings[spacing], className)} {...rest}>
      <Container size={containerSize} className={containerClassName}>
        {children}
      </Container>
    </Tag>
  )
}
