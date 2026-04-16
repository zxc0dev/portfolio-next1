'use client'

import { useEffect } from 'react'

export function InteractionLock() {
  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (e.button === 1) e.preventDefault()
    }

    const onSelectStart = (e: Event) => {
      const t = e.target as HTMLElement
      if (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable) return
      e.preventDefault()
    }

    const onDragStart = (e: DragEvent) => {
      e.preventDefault()
    }

    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('selectstart', onSelectStart)
    document.addEventListener('dragstart', onDragStart)

    return () => {
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('selectstart', onSelectStart)
      document.removeEventListener('dragstart', onDragStart)
    }
  }, [])

  return null
}
