import type { Variants } from 'framer-motion'
import { easings, durations } from '@/tokens'

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: durations.reveal, ease: easings.outQuad },
  },
}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.reveal, ease: easings.outExpo },
  },
}

export const fadeUpStagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
}

export const fadeUpChild: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    transition: { duration: 0.3, ease: easings.outExpo },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.reveal, ease: easings.outExpo },
  },
}

export const heroEntrance: Variants = {
  hidden: { opacity: 0, x: 48, y: 6, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: durations.heroEntrance, ease: easings.outExpo },
  },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: durations.reveal, ease: easings.outExpo },
  },
}

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: durations.reveal, ease: easings.outExpo },
  },
}

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: durations.reveal, ease: easings.outExpo },
  },
}
