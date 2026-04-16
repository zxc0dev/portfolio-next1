import { create } from 'zustand'

interface UIState {
  activeSection: string
  mobileMenuOpen: boolean
  backToTopVisible: boolean
  setActiveSection: (section: string) => void
  setMobileMenuOpen: (open: boolean) => void
  setBackToTopVisible: (visible: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
  activeSection: 'hero',
  mobileMenuOpen: false,
  backToTopVisible: false,
  setActiveSection: (section) => set({ activeSection: section }),
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  setBackToTopVisible: (visible) => set({ backToTopVisible: visible }),
}))
