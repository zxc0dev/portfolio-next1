'use client'

import { useEffect, useRef } from 'react'
import { useLenis } from 'lenis/react'
import { TrendingUp, Users, ShoppingCart, Globe } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { RevenueTrendChart } from '@/components/rfm/revenue-trend-chart'
import { TopProductsChart } from '@/components/rfm/top-products-chart'
import { CountryChart } from '@/components/rfm/country-chart'
import { SegmentDistChart } from '@/components/rfm/segment-dist-chart'
import { SegmentMonetaryChart } from '@/components/rfm/segment-monetary-chart'
import { SegmentRevenueChart } from '@/components/rfm/segment-revenue-chart'

/* ── KPI data ────────────────────────────────────────────────────────── */
const KPI_CARDS = [
  {
    icon: TrendingUp,
    label: 'Total Revenue',
    value: '~£17.4M',
    foot: 'Dec 2009 – Dec 2011',
  },
  {
    icon: ShoppingCart,
    label: 'Transactions',
    value: '797,815',
    foot: 'post-cleaning',
  },
  {
    icon: Users,
    label: 'Unique Customers',
    value: '5,939',
    foot: 'with customer ID',
  },
  {
    icon: Globe,
    label: 'UK Revenue Share',
    value: '82.82%',
    foot: 'remaining 17.18% across 39 countries',
  },
]

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
      <div>
        <span className="mb-1.5 block font-mono text-[0.67rem] font-semibold uppercase tracking-[0.14em] text-muted">
          {label}
        </span>
        <p className="text-[1.22rem] leading-[1.8] text-secondary">{children}</p>
      </div>
    </Reveal>
  )
}

/* ── Chart section header ────────────────────────────────────────────── */
function ChartHeader({ tag, title }: { tag: string; title: string }) {
  return (
    <div className="mb-3">
      <p className="mb-[5px] font-mono text-[0.68rem] font-semibold uppercase tracking-[0.15em] text-muted">
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

/* ── Dashboard export ────────────────────────────────────────────────── */
export function RfmDashboard() {
  const lenis = useLenis()
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    lenis?.resize()
  }, [lenis])

  useEffect(() => {
    const el = rootRef.current
    if (!el || !lenis) return
    const ro = new ResizeObserver(() => lenis.resize())
    ro.observe(el)
    return () => ro.disconnect()
  }, [lenis])

  return (
    <div ref={rootRef} className="flex flex-col gap-[clamp(24px,3vw,36px)]">
      {/* KPI Strip */}
      <Reveal>
        <div className="grid grid-cols-4 gap-[clamp(8px,1vw,12px)] max-md:grid-cols-2 max-sm:grid-cols-1">
          {KPI_CARDS.map((kpi, i) => (
            <Reveal key={kpi.label} delay={i * 0.04}>
              <div className="flex flex-col items-start gap-0.5 rounded-sm p-[10px_clamp(12px,1.2vw,16px)]">
                <span className="mb-0.5 block w-full font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] leading-[1.2] text-muted">
                  {kpi.label}
                </span>
                <span className="block w-full text-[1.28rem] font-semibold leading-[1.14] tracking-[-0.028em] text-foreground tabular-nums">
                  {kpi.value}
                </span>
                <span className="block w-full text-[0.88rem] leading-[1.52] text-muted">
                  {kpi.foot}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </Reveal>

      {/* ── Chart 1: Revenue Trend ─────────────────────────────────────── */}
      <Reveal delay={0.04}>
        <div>
          <ChartHeader
            tag="Revenue Trend"
            title="Total monthly revenue — Dec 2009 through Dec 2011"
          />
          <RevenueTrendChart />
        </div>
      </Reveal>

      {/* Insight: seasonality */}
      <InsightCallout label="Seasonality Signal">
        Revenue peaks sharply in Q4 each year:{' '}
        <strong className="text-foreground font-semibold">Nov 2010 (£1.13M)</strong> and{' '}
        <strong className="text-foreground font-semibold">Nov 2011 (£1.13M)</strong> are the
        highest single months, with Oct 2011 close behind at £973K. The recurring late-year surge
        confirms a strong seasonal demand pattern driven by gift-purchasing cycles — a critical
        input for inventory planning and campaign timing.
      </InsightCallout>

      {/* ── Chart 2: Top 10 Products by Year ─────────────────────────── */}
      <Reveal delay={0.04}>
        <div>
          <ChartHeader
            tag="Product Performance"
            title="Top 10 products by revenue — per calendar year"
          />
          <div className="grid grid-cols-3 gap-[clamp(16px,2vw,28px)] max-lg:grid-cols-1">
            {(['2009', '2010', '2011'] as const).map((year, i) => (
              <Reveal key={year} delay={0.04 + i * 0.05}>
                <div>
                  <p className="mb-2 font-mono text-[0.67rem] font-semibold uppercase tracking-[0.14em] text-muted">
                    {year === '2009' ? `${year} (Dec only)` : year}
                  </p>
                  <TopProductsChart year={year} />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Insight: product concentration */}
      <InsightCallout label="Product Concentration">
        The top 10 products shift noticeably between years, but seasonal gift items — decorative
        storage, lighting accessories, and homeware — consistently dominate. Because 2009 covers
        only December, its top-10 reflects peak holiday demand exclusively. Revenue concentration
        in a handful of SKUs means supply chain disruptions on even two or three hero products
        could materially impact monthly totals.
      </InsightCallout>

      {/* ── Chart 3: Sales by Country ─────────────────────────────────── */}
      <Reveal delay={0.04}>
        <div>
          <ChartHeader
            tag="Geographic Footprint"
            title="Revenue by country — top 20 markets (positive transactions)"
          />
          <CountryChart />
        </div>
      </Reveal>

      {/* Insight: geo concentration */}
      <InsightCallout label="UK Dominance">
        The United Kingdom contributes{' '}
        <strong className="text-foreground font-semibold">82.82%</strong> of total cleaned
        revenue — a concentration that is large but less extreme than initial raw-data estimates
        suggested (~88%). EIRE, the Netherlands, Germany, and France form a distant second tier.
        Non-UK markets collectively offer meaningful growth headroom: any improvement in
        European customer retention would disproportionately lift portfolio diversification.
      </InsightCallout>

      {/* ── Charts 4 & 5: Segments ────────────────────────────────────── */}
      <Reveal delay={0.04}>
        <div>
          <ChartHeader
            tag="Customer Segmentation"
            title="K-Means cluster distribution and average revenue per segment"
          />
          <div className="grid grid-cols-[1fr_1.2fr] items-start gap-[clamp(20px,2.5vw,32px)] max-lg:grid-cols-1">
            <Reveal delay={0.04}>
              <div>
                <p className="mb-2 font-mono text-[0.67rem] font-semibold uppercase tracking-[0.14em] text-muted">
                  Segment Distribution
                </p>
                <SegmentDistChart />
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div>
                <p className="mb-2 font-mono text-[0.67rem] font-semibold uppercase tracking-[0.14em] text-muted">
                  Avg Monetary Value by Segment
                </p>
                <SegmentMonetaryChart />
              </div>
            </Reveal>
          </div>
        </div>
      </Reveal>

      {/* Insight: segments */}
      <InsightCallout label="Segment Interpretation">
        K-Means (k=3) partitions customers into three commercially meaningful tiers.{' '}
        <strong className="text-foreground font-semibold">Champions</strong> (29.3%) represent
        high-recency, high-frequency, high-spend buyers — the core of the revenue base.{' '}
        <strong className="text-foreground font-semibold">Loyal Customers</strong> (39.9%) are
        the largest group and show consistent but lower-spend behaviour, ideal targets for
        up-sell campaigns.{' '}
        <strong className="text-foreground font-semibold">Potential Loyalists</strong> (30.8%)
        have the headroom to convert upward — targeted reactivation offers could shift a
        meaningful portion of this cohort into the Champion tier.
      </InsightCallout>

      {/* ── Chart 6: Revenue Contribution by RFM Segment ──────────────── */}
      <Reveal delay={0.04}>
        <div>
          <ChartHeader
            tag="Revenue Contribution"
            title="Share of total revenue by RFM segment"
          />
          <SegmentRevenueChart />
        </div>
      </Reveal>

      {/* Insight: segment revenue */}
      <InsightCallout label="Revenue Concentration">
        <strong className="text-foreground font-semibold">Champions</strong> and{' '}
        <strong className="text-foreground font-semibold">Loyal Customers</strong> together
        account for the majority of total revenue despite representing fewer than half of all
        customers — the classic Pareto dynamic in e-commerce. Segments like{' '}
        <em className="text-foreground not-italic font-medium">Hibernating</em> and{' '}
        <em className="text-foreground not-italic font-medium">About to Sleep</em> hold
        disproportionately low revenue share relative to their customer count, making them
        high-priority targets for reactivation campaigns with a clear ceiling on the upside.
      </InsightCallout>
    </div>
  )
}
