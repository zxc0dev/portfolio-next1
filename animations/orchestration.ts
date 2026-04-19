import type { Variants } from 'motion/react'
import { easings, durations } from '@/tokens'

export const heroOrchestration: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
}

export const sectionOrchestration: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
}

export const cardGridOrchestration: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
}

export const timelineOrchestration: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
}

export function createStaggerOrchestration(
  stagger: number = 0.08,
  delay: number = 0,
): Variants {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
        ease: easings.outExpo,
        duration: durations.reveal,
      },
    },
  }
}
