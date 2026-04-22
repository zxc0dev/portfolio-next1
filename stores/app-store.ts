import { create } from 'zustand'

interface AppState {
  scrollProgress: number
  isScrolling: boolean
  activeSection: string
  mobileMenuOpen: boolean
  setScrollProgress: (progress: number) => void
  setIsScrolling: (scrolling: boolean) => void
  setActiveSection: (section: string) => void
  setMobileMenuOpen: (open: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  scrollProgress: 0,
  isScrolling: false,
  activeSection: 'hero',
  mobileMenuOpen: false,
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
  setIsScrolling: (scrolling) => set({ isScrolling: scrolling }),
  setActiveSection: (section) => set({ activeSection: section }),
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
}))
