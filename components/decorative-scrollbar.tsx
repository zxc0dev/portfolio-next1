'use client'

import { useEffect, useRef } from 'react'
import { useAppStore } from '@/stores/app-store'

const THUMB_H = 44 // px — fixed height matching screenshot reference

/**
 * Decorative custom-styled scrollbar, flush to the right viewport edge,
 * identical position to a native OS scrollbar.
 *
 * • Fixed-size thumb (never grows/shrinks)
 * • CSS transition on transform for smooth motion
 * • pointer-events-none — purely visual, never interactive
 */
export function DecorativeScrollbar() {
  const thumbRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    return useAppStore.subscribe(
      (state) => state.scrollProgress,
      (progress) => {
        const el = thumbRef.current
        if (!el) return
        const maxSlide = window.innerHeight - THUMB_H
        const offset   = Math.round(progress * maxSlide)
        el.style.transform = `translateY(${offset}px)`
      },
    )
  }, [])

  return (
    // Full-height track flush to the right edge — same position as a native scrollbar
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-y-0 right-0 z-[199] w-[3px]"
      style={{ background: 'rgba(255,255,255,0.05)', transform: 'translateZ(0)' }}
    >
      <div
        ref={thumbRef}
        className="absolute left-0 top-0 w-full rounded-full"
        style={{
          height: THUMB_H,
          background: 'rgba(255,255,255,0.38)',
          transition: 'transform 80ms linear',
          willChange: 'transform',
        }}
      />
    </div>
  )
}

