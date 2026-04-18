'use client'

import dynamic from 'next/dynamic'
import { Github, Lock, ExternalLink } from 'lucide-react'
import { SectionHeader } from '@/components/section-header'
import { Reveal } from '@/components/reveal'
import { cn } from '@/lib/utils'
import { projects } from '@/data/projects'

const ChurnDashboard = dynamic(
  () => import('@/components/churn-dashboard').then((m) => m.ChurnDashboard),
  { ssr: false, loading: () => (
    <div className="flex min-h-[400px] items-center justify-center">
      <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-white/20">
        Loading dashboard…
      </span>
    </div>
  ) },
)

const DASHBOARD_MAP: Record<string, React.ComponentType> = {
  churn: ChurnDashboard,
}

export function ProjectsSection() {
  return (
    <section
      id="projects"
      className="section-divider relative bg-surface-alt py-[clamp(100px,12vw,160px)] scroll-mt-[92px]"
    >
      <div className="mx-auto max-w-[1360px] px-[clamp(20px,4vw,48px)]">
        <SectionHeader
          number="01"
          title="Projects"
          subtitle="Selected work"
          className="mb-[clamp(20px,2.5vw,32px)]"
        />

        <div className="ml-[42px] flex flex-col max-md:ml-0">
          {projects.map((project, idx) => (
            <article
              key={project.slug}
              className={cn(
                'border-b border-border-subtle py-[clamp(28px,3vw,40px)]',
                idx === 0 && 'pt-0',
                idx === projects.length - 1 && 'border-b-0',
              )}
            >
              {/* Row 1: Title + Buttons */}
              <Reveal>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3
                  className="font-bold leading-[1.32] tracking-[-0.025em] text-wrap-balance"
                  style={{ fontSize: 'clamp(1.38rem, 1.3vw + 0.9rem, 1.64rem)' }}
                >
                  {project.title}
                </h3>
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  {project.githubUrl && !project.isConfidential && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 rounded-md border border-border bg-white/[0.012] px-3.5 py-2.5 font-mono text-[0.72rem] font-[560] tracking-[0.02em] text-secondary transition-all duration-[220ms] ease-out-expo gradient-border hover:text-foreground hover:bg-white/[0.026] hover:-translate-y-px hover:border-border-hover hover:shadow-[0_4px_10px_rgba(242,242,242,0.08)]"
                    >
                      <Github className="h-[15px] w-[15px]" />
                      <span>View on GitHub</span>
                      <ExternalLink className="h-3 w-3 opacity-40 transition-opacity duration-[180ms] group-hover:opacity-75" />
                    </a>
                  )}
                  {project.isConfidential && (
                    <span className="inline-flex cursor-not-allowed items-center gap-2 rounded-sm border border-white/7 bg-white/[0.01] px-[11px] py-2.5 font-mono text-[0.72rem] font-semibold tracking-[0.025em] text-white/50 gradient-border">
                      <Lock className="h-[15px] w-[15px] opacity-60" />
                      <span>Client Project</span>
                    </span>
                  )}
                </div>
              </div>
              </Reveal>

              {/* Row 2: Live Dashboard */}
              {(() => {
                const Dashboard = DASHBOARD_MAP[project.slug]
                return Dashboard ? (
                  <Reveal delay={0.04}>
                  <div className="mt-5">
                    <Dashboard />
                  </div>
                  </Reveal>
                ) : (
                  <Reveal delay={0.04}>
                  <div className="mt-5 flex min-h-[400px] items-center justify-center rounded-lg border border-border-subtle bg-white/[0.018]">
                    <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-white/20">
                      Live Dashboard
                    </span>
                  </div>
                  </Reveal>
                )
              })()}

              {/* Row 3: Tech Stack + Date  |  Description */}
              <Reveal delay={0.06}>
              <div className="mt-8 grid grid-cols-[340px_1fr] items-start gap-[clamp(60px,12vw,144px)] max-md:grid-cols-1">
                {/* Left: stack + date */}
                <div className="flex flex-col gap-3.5">
                  <div className="flex items-baseline gap-3">
                    <span className="shrink-0 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.15em] text-white/35">
                      Tech Stack
                    </span>
                    <p className="text-[0.92rem] leading-[1.7] text-foreground">
                      {project.tags.join(', ')}
                    </p>
                  </div>
                  {project.dataset && (
                    <div className="flex items-baseline gap-3">
                      <span className="shrink-0 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.15em] text-white/35">
                        Dataset
                      </span>
                      <p className="text-[0.92rem] leading-[1.7] text-foreground">
                        {project.dataset}
                      </p>
                    </div>
                  )}
                  {project.dateRange && (
                    <div className="flex items-baseline gap-3">
                      <span className="shrink-0 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.15em] text-muted opacity-72">
                        Date
                      </span>
                      <p className="font-mono text-[0.82rem] tabular-nums text-foreground">
                        {project.dateRange}
                      </p>
                    </div>
                  )}
                </div>

                {/* Right: description */}
                <div className="pt-1">
                  {project.description ? (
                    <p className="text-[1.08rem] leading-[1.72] text-secondary text-wrap-pretty">
                      {project.description}
                    </p>
                  ) : (
                    <p className="text-[1.08rem] leading-[1.72] text-white/22 italic">
                      Description coming soon.
                    </p>
                  )}
                </div>
              </div>
              </Reveal>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
