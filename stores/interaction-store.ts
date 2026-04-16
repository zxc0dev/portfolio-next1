import { create } from 'zustand'

interface InteractionState {
  scrollProgress: number
  isScrolling: boolean
  cursorPosition: { x: number; y: number }
  hoverTarget: string | null
  setScrollProgress: (progress: number) => void
  setIsScrolling: (scrolling: boolean) => void
  setCursorPosition: (pos: { x: number; y: number }) => void
  setHoverTarget: (target: string | null) => void
}

export const useInteractionStore = create<InteractionState>((set) => ({
  scrollProgress: 0,
  isScrolling: false,
  cursorPosition: { x: 0, y: 0 },
  hoverTarget: null,
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
  setIsScrolling: (scrolling) => set({ isScrolling: scrolling }),
  setCursorPosition: (pos) => set({ cursorPosition: pos }),
  setHoverTarget: (target) => set({ hoverTarget: target }),
}))
