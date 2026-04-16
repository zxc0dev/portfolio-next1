'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Github, Lock } from 'lucide-react'
import { motion } from 'framer-motion'
import { SectionHeader } from '@/components/section-header'
import { ButtonLink, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { projects } from '@/data/projects'
import { fadeUpChild } from '@/animations/variants'

function StepDot({ index }: { index: number }) {
  if (index === 2) {
    return (
      <span className="text-gradient absolute -left-[21px] top-[10px] h-2 w-2 rounded-full bg-foreground shadow-[0_0_6px_rgba(242,242,242,0.25)]" />
    )
  }
  return (
    <span
      className={cn(
        'absolute -left-[21px] top-[10px] h-2 w-2 rounded-full border-[1.5px] bg-background',
        index === 0 && 'border-white/35',
        index === 1 && 'border-white/50',
      )}
      style={
        index === 1
          ? { background: 'radial-gradient(circle, rgba(242,242,242,0.65) 30%, transparent 31%)' }
          : undefined
      }
    />
  )
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
            <motion.article
              key={project.slug}
              variants={fadeUpChild}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, margin: '-60px 0px -60px 0px' }}
              className={cn(
                'border-b border-border-subtle py-[clamp(28px,3vw,40px)]',
                idx === 0 && 'pt-0',
                idx === projects.length - 1 && 'border-b-0',
                project.isWip && 'opacity-55',
              )}
            >
              {/* Head: title + links */}
              <div className="mb-[18px] flex items-start justify-between gap-4">
                <h3
                  className="relative z-1 font-bold leading-[1.32] tracking-[-0.025em] text-wrap-balance"
                  style={{ fontSize: 'clamp(1.38rem, 1.3vw + 0.9rem, 1.64rem)' }}
                >
                  {project.title}
                </h3>
                <div className="ml-3 flex shrink-0 flex-wrap items-center gap-2">
                  <Link
                    href={`/projects/${project.slug}`}
                    className={cn(buttonVariants({ variant: 'chip', size: 'chip' }), 'no-underline')}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-[15px] w-[15px]"
                    >
                      <rect x="4" y="2" width="14" height="20" rx="2" />
                      <path d="M8 9h8M8 13h6" />
                    </svg>
                    <span>Short summary</span>
                  </Link>
                  {project.githubUrl && !project.isConfidential && (
                    <ButtonLink
                      variant="chip"
                      size="chip"
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="h-[15px] w-[15px]" />
                      <span>View full project</span>
                    </ButtonLink>
                  )}
                  {project.isConfidential && (
                    <span className="inline-flex items-center gap-2 rounded-sm border border-white/7 bg-white/[0.01] px-[11px] py-2.5 text-[0.72rem] font-semibold tracking-[0.025em] text-white/50 gradient-border cursor-not-allowed">
                      <Lock className="h-[15px] w-[15px] opacity-60" />
                      <span>Client Project</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Media + Steps */}
              <div className="mb-[22px] grid grid-cols-[minmax(0,5fr)_minmax(0,6fr)] items-stretch gap-8 max-md:grid-cols-1 max-md:gap-5">
                {/* Image */}
                <div className="relative aspect-video w-full max-w-[700px] self-start overflow-hidden rounded-md border border-border bg-black/35 shadow-[0_8px_32px_rgba(0,0,0,0.36),inset_0_1px_0_rgba(255,255,255,0.035)] transition-all duration-[280ms] ease-out-expo hover:border-border-hover hover:shadow-[0_12px_34px_rgba(0,0,0,0.4)]">
                  <Image
                    src={project.image}
                    alt={project.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 45vw"
                    className="object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Steps */}
                <div className="relative flex h-full flex-col gap-1 pl-[18px]">
                  <div className="absolute top-1.5 bottom-1.5 left-0 w-0.5 rounded-full bg-gradient-to-b from-white/12 via-white/22 to-white/12" />
                  {project.steps.map((step, stepIdx) => (
                    <div key={step.label} className="relative block">
                      <StepDot index={stepIdx} />
                      <span
                        className={cn(
                          'mb-1 block font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] leading-[1.15]',
                          stepIdx === 2 ? 'text-gradient' : 'text-white/65',
                        )}
                      >
                        {step.label}
                      </span>
                      <p className="mb-2.5 text-[1.08rem] leading-[1.72] text-secondary text-wrap-pretty">
                        {step.metric ? (
                          <>
                            {step.text.split(step.metric)[0]}
                            <strong className="text-gradient font-bold tabular-nums">
                              {step.metric}
                            </strong>
                            {step.text.split(step.metric)[1]}
                          </>
                        ) : (
                          step.text
                        )}
                      </p>
                    </div>
                  ))}

                  {/* Tags */}
                  <div className="flex flex-wrap items-center gap-2 border-t border-border-subtle pt-3.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-pill border border-white/9 bg-white/[0.055] px-3 py-1.5 font-mono text-[0.69rem] tracking-[0.02em] text-white/84 transition-all duration-[180ms] ease-out-expo hover:-translate-y-px hover:border-white/22 hover:bg-white/11 hover:text-white/96 hover:shadow-[0_6px_16px_rgba(242,242,242,0.1)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
