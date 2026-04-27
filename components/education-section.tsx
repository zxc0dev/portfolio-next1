import { SectionHeader } from '@/components/section-header'
import { Reveal } from '@/components/reveal'
import { TerminalQuery } from '@/components/terminal-query'
import { education } from '@/data/education'

export function EducationSection() {
  return (
    <section
      id="education"
      className="relative py-[clamp(100px,12vw,160px)] scroll-mt-[92px]"
    >
      <div className="mx-auto max-w-[1360px] px-[clamp(20px,4vw,48px)]">
        <TerminalQuery
          query={`SELECT * FROM certifications\n            ORDER BY date DESC;`}
          rowsText="3 rows returned"
        >
        <SectionHeader
          number="04"
          title="Certifications"
          subtitle="Continuous Learning"
          className="mb-[clamp(20px,2.5vw,32px)]"
        />

        <div className="ml-[42px] flex flex-col divide-y divide-border/60 max-md:ml-0">
          {education.map((item, idx) => (
            <Reveal key={item.title} delay={idx * 0.04} className="py-[clamp(16px,2vw,22px)] first:pt-0">
              <div className="relative pl-[clamp(15px,1.4vw,20px)]">
                {/* Left accent line */}
                <div className="absolute top-1 bottom-1 left-0 w-px rounded-full bg-gradient-to-b from-white/40 to-transparent" />

                <h3 className="mb-[5px] text-[1.56rem] font-[650] leading-[1.3] tracking-[-0.02em] text-wrap-balance">
                  {item.title}
                </h3>
                <span className="text-gradient text-[1rem] font-semibold">
                  {item.issuer}
                </span>
                <span className="mt-[3px] block font-mono text-[0.76rem] tracking-[0.08em] text-muted tabular-nums leading-[1.15]">
                  {item.date}
                </span>
                <p className="mt-3 text-[1.26rem] leading-[1.8] text-secondary text-wrap-pretty">
                  {item.detail}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
        </TerminalQuery>
      </div>
    </section>
  )
}
