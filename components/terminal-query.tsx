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
  const phaseRef     = useRef<Phase>('idle')
  const isLockedRef  = useRef(false)
  const guardRef     = useRef<ReturnType<typeof setInterval> | null>(null)
  const savedYRef    = useRef(0)
  const rafRef       = useRef<number | null>(null)

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
    guardRef.current = setInterval(() => {
      if (Math.abs(window.scrollY - savedYRef.current) > 1) {
        window.scrollTo({ top: savedYRef.current, behavior: 'instant' })
      }
    }, 16)
  }, [lenis])

  const unlockScroll = useCallback(() => {
    if (!isLockedRef.current) return
    isLockedRef.current = false
    if (guardRef.current) { clearInterval(guardRef.current); guardRef.current = null }
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
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.0, rootMargin: '0px 0px -160px 0px' },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [isLoaded])

  // ── Claim global gate ─────────────────────────────────────────────────────

  useEffect(() => {
    if (!isLoaded || !isInView || phase !== 'idle') return
    const tryClaim = () => {
      if (phaseRef.current !== 'idle') return
      if (activeTerminalId && activeTerminalId !== idRef.current) return
      activeTerminalId = idRef.current
      setPhase('typing')
    }
    tryClaim()
    const iv = setInterval(tryClaim, 90)
    return () => clearInterval(iv)
  }, [isLoaded, isInView, phase, setPhase])

  // ── Hard flick bypass ─────────────────────────────────────────────────────

  useEffect(() => {
    if (phase !== 'typing' && phase !== 'status') return
    const handler = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 180) finish()
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
    charCountRef.current   = charCount // sync on entry

    // ── Input listeners — fill the energy bucket ──────────────────────────
    const CHARS_PER_PX = 0.45 // tune: lower = more scrolling needed per char

    const normalizeDelta = (deltaY: number, deltaMode: number) => {
      // WheelEvent delta can be in pixels (0), lines (1), or pages (2).
      if (deltaMode === 1) return deltaY * 16
      if (deltaMode === 2) return deltaY * window.innerHeight
      return deltaY
    }

    const onWheel = (e: WheelEvent) => {
      // Only downward scroll advances typing
      const dy = normalizeDelta(e.deltaY, e.deltaMode)
      if (dy > 0) wheelEnergyRef.current += dy
    }

    let lastTouchY = 0
    const onTouchStart = (e: TouchEvent) => {
      lastTouchY = e.touches[0].clientY
    }
    const onTouchMove = (e: TouchEvent) => {
      const dy = lastTouchY - e.touches[0].clientY // positive = scrolling down
      lastTouchY = e.touches[0].clientY
      if (dy > 0) wheelEnergyRef.current += dy * 3 // touch needs amplification
    }

    // Capture phase helps when smooth-scroll libraries stop propagation later.
    window.addEventListener('wheel',      onWheel,      { passive: true, capture: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true, capture: true })
    window.addEventListener('touchmove',  onTouchMove,  { passive: true, capture: true })

    // ── RAF loop — drain energy into chars ────────────────────────────────
    const tick = () => {
      if (wheelEnergyRef.current > 0) {
        // Convert energy to char budget
        charBudgetRef.current += wheelEnergyRef.current * CHARS_PER_PX
        // Decay energy so it feels natural, not instant
        wheelEnergyRef.current *= 0.6

        // Drain budget — cap at 4 chars/frame so bursts aren't jarring
        const advance = Math.min(Math.floor(charBudgetRef.current), 4)
        if (advance > 0) {
          charBudgetRef.current -= advance
          const next = Math.min(charCountRef.current + advance, query.length)
          charCountRef.current = next
          setCharCount(next)
        }

        if (charCountRef.current >= query.length) {
          setTimeout(() => { setStatus(true); setPhase('status') }, 110)
          return // stop RAF
        }
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
  }, [phase, lockScroll, setPhase, query.length, charCount])

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
          <span style={{ color: 'rgba(255,255,255,0.28)' }}>portfolio=#&nbsp;</span>
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
            style={{ color: 'rgba(255,255,255,0.3)' }}
          >
            {`-- ✓  ${rowsText}`}
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