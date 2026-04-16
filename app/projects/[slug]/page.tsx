import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Github, Lock } from 'lucide-react'
import type { Metadata } from 'next'
import { projects } from '@/data/projects'
import { ButtonLink } from '@/components/ui/button'
import { Nav } from '@/components/nav'
import { Footer } from '@/components/footer'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)
  if (!project) return {}
  return {
    title: `${project.title} | Pavlo Popovych`,
    description: project.summary?.[0]?.text ?? project.steps[2]?.text ?? '',
  }
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)
  if (!project) notFound()

  return (
    <>
      <Nav />
      <main className="flex-1 min-h-svh pt-[140px] pb-[clamp(80px,10vw,120px)]">
        <div className="mx-auto max-w-[1360px] px-[clamp(20px,4vw,48px)]">
          {/* Back link */}
          <Link
            href="/#projects"
            className="group mb-10 inline-flex items-center gap-2 rounded-lg text-[0.9rem] font-medium text-muted transition-colors duration-[280ms] hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-[280ms] group-hover:-translate-x-1" />
            Back to projects
          </Link>

          {/* Header */}
          <header className="mb-12">
            <h1
              className="mb-4 max-w-[28ch] font-bold leading-[1.12] tracking-[-0.025em]"
              style={{ fontSize: 'clamp(2rem, 3vw + 1rem, 2.8rem)' }}
            >
              {project.title}
            </h1>

            {/* Tags */}
            <div className="mb-6 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-pill border border-white/9 bg-white/[0.055] px-3 py-1.5 font-mono text-[0.69rem] tracking-[0.02em] text-white/84"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Links */}
            <div className="flex items-center gap-3">
              {project.githubUrl && !project.isConfidential && (
                <ButtonLink
                  variant="ghost"
                  size="default"
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="h-4 w-4" />
                  View full project
                </ButtonLink>
              )}
              {project.isConfidential && (
                <span className="inline-flex items-center gap-2 rounded-sm border border-white/7 bg-white/[0.01] px-[11px] py-2.5 text-[0.72rem] font-semibold tracking-[0.025em] text-white/50">
                  <Lock className="h-[15px] w-[15px] opacity-60" />
                  Client Project — Code is confidential
                </span>
              )}
            </div>
          </header>

          {/* Image */}
          <div className="relative mb-14 aspect-video max-w-[900px] overflow-hidden rounded-lg border border-border bg-black/35 shadow-elevated">
            <Image
              src={project.image}
              alt={project.imageAlt}
              fill
              sizes="(max-width: 900px) 100vw, 900px"
              className="object-cover"
              priority
            />
          </div>

          {/* Steps */}
          <div className="relative mb-14 ml-5 pl-8 max-w-[700px] max-md:ml-0 max-md:pl-6">
            <div className="absolute top-2 bottom-2 left-0 w-0.5 rounded-full bg-gradient-to-b from-white/14 via-white/22 to-white/14" />
            {project.steps.map((step, idx) => (
              <div key={step.label} className="relative mb-6 last:mb-0">
                <span
                  className={`absolute -left-[34px] top-[10px] h-2.5 w-2.5 rounded-full ${
                    idx === 2
                      ? 'bg-foreground shadow-[0_0_6px_rgba(242,242,242,0.25)]'
                      : 'border-[1.5px] border-white/35 bg-background'
                  }`}
                />
                <span
                  className={`mb-1.5 block font-mono text-[0.72rem] font-semibold uppercase tracking-[0.16em] ${
                    idx === 2 ? 'text-gradient' : 'text-white/65'
                  }`}
                >
                  {step.label}
                </span>
                <p className="text-[1.12rem] leading-[1.72] text-foreground text-wrap-pretty">
                  {step.text}
                </p>
              </div>
            ))}
          </div>

          {/* Summary */}
          {project.summary && project.summary.length > 0 && (
            <div className="max-w-[700px]">
              <h2 className="mb-6 text-[1.5rem] font-bold tracking-[-0.02em]">Summary</h2>
              <div className="flex flex-col gap-6">
                {project.summary.map((item, idx) => (
                  <div key={idx}>
                    <h3 className="mb-2 text-[1.1rem] font-semibold tracking-[-0.01em] text-foreground">
                      {item.heading}
                    </h3>
                    <p className="text-[1.08rem] leading-[1.78] text-foreground text-wrap-pretty">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
