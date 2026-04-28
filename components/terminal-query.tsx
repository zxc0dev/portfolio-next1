'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useLenis } from 'lenis/react'
import { useAppStore } from '@/stores/app-store'
import { cn } from '@/lib/utils'

type Phase = 'idle' | 'typing' | 'revealed'

// Global gate â€” only one query types at a time
let activeTerminalId: string | null = null

interface TerminalQueryProps {
  query: string
  rowsText?: string
  children: React.ReactNode
  className?: string
  prompt?: string
  onRevealed?: () => void
  /** rootMargin for the IntersectionObserver — tighten to require more scroll before typing starts */
  observerMargin?: string
  /** Lock Lenis scroll while the query is typing so the user cannot skip ahead */
  lockScroll?: boolean
  /** Optional already-typed line shown above the main prompt when typing starts */
  prelude?: { prompt?: string; text: string }
  /** Removes the gap between command line and children — use for connection output that flows continuously */
  compact?: boolean
}

const CHAR_SPEED = 22 // ms per character

export function TerminalQuery({
  query,
  rowsText,
  children,
  className,
  prompt = 'portfolio=# ',
  onRevealed,
  observerMargin = '0px 0px -80px 0px',
  lockScroll = false,
  prelude,
  compact = false,
}: TerminalQueryProps) {
  const isLoaded     = useAppStore((s) => s.isLoaded)
  const lenis        = useLenis()
  const containerRef = useRef<HTMLDivElement>(null)
  const idRef        = useRef(`tq-${Math.random().toString(36).slice(2)}`)
  const phaseRef     = useRef<Phase>('idle')

  const [phase,         setPhaseState]  = useState<Phase>('idle')
  const [charCount,     setCharCount]   = useState(0)
  const [statusVisible, setStatus]      = useState(false)
  const [isInView,      setInView]      = useState(false)

  const setPhase = useCallback((p: Phase) => {
    phaseRef.current = p
    setPhaseState(p)
  }, [])

  const releaseGate = useCallback(() => {
    if (activeTerminalId === idRef.current) activeTerminalId = null
  }, [])

  // â”€â”€ IntersectionObserver â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  useEffect(() => {
    if (!isLoaded) return
    const el = containerRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { setInView(entry.isIntersecting) },
      { threshold: 0.0, rootMargin: observerMargin },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [isLoaded, observerMargin])

  // â”€â”€ Claim global gate once in view â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  useEffect(() => {
    if (!isLoaded || !isInView || phase !== 'idle') return
    const tryClaim = () => {
      if (phaseRef.current !== 'idle') return
      if (activeTerminalId && activeTerminalId !== idRef.current) return
      activeTerminalId = idRef.current
      setPhase('typing')
    }
    tryClaim()
    const iv = setInterval(tryClaim, 80)
    return () => clearInterval(iv)
  }, [isLoaded, isInView, phase, setPhase])

  // â”€â”€ Auto-type on 'typing' â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  useEffect(() => {
    if (phase !== 'typing') return

    const ts: ReturnType<typeof setTimeout>[] = []
    for (let i = 1; i <= query.length; i++) {
      ts.push(
        setTimeout(() => {
          setCharCount(i)
          if (i === query.length) {
            setTimeout(() => {
              setStatus(true)
              setTimeout(() => {
                setPhase('revealed')
                releaseGate()
                onRevealed?.()
              }, 380)
            }, 100)
          }
        }, i * CHAR_SPEED),
      )
    }
    return () => ts.forEach(clearTimeout)
  }, [phase, query, setPhase, releaseGate])
  // Lock scroll while typing

  useEffect(() => {
    if (!lockScroll) return
    if (phase === 'typing') {
      lenis?.stop()
    } else {
      lenis?.start()
    }
  }, [lockScroll, phase, lenis])


  // â”€â”€ Safety cleanup â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  useEffect(() => {
    return () => {
      releaseGate()
      if (lockScroll) lenis?.start()
    }
  }, [releaseGate, lockScroll, lenis])

  return (
    <div ref={containerRef} className={cn(className)}>
      <div className={cn(compact ? 'mb-0' : 'mb-[clamp(20px,2.5vw,32px)]', 'font-mono text-[0.78rem] leading-[1.72]')}>
        {phase !== 'idle' && prelude && (
          <div className="whitespace-pre">
            {prelude.prompt && <span className="text-white/[0.28]">{prelude.prompt}</span>}
            <span className="text-foreground">{prelude.text}</span>
          </div>
        )}
        <div className="whitespace-pre">
          <span className="text-white/[0.28]">{prompt}</span>
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

        {statusVisible && rowsText && (
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
            initial={{ opacity: 0, y: compact ? 0 : 10 }}
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
