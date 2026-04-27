'use client'

import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { cn } from '@/lib/utils'
import { ease, dur } from '@/lib/motion'
import { useAppStore } from '@/stores/app-store'

interface RevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export function Reveal({
  children,
  className,
  delay = 0,
}: RevealProps) {
  const ref      = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '0px 0px -48px 0px' })
  const isLoaded = useAppStore((s) => s.isLoaded)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isLoaded && isInView ? { opacity: 1 } : undefined}
      transition={{ duration: dur.reveal, ease: ease.expo, delay }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}
