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
                  className="font-bold leading-[1.26] tracking-[-0.025em] text-foreground text-wrap-balance"
                  style={{ fontSize: 'clamp(1.66rem, 1.55vw + 1rem, 1.96rem)' }}
                >
                  A data analyst who turns{' '}
                  <span className="text-gradient">complexity into clarity.</span>
                </h3>
                <p
                  className="font-[400] leading-[1.26] tracking-[-0.025em] text-secondary text-wrap-balance"
                  style={{ fontSize: 'clamp(1.66rem, 1.55vw + 1rem, 1.96rem)' }}
                >
                  What a clich&eacute;, huh? But it&apos;s true of me.
                </p>
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

            <Reveal delay={0.04}>
              <div className="mb-4 flex max-w-[68ch] flex-col gap-5 text-[1.16rem] leading-[1.82] text-secondary">
                <p>I am Pavlo. I like data. Specifically: analytics and engineering.</p>
                <p>
                  I have 1.5+ years of on-site experience in electronics manufacturing at Foxconn,
                  where I improved production-line pass rates and developed automation scripts that
                  eliminated hours of manual work.
                </p>
                <p>
                  I possess a natural curiosity for how systems are built. I don&apos;t just follow
                  tutorials; instead building end-to-end projects from the ground up to understand
                  the structure behind it all. I take a First Principles approach, Platonic in its
                  focus on the essence of a problem in order to help me with that.
                </p>
                <p>
                  Also I&apos;m a firm believer that the only way to master a craft is through the
                  kind of deliberate practice Anders Ericsson championed:
                </p>
                <ul className="flex flex-col gap-1.5 pl-0 list-none">
                  <li>&#8212;&nbsp;Relentless, but not to the point of killing interest.</li>
                  <li>&#8212;&nbsp;Focused, but not so much that you miss your own mistakes.</li>
                  <li>&#8212;&nbsp;Corrective, but not to the point of paralysis.</li>
                </ul>
                <p>Anyway, enough text. I&apos;ll let the projects speak for themselves.</p>
              </div>
            </Reveal>

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
