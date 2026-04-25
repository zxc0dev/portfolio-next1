'use client'

import { useEffect, useRef } from 'react'
import { useAppStore } from '@/stores/app-store'

// Bypasses React reconciliation on every scroll frame by subscribing to the
// Zustand store directly and mutating the DOM ref imperatively.
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    return useAppStore.subscribe((state) => {
      if (ref.current) {
        ref.current.style.width = `${state.scrollProgress * 100}%`
      }
    })
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="fixed top-0 left-0 z-[200] h-0.5 opacity-80"
      style={{
        width: '0%',
        background:
          'linear-gradient(135deg, #ffffff 0%, rgba(242,242,242,0.85) 48%, rgba(242,242,242,0.7) 100%)',
        transform: 'translateZ(0)',
        willChange: 'width',
      }}
    />
  )
}
