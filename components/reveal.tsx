'use client'

import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
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
  const isInView = useInView(ref, { once, margin: '0px 0px 100px 0px' })

  const directionMap = {
    up: { y: 10 },
    left: { x: -14 },
    right: { x: 14 },
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
        duration: durations.reveal,
        ease: easings.outExpo,
        delay: isInView ? delay : 0,
      }}
      transformTemplate={(_, generated) =>
        generated === 'none' ? 'translateZ(0px)' : `${generated} translateZ(0px)`
      }
      className={cn(className)}
      style={{ backfaceVisibility: 'hidden' }}
    >
      {children}
    </motion.div>
  )
}
