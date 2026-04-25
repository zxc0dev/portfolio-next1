'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useAppStore } from '@/stores/app-store'

const SHELL = 'zxc0@localhost:~$ psql -d portfolio'
const QUERY = 'SELECT * FROM hero;'

const STATUS = [
  '-- Connecting to data warehouse...',
  '-- Running query...',
  '-- \u2713  1 row returned in 1.78s',
]

type Phase = 'shell' | 'query' | 'status'

function Cursor() {
  return (
    <span
      className="inline-block ml-px w-[6px] h-[0.88em] bg-foreground/55 align-middle animate-[blink_0.9s_step-end_infinite]"
      aria-hidden="true"
    />
  )
}

export function LoadingScreen() {
  const setLoaded = useAppStore((s) => s.setLoaded)
  const [phase, setPhase]             = useState<Phase>('shell')
  const [shellChars, setShellChars]   = useState(0)
  const [queryChars, setQueryChars]   = useState(0)
  const [statusCount, setStatusCount] = useState(0)
  const [exiting, setExiting]         = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    document.documentElement.style.overflow = 'hidden'
    return () => { document.documentElement.style.overflow = '' }
  }, [])

  /* Shell line typing */
  useEffect(() => {
    if (phase !== 'shell') return
    if (shellChars >= SHELL.length) {
      const t = setTimeout(() => setPhase('query'), 210)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setShellChars((c) => c + 1), 9)
    return () => clearTimeout(t)
  }, [phase, shellChars])

  /* Query line typing */
  useEffect(() => {
    if (phase !== 'query') return
    if (queryChars >= QUERY.length) {
      const t = setTimeout(() => setPhase('status'), 140)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setQueryChars((c) => c + 1), 21)
    return () => clearTimeout(t)
  }, [phase, queryChars])

  /* Status lines */
  useEffect(() => {
    if (phase !== 'status') return
    if (statusCount >= STATUS.length) {
      const t = setTimeout(() => setExiting(true), 480)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setStatusCount((n) => n + 1), 230)
    return () => clearTimeout(t)
  }, [phase, statusCount])

  return (
    <AnimatePresence
      onExitComplete={() => {
        document.documentElement.style.overflow = ''
        window.scrollTo(0, 0)
        setLoaded()
      }}
    >
      {!exiting && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9999] flex items-center justify-start bg-background px-[clamp(28px,8vw,96px)]"
        >
          <div className="w-full max-w-[520px]">
            {/* Decorative dots */}
            <div className="mb-6 flex gap-[7px]" aria-hidden="true">
              <span className="h-[10px] w-[10px] rounded-full bg-white/[0.07]" />
              <span className="h-[10px] w-[10px] rounded-full bg-white/[0.07]" />
              <span className="h-[10px] w-[10px] rounded-full bg-white/[0.07]" />
            </div>

            <div className="font-mono text-[0.8rem] leading-[1.8]">
              {/* Shell line */}
              <div style={{ color: 'rgba(255,255,255,0.42)' }}>
                {SHELL.slice(0, shellChars)}
                {phase === 'shell' && <Cursor />}
              </div>

              {/* Query line */}
              {phase !== 'shell' && (
                <div className="mt-px">
                  <span style={{ color: 'rgba(255,255,255,0.3)' }}>portfolio=# </span>
                  <span className="text-foreground">{QUERY.slice(0, queryChars)}</span>
                  <Cursor />
                </div>
              )}

              {/* Status lines */}
              {statusCount > 0 && (
                <div className="mt-4 flex flex-col">
                  {STATUS.slice(0, statusCount).map((line, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.22 }}
                      className={i === STATUS.length - 1 ? 'text-foreground font-medium' : ''}
                      style={i < STATUS.length - 1 ? { color: 'rgba(255,255,255,0.35)' } : undefined}
                    >
                      {line}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
