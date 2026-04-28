'use client'

import type { ComponentType } from 'react'
import { Github, ExternalLink, Construction } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { TerminalQuery } from '@/components/terminal-query'
import { ErrorBoundary } from '@/components/error-boundary'
import { projects } from '@/data/projects'
import { ChurnDashboard } from '@/components/churn/lazy-dashboard'
import { RfmDashboard } from '@/components/rfm/lazy-dashboard'
import { useAppStore } from '@/stores/app-store'
import { motion } from 'motion/react'
import { useState, useEffect } from 'react'
import { useLenis } from 'lenis/react'

type DashboardComponent = ComponentType

const DASHBOARD_MAP: Record<string, DashboardComponent> = {
  churn: ChurnDashboard as DashboardComponent,
  rfm:   RfmDashboard   as DashboardComponent,
}

const MONGO_NAMES: Record<string, string> = {
  profesia: 'job_market_intelligence',
  covid:    'covid_global_impact',
  rfm:      'customer_rfm_segmentation',
  churn:    'telecom_churn_prediction',
}

const MONGO_PROMPT   = '[zxc0dev@portfolio ~]$ '
const MONGO_DB_PROMPT = 'portfolio> '

export function ProjectsSection() {
  const certificatesDone = useAppStore((s) => s.certificatesDone)
  // 0 = nothing started; 1 = connection revealed (project[0] prompt visible);
  // 2 = project[0] revealed (project[1] prompt visible); etc.
  const [revealedCount, setRevealedCount] = useState(0)
  const advance = () => setRevealedCount((c) => c + 1)
  const lenis = useLenis()

  // Each time a new project mounts, the document height grows — force Lenis
  // to recalculate its scroll range so the user can scroll past it.
  useEffect(() => {
    if (revealedCount === 0) return
    requestAnimationFrame(() => requestAnimationFrame(() => lenis?.resize()))
  }, [revealedCount, lenis])

  if (!certificatesDone) return null

  return (
    <motion.section
      id="projects"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative py-[clamp(100px,12vw,160px)] scroll-mt-[92px]"
    >
      <div className="mx-auto max-w-[1360px] px-[clamp(20px,4vw,48px)]">

        {/* MongoDB connection */}
        <TerminalQuery
          query={`mongosh 'mongodb://zxc0dev:****@cluster.zxc0.dev:27017/portfolio'`}
          prompt={MONGO_PROMPT}
          onRevealed={advance}
          lockScroll
          compact
        >
          <div className="font-mono text-[0.78rem] leading-[1.85] text-muted">
            <div>
              {'Connecting to:    '}
              <span className="text-secondary">mongodb://cluster.zxc0.dev:27017/portfolio</span>
            </div>
            <div>
              {'Using MongoDB:    '}
              <span className="text-secondary">7.0.4</span>
            </div>
            <div>
              {'Using Mongosh:    '}
              <span className="text-secondary">2.1.1</span>
            </div>
          </div>
        </TerminalQuery>

        {/* Projects — each mounts only after the previous one reveals */}
        <div className="flex flex-col">
          {projects.map((project, index) => {
            if (revealedCount <= index) return null
            const Dashboard = DASHBOARD_MAP[project.slug]
            const mongoName = MONGO_NAMES[project.slug] ?? project.slug
            const query     = `db.projects.findOne({ project_name: "${mongoName}" })`
            return (
              <TerminalQuery
                key={project.slug}
                query={query}
                rowsText="1 document"
                prompt={MONGO_DB_PROMPT}
                onRevealed={advance}
                observerMargin="0px 0px -35% 0px"
                lockScroll
                className={index === 0 ? '' : 'pt-[clamp(48px,5vw,72px)] border-t border-border/60'}
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

                  {/* Row 2: Why + Metadata (side by side) */}
                  <Reveal delay={0.04}>
                    <div className="mt-6 grid grid-cols-[1fr_clamp(240px,30ch,360px)] items-start gap-[clamp(28px,4vw,56px)] max-md:grid-cols-1 max-md:gap-4">
                      {/* Why this project */}
                      {project.why && (
                        <div>
                          <span className="mb-1.5 block font-mono text-[0.67rem] font-semibold uppercase tracking-[0.14em] text-muted">
                            Why this project
                          </span>
                          <p className="text-[0.95rem] leading-[1.82] text-secondary">
                            {project.why}
                          </p>
                        </div>
                      )}

                      {/* Metadata — mono kv rows (stack.zx style) */}
                      <div className="border-l border-white/10 pl-[clamp(20px,3vw,40px)] max-md:border-l-0 max-md:pl-0 max-md:border-t max-md:border-white/10 max-md:pt-4">
                        <div className="font-mono text-[0.78rem] leading-[1.75]">
                          <div className="flex">
                            <span className="text-secondary shrink-0 min-w-[5rem]">stack</span>
                            <span className="text-foreground/30 mr-2">:</span>
                            <span className="text-muted">{project.tags.join(', ')}</span>
                          </div>
                          {project.dataset && (
                            <div className="flex">
                              <span className="text-secondary shrink-0 min-w-[5rem]">dataset</span>
                              <span className="text-foreground/30 mr-2">:</span>
                              <span className="text-muted">{project.dataset}</span>
                            </div>
                          )}
                          {project.dateRange && (
                            <div className="flex">
                              <span className="text-secondary shrink-0 min-w-[5rem]">period</span>
                              <span className="text-foreground/30 mr-2">:</span>
                              <span className="text-muted">{project.dateRange}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Reveal>

                  {/* Row 3: Live Dashboard */}
                  {Dashboard && (
                    <Reveal delay={0.08}>
                      <div className="mt-7">
                        <ErrorBoundary label={project.title}>
                          <Dashboard />
                        </ErrorBoundary>
                      </div>
                    </Reveal>
                  )}
                </article>
              </TerminalQuery>
            )
          })}
        </div>
      </div>
    </motion.section>
  )

}
