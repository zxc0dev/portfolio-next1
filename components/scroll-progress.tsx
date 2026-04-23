'use client'

import { useAppStore } from '@/stores/app-store'

export function ScrollProgress() {
  const progress = useAppStore((s) => s.scrollProgress)

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 z-[200] h-0.5 opacity-80"
      style={{
        width: `${progress * 100}%`,
        background: 'linear-gradient(135deg, #ffffff 0%, rgba(242,242,242,0.85) 48%, rgba(242,242,242,0.7) 100%)',
        transform: 'translateZ(0)',
      }}
    />
  )
}
