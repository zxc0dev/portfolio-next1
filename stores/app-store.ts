import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

interface AppState {
  scrollProgress: number
  activeSection: string
  isLoaded: boolean
  setScrollProgress: (progress: number) => void
  setActiveSection: (section: string) => void
  setLoaded: () => void
}

export const useAppStore = create<AppState>()(
  subscribeWithSelector((set) => ({
    scrollProgress: 0,
    activeSection: 'hero',
    isLoaded: false,
    setScrollProgress: (scrollProgress) => set({ scrollProgress }),
    setActiveSection: (activeSection) => set({ activeSection }),
    setLoaded: () => set({ isLoaded: true }),
  })),
)
