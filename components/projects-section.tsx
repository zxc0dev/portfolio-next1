import type { ComponentType } from 'react'
import { Github, ExternalLink, Construction } from 'lucide-react'
import { SectionHeader } from '@/components/section-header'
import { Reveal } from '@/components/reveal'
import { projects } from '@/data/projects'
import { ChurnDashboard } from '@/components/churn/lazy-dashboard'

const DASHBOARD_MAP: Record<string, ComponentType> = {
  churn: ChurnDashboard,
}

export function ProjectsSection() {
  return (
    <section
      id="projects"
      className="relative py-[clamp(100px,12vw,160px)] scroll-mt-[92px]"
    >
      <div className="mx-auto max-w-[1360px] px-[clamp(20px,4vw,48px)]">
        <SectionHeader
          number="02"
          title="Projects"
          subtitle="Selected work"
          className="mb-[clamp(20px,2.5vw,32px)]"
        />

        <div className="ml-[42px] flex flex-col divide-y divide-border/60 max-md:ml-0">
          {projects.map((project) => {
            const Dashboard = DASHBOARD_MAP[project.slug]
            return (
            <article key={project.slug} className="py-[clamp(48px,5vw,72px)] first:pt-0">
              {/* Row 1: Title + Buttons */}
              <Reveal>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3
                      className="font-bold leading-[1.32] tracking-[-0.025em] text-wrap-balance"
                      style={{ fontSize: 'clamp(1.8rem, 1.7vw + 1.1rem, 2.13rem)' }}
                    >
                      {project.title}
                    </h3>
                    {project.isWip && (
                      <span className="inline-flex items-center gap-1.5 rounded-pill border border-warning/30 bg-warning/[0.08] px-3 py-1 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-warning">
                        <Construction className="h-3 w-3" />
                        In Progress
                      </span>
                    )}
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-1.5 font-mono text-[0.78rem] tracking-[0.04em] text-foreground transition-all duration-[220ms] ease-out-expo"
                      >
                        <Github className="h-[14px] w-[14px] opacity-70 transition-opacity duration-[180ms] group-hover:opacity-100" />
                        <span className="border-b border-white/0 transition-[border-color] duration-[220ms] group-hover:border-white/30">View on GitHub</span>
                        <ExternalLink className="h-[11px] w-[11px] opacity-0 -translate-y-px translate-x-[-2px] transition-all duration-[180ms] group-hover:opacity-60 group-hover:translate-x-0" />
                      </a>
                    )}
                  </div>
                </div>
              </Reveal>

              {/* Row 2: Live Dashboard */}
              {Dashboard && (
                <Reveal delay={0.04}>
                  <div className="mt-5">
                    <Dashboard />
                  </div>
                </Reveal>
              )}

              {/* Row 3: Tech Stack + Date  |  Description */}
              <Reveal delay={0.06}>
                <div className="mt-8 grid grid-cols-[340px_1fr] items-start gap-[clamp(60px,12vw,144px)] max-md:grid-cols-1">
                  {/* Left: stack + date */}
                  <dl className="grid grid-cols-[80px_1fr] gap-x-6 gap-y-2.5 items-baseline">
                    <dt className="font-mono text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-muted">Stack</dt>
                    <dd className="m-0 text-[0.95rem] font-medium leading-[1.7] text-secondary">{project.tags.join(', ')}</dd>
                    {project.dataset && (<>
                      <dt className="font-mono text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-muted">Dataset</dt>
                      <dd className="m-0 text-[0.95rem] font-medium leading-[1.7] text-secondary">{project.dataset}</dd>
                    </>)}
                    {project.dateRange && (<>
                      <dt className="font-mono text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-muted">Date</dt>
                      <dd className="m-0 text-[0.95rem] font-medium leading-[1.7] text-secondary">{project.dateRange}</dd>
                    </>)}
                  </dl>

                  {/* Right: description */}
                  <div className="pt-1">
                    {project.description ? (
                      <p className="text-[1.05rem] leading-[1.72] text-secondary text-wrap-pretty">
                        {project.description}
                      </p>
                    ) : (
                      <p className="text-[1.05rem] leading-[1.72] text-muted/50 italic">
                        Description coming soon.
                      </p>
                    )}
                  </div>
                </div>
              </Reveal>
            </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
