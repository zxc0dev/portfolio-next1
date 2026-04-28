'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useAppStore } from '@/stores/app-store'

const SHELL = '[zxc0@arch ~]$ psql -d portfolio'
const QUERY = 'SELECT * FROM hero;'

const STATUS = [
  ':: connecting to data warehouse...',
  ':: running query...',
  ':: ✓  1 row returned in 1.78s',
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
      const t = setTimeout(() => setPhase('query'), 260)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setShellChars((c) => c + 1), 20)
    return () => clearTimeout(t)
  }, [phase, shellChars])

  /* Query line typing */
  useEffect(() => {
    if (phase !== 'query') return
    if (queryChars >= QUERY.length) {
      const t = setTimeout(() => setPhase('status'), 200)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setQueryChars((c) => c + 1), 40)
    return () => clearTimeout(t)
  }, [phase, queryChars])

  /* Status lines */
  useEffect(() => {
    if (phase !== 'status') return
    if (statusCount >= STATUS.length) {
      const t = setTimeout(() => setExiting(true), 580)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setStatusCount((n) => n + 1), 400)
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
          <div className="w-full max-w-[540px]">

            {/* ── Terminal title bar ─────────────────────────────────────── */}
            <div className="mb-5 flex items-center gap-2" aria-hidden="true">
              <span className="h-[11px] w-[11px] rounded-full bg-white/[0.09]" />
              <span className="h-[11px] w-[11px] rounded-full bg-white/[0.09]" />
              <span className="h-[11px] w-[11px] rounded-full bg-white/[0.09]" />
              <span className="ml-3 font-mono text-[0.67rem] tracking-[0.06em] text-white/20">
                zxc0@arch — psql
              </span>
            </div>

            <div className="font-mono text-[0.8rem] leading-[1.8]">
              {/* Shell line */}
              <div className="text-secondary">
                {SHELL.slice(0, shellChars)}
                {phase === 'shell' && <Cursor />}
              </div>

              {/* Query line */}
              {phase !== 'shell' && (
                <div className="mt-px">
                  <span className="text-white/[0.28]">portfolio=# </span>
                  <span className="text-foreground">{QUERY.slice(0, queryChars)}</span>
                  <Cursor />
                </div>
              )}

              {/* Status lines — :: prefix style */}
              {statusCount > 0 && (
                <div className="mt-4 flex flex-col">
                  {STATUS.slice(0, statusCount).map((line, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.22 }}
                      className={i === STATUS.length - 1 ? 'text-foreground font-medium' : 'text-white/[0.35]'}
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
