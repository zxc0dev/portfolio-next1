'use client'

import { ReactLenis } from 'lenis/react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { useScrollProgress } from '@/hooks/use-scroll-progress'
import { useActiveSection } from '@/hooks/use-active-section'

function ScrollManager() {
  useScrollProgress()
  useActiveSection()
  return null
}

export function Providers({ children }: { children: React.ReactNode }) {
  const prefersReduced = useReducedMotion()

  return (
    <ReactLenis
      root
      options={{
        lerp: prefersReduced ? 1 : 0.18,
        smoothWheel: !prefersReduced,
        autoResize: true,
      }}
    >
      <ScrollManager />
      {children}
    </ReactLenis>
  )
}
