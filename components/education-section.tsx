import { GraduationCap, Award } from 'lucide-react'
import { SectionHeader } from '@/components/section-header'
import { Reveal } from '@/components/reveal'
import { cn } from '@/lib/utils'
import { education } from '@/data/education'

export function EducationSection() {
  return (
    <section
      id="education"
      className="relative py-[clamp(100px,12vw,160px)] scroll-mt-[92px]"
    >
      <div className="mx-auto max-w-[1360px] px-[clamp(20px,4vw,48px)]">
        <SectionHeader
          number="04"
          title="Certifications"
          subtitle="Continuous Learning"
          className="mb-[clamp(20px,2.5vw,32px)]"
        />

        <div className="ml-[42px] flex flex-col gap-[clamp(14px,1.8vw,22px)] max-md:ml-0">
          {education.map((item, idx) => (
            <Reveal key={item.title} delay={idx * 0.04}>
              <div className="relative flex flex-col gap-2 py-[clamp(12px,1.8vw,18px)] pb-[clamp(14px,2vw,20px)] pl-[clamp(15px,1.4vw,20px)]">
                {/* Left accent line */}
                <div className="absolute top-2 bottom-2 left-0 w-px rounded-full bg-gradient-to-b from-white/48 to-white/14 opacity-84" />

                {/* Header */}
                <div className="mb-2.5 flex items-center gap-3">
                  <span
                    className={cn(
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]',
                      item.type === 'degree' ? 'bg-white/8 text-accent' : 'bg-white/8 text-accent-2',
                    )}
                  >
                    {item.type === 'degree' ? (
                      <GraduationCap className="h-5 w-5" />
                    ) : (
                      <Award className="h-5 w-5" />
                    )}
                  </span>
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        'inline-block rounded-pill px-3 py-1 font-mono text-[0.63rem] font-semibold uppercase tracking-[0.16em] leading-[1.15]',
                        item.type === 'degree'
                          ? 'border border-white/20 bg-gradient-to-br from-white/12 to-white/8 text-accent'
                          : 'border border-white/15 bg-white/8 text-accent-2',
                      )}
                    >
                      {item.type === 'degree' ? 'Degree' : 'Certificate'}
                    </span>
                    <span className="font-mono text-[0.72rem] tracking-[0.08em] text-muted tabular-nums leading-[1.15]">
                      {item.date}
                    </span>
                  </div>
                </div>

                <h3 className="text-[1.34rem] font-[650] leading-[1.4] tracking-[-0.02em] text-wrap-balance">
                  {item.title}
                </h3>
                <span className="text-[0.9rem] font-medium text-muted">{item.issuer}</span>
                <p className="mt-2 text-[1.14rem] leading-[1.7] text-secondary text-wrap-pretty">
                  {item.detail}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
