'use client'

import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { Mail, Layers } from 'lucide-react'

import { useLenis } from 'lenis/react'
import { ButtonLink } from '@/components/ui/button'
import { Reveal } from '@/components/reveal'
import { heroEntrance } from '@/animations/variants'
import { heroOrchestration } from '@/animations/orchestration'

export function Hero() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, margin: '-10%' })
  const lenis = useLenis()

  return (
    <header
      id="hero"
      ref={ref}
      className="relative flex min-h-svh items-center justify-center overflow-hidden px-7 pt-[140px] pb-[clamp(88px,10vw,140px)]"
    >
      <motion.div
        variants={heroOrchestration}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="relative z-2 w-full max-w-[1360px] text-left px-[clamp(20px,4vw,48px)]"
      >
        {/* Hero statement */}
        <Reveal>
        <motion.div variants={heroEntrance} className="mb-14">
          <h1
            className="font-sans font-[300] leading-[1.08] tracking-[-0.025em] text-foreground"
            style={{ fontSize: 'clamp(2.4rem, 5vw, 4.4rem)' }}
          >
              I&apos;m Pavlo — a data analyst and I love finding structure and patterns in
              complex things.
          </h1>
        </motion.div>
        </Reveal>

        {/* CTA buttons */}
        <Reveal delay={0.08}>
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
            <Layers className="h-4 w-4" />
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
        </Reveal>

        {/* Scroll indicator */}
        <Reveal delay={0.16}>
        <motion.div
          variants={{
            hidden: { opacity: 0, y: -28 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 1, ease: [0.33, 1, 0.68, 1], delay: 0.3 },
            },
          }}
          className="mt-10 hidden lg:flex justify-end text-muted pointer-events-none"
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
        </Reveal>
      </motion.div>

    </header>
  )
}
