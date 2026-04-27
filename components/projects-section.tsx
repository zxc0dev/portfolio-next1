import type { ComponentType } from 'react'
import { Github, ExternalLink, Construction } from 'lucide-react'
import { SectionHeader } from '@/components/section-header'
import { Reveal } from '@/components/reveal'
import { TerminalQuery } from '@/components/terminal-query'
import { ErrorBoundary } from '@/components/error-boundary'
import { projects } from '@/data/projects'
import { ChurnDashboard } from '@/components/churn/lazy-dashboard'
import { RfmDashboard } from '@/components/rfm/lazy-dashboard'

type DashboardComponent = ComponentType<{ why?: string }>

const DASHBOARD_MAP: Record<string, DashboardComponent> = {
  churn: ChurnDashboard as DashboardComponent,
  rfm: RfmDashboard as DashboardComponent,
}

const SQL_NAMES: Record<string, string> = {
  profesia: 'job_market_intelligence',
  covid:    'covid_global_impact',
  rfm:      'customer_rfm_segmentation',
  churn:    'telecom_churn_prediction',
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
            const sqlName = SQL_NAMES[project.slug] ?? project.slug
            const query = `SELECT * FROM projects\n            WHERE name = '${sqlName}';`
            return (
            <TerminalQuery
              key={project.slug}
              query={query}
              rowsText="1 row returned"
              className="py-[clamp(48px,5vw,72px)] first:pt-0"
            >
            <article>
              {/* Row 1: Title + Buttons */}
              <Reveal>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3
                      className="font-bold leading-[1.28] tracking-[-0.025em] text-wrap-balance"
                      style={{ fontSize: 'clamp(1.6rem, 1.3vw + 0.85rem, 1.96rem)' }}
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
                    <ErrorBoundary label={project.title}>
                      <Dashboard why={project.why} />
                    </ErrorBoundary>
                  </div>
                </Reveal>
              )}

              {/* Row 3: Metadata — full width */}
              <Reveal delay={0.06}>
                <dl className="mt-6 flex flex-col gap-0">
                  <div className="font-mono text-[0.78rem] uppercase tracking-[0.13em] leading-[2]">
                    <span className="text-muted">Stack&ensp;</span>
                    <span className="text-foreground font-semibold">{project.tags.join(', ')}</span>
                  </div>
                  {project.dataset && (
                    <div className="font-mono text-[0.78rem] uppercase tracking-[0.13em] leading-[2]">
                      <span className="text-muted">Data&ensp;</span>
                      <span className="text-foreground font-semibold">{project.dataset}</span>
                    </div>
                  )}
                  {project.dateRange && (
                    <div className="font-mono text-[0.78rem] uppercase tracking-[0.13em] leading-[2]">
                      <span className="text-muted">Date&ensp;</span>
                      <span className="text-foreground font-semibold">{project.dateRange}</span>
                    </div>
                  )}
                </dl>
              </Reveal>
            </article>
            </TerminalQuery>
            )
          })}
        </div>
      </div>
    </section>
  )
}
