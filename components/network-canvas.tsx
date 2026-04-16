'use client'

import { useEffect, useRef } from 'react'

export function NetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let cleanup: (() => void) | undefined

    const basePath = process.env.NODE_ENV === 'production' ? '/portfolio-next1' : ''
    import('@/lib/network-canvas').then(({ initNetworkCanvas }) => {
      if (!canvasRef.current) return
      cleanup = initNetworkCanvas(canvasRef.current, '#hero', basePath)
    })

    return () => {
      cleanup?.()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed -top-px -left-px z-0 pointer-events-none"
      style={{
        width: 'calc(100vw + 2px)',
        height: 'calc(100dvh + 2px)',
        opacity: 0.992,
        filter: 'contrast(1.075) saturate(1.05) brightness(1.015)',
        transform: 'translateZ(0)',
      }}
    />
  )
}
