'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { useLenis } from 'lenis/react'
import { useAppStore } from '@/stores/app-store'
import { cn } from '@/lib/utils'

type Phase = 'idle' | 'typing' | 'status' | 'revealed'

interface TerminalQueryProps {
  /** SQL query text — use \n for line wraps */
  query: string
  /** Rows returned description, e.g. "3 rows returned" */
  rowsText?: string
  children: React.ReactNode
  className?: string
  /** Total typing animation duration in ms */
  typeDuration?: number
}

export function TerminalQuery({
  query,
  rowsText = '1 row returned',
  children,
  className,
  typeDuration = 500,
}: TerminalQueryProps) {
  const lenis        = useLenis()
  const isLoaded     = useAppStore((s) => s.isLoaded)
  const containerRef = useRef<HTMLDivElement>(null)
  const phaseRef     = useRef<Phase>('idle')

  const [phase, setPhaseState]     = useState<Phase>('idle')
  const [charCount, setCharCount]  = useState(0)
  const [statusVisible, setStatus] = useState(false)

  // Keep ref in sync so IntersectionObserver callback can read current phase
  const setPhase = useCallback((p: Phase) => {
    phaseRef.current = p
    setPhaseState(p)
  }, [])

  // Finish immediately — used for wheel bypass
  const finish = useCallback(() => {
    if (phaseRef.current === 'revealed') return
    setCharCount(query.length)
    setStatus(true)
    setPhase('revealed')
    lenis?.start()
  }, [query.length, lenis, setPhase])

  // IntersectionObserver — start typing when section enters viewport
  useEffect(() => {
    if (!isLoaded) return
    const el = containerRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && phaseRef.current === 'idle') {
          setPhase('typing')
        }
      },
      { threshold: 0.25, rootMargin: '0px 0px -80px 0px' },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [isLoaded, setPhase])

  // Wheel bypass — fast scroll skips animation immediately
  useEffect(() => {
    if (phase !== 'typing' && phase !== 'status') return
    const handler = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 180) finish()
    }
    window.addEventListener('wheel', handler, { passive: true })
    return () => window.removeEventListener('wheel', handler)
  }, [phase, finish])

  // Phase: typing — lock scroll, advance char by char
  useEffect(() => {
    if (phase !== 'typing') return
    lenis?.stop()
    if (charCount >= query.length) {
      const t = setTimeout(() => {
        setStatus(true)
        setPhase('status')
      }, 110)
      return () => clearTimeout(t)
    }
    const charMs = Math.max(typeDuration / query.length, 7)
    const t = setTimeout(() => setCharCount((c) => c + 1), charMs)
    return () => clearTimeout(t)
  }, [phase, charCount, query.length, typeDuration, lenis, setPhase])

  // Phase: status → revealed — unlock scroll after brief pause
  useEffect(() => {
    if (phase !== 'status') return
    const t = setTimeout(() => {
      setPhase('revealed')
      lenis?.start()
    }, 380)
    return () => clearTimeout(t)
  }, [phase, lenis, setPhase])

  const displayedText = query.slice(0, charCount)

  return (
    <div ref={containerRef} className={cn(className)}>
      {/* Terminal prompt + query line */}
      <div className="mb-6 font-mono text-[0.78rem] leading-[1.72]">
        <div className="whitespace-pre">
          <span style={{ color: 'rgba(255,255,255,0.28)' }}>portfolio=# </span>
          {phase !== 'idle' && (
            <span className="text-foreground">{displayedText}</span>
          )}
          {/* Blinking cursor — visible in all phases */}
          <span
            className="inline-block ml-px w-[6px] h-[0.88em] bg-foreground/50 align-middle animate-[blink_0.9s_step-end_infinite]"
            aria-hidden="true"
          />
        </div>

        {/* Status line — appears after typing completes */}
        {statusVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            style={{ color: 'rgba(255,255,255,0.3)' }}
          >
            {`-- \u2713  ${rowsText}`}
          </motion.div>
        )}
      </div>

      {/* Section content — mounted only after query executes */}
      {phase === 'revealed' && children}
    </div>
  )
}
