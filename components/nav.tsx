'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Menu, X } from 'lucide-react'
import { useLenis } from 'lenis/react'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { label: 'GitHub', href: 'https://github.com/zxc0dev', external: true },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/pavlo-popovych', external: true },
  { label: 'Email', href: 'mailto:pavlo.v.popovych@outlook.com', external: false },
]

export function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const lenis = useLenis()

  const scrollTo = (id: string) => {
    setMobileOpen(false)
    const el = document.getElementById(id)
    if (el && lenis) lenis.scrollTo(el, { offset: -92 })
  }

  return (
    <nav className="fixed inset-x-0 top-0 z-100 py-4">
      <div className="mx-auto flex min-h-[44px] max-w-[1360px] items-center gap-[clamp(16px,2.5vw,28px)] px-[clamp(20px,4vw,48px)]">
        {/* Logo */}
        <button
          onClick={() => scrollTo('hero')}
          className="shrink-0 rounded-lg font-mono text-[1.1rem] font-bold tracking-[-0.02em] text-foreground transition-transform duration-[280ms] ease-out-expo hover:-translate-y-0.5 cursor-pointer"
        >
          <span className="text-gradient">&lt;</span>
          zxc0
          <span className="text-accent">.</span>
          dev
          <span className="text-gradient">/&gt;</span>
        </button>

        {/* Center links — desktop */}
        <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-[clamp(26px,5.2vw,64px)] md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="group relative py-2 text-[0.9rem] font-medium leading-none tracking-[0.04em] text-secondary transition-colors duration-[280ms] hover:text-foreground"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 h-[1.5px] w-0 rounded-full bg-gradient-to-r from-foreground to-accent-3 transition-all duration-[280ms] ease-out-expo group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        {/* Right — resume */}
        <a
          href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/pavlo_popovych_data_analyst_resume.pdf`}
          download
          className="group relative ml-auto hidden py-2 text-[0.9rem] font-medium leading-none tracking-[0.04em] text-secondary transition-colors duration-[280ms] hover:text-foreground md:inline-flex"
        >
          Resume
          <span className="absolute bottom-0 left-0 h-[1.5px] w-0 rounded-full bg-gradient-to-r from-foreground to-accent-3 transition-all duration-[280ms] ease-out-expo group-hover:w-full" />
        </a>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={cn(
            'ml-auto flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-[10px] md:hidden',
            'border border-border bg-elevated shadow-[0_8px_20px_rgba(0,0,0,0.16)]',
            'transition-all duration-[180ms] cursor-pointer',
            'hover:bg-white/[0.03] hover:border-transparent',
            'gradient-border',
          )}
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="mx-4 mt-2 rounded-md border border-border bg-elevated/95 p-4 shadow-elevated backdrop-blur-2xl md:hidden"
          >
            <div className="flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="rounded-sm px-3 py-2 text-[0.9rem] font-medium text-secondary transition-colors hover:bg-white/[0.04] hover:text-foreground"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <a
                href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/pavlo_popovych_data_analyst_resume.pdf`}
                download
                className="rounded-sm px-3 py-2 text-[0.9rem] font-medium text-secondary transition-colors hover:bg-white/[0.04] hover:text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                Resume
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
