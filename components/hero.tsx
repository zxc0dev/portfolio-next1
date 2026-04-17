'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Mail } from 'lucide-react'

import { useLenis } from 'lenis/react'
import { ButtonLink } from '@/components/ui/button'
import { heroEntrance } from '@/animations/variants'
import { heroOrchestration } from '@/animations/orchestration'

export function Hero() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-10%' })
  const lenis = useLenis()

  return (
    <header
      id="hero"
      ref={ref}
      className="relative flex min-h-svh items-center justify-center overflow-hidden px-7 pt-[140px] pb-[clamp(88px,10vw,140px)]"
    >
      {/* Ambient orbs */}
      <div className="pointer-events-none absolute -top-[20%] left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(242,242,242,0.04)_0%,transparent_70%)] blur-[80px] animate-[orbFloat1_10s_ease-in-out_infinite_alternate]" />
      <div className="pointer-events-none absolute -right-[10%] -bottom-[10%] h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(242,242,242,0.025)_0%,transparent_70%)] blur-[80px] animate-[orbFloat2_12s_ease-in-out_infinite_alternate]" />

      <motion.div
        variants={heroOrchestration}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="relative z-2 w-full max-w-[1360px] text-left px-[clamp(20px,4vw,48px)]"
      >
        {/* Hero statement */}
        <motion.div variants={heroEntrance} className="mb-14">
          <h1
            className="font-sans font-normal leading-[1.10] tracking-[-0.02em] text-foreground"
            style={{ fontSize: 'clamp(2.6rem, 5.2vw, 4.4rem)' }}
          >
              I&apos;m Pavlo — a data analyst and I love finding structure and patterns in
              complex things.
          </h1>
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          variants={heroEntrance}
          className="flex flex-wrap items-center justify-start gap-3.5 gap-y-3"
        >
          <ButtonLink
            variant="primary"
            size="default"
            href="#projects"
            onClick={(e) => {
              e.preventDefault()
              const el = document.getElementById('projects')
              if (el && lenis) lenis.scrollTo(el, { offset: -92 })
            }}
          >
            View My Work
          </ButtonLink>
          <ButtonLink
            variant="ghost"
            size="default"
            href="#contact"
            onClick={(e) => {
              e.preventDefault()
              const el = document.getElementById('contact')
              if (el && lenis) lenis.scrollTo(el, { offset: -92 })
            }}
          >
            <Mail className="h-4 w-4" />
            Get in Touch
          </ButtonLink>
        </motion.div>

        {/* Scroll indicator */}
        <motion.button
          variants={{
            hidden: { opacity: 0, y: -28 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 1, ease: [0.33, 1, 0.68, 1], delay: 0.3 },
            },
          }}
          onClick={() => {
            const el = document.getElementById('projects')
            if (el && lenis) lenis.scrollTo(el, { offset: -92 })
          }}
          className="ml-auto mt-10 hidden text-muted transition-colors duration-[280ms] hover:text-accent cursor-pointer lg:flex"
          aria-label="Scroll down"
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
        </motion.button>
      </motion.div>

    </header>
  )
}
