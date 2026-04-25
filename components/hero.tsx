'use client'

import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { ease, dur } from '@/lib/motion'
import { useAppStore } from '@/stores/app-store'

export function Hero() {
  const ref      = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-10%' })
  const isLoaded = useAppStore((s) => s.isLoaded)

  return (
    <header
      id="hero"
      ref={ref}
      className="relative flex min-h-svh items-center justify-center overflow-hidden px-7 pt-[140px] pb-[clamp(88px,10vw,140px)]"
    >
      <motion.div
        initial="hidden"
        animate={isLoaded && isInView ? 'visible' : 'hidden'}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
        }}
        className="relative z-2 w-full max-w-[1360px] text-left px-[clamp(20px,4vw,48px)]"
      >
        <motion.div
          variants={{
            hidden: { opacity: 0, x: 28, y: 4 },
            visible: { opacity: 1, x: 0, y: 0, transition: { duration: dur.hero, ease: ease.expo } },
          }}
          className="mb-14"
        >
          <h1
            className="font-sans font-[300] leading-[1.08] tracking-[-0.025em] text-foreground"
            style={{ fontSize: 'clamp(2.4rem, 5vw, 4.4rem)' }}
          >
            I&apos;m Pavlo — a data analyst and I love finding structure and patterns in
            complex things.
          </h1>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: -28 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 1, ease: ease.quad, delay: 0.3 },
            },
          }}
          className="hidden lg:flex justify-end text-muted pointer-events-none"
          aria-hidden="true"
        >
          <svg
            width="24"
            height="58"
            viewBox="0 0 24 58"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 4v46" />
            <path d="m19 46-7 8-7-8" />
          </svg>
        </motion.div>
      </motion.div>
    </header>
  )
}

