'use client'

import { useEffect, useRef } from 'react'
import { useAppStore } from '@/stores/app-store'

/**
 * A purely decorative, non-interactive scrollbar on the right edge.
 * The thumb position mirrors scroll progress but the element is
 * pointer-events-none so it can never be dragged or clicked.
 */
export function DecorativeScrollbar() {
  const trackRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    return useAppStore.subscribe(
      (state) => state.scrollProgress,
      (progress) => {
        if (!thumbRef.current || !trackRef.current) return
        const trackH = trackRef.current.offsetHeight
        const thumbH = thumbRef.current.offsetHeight
        const offset = Math.max(0, Math.min(progress * (trackH - thumbH), trackH - thumbH))
        thumbRef.current.style.transform = `translateY(${offset}px)`
      },
    )
  }, [])

  return (
    <div
      ref={trackRef}
      aria-hidden="true"
      className="pointer-events-none fixed bottom-4 right-3 top-[88px] z-[199] w-[2px] rounded-full"
      style={{ background: 'rgba(255,255,255,0.07)', transform: 'translateZ(0)' }}
    >
      <div
        ref={thumbRef}
        className="absolute left-0 top-0 w-full rounded-full"
        style={{
          height: 38,
          background: 'rgba(255,255,255,0.42)',
          willChange: 'transform',
        }}
      />
    </div>
  )
}
