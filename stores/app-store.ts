import { create } from 'zustand'

interface AppState {
  scrollProgress: number
  isScrolling: boolean
  activeSection: string
  mobileMenuOpen: boolean
  backToTopVisible: boolean
  setScrollProgress: (progress: number) => void
  setIsScrolling: (scrolling: boolean) => void
  setActiveSection: (section: string) => void
  setMobileMenuOpen: (open: boolean) => void
  setBackToTopVisible: (visible: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  scrollProgress: 0,
  isScrolling: false,
  activeSection: 'hero',
  mobileMenuOpen: false,
  backToTopVisible: false,
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
  setIsScrolling: (scrolling) => set({ isScrolling: scrolling }),
  setActiveSection: (section) => set({ activeSection: section }),
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  setBackToTopVisible: (visible) => set({ backToTopVisible: visible }),
}))
