'use client'

import { motion, AnimatePresence } from 'motion/react'
import { ArrowUp } from 'lucide-react'
import { useLenis } from 'lenis/react'
import { useAppStore } from '@/stores/app-store'
import { cn } from '@/lib/utils'

export function BackToTop() {
  const visible = useAppStore((s) => s.backToTopVisible)
  const lenis = useLenis()

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => lenis?.scrollTo(0, { duration: 1.2 })}
          className={cn(
            'fixed right-8 bottom-8 z-90 flex h-[46px] w-[34px] items-center justify-center',
            'rounded-md border border-border bg-elevated text-muted',
            'shadow-soft backdrop-blur-[12px]',
            'transition-all duration-[280ms] ease-out-expo',
            'hover:-translate-y-px hover:border-foreground hover:text-foreground',
            'gradient-border cursor-pointer',
          )}
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
