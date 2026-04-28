'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useAppStore } from '@/stores/app-store'

// ─── Boot sequence lines ────────────────────────────────────────────────────
const BOOT_LINES: { text: string; t: number; dim?: boolean }[] = [
  { text: 'Initialized Data Kernel v7.11',      t: 0 },
  { text: ':: running early hook [udev]',        t: 250 },
  { text: 'Starting datad-udevd version 170-3', t: 500 },
  { text: ':: running hook [udev]',              t: 750 },
  { text: 'Why are you reading it...',           t: 1050, dim: true },
  { text: ':: Triggering uevents...',            t: 1300 },
  { text: ':: running hook [keymap]',            t: 1550 },
  { text: ':: Loading keymap...done.',           t: 1800 },
  { text: ':: running hook [encrypt]',           t: 2050 },
]

const T_PASS_PROMPT    = 2380
const T_PASS_CHARS     = 2620
const PASS_CHAR_MS     = 41
const T_VERIFYING      = 3240
const T_DECRYPTING     = 3560
const T_PROGRESS_START = 3780
const PROGRESS_STEPS   = 50
const PROGRESS_STEP_MS = 20
const T_OK1  = 4920
const T_OK2  = 5080
const T_OK3  = 5240
const T_EXIT = 5580

const TOTAL_BLOCKS = 32

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

  const [visibleLines,   setVisibleLines]   = useState(0)
  const [showPrompt,     setShowPrompt]     = useState(false)
  const [passChars,      setPassChars]      = useState(0)
  const [showVerifying,  setShowVerifying]  = useState(false)
  const [showDecrypting, setShowDecrypting] = useState(false)
  const [progress,       setProgress]       = useState(0)
  const [showOk1,        setShowOk1]        = useState(false)
  const [showOk2,        setShowOk2]        = useState(false)
  const [showOk3,        setShowOk3]        = useState(false)
  const [exiting,        setExiting]        = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    document.documentElement.style.overflow = 'hidden'
    return () => { document.documentElement.style.overflow = '' }
  }, [])

  useEffect(() => {
    const ts: ReturnType<typeof setTimeout>[] = []
    const at = (t: number, fn: () => void) => { ts.push(setTimeout(fn, t)) }

    BOOT_LINES.forEach((line, i) => at(line.t, () => setVisibleLines(i + 1)))

    at(T_PASS_PROMPT, () => setShowPrompt(true))

    for (let i = 1; i <= 12; i++) {
      at(T_PASS_CHARS + i * PASS_CHAR_MS, () => setPassChars((c) => Math.min(c + 1, 12)))
    }

    at(T_VERIFYING,  () => setShowVerifying(true))
    at(T_DECRYPTING, () => setShowDecrypting(true))

    for (let i = 1; i <= PROGRESS_STEPS; i++) {
      at(T_PROGRESS_START + i * PROGRESS_STEP_MS, () =>
        setProgress((p) => Math.min(p + Math.round(100 / PROGRESS_STEPS), 100))
      )
    }

    at(T_OK1, () => setShowOk1(true))
    at(T_OK2, () => setShowOk2(true))
    at(T_OK3, () => setShowOk3(true))
    at(T_EXIT, () => setExiting(true))

    return () => ts.forEach(clearTimeout)
  }, [])

  const filled      = Math.floor((progress / 100) * TOTAL_BLOCKS)
  const progressBar = '█'.repeat(filled) + '░'.repeat(TOTAL_BLOCKS - filled)

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
          className="fixed inset-0 z-[9999] flex items-start justify-start bg-background px-[clamp(28px,8vw,96px)] py-[clamp(60px,10vh,120px)] overflow-hidden"
        >
          <div className="w-full max-w-[640px] font-mono text-[0.8rem] leading-[1.85]">

            {/* Boot lines */}
            {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.12 }}
                className={
                  line.dim
                    ? 'text-muted'
                    : line.text.startsWith('::')
                      ? 'text-secondary'
                      : 'text-foreground/70'
                }
              >
                {line.text}
              </motion.div>
            ))}

            {/* Password section */}
            {showPrompt && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.12 }}
                className="mt-5"
              >
                <div className="text-secondary">
                  A password is required to encrypt the secret volume:
                </div>
                <div className="mt-0.5 flex items-center text-foreground/80">
                  <span>Enter passphrase for /dev/portfolio/zxc0dev:&nbsp;</span>
                  <span className="tracking-[0.2em]">{'*'.repeat(passChars)}</span>
                  {passChars < 12 && <Cursor />}
                </div>
              </motion.div>
            )}

            {showVerifying && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.12 }}
                className="mt-4 text-muted"
              >
                Verifying passphrase...
              </motion.div>
            )}

            {showDecrypting && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.12 }}
              >
                <div className="mt-1 text-foreground/70">
                  Decrypting /dev/portfolio/zxc0dev...
                </div>
                <div className="mt-2 text-secondary tabular-nums">
                  {progressBar} {progress}%
                </div>
              </motion.div>
            )}

            {showOk1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.12 }}
                className="mt-4 text-success"
              >
                {'[ OK ] Target reached: Secret Volume Decrypted.'}
              </motion.div>
            )}
            {showOk2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.12 }}
                className="text-success"
              >
                {'[ OK ] Mounted /projects/'}
              </motion.div>
            )}
            {showOk3 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.12 }}
                className="text-success"
              >
                {'[ OK ] Initializing Interactive Shell...'}
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
