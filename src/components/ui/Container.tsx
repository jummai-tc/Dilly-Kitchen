import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ContainerProps {
  children: ReactNode
  className?: string
  /** `wide` for galleries and grids, `narrow` for long-form reading. */
  size?: 'narrow' | 'default' | 'wide'
}

const sizes = {
  narrow: 'max-w-3xl',
  default: 'max-w-6xl',
  wide: 'max-w-[88rem]',
}

export function Container({ children, className, size = 'default' }: ContainerProps) {
  return (
    <div className={cn('mx-auto w-full px-5 sm:px-8 lg:px-10', sizes[size], className)}>
      {children}
    </div>
  )
}
