'use client'

import { Github } from 'lucide-react'
import { SectionHeader } from '@/components/section-header'
import { Reveal } from '@/components/reveal'
import { ButtonLink } from '@/components/ui/button'
import {
  riskSignals,
  retentionPlan,
} from '@/data/churn-studio'

export function ChurnStudioSection() {
  return (
    <section
      id="churn-studio"
      className="section-divider relative bg-surface-alt py-[clamp(100px,12vw,160px)] scroll-mt-[92px]"
    >
      <div className="mx-auto max-w-[1360px] px-[clamp(20px,4vw,48px)]">
        <SectionHeader
          number="05"
          title="Analytical Signature"
          subtitle="Key findings from one of my data analysis projects"
          className="mb-[clamp(20px,2.5vw,32px)]"
        />

        <div className="ml-[42px] flex flex-col gap-[clamp(24px,3vw,36px)] max-md:ml-0">
          {/* Intro */}
          <Reveal>
            <div className="flex items-start justify-between gap-3.5 max-md:flex-col max-md:items-start">
              <div className="max-w-[70ch]">
                <span className="text-gradient mb-3 inline-flex font-mono text-[0.68rem] font-semibold uppercase tracking-[0.15em] leading-[1.2]">
                  Project Findings Overview
                </span>
                <h3 className="mb-2 font-bold leading-[1.3] tracking-[-0.025em] text-foreground text-wrap-balance" style={{ fontSize: 'clamp(1.36rem, 1.1vw + 0.92rem, 1.62rem)' }}>
                  Churn risk across the customer lifecycle
                </h3>
                <p className="max-w-[68ch] text-[1.03rem] leading-[1.7] tracking-[0.005em] text-foreground">
                  This overview summarizes a telecom retention analysis I conducted,
                  highlighting where churn risk concentrates and which behaviors most
                  strongly increase it.
                </p>
              </div>
              <ButtonLink
                variant="chip"
                size="chip"
                href="https://github.com/zxrc0dev/telecom-customer-churn-prediction"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0"
              >
                <Github className="h-[15px] w-[15px]" />
                <span>View full project</span>
              </ButtonLink>
            </div>
          </Reveal>

          {/* Risk Signals */}
          <div className="flex flex-col gap-2.5">
            <Reveal>
              <div className="max-w-[68ch]">
                <p className="text-gradient mb-[5px] font-mono text-[0.68rem] font-semibold uppercase tracking-[0.15em]">
                  Risk Signals
                </p>
                <h3 className="mb-1 font-[650] leading-[1.36] tracking-[-0.02em] text-foreground text-wrap-balance" style={{ fontSize: 'clamp(1.14rem, 0.66vw + 0.88rem, 1.3rem)' }}>
                  Primary churn risk segments
                </h3>
                <p className="max-w-[68ch] text-[0.95rem] leading-[1.64] text-muted">
                  Most impactful churn risk signals, based on lifecycle stage, billing
                  behavior, and support activity.
                </p>
              </div>
            </Reveal>
            <div className="grid grid-cols-2 gap-2 max-md:grid-cols-1">
              {riskSignals.map((signal, i) => (
                <Reveal key={signal.title} delay={i * 0.04}>
                  <div className="relative grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2 overflow-hidden rounded-md border border-border-subtle bg-panel p-[8px_10px_8px_12px] shadow-[inset_0_1px_0_rgba(255,255,255,0.015)] transition-all duration-[280ms] ease-out-expo before:absolute before:top-[11px] before:bottom-[11px] before:left-0 before:w-0.5 before:rounded-full before:bg-gradient-to-b before:from-white/85 before:to-white/75 before:opacity-62 hover:-translate-y-[var(--lift-control)] hover:border-white/18 hover:bg-white/[0.045]">
                    <div>
                      <p className="mb-0.5 text-[0.96rem] font-semibold leading-[1.4] text-foreground">
                        {signal.title}
                      </p>
                      <p className="text-[0.91rem] leading-[1.6] text-muted text-wrap-pretty">
                        {signal.description}
                      </p>
                    </div>
                    <div className="min-w-[80px] rounded-[10px] border border-white/[0.045] bg-white/[0.014] p-[6px_8px] text-right">
                      <span className="block font-mono text-[0.75rem] leading-[1.1] tracking-[0.01em] text-foreground tabular-nums">
                        {signal.rate}
                      </span>
                      <span className="mt-px block font-mono text-[0.66rem] tracking-[0.03em] text-white/72 tabular-nums">
                        {signal.uplift}
                      </span>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Retention Plan */}
          <div className="flex flex-col gap-2.5">
            <Reveal>
              <div className="max-w-[68ch]">
                <p className="text-gradient mb-[5px] font-mono text-[0.68rem] font-semibold uppercase tracking-[0.15em]">
                  Retention Plan
                </p>
                <h3 className="mb-1 font-[650] leading-[1.36] tracking-[-0.02em] text-foreground text-wrap-balance" style={{ fontSize: 'clamp(1.14rem, 0.66vw + 0.88rem, 1.3rem)' }}>
                  Recommended interventions
                </h3>
                <p className="max-w-[68ch] text-[0.95rem] leading-[1.64] text-muted">
                  Most impactful interventions based on analysis findings
                </p>
              </div>
            </Reveal>
            <div className="grid grid-cols-3 gap-2 max-lg:grid-cols-2 max-sm:grid-cols-1">
              {retentionPlan.map((card, i) => (
                <Reveal key={card.label} delay={i * 0.04}>
                  <div className="flex flex-col gap-1 overflow-hidden rounded-md border border-border-subtle bg-panel p-[12px_14px] shadow-[inset_0_1px_0_rgba(255,255,255,0.015)] transition-all duration-[280ms] ease-out-expo hover:-translate-y-[var(--lift-control)] hover:border-white/18 hover:bg-white/[0.045]">
                    <span className="text-gradient block font-mono text-[0.66rem] font-semibold uppercase tracking-[0.16em] leading-[1.2]">
                      {card.label}
                    </span>
                    <p className="text-[0.92rem] leading-[1.58] text-secondary text-wrap-pretty">
                      {card.description}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
