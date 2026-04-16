'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

export function Loader() {
  const overlayRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const pctRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)
  const doneRef = useRef(false)

  const dismiss = useCallback(() => {
    if (doneRef.current) return
    doneRef.current = true

    let progress = barRef.current
      ? parseFloat(barRef.current.style.width) || 0
      : 0

    function step() {
      progress += (100 - progress) * 0.24
      if (progress >= 99.4) {
        progress = 100
        if (barRef.current) barRef.current.style.width = '100%'
        if (pctRef.current) pctRef.current.textContent = '100 %'

        setTimeout(() => {
          contentRef.current?.classList.add('loader-content-exit')
          setTimeout(() => {
            overlayRef.current?.classList.add('loader-exit')
            // Dispatch network-intro event for canvas
            window.dispatchEvent(new CustomEvent('network-intro:start'))
            // Scroll to top
            window.scrollTo(0, 0)
            setTimeout(() => setVisible(false), 700)
          }, 400)
        }, 240)
        return
      }
      if (barRef.current) barRef.current.style.width = progress + '%'
      if (pctRef.current) pctRef.current.textContent = Math.round(progress) + ' %'
      requestAnimationFrame(step)
    }
    step()
  }, [])

  useEffect(() => {
    // Only show loader on first visit or page refresh, not client-side navigation
    const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
    const isReload = navEntry?.type === 'reload'
    const isFirstVisit = !sessionStorage.getItem('portfolio-loaded')

    if (!isReload && !isFirstVisit) {
      setVisible(false)
      window.dispatchEvent(new CustomEvent('network-intro:start'))
      return
    }

    sessionStorage.setItem('portfolio-loaded', '1')

    // Always scroll to top on load
    window.scrollTo(0, 0)

    const startMs = performance.now()
    const minShow = 150
    let progress = 0
    let tickDone = false

    function tick() {
      if (doneRef.current || progress >= 85) return
      const rem = 85 - progress
      progress = Math.min(progress + Math.random() * rem * 0.35 + 2.5, 85)
      if (barRef.current) barRef.current.style.width = progress + '%'
      if (pctRef.current) pctRef.current.textContent = Math.round(progress) + ' %'
      setTimeout(tick, 40 + Math.random() * 30)
    }
    setTimeout(tick, 30)

    function finish() {
      if (tickDone) return
      tickDone = true
      const elapsed = performance.now() - startMs
      const wait = Math.max(0, minShow - elapsed)
      setTimeout(dismiss, wait)
    }

    const fontReady =
      typeof document.fonts !== 'undefined' && document.fonts.ready
        ? document.fonts.ready
        : Promise.resolve()

    Promise.all([
      new Promise<void>((resolve) =>
        window.addEventListener('load', () => resolve(), { once: true }),
      ),
      fontReady,
    ]).then(finish)

    // Fallback timeout
    const fallback = setTimeout(dismiss, 2500)
    return () => clearTimeout(fallback)
  }, [dismiss])

  if (!visible) return null

  return (
    <div
      ref={overlayRef}
      className="loader-overlay fixed inset-0 z-[10000] flex items-center justify-center bg-background"
      style={{
        backgroundImage:
          'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)',
      }}
    >
      {/* Ambient pulse */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,rgba(242,242,242,0.06)_0%,rgba(242,242,242,0.025)_35%,rgba(242,242,242,0.008)_55%,transparent_72%)] animate-[loaderAmbientPulse_3s_ease-in-out_infinite_alternate]" />

      <div
        ref={contentRef}
        className="flex flex-col items-center gap-9 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
      >
        {/* Logo wrap with spinning ring */}
        <div className="relative flex h-[150px] w-[150px] items-center justify-center">
          {/* Ring */}
          <div className="absolute inset-0 animate-[loaderRingSpin_3.5s_linear_infinite]">
            <svg className="h-full w-full" viewBox="0 0 140 140">
              <defs>
                <linearGradient
                  id="loaderGrad"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="48%" stopColor="#CCCCCC" />
                  <stop offset="100%" stopColor="#999999" />
                </linearGradient>
              </defs>
              <circle
                cx="70"
                cy="70"
                r="62"
                fill="none"
                stroke="rgba(255,255,255,0.03)"
                strokeWidth="1.5"
              />
              <circle
                cx="70"
                cy="70"
                r="62"
                fill="none"
                stroke="url(#loaderGrad)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray="120 280"
                strokeDashoffset="0"
                style={{ filter: 'drop-shadow(0 0 6px rgba(242,242,242,0.35))' }}
              />
            </svg>
          </div>

          {/* Orbiting particles */}
          <div className="absolute inset-2 animate-[loaderOrbitSpin_7s_linear_infinite]">
            <span className="absolute top-0 left-1/2 h-[5px] w-[5px] -translate-x-1/2 rounded-full bg-accent shadow-[0_0_12px_rgba(242,242,242,0.7),0_0_3px_rgba(242,242,242,0.9)]" />
            <span className="absolute right-[6%] bottom-[12%] h-[3.5px] w-[3.5px] rounded-full bg-accent-2 shadow-[0_0_9px_rgba(242,242,242,0.55)]" />
            <span className="absolute bottom-[12%] left-[6%] h-[2.5px] w-[2.5px] rounded-full bg-accent-3 shadow-[0_0_7px_rgba(242,242,242,0.45)]" />
          </div>

          {/* Logo */}
          <span className="relative z-1 font-mono text-[1.24rem] font-bold tracking-[-0.02em] text-foreground animate-[loaderLogoBreathe_2.8s_ease-in-out_infinite]">
            <span className="text-gradient">&lt;</span>
            zxrc0<span className="text-accent">.</span>dev
            <span className="text-gradient">/&gt;</span>
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-[220px] h-[3px] rounded-[3px] bg-white/5 overflow-hidden shadow-[0_0_20px_rgba(242,242,242,0.04)]">
          <div
            ref={barRef}
            className="h-full w-0 rounded-[3px] bg-[var(--gradient)] transition-[width] duration-[220ms] ease-[cubic-bezier(0.16,1,0.3,1)] relative shadow-[0_0_12px_rgba(242,242,242,0.3),0_0_4px_rgba(242,242,242,0.2)]"
          >
            <span className="absolute -top-px right-0 h-[calc(100%+2px)] w-[60px] rounded-[3px] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),rgba(242,242,242,0.2))] blur-[1px]" />
          </div>
        </div>

        {/* Percentage */}
        <div
          ref={pctRef}
          className="font-mono text-[0.74rem] tracking-[0.22em] text-muted opacity-70 tabular-nums"
        >
          0 %
        </div>
      </div>
    </div>
  )
}
