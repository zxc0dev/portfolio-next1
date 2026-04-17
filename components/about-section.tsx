'use client'

import { MapPin, Languages } from 'lucide-react'
import Balancer from 'react-wrap-balancer'
import { SectionHeader } from '@/components/section-header'
import { Reveal } from '@/components/reveal'

const STACK_GROUPS = [
  {
    label: 'Languages & Libraries',
    tags: ['Python', 'Pandas', 'NumPy', 'Scikit-learn', 'Matplotlib', 'Seaborn', 'SQL', 'VBA'],
  },
  {
    label: 'Platforms & Tools',
    tags: ['Power BI', 'dbt', 'Git', 'Linux', 'Excel', 'Power Query'],
  },
]

export function AboutSection() {
  return (
    <section
      id="about"
      className="section-divider relative bg-surface-alt py-[clamp(100px,12vw,160px)] scroll-mt-[92px]"
    >
      <div className="mx-auto max-w-[1360px] px-[clamp(20px,4vw,48px)]">
        <SectionHeader
          number="03"
          title="About Me"
          subtitle="How I work"
          className="mb-[clamp(20px,2.5vw,32px)]"
        />

        <div className="ml-[42px] grid grid-cols-[1fr_340px] items-start gap-[clamp(40px,5vw,64px)] max-lg:grid-cols-1 max-md:ml-0">
          {/* Prose */}
          <div className="flex flex-col">
            <Reveal>
              <div className="mb-6 flex flex-col gap-2.5">
                <h3
                  className="font-bold leading-[1.26] tracking-[-0.025em] text-foreground text-wrap-balance"
                  style={{ fontSize: 'clamp(1.66rem, 1.55vw + 1rem, 1.96rem)' }}
                >
                  <Balancer>
                    A data analyst who turns{' '}
                    <span className="text-gradient">complexity into clarity.</span>
                  </Balancer>
                </h3>
                <div className="flex flex-col items-start gap-1.5 font-mono text-[0.72rem] tracking-[0.06em]">
                  <span className="flex items-center gap-1.5 text-muted">
                    <MapPin className="h-3.5 w-3.5 shrink-0 opacity-88" />
                    Slovakia, EU
                  </span>
                  <span className="flex items-center gap-1.5 text-white/74">
                    <Languages className="h-3.5 w-3.5 shrink-0 opacity-88" />
                    <span className="text-wrap-pretty">
                      English (C1), Russian (Native), Ukrainian (Native), Slovak (A2)
                    </span>
                  </span>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.04}>
              <p className="mb-4 max-w-[68ch] text-[1.23rem] leading-[1.85] text-foreground">
                I am Pavlo and so to add I like data. I have 1.5+ years of on-site experience in electronics manufacturing at
                Foxconn, where I improved production-line pass rates and developed automation
                scripts that eliminated hours of manual work. That production-floor experience
                has sharpened the way I approach problems.
              </p>
            </Reveal>

          </div>

          {/* Stack */}
          <div className="flex flex-col gap-5 border-l border-white/10 pl-[clamp(28px,3.5vw,44px)] max-lg:border-l-0 max-lg:pl-0">
            <Reveal>
              <h3 className="text-[1.12rem] font-bold tracking-[-0.02em]">Core Stack</h3>
            </Reveal>
            {STACK_GROUPS.map((group, gIdx) => (
              <Reveal key={group.label} delay={(gIdx + 1) * 0.04}>
                <div>
                  {gIdx > 0 && <div className="my-4 h-px bg-border-subtle" />}
                  <span className="mb-2.5 block font-mono text-[0.68rem] font-semibold uppercase tracking-[0.15em] text-muted">
                    {group.label}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {group.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-pill border border-white/9 bg-white/[0.055] px-3 py-1.5 font-mono text-[0.69rem] tracking-[0.02em] text-white/84 transition-all duration-[180ms] ease-out-expo hover:-translate-y-px hover:border-white/22 hover:bg-white/11 hover:text-white/96 hover:shadow-[0_6px_16px_rgba(242,242,242,0.1)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
