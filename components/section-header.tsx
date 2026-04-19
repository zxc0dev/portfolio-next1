import { Reveal } from '@/components/reveal'
import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  number: string
  title: string
  subtitle: string
  className?: string
}

export function SectionHeader({ number, title, subtitle, className }: SectionHeaderProps) {
  return (
    <div className={cn('flex items-start gap-3.5', className)}>
      <Reveal>
        <span className="text-gradient shrink-0 w-8 pt-1 font-mono text-[0.9rem] font-bold tracking-[0.16em] opacity-72">
          {number}
        </span>
      </Reveal>
      <div className="flex flex-col gap-1.5">
        <Reveal delay={0.04}>
          <h2
            className="relative inline-block font-sans leading-[1.08] font-bold tracking-[-0.04em] text-wrap-balance"
            style={{ fontSize: 'clamp(2.2rem, 2.8vw + 1rem, 3rem)' }}
          >
            {title}
            <span className="text-gradient absolute -bottom-2.5 left-0 block h-0.5 w-12 rounded-full opacity-60" />
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="mt-1.5 font-mono text-[0.74rem] font-semibold uppercase leading-[1.5] tracking-[0.13em] text-muted opacity-72">
            {subtitle}
          </p>
        </Reveal>
      </div>
    </div>
  )
}
