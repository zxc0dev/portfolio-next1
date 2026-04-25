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

// Quartic ease-out: reaches the exact target at t=1 — no fractional snap.
// Defined outside the component so the reference is stable across renders,
// preventing ReactLenis from unnecessarily re-initialising Lenis.
const quarticOut = (t: number) => 1 - Math.pow(1 - t, 4)

export function Providers({ children }: { children: React.ReactNode }) {
  const prefersReduced = useReducedMotion()

  return (
    <ReactLenis
      root
      options={{
        // Duration + easing mode: the Lenis animate.advance() path that uses
        // this branch reaches value === to exactly at linearProgress=1, unlike
        // the lerp branch which uses Math.round() and produces a ≤0.499px
        // fractional snap on every deceleration stop.
        ...(prefersReduced
          ? { lerp: 1, smoothWheel: false }
          : { duration: 0.8, easing: quarticOut, smoothWheel: true }),
        autoResize: true,
      }}
    >
      <ScrollManager />
      {children}
    </ReactLenis>
  )
}
