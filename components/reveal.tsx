'use client'

import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { cn } from '@/lib/utils'
import { ease, dur } from '@/lib/motion'

interface RevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'left' | 'right' | 'none'
}

export function Reveal({
  children,
  className,
  delay = 0,
  direction = 'up',
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' })

  const offset = {
    up: { y: 10 },
    left: { x: -14 },
    right: { x: 14 },
    none: {},
  }[direction]

  const animateTo: Record<string, number> = { opacity: 1 }
  if ('x' in offset) animateTo.x = 0
  if ('y' in offset) animateTo.y = 0

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...offset }}
      animate={isInView ? animateTo : undefined}
      transition={{ duration: dur.reveal, ease: ease.expo, delay }}
      // Keeping will-change set permanently on revealed elements ensures the
      // element stays on a single GPU compositor layer from pre-animation
      // through rest state. Without this, browsers promote the layer when
      // opacity < 1 (animation in progress) and then dissolve it when opacity
      // reaches 1 — that dissolution re-enables subpixel AA and triggers a
      // fractional glyph-position recalculation, visible as a blurry-to-sharp
      // snap with a small upward shift. Maintaining the layer prevents the
      // mode switch entirely.
      style={{ willChange: 'transform, opacity' }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}
