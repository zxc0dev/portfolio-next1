'use client'

import { Target, Shield, Wifi, CreditCard, UserCheck } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import kpiRaw from '@/public/data/churn/kpi_cards.json'
import { TenureChart } from '@/components/churn/tenure-chart'
import { DriversChart } from '@/components/churn/drivers-chart'
import { HeatmapChart } from '@/components/churn/heatmap-chart'
import { PaymentChart } from '@/components/churn/payment-chart'
import { ServiceChart } from '@/components/churn/service-chart'
import { ChargesChart } from '@/components/churn/charges-chart'

/* ── Insight callout ─────────────────────────────────────────────────── */
function InsightCallout({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <Reveal>
      <div className="border-l-2 border-white/20 py-1 pl-5">
        <span className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-white/60">
          {label}
        </span>
        <p className="mt-1.5 text-[1.02rem] leading-[1.72] text-white/80">
          {children}
        </p>
      </div>
    </Reveal>
  )
}

/* ── Chart section header ────────────────────────────────────────────── */
function ChartHeader({ tag, title }: { tag: string; title: string }) {
  return (
    <div className="mb-3">
      <p className="text-gradient mb-[5px] font-mono text-[0.68rem] font-semibold uppercase tracking-[0.15em]">
        {tag}
      </p>
      <h3
        className="font-semibold leading-[1.36] tracking-[-0.02em] text-foreground text-wrap-balance"
        style={{ fontSize: 'clamp(1.14rem, 0.66vw + 0.88rem, 1.3rem)' }}
      >
        {title}
      </h3>
    </div>
  )
}

/* ── Verdict card ────────────────────────────────────────────────────── */
const RECOMMENDATIONS = [
  {
    icon: UserCheck,
    title: 'Eliminate the early-tenure danger zone',
    detail:
      'Proactive onboarding for months 0–5 with check-in calls at month 1 & 3, a welcome bundle discount, and a clear upgrade path to annual contracts.',
  },
  {
    icon: Target,
    title: 'Migrate month-to-month → longer contracts',
    detail:
      'Time-limited incentive (locked-in rate, one-time bill credit) to flip high-risk M2M customers to 1-year contracts. Even a partial shift reduces weighted churn from 23.5% toward the 2.4% seen on annual plans.',
  },
  {
    icon: Shield,
    title: 'Bundle add-on services by default',
    detail:
      'Include online security and tech support in mid-tier plans. Customers with these services show 4–8% weighted churn vs 17–21% without.',
  },
  {
    icon: Wifi,
    title: 'Address fiber optic dissatisfaction',
    detail:
      'Fiber optic users without tech support are the highest-risk cohort. Deploy proactive tech support outreach and audit pricing vs. competitor offerings.',
  },
  {
    icon: CreditCard,
    title: 'Automate payments to reduce friction',
    detail:
      'Electronic check users churn at ~4× the rate of automatic payment users. Incentivize switching with a $5/month discount for auto-pay enrollment.',
  },
]

/* ── Dashboard export ────────────────────────────────────────────────── */
export function ChurnDashboard() {
  return (
    <div className="flex flex-col gap-[clamp(24px,3vw,36px)]">
      {/* Insight: Overview */}
      <InsightCallout label="Context">
        With an overall churn rate of ~26% — 1,869 of 7,032 customers lost — this
        dataset reveals significant retention challenges that justify targeted
        intervention across contract, service, and payment dimensions.
      </InsightCallout>

      {/* KPI Strip */}
      <Reveal>
        <div className="grid grid-cols-4 gap-[clamp(8px,1vw,12px)] max-md:grid-cols-2 max-sm:grid-cols-1">
          {kpiRaw.cards.map((kpi, i) => (
            <Reveal key={kpi.label} delay={i * 0.04}>
              <div className="flex flex-col items-start gap-0.5 rounded-sm p-[10px_clamp(12px,1.2vw,16px)]">
                <span className="text-gradient mb-0.5 block w-full font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] leading-[1.2]">
                  {kpi.label}
                </span>
                <span className="block w-full text-[1.28rem] font-semibold leading-[1.14] tracking-[-0.028em] text-foreground tabular-nums">
                  {kpi.value}
                </span>
                <span className="block w-full text-[0.82rem] leading-[1.52] text-white/60">
                  {kpi.foot}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </Reveal>

      {/* Main chart: Lifecycle Risk Curve */}
      <Reveal delay={0.04}>
        <div>
          <ChartHeader
            tag="Lifecycle Risk Curve"
            title="Tenure bands — customer volume and churn-rate overlay"
          />
          <TenureChart />
        </div>
      </Reveal>

      {/* Insight: Tenure finding */}
      <InsightCallout label="Key Finding">
        54.7% of month-to-month customers churn within the first 5 months. This
        early-tenure window represents the single greatest retention opportunity —
        after month 12, churn drops below 20%.
      </InsightCallout>

      {/* Split view: Drivers + Heatmap */}
      <div className="grid grid-cols-[1fr_1fr] items-start gap-[clamp(20px,2.5vw,32px)] max-lg:grid-cols-1">
        <Reveal delay={0.04}>
          <div>
            <ChartHeader
              tag="Churn Drivers"
              title="Top factors ranked by weighted churn contribution"
            />
            <DriversChart />
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <div>
            <ChartHeader
              tag="Risk Matrix"
              title="Churn rate by contract type and tenure"
            />
            <HeatmapChart />
          </div>
        </Reveal>
      </div>

      {/* Insight: Contract & service */}
      <InsightCallout label="Pattern">
        Contract type is the strongest churn lever: two-year contracts show ~2–3%
        churn compared to ~43% for month-to-month. Service engagement (online
        security, tech support) further separates retained from churned customers.
      </InsightCallout>

      {/* Split view: Service Adoption + Payment Method */}
      <div className="grid grid-cols-[1fr_1fr] items-start gap-[clamp(20px,2.5vw,32px)] max-lg:grid-cols-1">
        <Reveal delay={0.04}>
          <div>
            <ChartHeader
              tag="Service Adoption Impact"
              title="Churn rate with vs without each add-on"
            />
            <ServiceChart />
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <div>
            <ChartHeader
              tag="Payment Method"
              title="Customer retention by billing type"
            />
            <PaymentChart />
          </div>
        </Reveal>
      </div>

      {/* Insight: Payment friction */}
      <InsightCallout label="Signal">
        Customers without add-on services show 4–8× higher churn. Electronic check
        users churn at ~4× the rate of automatic payment users — payment friction is
        a surprisingly strong and actionable signal.
      </InsightCallout>

      {/* Monthly Charges */}
      <Reveal delay={0.04}>
        <div>
          <ChartHeader
            tag="Price Sensitivity"
            title="Churn rate by monthly charge bracket"
          />
          <ChargesChart />
        </div>
      </Reveal>

      {/* Verdict Card — Retention Plan */}
      <Reveal delay={0.04}>
        <div className="p-[clamp(20px,2.5vw,32px)]">
          <span className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-white/60">
            Retention Plan — 5 Actionable Recommendations
          </span>
          <div className="mt-5 flex flex-col gap-4">
            {RECOMMENDATIONS.map((rec, i) => (
              <Reveal key={rec.title} delay={0.04 + i * 0.03}>
                <div className="flex gap-3.5">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/8 text-white/70">
                    <rec.icon className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <span className="text-[0.95rem] font-semibold text-foreground">
                      {rec.title}
                    </span>
                    <p className="mt-0.5 text-[0.88rem] leading-[1.65] text-white/60">
                      {rec.detail}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  )
}
