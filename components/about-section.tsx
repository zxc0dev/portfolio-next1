import { SectionHeader } from '@/components/section-header'
import { Reveal } from '@/components/reveal'
import { TerminalQuery } from '@/components/terminal-query'

const INFO_GROUPS = [
  {
    label: 'Location',
    text: 'Slovakia, EU',
  },
  {
    label: 'Languages',
    text: 'English (C1), Russian (Native), Ukrainian (Native), Slovak (A2)',
  },
  {
    label: 'Programming Languages',
    text: 'Python, SQL, VBA',
  },
  {
    label: 'Libraries',
    text: 'Pandas, NumPy, Scikit-learn, Matplotlib, Seaborn',
  },
  {
    label: 'Platforms & Tools',
    text: 'Power BI, dbt, Git, Linux, Excel, Power Query',
  },
]

export function AboutSection() {
  return (
    <section
      id="about"
      className="relative pt-[clamp(64px,6vw,80px)] pb-[clamp(100px,12vw,160px)] scroll-mt-[92px]"
    >
      <div className="mx-auto max-w-[1360px] px-[clamp(20px,4vw,48px)]">
        <TerminalQuery query="SELECT * FROM about_me;" rowsText="1 row returned">
        <SectionHeader
          number="01"
          title="About Me"
          subtitle="Who I Am"
          className="mb-[clamp(20px,2.5vw,32px)]"
        />

        <div className="ml-[42px] grid grid-cols-[1fr_300px] items-start gap-[clamp(40px,5vw,64px)] max-lg:grid-cols-1 max-md:ml-0">
          {/* Prose */}
          <div className="flex flex-col">
            <Reveal>
              <h3
                className="mb-7 font-[800] leading-[1.18] tracking-[-0.03em] text-foreground text-wrap-balance flex flex-col gap-2"
                style={{ fontSize: 'clamp(1.72rem, 1.9vw + 0.4rem, 2.3rem)' }}
              >
                <span>
                  A data analyst who turns{' '}
                  <span className="text-gradient">complexity into clarity.</span>
                </span>
                <span>What a clich&eacute;&#8230;</span>
              </h3>
            </Reveal>

            <div className="mb-4 flex max-w-[68ch] flex-col gap-5 text-[1.26rem] leading-[1.82] text-secondary">
              <Reveal delay={0.04}>
                <p>Anyways, I love data. Specifically: analytics and engineering. I enjoy architecting, transforming, optimizing, and analyzing it.</p>
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
              <Reveal delay={0.20}>
                <p>
                  Outside of data, I read broadly — philosophy, cognitive science, sometimes history, less for credentials
                  than for better mental furniture. And I usually have a side project running:
                  something I&apos;m building to understand it, not necessarily to showcase it.
                </p>
              </Reveal>
              <Reveal delay={0.24}>
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

          {/* Info Sidebar */}
          <div className="flex flex-col gap-7 border-l border-white/10 pl-[clamp(28px,3.5vw,44px)] max-lg:border-l-0 max-lg:border-t max-lg:border-t-border max-lg:pt-8 max-lg:pl-0">
            {INFO_GROUPS.map((group, gIdx) => (
              <Reveal key={group.label} delay={(gIdx + 1) * 0.04}>
                <div>
                  <span className="mb-1.5 block font-mono text-[0.67rem] font-semibold uppercase tracking-[0.14em] text-muted">
                    {group.label}
                  </span>
                  <p className="text-[0.9rem] leading-[1.68] text-secondary">
                    {group.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        </TerminalQuery>
      </div>
    </section>
  )
}
