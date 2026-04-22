import { SectionHeader } from '@/components/section-header'
import { Reveal } from '@/components/reveal'
import { cn } from '@/lib/utils'
import { experience } from '@/data/experience'

export function ExperienceSection() {
  return (
    <section
      id="experience"
      className="relative py-[clamp(100px,12vw,160px)] scroll-mt-[92px]"
    >
      <div className="mx-auto max-w-[1360px] px-[clamp(20px,4vw,48px)]">
        <SectionHeader
          number="03"
          title="Experience"
          subtitle="Where I've made an impact"
          className="mb-[clamp(20px,2.5vw,32px)]"
        />

        <div className="relative ml-[42px] pl-[34px] max-md:ml-0">
          {/* Timeline line */}
          <div className="absolute top-2.5 bottom-2.5 left-1 w-px rounded-full bg-gradient-to-b from-white/40 via-white/25 to-transparent opacity-82" />

          {experience.map((item, idx) => (
              <div key={item.title} className={cn('relative', idx < experience.length - 1 && 'mb-9')}>
                {/* Marker */}
                <div
                  className={cn(
                    'absolute -left-[34px] top-3 z-2 h-[11px] w-[11px] rounded-full border bg-background shadow-[0_0_0_3px_rgba(242,242,242,0.07),0_6px_14px_rgba(0,0,0,0.12)] transition-all duration-500 ease-out-expo',
                    idx === 0
                      ? 'border-accent bg-accent shadow-[0_0_0_3px_rgba(242,242,242,0.1)]'
                      : 'border-white/16',
                  )}
                />

                <Reveal delay={idx * 0.06}>
                <div className="mb-3.5">
                  <h3 className="mb-[5px] text-[1.38rem] font-semibold leading-[1.35] tracking-[-0.02em] text-wrap-balance">
                    {item.title}
                  </h3>
                  <span className="text-gradient text-[0.95rem] font-semibold">
                    {item.company}
                  </span>
                  <span className="mt-[3px] block font-mono text-[0.76rem] tracking-[0.08em] text-muted tabular-nums leading-[1.15]">
                    {item.date}
                  </span>
                </div>
                </Reveal>

                <ul className="list-none p-0">
                  {item.details.map((detail, dIdx) => (
                    <Reveal key={detail.label} delay={idx * 0.06 + (dIdx + 1) * 0.04}>
                    <li
                      className="relative mb-2 pl-4 text-[1.14rem] leading-[1.72] text-secondary text-wrap-pretty before:absolute before:left-0 before:top-[0.82em] before:h-1 before:w-1 before:rounded-full before:bg-accent"
                    >
                      <strong className="text-[1.18rem] font-semibold text-foreground">
                        {detail.label}:
                      </strong>{' '}
                      {detail.text}
                    </li>
                    </Reveal>
                  ))}
                </ul>
              </div>
          ))}
        </div>
      </div>
    </section>
  )
}
