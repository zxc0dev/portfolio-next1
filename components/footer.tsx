'use client'

import { Github, Linkedin, Mail, LayoutGrid, Briefcase, User, GraduationCap } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { useLenis } from 'lenis/react'
import { useAppStore } from '@/stores/app-store'
import { cn } from '@/lib/utils'

const MediumIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M3 6h3l3.3 8L12.6 6h3L13 18h-2.7L7.5 10.9V18H5V6zm11 2h2v10h-2V8zm4 1.5h2V18h-2V9.5z" />
  </svg>
)

const NAV_LINKS = [
  { label: 'About Me', id: 'about', icon: User },
  { label: 'Projects', id: 'projects', icon: LayoutGrid },
  { label: 'Experience', id: 'experience', icon: Briefcase },
  { label: 'Certifications', id: 'education', icon: GraduationCap },
]

const SOCIAL_LINKS = [
  { label: 'GitHub', href: 'https://github.com/zxc0dev', icon: Github },
  { label: 'Medium', href: 'https://medium.com/@zxrcodev', icon: MediumIcon },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/pavlo-popovych', icon: Linkedin },
  { label: 'Email', href: 'mailto:pavlo.v.popovych@outlook.com', icon: Mail },
]

export function Footer() {
  const lenis = useLenis()
  const activeSection = useAppStore((s) => s.activeSection)

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el && lenis) lenis.scrollTo(el, { offset: -92 })
  }

  return (
    <footer className="relative overflow-hidden bg-[linear-gradient(180deg,rgba(0,0,0,0.35)_0%,rgba(0,0,0,0.35)_100%)]">
      {/* Top border */}
      <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent_6%,rgba(242,242,242,0.09)_30%,rgba(242,242,242,0.12)_50%,rgba(242,242,242,0.09)_70%,transparent_94%)]" />

      <div className="relative z-1 mx-auto max-w-[1360px] px-[clamp(20px,4vw,48px)] pt-20 pb-8 max-md:pt-14 max-md:pb-6">
        <div className="mb-12 grid grid-cols-[1.4fr_1fr_1fr] items-start gap-12 max-md:grid-cols-1 max-md:gap-9 max-md:mb-9">
          {/* Brand */}
          <Reveal>
            <div className="max-w-[340px]">
              <button
                onClick={() => lenis?.scrollTo(0, { duration: 1.2 })}
                aria-label="Scroll to top"
                className="inline-block rounded-lg font-mono text-[1.1rem] font-bold tracking-[-0.02em] text-foreground transition-transform duration-[280ms] ease-out-expo hover:-translate-y-0.5 cursor-pointer"
              >
                <span className="text-gradient">&lt;</span>
                zxc0
                <span className="text-accent">.</span>
                dev
                <span className="text-gradient">/&gt;</span>
              </button>
              <p className="mt-3.5 text-[0.97rem] leading-[1.7] text-muted opacity-62">
                Turning data noise into clarity.
              </p>
            </div>
          </Reveal>

          {/* Navigate */}
          <Reveal delay={0.04}>
            <div>
              <h4 className="text-gradient relative mb-[18px] pb-2.5 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-6 after:rounded-full after:bg-[var(--gradient)] after:opacity-50">
                Navigate
              </h4>
              <ul className="flex flex-col gap-2.5 list-none">
                {NAV_LINKS.map((link) => {
                  const active = activeSection === link.id
                  return (
                    <li key={link.id}>
                      <button
                        onClick={() => scrollTo(link.id)}
                        className={cn(
                          'group inline-flex items-center gap-[7px] rounded-lg text-[0.89rem] font-normal leading-[1.25] transition-all duration-[180ms] hover:translate-x-0.5 cursor-pointer',
                          active ? 'text-white' : 'text-secondary hover:text-white/98',
                        )}
                      >
                        <link.icon
                          className={cn(
                            'h-[15px] w-[15px] shrink-0 transition-all duration-300',
                            active
                              ? 'opacity-100 text-accent'
                              : 'opacity-50 group-hover:text-accent group-hover:opacity-100',
                          )}
                        />
                        {link.label}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          </Reveal>

          {/* Find me */}
          <Reveal delay={0.08}>
            <div>
              <h4 className="text-gradient relative mb-[18px] pb-2.5 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-6 after:rounded-full after:bg-[var(--gradient)] after:opacity-50">
                Find me
              </h4>
              <ul className="flex flex-col gap-2.5 list-none">
                {SOCIAL_LINKS.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.href.startsWith('mailto') ? undefined : '_blank'}
                      rel={link.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                      className="group inline-flex items-center gap-[7px] rounded-lg text-[0.89rem] font-normal leading-[1.25] text-secondary transition-all duration-[180ms] hover:translate-x-0.5 hover:text-white/98"
                    >
                      <link.icon className="h-[15px] w-[15px] shrink-0 opacity-50 transition-all duration-300 group-hover:text-accent group-hover:opacity-100" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        {/* Bottom bar */}
        <Reveal delay={0.1}>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border-subtle pt-6">
            <p className="font-mono text-[0.73rem] tracking-[0.04em] text-muted opacity-50">
              &copy; {new Date().getFullYear()} Pavlo Popovych. All rights reserved.
            </p>
            <p className="font-mono text-[0.74rem] text-muted opacity-50">
              Built with precision &amp; care
            </p>
          </div>
        </Reveal>
      </div>
    </footer>
  )
}
