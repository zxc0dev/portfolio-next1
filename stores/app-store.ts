import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

interface AppState {
  scrollProgress: number
  activeSection: string
  setScrollProgress: (progress: number) => void
  setActiveSection: (section: string) => void
}

export const useAppStore = create<AppState>()(
  subscribeWithSelector((set) => ({
    scrollProgress: 0,
    activeSection: 'hero',
    setScrollProgress: (scrollProgress) => set({ scrollProgress }),
    setActiveSection: (activeSection) => set({ activeSection }),
  })),
)
