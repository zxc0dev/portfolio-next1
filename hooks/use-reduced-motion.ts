'use client'

import { useEffect, useState } from 'react'

export function useReducedMotion() {
  // Always initialise to false (SSR-safe). The effect below syncs the real
  // value after hydration, avoiding a server/client mismatch.
  const [prefersReduced, setPrefersReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReduced(mq.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return prefersReduced
}
