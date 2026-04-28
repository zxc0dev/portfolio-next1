'use client'

import { useEffect } from 'react'
import { ReactLenis, useLenis } from 'lenis/react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { useScrollProgress } from '@/hooks/use-scroll-progress'
import { useActiveSection } from '@/hooks/use-active-section'
import { useAppStore } from '@/stores/app-store'

function ScrollManager() {
  useScrollProgress()
  useActiveSection()
  useScrollResetOnLoad()
  useResizeOnCertsDone()
  return null
}

/**
 * When the loading screen finishes and `isLoaded` transitions false → true,
 * immediately snap Lenis (and the native scroll) to the very top.
 *
 * Without this, a hard-refresh mid-page can leave Lenis at whatever Y the
 * browser scroll-restored to, causing terminal-query IntersectionObservers
 * to fire for elements that are out-of-viewport — trapping the user between
 * two queries.
 */
function useScrollResetOnLoad() {
  const lenis = useLenis()

  useEffect(() => {
    return useAppStore.subscribe(
      (s) => s.isLoaded,
      (isLoaded) => {
        if (isLoaded) lenis?.scrollTo(0, { immediate: true })
      },
    )
  }, [lenis])
}

/**
 * When gated sections (Projects, Contact) first render after certificatesDone,
 * the document height increases but Lenis does not automatically recalculate
 * its scroll range (autoResize only fires on viewport resize, not DOM changes).
 * Force a resize() so Lenis picks up the new scrollable height.
 */
function useResizeOnCertsDone() {
  const lenis = useLenis()

  useEffect(() => {
    return useAppStore.subscribe(
      (s) => s.certificatesDone,
      (done) => {
        if (!done) return
        // Double rAF: first frame React commits, second frame browser paints
        requestAnimationFrame(() => requestAnimationFrame(() => lenis?.resize()))
      },
    )
  }, [lenis])
}

// Quartic ease-out: reaches the exact target at t=1 — no fractional snap.
// Defined outside the component so the reference is stable across renders,
// preventing ReactLenis from unnecessarily re-initialising Lenis.
const quarticOut = (t: number) => 1 - Math.pow(1 - t, 4)

function useBlockMiddleMouse() {
  useEffect(() => {
    const block = (e: MouseEvent) => {
      if (e.button === 1) e.preventDefault()
    }
    document.addEventListener('mousedown', block)
    return () => document.removeEventListener('mousedown', block)
  }, [])
}

// Prevent the browser from restoring the previous scroll position on hard
// refresh, which would cause IntersectionObservers to fire for off-screen
// elements before the loading screen finishes.
function useDisableBrowserScrollRestoration() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      history.scrollRestoration = 'manual'
    }
  }, [])
}

export function Providers({ children }: { children: React.ReactNode }) {
  const prefersReduced = useReducedMotion()
  useBlockMiddleMouse()
  useDisableBrowserScrollRestoration()

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
