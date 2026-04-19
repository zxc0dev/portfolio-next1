'use client'

import { useLenis } from 'lenis/react'
import { useAppStore } from '@/stores/app-store'

export function useScrollProgress() {
  useLenis(({ progress, velocity }) => {
    useAppStore.getState().setScrollProgress(progress)
    useAppStore.getState().setIsScrolling(Math.abs(velocity) > 0.01)
  })
}
