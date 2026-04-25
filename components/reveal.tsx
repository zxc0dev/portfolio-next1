'use client'

import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { cn } from '@/lib/utils'
import { ease, dur } from '@/lib/motion'

interface RevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  /** @deprecated No longer applied — reveal is pure opacity staging */
  direction?: 'up' | 'left' | 'right' | 'none'
}

export function Reveal({
  children,
  className,
  delay = 0,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '0px 0px -48px 0px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : undefined}
      transition={{ duration: dur.reveal, ease: ease.expo, delay }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}
