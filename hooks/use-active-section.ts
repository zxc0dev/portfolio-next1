'use client'

import { useEffect } from 'react'
import { useAppStore } from '@/stores/app-store'

const SECTIONS = [
  'hero',
  'about',
  'projects',
  'experience',
  'education',
  'contact',
]

export function useActiveSection() {
  const setActiveSection = useAppStore((s) => s.setActiveSection)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting)
        if (visible) {
          setActiveSection(visible.target.id)
        }
      },
      { rootMargin: '-40% 0px -40% 0px' },
    )

    SECTIONS.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [setActiveSection])
}
