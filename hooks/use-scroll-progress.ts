'use client'

import { useLenis } from 'lenis/react'
import { useAppStore } from '@/stores/app-store'

export function useScrollProgress() {
  useLenis(({ progress }) => {
    useAppStore.getState().setScrollProgress(progress)
  })
}
