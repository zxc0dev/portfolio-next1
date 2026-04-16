import type { Transition } from 'framer-motion'
import { easings, durations } from '@/tokens'

export const springDefault: Transition = {
  type: 'spring',
  stiffness: 260,
  damping: 20,
}

export const tweenFast: Transition = {
  type: 'tween',
  duration: durations.fast,
  ease: easings.outExpo,
}

export const tweenBase: Transition = {
  type: 'tween',
  duration: durations.base,
  ease: easings.outExpo,
}

export const tweenSlow: Transition = {
  type: 'tween',
  duration: durations.slow,
  ease: easings.outQuad,
}

export const tweenReveal: Transition = {
  type: 'tween',
  duration: durations.reveal,
  ease: easings.outExpo,
}

export const pageTransition: Transition = {
  type: 'tween',
  duration: durations.pageTransition,
  ease: easings.outExpo,
}
