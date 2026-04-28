'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useLenis } from 'lenis/react'
import { useAppStore } from '@/stores/app-store'
import { cn } from '@/lib/utils'

type Phase = 'idle' | 'typing' | 'status' | 'revealed'

let activeTerminalId: string | null = null

interface TerminalQueryProps {
  query: string
  rowsText?: string
  children: React.ReactNode
  className?: string
}

export function TerminalQuery({
  query,
  rowsText = '1 row returned',
  children,
  className,
}: TerminalQueryProps) {
  const lenis        = useLenis()
  const isLoaded     = useAppStore((s) => s.isLoaded)
  const containerRef = useRef<HTMLDivElement>(null)
  const idRef        = useRef(`tq-${Math.random().toString(36).slice(2)}`)
  const phaseRef      = useRef<Phase>('idle')
  const isLockedRef   = useRef(false)
  // rAF id for the scroll-position guard loop (replaces setInterval)
  const guardRef      = useRef<number | null>(null)
  const savedYRef     = useRef(0)
  const rafRef        = useRef<number | null>(null)
  // Set to true when the user scrolls backward to 0 chars; cleared when element leaves view.
  // Prevents the claim gate from immediately re-acquiring the lock.
  const retreatedRef  = useRef(false)

  // Wheel energy accumulator — filled by wheel/touch events, drained by RAF
  const wheelEnergyRef  = useRef(0)
  const charBudgetRef   = useRef(0)
  const charCountRef    = useRef(0)

  const [phase,         setPhaseState] = useState<Phase>('idle')
  const [charCount,     setCharCount]  = useState(0)
  const [statusVisible, setStatus]     = useState(false)
  const [isInView,      setInView]     = useState(false)

  const setPhase = useCallback((p: Phase) => {
    phaseRef.current = p
    setPhaseState(p)
  }, [])

  const releaseGate = useCallback(() => {
    if (activeTerminalId === idRef.current) activeTerminalId = null
  }, [])

  const lockScroll = useCallback(() => {
    if (isLockedRef.current) return
    isLockedRef.current = true
    savedYRef.current   = window.scrollY
    lenis?.stop()
    // rAF guard keeps scroll position clamped without the overhead of setInterval
    const guard = () => {
      if (Math.abs(window.scrollY - savedYRef.current) > 1) {
        window.scrollTo({ top: savedYRef.current, behavior: 'instant' })
      }
      guardRef.current = requestAnimationFrame(guard)
    }
    guardRef.current = requestAnimationFrame(guard)
  }, [lenis])

  const unlockScroll = useCallback(() => {
    if (!isLockedRef.current) return
    isLockedRef.current = false
    if (guardRef.current) { cancelAnimationFrame(guardRef.current); guardRef.current = null }
    lenis?.start()
    // Re-measure page height after revealed content enters the DOM
    setTimeout(() => lenis?.resize(), 60)
  }, [lenis])

  const finish = useCallback(() => {
    if (phaseRef.current === 'revealed') return
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    charCountRef.current = query.length
    setCharCount(query.length)
    setStatus(true)
    setPhase('revealed')
    releaseGate()
    unlockScroll()
  }, [query.length, setPhase, releaseGate, unlockScroll])

  // ── IntersectionObserver ──────────────────────────────────────────────────

  useEffect(() => {
    if (!isLoaded) return
    const el = containerRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
        // When the element leaves view, allow re-claiming the gate next time it enters
        if (!entry.isIntersecting) retreatedRef.current = false
      },
      { threshold: 0.0, rootMargin: '0px 0px -160px 0px' },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [isLoaded])

  // ── Claim global gate ─────────────────────────────────────────────────────

  useEffect(() => {
    // retreatedRef: skip re-claim until element has left and re-entered view
    if (!isLoaded || !isInView || phase !== 'idle' || retreatedRef.current) return
    const tryClaim = () => {
      if (phaseRef.current !== 'idle') return
      if (retreatedRef.current) return
      if (activeTerminalId && activeTerminalId !== idRef.current) return
      activeTerminalId = idRef.current
      setPhase('typing')
    }
    tryClaim()
    const iv = setInterval(tryClaim, 90)
    return () => clearInterval(iv)
  }, [isLoaded, isInView, phase, setPhase])

  // ── Hard flick bypass (downward only) ────────────────────────────────────
  // A large upward flick is handled by the retreat path in the typing effect.

  useEffect(() => {
    if (phase !== 'typing' && phase !== 'status') return
    const handler = (e: WheelEvent) => {
      if (e.deltaY > 180) finish()
    }
    window.addEventListener('wheel', handler, { passive: true })
    return () => window.removeEventListener('wheel', handler)
  }, [phase, finish])

  // ── Phase: typing ─────────────────────────────────────────────────────────
  // Scroll is locked so scrollY never changes.
  // Instead we listen to raw wheel/touch delta and use that as energy
  // to advance the char counter — scroll drives typing, not position.

  useEffect(() => {
    if (phase !== 'typing') return

    lockScroll()
    charBudgetRef.current  = 0
    wheelEnergyRef.current = 0
    // charCountRef already holds the correct value; no reset needed here —
    // it is managed imperatively by the RAF loop and must NOT be wiped on
    // every render (removing charCount from deps makes this effect run only
    // on phase transitions, not on every character advance).

    const CHARS_PER_PX = 0.14

    const normalizeDelta = (deltaY: number, deltaMode: number) => {
      if (deltaMode === 1) return deltaY * 16
      if (deltaMode === 2) return deltaY * window.innerHeight
      return deltaY
    }

    // Accept both positive (down) and negative (up) delta
    const onWheel = (e: WheelEvent) => {
      wheelEnergyRef.current += normalizeDelta(e.deltaY, e.deltaMode)
    }

    let lastTouchY = 0
    const onTouchStart = (e: TouchEvent) => { lastTouchY = e.touches[0].clientY }
    const onTouchMove  = (e: TouchEvent) => {
      const dy = lastTouchY - e.touches[0].clientY // positive = down
      lastTouchY = e.touches[0].clientY
      wheelEnergyRef.current += dy * 3
    }

    window.addEventListener('wheel',      onWheel,      { passive: true, capture: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true, capture: true })
    window.addEventListener('touchmove',  onTouchMove,  { passive: true, capture: true })

    const tick = () => {
      const energy = wheelEnergyRef.current

      if (Math.abs(energy) > 0.5) {
        charBudgetRef.current  += energy * CHARS_PER_PX
        wheelEnergyRef.current *= 0.6 // natural decay

        if (charBudgetRef.current >= 1) {
          // ── Advance ──────────────────────────────────────────────────────
          const advance = Math.min(Math.floor(charBudgetRef.current), 4)
          charBudgetRef.current -= advance
          const next = Math.min(charCountRef.current + advance, query.length)
          if (next !== charCountRef.current) {
            charCountRef.current = next
            setCharCount(next)
          }
          if (charCountRef.current >= query.length) {
            setTimeout(() => { setStatus(true); setPhase('status') }, 110)
            return
          }
        } else if (charBudgetRef.current <= -1) {
          // ── Retreat ──────────────────────────────────────────────────────
          const retreat = Math.min(Math.floor(-charBudgetRef.current), 4)
          charBudgetRef.current += retreat
          const next = Math.max(charCountRef.current - retreat, 0)
          if (next !== charCountRef.current) {
            charCountRef.current = next
            setCharCount(next)
          }
          if (charCountRef.current === 0) {
            // Fully untyped — release gate, unlock, let user scroll up freely.
            // retreatedRef prevents the claim gate from immediately re-locking.
            retreatedRef.current   = true
            wheelEnergyRef.current = 0
            charBudgetRef.current  = 0
            releaseGate()
            unlockScroll()
            setPhase('idle')
            return
          }
        }
      } else {
        wheelEnergyRef.current = 0
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener('wheel',      onWheel,      true)
      window.removeEventListener('touchstart', onTouchStart, true)
      window.removeEventListener('touchmove',  onTouchMove,  true)
    }
    // charCount intentionally omitted — RAF loop owns charCountRef imperatively.
    // Including it would tear down and rebuild event listeners on every keypress.
  }, [phase, lockScroll, setPhase, query.length, releaseGate, unlockScroll])

  // ── Phase: status → revealed ──────────────────────────────────────────────

  useEffect(() => {
    if (phase !== 'status') return
    const t = setTimeout(() => {
      setPhase('revealed')
      releaseGate()
      unlockScroll()
    }, 420)
    return () => clearTimeout(t)
  }, [phase, setPhase, releaseGate, unlockScroll])

  // ── Safety cleanup ────────────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      releaseGate()
      unlockScroll()
    }
  }, [releaseGate, unlockScroll])

  return (
    <div ref={containerRef} className={cn(className)}>
      <div className="mb-[clamp(20px,2.5vw,32px)] font-mono text-[0.78rem] leading-[1.72]">
        <div className="whitespace-pre">
          <span className="text-white/[0.28]">portfolio=#&nbsp;</span>
          {phase !== 'idle' && (
            <span className="text-foreground">{query.slice(0, charCount)}</span>
          )}
          {phase !== 'revealed' && (
            <span
              className="inline-block ml-px w-[6px] h-[0.88em] bg-foreground/50 align-middle animate-[blink_0.9s_step-end_infinite]"
              aria-hidden="true"
            />
          )}
        </div>

        {statusVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="text-white/[0.3]"
          >
            {`-- ${rowsText}`}
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {phase === 'revealed' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}