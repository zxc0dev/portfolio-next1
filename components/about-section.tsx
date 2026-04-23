import { MapPin, Languages } from 'lucide-react'
import { SectionHeader } from '@/components/section-header'
import { Reveal } from '@/components/reveal'

const STACK_GROUPS = [
  {
    label: 'Languages & Libraries',
    tags: ['Python', 'Pandas', 'NumPy', 'Scikit-learn', 'Matplotlib', 'Seaborn', 'SQL', 'VBA'],
  },
  {
    label: 'Platforms & Tools',
    tags: ['Power BI', 'dbt', 'Git', 'Linux', 'Excel', 'Power Query'],
  },
]

export function AboutSection() {
  return (
    <section
      id="about"
      className="relative pt-[clamp(64px,6vw,80px)] pb-[clamp(100px,12vw,160px)] scroll-mt-[92px]"
    >
      <div className="mx-auto max-w-[1360px] px-[clamp(20px,4vw,48px)]">
        <SectionHeader
          number="01"
          title="About Me"
          subtitle="Who I Am"
          className="mb-[clamp(20px,2.5vw,32px)]"
        />

        <div className="ml-[42px] grid grid-cols-[1fr_340px] items-start gap-[clamp(40px,5vw,64px)] max-lg:grid-cols-1 max-md:ml-0">
          {/* Prose */}
          <div className="flex flex-col">
            <Reveal>
              <div className="mb-6 flex flex-col gap-2.5">
                <h3
                  className="font-bold leading-[1.26] tracking-[-0.025em] text-foreground text-wrap-balance flex flex-col gap-2"
                  style={{ fontSize: 'clamp(1.66rem, 1.55vw + 1rem, 1.96rem)' }}
                >
                  <span>
                    A data analyst who turns{' '}
                    <span className="text-gradient">complexity into clarity.</span>
                  </span>
                  <span>What a clich&eacute;, huh?</span>
                </h3>
                <div className="flex flex-col items-start gap-1.5 font-mono text-[0.72rem] tracking-[0.06em]">
                  <span className="flex items-center gap-1.5 text-muted">
                    <MapPin className="h-3.5 w-3.5 shrink-0 opacity-88" />
                    Slovakia, EU
                  </span>
                  <span className="flex items-center gap-1.5 text-white/74">
                    <Languages className="h-3.5 w-3.5 shrink-0 opacity-88" />
                    <span className="text-wrap-pretty">
                      English (C1), Russian (Native), Ukrainian (Native), Slovak (A2)
                    </span>
                  </span>
                </div>
              </div>
            </Reveal>

            <div className="mb-4 flex max-w-[68ch] flex-col gap-5 text-[1.16rem] leading-[1.82] text-secondary">
              <Reveal delay={0.04}>
                <p>I love data. Specifically: analytics and engineering. I enjoy architecting, transforming, optimizing, and analyzing it.</p>
              </Reveal>
              <Reveal delay={0.08}>
                <p>
                  My journey started at Foxconn, where I spent 1.5+ years embedded in electronics
                  manufacturing. There I analyzed production-line data to improve pass rates and
                  built automation scripts that cut hours of manual work down to minutes.
                </p>
              </Reveal>
              <Reveal delay={0.12}>
                <p>
                  What drives how I work is a mix of philosophy and pragmatism. I approach problems
                  through first principles: strip everything back to its essential structure,
                  understand it from the ground up.
                  I ask a lot of questions, partly Socratic<sup className="text-[0.7em]">*</sup>{' '}
                  habit, partly because the right question often does more work than the right
                  answer, and because ideas only matter if they prove their value in
                  practice<sup className="text-[0.7em]">**</sup>.
                </p>
              </Reveal>
              <Reveal delay={0.16}>
                <p>
                  Stepping from &ldquo;true&rdquo; philosophy, I also believe the only honest
                  path to mastering a craft is through the kind of deliberate practice Anders
                  Ericsson described: focused, corrective, and sustained without burning out.
                </p>
              </Reveal>
              <Reveal delay={0.16}>
                <p>
                  Outside of data, I read broadly — philosophy, cognitive science, sometimes history, less for credentials
                  than for better mental furniture. And I usually have a side project running:
                  something I&apos;m building to understand it, not necessarily to showcase it.
                </p>
              </Reveal>
              <Reveal delay={0.16}>
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[0.69rem] tracking-[0.04em] text-muted">
                    *&thinsp;the dude casually asking lots of questions
                  </span>
                  <span className="font-mono text-[0.69rem] tracking-[0.04em] text-muted">
                    **&thinsp;jamesian cash-value principle
                  </span>
                </div>
              </Reveal>
            </div>
          </div>

          {/* Stack */}
          <div className="flex flex-col gap-5 border-l border-white/10 pl-[clamp(28px,3.5vw,44px)] max-lg:border-l-0 max-lg:pl-0">
            <Reveal>
              <h3 className="text-[1.12rem] font-bold tracking-[-0.02em]">Core Stack</h3>
            </Reveal>
            {STACK_GROUPS.map((group, gIdx) => (
              <Reveal key={group.label} delay={(gIdx + 1) * 0.04}>
                <div>
                  {gIdx > 0 && <div className="my-4 h-px bg-border-subtle" />}
                  <span className="mb-2.5 block font-mono text-[0.68rem] font-semibold uppercase tracking-[0.15em] text-muted">
                    {group.label}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {group.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-pill border border-white/9 bg-white/[0.055] px-3 py-1.5 font-mono text-[0.69rem] tracking-[0.02em] text-white/84 transition-all duration-[180ms] ease-out-expo hover:-translate-y-px hover:border-white/22 hover:bg-white/11 hover:text-white/96 hover:shadow-[0_6px_16px_rgba(242,242,242,0.1)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
