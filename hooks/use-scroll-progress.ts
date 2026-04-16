'use client'

import { useLenis } from 'lenis/react'
import { useInteractionStore } from '@/stores/interaction-store'

export function useScrollProgress() {
  useLenis(({ progress, velocity }) => {
    useInteractionStore.getState().setScrollProgress(progress)
    useInteractionStore.getState().setIsScrolling(Math.abs(velocity) > 0.01)
  })
}
