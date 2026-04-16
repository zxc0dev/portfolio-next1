'use client'

import { Github } from 'lucide-react'
import { motion } from 'framer-motion'
import { SectionHeader } from '@/components/section-header'
import { Reveal } from '@/components/reveal'
import { ButtonLink } from '@/components/ui/button'
import {
  tenureData,
  kpis,
  riskSignals,
  retentionPlan,
} from '@/data/churn-studio'
import { fadeUpChild } from '@/animations/variants'

/* ── Tenure Chart (static SVG) ─────────────────────────────────────────── */
function TenureChart() {
  const W = 720
  const H = 348
  const pad = { top: 30, right: 60, bottom: 44, left: 50 }
  const chartW = W - pad.left - pad.right
  const chartH = H - pad.top - pad.bottom
  const maxCustomers = Math.max(...tenureData.map((d) => d.customers))
  const maxChurn = 55
  const barW = chartW / tenureData.length - 10

  return (
    <div className="overflow-hidden rounded-[14px] border border-white/7 bg-[linear-gradient(180deg,rgba(255,255,255,0.016),rgba(255,255,255,0)),rgba(8,8,8,0.72)] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.018),0_8px_18px_rgba(0,0,0,0.12)]">
      <svg viewBox={`0 0 ${W} ${H}`} className="block w-full h-auto">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((frac) => (
          <line
            key={frac}
            x1={pad.left}
            x2={W - pad.right}
            y1={pad.top + chartH * (1 - frac)}
            y2={pad.top + chartH * (1 - frac)}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={1}
          />
        ))}

        {/* Bars */}
        {tenureData.map((d, i) => {
          const barH = (d.customers / maxCustomers) * chartH
          const x = pad.left + (chartW / tenureData.length) * i + 5
          const y = pad.top + chartH - barH
          return (
            <rect
              key={d.band}
              x={x}
              y={y}
              width={barW}
              height={barH}
              rx={4}
              fill={i === 0 ? 'rgba(255,255,255,0.9)' : 'rgba(242,242,242,0.72)'}
              stroke="rgba(242,242,242,0.38)"
              strokeWidth={1}
            />
          )
        })}

        {/* Churn rate line */}
        <polyline
          fill="none"
          stroke="rgba(255,255,255,0.98)"
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
          points={tenureData
            .map((d, i) => {
              const x = pad.left + (chartW / tenureData.length) * i + 5 + barW / 2
              const y = pad.top + chartH - (d.churnRate / maxChurn) * chartH
              return `${x},${y}`
            })
            .join(' ')}
        />

        {/* Line dots */}
        {tenureData.map((d, i) => {
          const x = pad.left + (chartW / tenureData.length) * i + 5 + barW / 2
          const y = pad.top + chartH - (d.churnRate / maxChurn) * chartH
          return (
            <circle
              key={`dot-${d.band}`}
              cx={x}
              cy={y}
              r={4}
              fill="rgba(255,255,255,0.99)"
              stroke="rgba(0,0,0,0.96)"
              strokeWidth={2}
            />
          )
        })}

        {/* Band labels */}
        {tenureData.map((d, i) => {
          const x = pad.left + (chartW / tenureData.length) * i + 5 + barW / 2
          return (
            <text
              key={`label-${d.band}`}
              x={x}
              y={H - 10}
              textAnchor="middle"
              fill="rgba(242,242,242,0.58)"
              fontSize={13}
              fontFamily="var(--font-mono)"
            >
              {d.band}
            </text>
          )
        })}

        {/* Right axis labels (churn %) */}
        {[0, 25, 50].map((val) => (
          <text
            key={`right-${val}`}
            x={W - pad.right + 8}
            y={pad.top + chartH - (val / maxChurn) * chartH + 4}
            fill="rgba(242,242,242,0.82)"
            fontSize={13}
            fontFamily="var(--font-mono)"
          >
            {val}%
          </text>
        ))}
      </svg>
    </div>
  )
}

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

          {/* KPIs */}
          <div className="grid grid-cols-4 gap-[clamp(8px,1vw,10px)] max-md:grid-cols-2 max-sm:grid-cols-1">
            {kpis.map((kpi) => (
              <motion.div
                key={kpi.label}
                variants={fadeUpChild}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, margin: '-60px 0px -60px 0px' }}
                className="flex flex-col items-start justify-start gap-0.5 rounded-sm border border-border-subtle bg-[linear-gradient(160deg,rgba(255,255,255,0.034)_0%,rgba(255,255,255,0.014)_100%)] p-[10px_clamp(12px,1.2vw,16px)] shadow-rest transition-all duration-[280ms] ease-out-expo hover:-translate-y-[var(--lift-card)] hover:border-transparent hover:shadow-elevated"
              >
                <span className="text-gradient mb-0.5 block w-full font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] leading-[1.2]">
                  {kpi.label}
                </span>
                <span className="block w-full text-[1.28rem] font-[650] leading-[1.14] tracking-[-0.028em] text-foreground tabular-nums">
                  {kpi.value}
                </span>
                <span className="block w-full text-[0.82rem] leading-[1.52] text-muted">
                  {kpi.foot}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Chart + Risk Signals */}
          <div className="grid grid-cols-[1.4fr_1fr] items-stretch gap-[clamp(20px,2.5vw,32px)] max-lg:grid-cols-1">
            <Reveal className="flex flex-col gap-2">
              <div className="max-w-[68ch]">
                <p className="text-gradient mb-[5px] font-mono text-[0.68rem] font-semibold uppercase tracking-[0.15em]">
                  Lifecycle Risk Curve
                </p>
                <h3 className="mb-1 font-[650] leading-[1.36] tracking-[-0.02em] text-foreground text-wrap-balance" style={{ fontSize: 'clamp(1.14rem, 0.66vw + 0.88rem, 1.3rem)' }}>
                  Tenure bands: customer volume and churn-rate overlay
                </h3>
              </div>
              <div className="flex items-center gap-2 pt-0.5">
                <span className="flex items-center gap-1.5 text-[0.74rem] tracking-[0.02em] text-muted">
                  <i className="inline-block h-2 w-2 rounded-full bg-white/92 shadow-[0_0_0_3px_rgba(242,242,242,0.14)]" />
                  Customer volume
                </span>
                <span className="flex items-center gap-1.5 text-[0.74rem] tracking-[0.02em] text-muted">
                  <i className="inline-block h-2 w-2 rounded-full bg-white/94 shadow-[0_0_0_3px_rgba(242,242,242,0.12)]" />
                  Churn rate
                </span>
              </div>
              <TenureChart />
            </Reveal>

            {/* Risk Signals */}
            <div className="flex flex-col gap-2.5">
              <Reveal>
                <div className="max-w-[68ch]">
                  <p className="text-gradient mb-[5px] font-mono text-[0.68rem] font-semibold uppercase tracking-[0.15em]">
                    Risk Signals
                  </p>
                  <h3 className="mb-1 font-[650] leading-[1.36] tracking-[-0.02em] text-foreground text-wrap-balance" style={{ fontSize: 'clamp(1.14rem, 0.66vw + 0.88rem, 1.3rem)' }}>
                    Primary churn risk signals
                  </h3>
                  <p className="max-w-[68ch] text-[0.95rem] leading-[1.64] text-muted">
                    Most impactful churn risk segments, based on lifecycle stage, billing
                    behavior, and support activity.
                  </p>
                </div>
              </Reveal>
              <div className="flex flex-1 flex-col gap-1.5">
                {riskSignals.map((signal, i) => (
                  <Reveal key={signal.title} delay={i * 0.04}>
                  <div
                    className="relative grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2 overflow-hidden rounded-md border border-border-subtle bg-panel p-[8px_10px_8px_12px] shadow-[inset_0_1px_0_rgba(255,255,255,0.015)] transition-all duration-[280ms] ease-out-expo before:absolute before:top-[11px] before:bottom-[11px] before:left-0 before:w-0.5 before:rounded-full before:bg-gradient-to-b before:from-white/85 before:to-white/75 before:opacity-62 hover:-translate-y-[var(--lift-control)] hover:border-white/18 hover:bg-white/[0.045]"
                  >
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
                  <div
                    className="flex flex-col gap-1 overflow-hidden rounded-md border border-border-subtle bg-panel p-[12px_14px] shadow-[inset_0_1px_0_rgba(255,255,255,0.015)] transition-all duration-[280ms] ease-out-expo hover:-translate-y-[var(--lift-control)] hover:border-white/18 hover:bg-white/[0.045]"
                  >
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
