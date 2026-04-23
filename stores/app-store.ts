import { create } from 'zustand'

interface AppState {
  scrollProgress: number
  activeSection: string
  setScrollProgress: (progress: number) => void
  setActiveSection: (section: string) => void
}

export const useAppStore = create<AppState>((set) => ({
  scrollProgress: 0,
  activeSection: 'hero',
  setScrollProgress: (scrollProgress) => set({ scrollProgress }),
  setActiveSection: (activeSection) => set({ activeSection }),
}))
