'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'
import { easings, durations } from '@/tokens'

interface RevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'left' | 'right' | 'none'
  once?: boolean
}

export function Reveal({
  children,
  className,
  delay = 0,
  direction = 'up',
  once = false,
}: RevealProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, margin: '-60px 0px -60px 0px' })

  const directionMap = {
    up: { y: 24 },
    left: { x: -32 },
    right: { x: 32 },
    none: {},
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...directionMap[direction] }}
      animate={
        isInView
          ? { opacity: 1, x: 0, y: 0 }
          : { opacity: 0, ...directionMap[direction] }
      }
      transition={{
        duration: isInView ? durations.reveal : 0.3,
        ease: easings.outExpo,
        delay: isInView ? delay : 0,
      }}
      className={cn(className)}
      style={{ willChange: 'opacity, transform' }}
    >
      {children}
    </motion.div>
  )
}
