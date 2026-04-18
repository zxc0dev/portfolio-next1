'use client'

import { useMemo } from 'react'
import ReactEChartsCore from 'echarts-for-react/lib/core'
import * as echarts from 'echarts/core'
import { BarChart, LineChart, HeatmapChart, ScatterChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  VisualMapComponent,
  DataZoomComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

import kpiRaw from '@/public/data/churn/kpi_cards.json'
import tenureRaw from '@/public/data/churn/churn_by_tenure.json'
import driversRaw from '@/public/data/churn/churn_drivers.json'
import heatmapRaw from '@/public/data/churn/churn_risk_heatmap.json'
import paymentRaw from '@/public/data/churn/payment_method_churn.json'
import serviceRaw from '@/public/data/churn/service_adoption_churn.json'
import chargesRaw from '@/public/data/churn/monthly_charges_churn.json'
import { Reveal } from '@/components/reveal'

echarts.use([
  BarChart,
  LineChart,
  HeatmapChart,
  ScatterChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  VisualMapComponent,
  DataZoomComponent,
  CanvasRenderer,
])

/* eslint-disable @typescript-eslint/no-explicit-any */
type EParam = Record<string, any>
/* eslint-enable @typescript-eslint/no-explicit-any */

/* ── Palette ──────────────────────────────────────────────────────────── */
const PALETTE = {
  white100: 'rgba(255,255,255,1)',
  white94: 'rgba(255,255,255,0.94)',
  white84: 'rgba(255,255,255,0.84)',
  white70: 'rgba(255,255,255,0.70)',
  white50: 'rgba(255,255,255,0.50)',
  white35: 'rgba(255,255,255,0.35)',
  white20: 'rgba(255,255,255,0.20)',
  white12: 'rgba(255,255,255,0.12)',
  white08: 'rgba(255,255,255,0.08)',
  white04: 'rgba(255,255,255,0.04)',
  accent1: 'rgba(242,242,242,0.92)',
  accent2: 'rgba(242,242,242,0.72)',
  accent3: 'rgba(242,242,242,0.52)',
  accent4: 'rgba(242,242,242,0.36)',
  accent5: 'rgba(242,242,242,0.22)',
  accent6: 'rgba(242,242,242,0.14)',
}

const SERIES_COLORS = [
  PALETTE.white100,
  PALETTE.white70,
  PALETTE.accent3,
  PALETTE.white50,
  PALETTE.accent4,
  PALETTE.white35,
]

/* ── Shared tooltip/axis styling ─────────────────────────────────────── */
const tooltipStyle = {
  backgroundColor: 'rgba(12,12,12,0.95)',
  borderColor: 'rgba(255,255,255,0.1)',
  borderWidth: 1,
  textStyle: {
    color: PALETTE.white94,
    fontSize: 12,
    fontFamily: 'var(--font-mono), monospace',
  },
  extraCssText: 'backdrop-filter:blur(12px);border-radius:10px;box-shadow:0 12px 40px rgba(0,0,0,0.4);',
}

const axisLabel = {
  color: PALETTE.white50,
  fontSize: 11,
  fontFamily: 'var(--font-mono), monospace',
}

const axisLine = { lineStyle: { color: PALETTE.white08 } }
const splitLine = { lineStyle: { color: PALETTE.white08, type: 'dashed' as const } }

/* ── Chart wrapper ───────────────────────────────────────────────────── */
function Chart({ option, height = 340 }: { option: echarts.EChartsCoreOption; height?: number }) {
  return (
    <ReactEChartsCore
      echarts={echarts}
      option={option}
      style={{ height, width: '100%' }}
      opts={{ renderer: 'canvas' }}
      notMerge
      lazyUpdate
    />
  )
}

/* ── 1. MAIN CHART: Tenure — bar + line combo ────────────────────────── */
function TenureChart() {
  const option = useMemo<echarts.EChartsCoreOption>(() => ({
    tooltip: {
      ...tooltipStyle,
      trigger: 'axis',
      axisPointer: { type: 'shadow', shadowStyle: { color: 'rgba(255,255,255,0.03)' } },
      formatter: (params: EParam | EParam[]) => {
        const p = Array.isArray(params) ? params : [params]
        const band = p[0]?.axisValue ?? ''
        let html = `<div style="margin-bottom:6px;font-weight:600;font-size:13px;color:${PALETTE.white94}">Tenure ${band} mo</div>`
        p.forEach((s: EParam) => {
          const unit = s.seriesName === 'Churn Rate' ? '%' : ''
          const val = typeof s.value === 'number' ? s.value.toLocaleString() : s.value
          html += `<div style="display:flex;align-items:center;gap:6px;margin:3px 0"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${s.color}"></span><span style="color:${PALETTE.white70}">${s.seriesName}:</span><span style="font-weight:600;color:${PALETTE.white94}">${val}${unit}</span></div>`
        })
        return html
      },
    },
    legend: {
      show: true,
      top: 0,
      right: 0,
      itemWidth: 10,
      itemHeight: 10,
      textStyle: { color: PALETTE.white50, fontSize: 11, fontFamily: 'var(--font-mono), monospace' },
      itemGap: 18,
    },
    grid: { top: 48, right: 56, bottom: 36, left: 56, containLabel: false },
    xAxis: {
      type: 'category',
      data: tenureRaw.data.map((d) => d.band),
      axisLabel: { ...axisLabel, fontSize: 11 },
      axisLine,
      axisTick: { show: false },
    },
    yAxis: [
      {
        type: 'value',
        name: 'Customers',
        nameTextStyle: { color: PALETTE.white35, fontSize: 10, fontFamily: 'var(--font-mono), monospace' },
        axisLabel,
        splitLine,
        axisLine: { show: false },
      },
      {
        type: 'value',
        name: 'Churn %',
        nameTextStyle: { color: PALETTE.white35, fontSize: 10, fontFamily: 'var(--font-mono), monospace' },
        axisLabel: { ...axisLabel, formatter: '{value}%' },
        splitLine: { show: false },
        axisLine: { show: false },
        max: 55,
      },
    ],
    series: [
      {
        name: 'Customers',
        type: 'bar',
        data: tenureRaw.data.map((d) => d.customers),
        barWidth: '48%',
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: PALETTE.accent1 },
            { offset: 1, color: PALETTE.accent5 },
          ]),
          borderRadius: [4, 4, 0, 0],
        },
        emphasis: { itemStyle: { color: PALETTE.white100 } },
      },
      {
        name: 'Churn Rate',
        type: 'line',
        yAxisIndex: 1,
        data: tenureRaw.data.map((d) => d.churnRate),
        smooth: 0.35,
        symbol: 'circle',
        symbolSize: 7,
        lineStyle: { width: 2.5, color: PALETTE.white100 },
        itemStyle: {
          color: PALETTE.white100,
          borderColor: 'rgba(0,0,0,0.8)',
          borderWidth: 2,
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(255,255,255,0.08)' },
            { offset: 1, color: 'rgba(255,255,255,0)' },
          ]),
        },
      },
    ],
  }), [])
  return <Chart option={option} height={360} />
}

/* ── 2. Churn Drivers — horizontal bar ───────────────────────────────── */
function DriversChart() {
  const data = useMemo(() => [...driversRaw.data].reverse(), [])
  const option = useMemo<echarts.EChartsCoreOption>(() => ({
    tooltip: {
      ...tooltipStyle,
      trigger: 'axis',
      axisPointer: { type: 'shadow', shadowStyle: { color: 'rgba(255,255,255,0.03)' } },
      formatter: (params: EParam | EParam[]) => {
        const p = Array.isArray(params) ? params[0] : params
        const item = driversRaw.data.find((d) => d.driver === p.name)
        return `<div style="font-weight:600;margin-bottom:4px;color:${PALETTE.white94}">${p.name}</div><div style="color:${PALETTE.white70}">Weighted churn: <span style="font-weight:600;color:${PALETTE.white94}">${p.value}%</span></div>${item ? `<div style="color:${PALETTE.white50};font-size:11px;margin-top:4px">${item.signal}</div>` : ''}`
      },
    },
    grid: { top: 8, right: 56, bottom: 8, left: 10, containLabel: true },
    xAxis: {
      type: 'value',
      axisLabel: { ...axisLabel, formatter: '{value}%' },
      splitLine,
      axisLine: { show: false },
    },
    yAxis: {
      type: 'category',
      data: data.map((d) => d.driver),
      axisLabel: { ...axisLabel, fontSize: 11, width: 140, overflow: 'truncate' },
      axisLine,
      axisTick: { show: false },
    },
    series: [{
      type: 'bar',
      data: data.map((d, i) => ({
        value: d.weightedChurn,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: SERIES_COLORS[i % SERIES_COLORS.length] },
            { offset: 1, color: PALETTE.accent5 },
          ]),
          borderRadius: [0, 4, 4, 0],
        },
      })),
      barWidth: '58%',
      label: {
        show: true,
        position: 'right',
        formatter: '{c}%',
        color: PALETTE.white70,
        fontSize: 11,
        fontFamily: 'var(--font-mono), monospace',
      },
    }],
  }), [data])
  return <Chart option={option} height={260} />
}

/* ── 3. Contract × Tenure Heatmap ────────────────────────────────────── */
const CONTRACTS = ['Month-to-month', 'One year', 'Two year']

function HeatmapChart_() {
  const tenureBands = useMemo(() => [...new Set(heatmapRaw.data.map((d) => d.tenure))], [])
  const heatData = useMemo(() =>
    heatmapRaw.data.map((d) => [
      tenureBands.indexOf(d.tenure),
      CONTRACTS.indexOf(d.contract),
      d.churnRate,
    ]), [tenureBands])

  const option = useMemo<echarts.EChartsCoreOption>(() => ({
    tooltip: {
      ...tooltipStyle,
      formatter: (p: EParam) => {
        const [ti, ci, val] = p.data
        const item = heatmapRaw.data.find((d) => d.tenure === tenureBands[ti] && d.contract === CONTRACTS[ci])
        return `<div style="font-weight:600;margin-bottom:4px;color:${PALETTE.white94}">${CONTRACTS[ci]}</div><div style="color:${PALETTE.white70}">Tenure: ${tenureBands[ti]} mo</div><div style="color:${PALETTE.white70}">Churn: <span style="font-weight:600;color:${PALETTE.white94}">${val}%</span></div>${item ? `<div style="color:${PALETTE.white50};font-size:11px">n=${item.count}</div>` : ''}`
      },
    },
    grid: { top: 8, right: 12, bottom: 48, left: 10, containLabel: true },
    xAxis: {
      type: 'category',
      data: tenureBands,
      axisLabel: { ...axisLabel, fontSize: 10 },
      axisLine,
      axisTick: { show: false },
      name: 'Tenure (months)',
      nameLocation: 'middle',
      nameGap: 34,
      nameTextStyle: { color: PALETTE.white35, fontSize: 10, fontFamily: 'var(--font-mono), monospace' },
    },
    yAxis: {
      type: 'category',
      data: CONTRACTS,
      axisLabel: { ...axisLabel, fontSize: 10 },
      axisLine: { show: false },
      axisTick: { show: false },
    },
    visualMap: {
      min: 0,
      max: 60,
      calculable: false,
      show: false,
      inRange: {
        color: [
          'rgba(255,255,255,0.04)',
          'rgba(255,255,255,0.12)',
          'rgba(255,255,255,0.24)',
          'rgba(255,255,255,0.42)',
          'rgba(255,255,255,0.62)',
          'rgba(255,255,255,0.85)',
        ],
      },
    },
    series: [{
      type: 'heatmap',
      data: heatData,
      itemStyle: { borderColor: 'rgba(0,0,0,0.6)', borderWidth: 2, borderRadius: 3 },
      label: {
        show: true,
        formatter: (p: EParam) => {
          const val = p.data[2]
          return val > 30 ? `{dark|${val}%}` : `{light|${val}%}`
        },
        rich: {
          dark: { color: '#000', fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-mono), monospace' },
          light: { color: PALETTE.white84, fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-mono), monospace' },
        },
      },
      emphasis: {
        itemStyle: { borderColor: PALETTE.white100, borderWidth: 2 },
      },
    }],
  }), [tenureBands, heatData])
  return <Chart option={option} height={200} />
}

/* ── 4. Payment Method — bar chart ───────────────────────────────────── */
function PaymentChart() {
  const option = useMemo<echarts.EChartsCoreOption>(() => ({
    tooltip: {
      ...tooltipStyle,
      trigger: 'axis',
      axisPointer: { type: 'shadow', shadowStyle: { color: 'rgba(255,255,255,0.03)' } },
      formatter: (params: EParam | EParam[]) => {
        const p = Array.isArray(params) ? params : [params]
        const name = p[0]?.axisValue ?? ''
        let html = `<div style="font-weight:600;margin-bottom:4px;color:${PALETTE.white94}">${name}</div>`
        p.forEach((s: EParam) => {
          html += `<div style="display:flex;align-items:center;gap:6px;margin:2px 0"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${s.color}"></span><span style="color:${PALETTE.white70}">${s.seriesName}:</span><span style="font-weight:600;color:${PALETTE.white94}">${s.value.toLocaleString()}</span></div>`
        })
        return html
      },
    },
    legend: {
      show: true,
      top: 0,
      right: 0,
      itemWidth: 10,
      itemHeight: 10,
      textStyle: { color: PALETTE.white50, fontSize: 11, fontFamily: 'var(--font-mono), monospace' },
      itemGap: 18,
    },
    grid: { top: 42, right: 12, bottom: 52, left: 10, containLabel: true },
    xAxis: {
      type: 'category',
      data: paymentRaw.data.map((d) => d.method),
      axisLabel: { ...axisLabel, fontSize: 10, rotate: 18 },
      axisLine,
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLabel,
      splitLine,
      axisLine: { show: false },
    },
    series: [
      {
        name: 'Retained',
        type: 'bar',
        stack: 'total',
        data: paymentRaw.data.map((d) => d.retained),
        itemStyle: { color: PALETTE.accent3, borderRadius: [0, 0, 0, 0] },
        emphasis: { itemStyle: { color: PALETTE.accent2 } },
      },
      {
        name: 'Churned',
        type: 'bar',
        stack: 'total',
        data: paymentRaw.data.map((d) => d.churned),
        itemStyle: { color: PALETTE.white100, borderRadius: [4, 4, 0, 0] },
        emphasis: { itemStyle: { color: PALETTE.white100 } },
      },
    ],
  }), [])
  return <Chart option={option} height={300} />
}

/* ── 5. Service Adoption — grouped bar ───────────────────────────────── */
function ServiceChart() {
  const option = useMemo<echarts.EChartsCoreOption>(() => ({
    tooltip: {
      ...tooltipStyle,
      trigger: 'axis',
      axisPointer: { type: 'shadow', shadowStyle: { color: 'rgba(255,255,255,0.03)' } },
      formatter: (params: EParam | EParam[]) => {
        const p = Array.isArray(params) ? params : [params]
        const name = p[0]?.axisValue ?? ''
        let html = `<div style="font-weight:600;margin-bottom:4px;color:${PALETTE.white94}">${name}</div>`
        p.forEach((s: EParam) => {
          html += `<div style="display:flex;align-items:center;gap:6px;margin:2px 0"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${s.color}"></span><span style="color:${PALETTE.white70}">${s.seriesName}:</span><span style="font-weight:600;color:${PALETTE.white94}">${s.value}%</span></div>`
        })
        return html
      },
    },
    legend: {
      show: true,
      top: 0,
      right: 0,
      itemWidth: 10,
      itemHeight: 10,
      textStyle: { color: PALETTE.white50, fontSize: 11, fontFamily: 'var(--font-mono), monospace' },
      itemGap: 18,
    },
    grid: { top: 42, right: 12, bottom: 52, left: 10, containLabel: true },
    xAxis: {
      type: 'category',
      data: serviceRaw.data.map((d) => d.service),
      axisLabel: { ...axisLabel, fontSize: 10, rotate: 22 },
      axisLine,
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLabel: { ...axisLabel, formatter: '{value}%' },
      splitLine,
      axisLine: { show: false },
      max: 50,
    },
    series: [
      {
        name: 'With Service',
        type: 'bar',
        data: serviceRaw.data.map((d) => d.withService),
        barWidth: '28%',
        barGap: '18%',
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: PALETTE.accent2 },
            { offset: 1, color: PALETTE.accent5 },
          ]),
          borderRadius: [4, 4, 0, 0],
        },
      },
      {
        name: 'Without Service',
        type: 'bar',
        data: serviceRaw.data.map((d) => d.withoutService),
        barWidth: '28%',
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: PALETTE.white100 },
            { offset: 1, color: PALETTE.white50 },
          ]),
          borderRadius: [4, 4, 0, 0],
        },
      },
    ],
  }), [])
  return <Chart option={option} height={300} />
}

/* ── 6. Monthly Charges Distribution ─────────────────────────────────── */
function ChargesChart() {
  const option = useMemo<echarts.EChartsCoreOption>(() => ({
    tooltip: {
      ...tooltipStyle,
      trigger: 'axis',
      axisPointer: { type: 'shadow', shadowStyle: { color: 'rgba(255,255,255,0.03)' } },
      formatter: (params: EParam | EParam[]) => {
        const p = Array.isArray(params) ? params[0] : params
        const item = chargesRaw.data.find((d) => d.range === p.name)
        return `<div style="font-weight:600;margin-bottom:4px;color:${PALETTE.white94}">${p.name}</div><div style="color:${PALETTE.white70}">Churn rate: <span style="font-weight:600;color:${PALETTE.white94}">${p.value}%</span></div>${item ? `<div style="color:${PALETTE.white50};font-size:11px">${item.churned} of ${item.total} customers</div>` : ''}`
      },
    },
    grid: { top: 24, right: 12, bottom: 36, left: 10, containLabel: true },
    xAxis: {
      type: 'category',
      data: chargesRaw.data.map((d) => d.range),
      axisLabel: { ...axisLabel, fontSize: 10 },
      axisLine,
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLabel: { ...axisLabel, formatter: '{value}%' },
      splitLine,
      axisLine: { show: false },
    },
    series: [{
      type: 'bar',
      data: chargesRaw.data.map((d, i) => ({
        value: d.churnRate,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: i >= 3 ? PALETTE.white100 : PALETTE.accent3 },
            { offset: 1, color: PALETTE.accent5 },
          ]),
          borderRadius: [4, 4, 0, 0],
        },
      })),
      barWidth: '52%',
      label: {
        show: true,
        position: 'top',
        formatter: '{c}%',
        color: PALETTE.white70,
        fontSize: 10,
        fontFamily: 'var(--font-mono), monospace',
      },
    }],
  }), [])
  return <Chart option={option} height={260} />
}

/* ── DASHBOARD EXPORT ────────────────────────────────────────────────── */
export function ChurnDashboard() {
  return (
    <div className="flex flex-col gap-[clamp(24px,3vw,36px)]">
      {/* KPI Strip */}
      <Reveal>
      <div className="grid grid-cols-4 gap-[clamp(8px,1vw,12px)] max-md:grid-cols-2 max-sm:grid-cols-1">
        {kpiRaw.cards.map((kpi, i) => (
          <Reveal key={kpi.label} delay={i * 0.04}>
          <div
            className="flex flex-col items-start gap-0.5 rounded-sm p-[10px_clamp(12px,1.2vw,16px)] transition-all duration-[280ms] ease-out-expo"
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
          </div>
          </Reveal>
        ))}
      </div>
      </Reveal>

      {/* Main chart: Lifecycle Risk Curve */}
      <Reveal delay={0.04}>
      <div>
        <div className="mb-3">
          <p className="text-gradient mb-[5px] font-mono text-[0.68rem] font-semibold uppercase tracking-[0.15em]">
            Lifecycle Risk Curve
          </p>
          <h3
            className="font-[650] leading-[1.36] tracking-[-0.02em] text-foreground text-wrap-balance"
            style={{ fontSize: 'clamp(1.14rem, 0.66vw + 0.88rem, 1.3rem)' }}
          >
            Tenure bands — customer volume and churn-rate overlay
          </h3>
        </div>
        <TenureChart />
      </div>
      </Reveal>

      {/* Split view: Drivers + Heatmap */}
      <div className="grid grid-cols-[1fr_1fr] items-start gap-[clamp(20px,2.5vw,32px)] max-lg:grid-cols-1">
        {/* Churn Drivers */}
        <Reveal delay={0.04}>
        <div>
          <div className="mb-3">
            <p className="text-gradient mb-[5px] font-mono text-[0.68rem] font-semibold uppercase tracking-[0.15em]">
              Churn Drivers
            </p>
            <h3
              className="font-[650] leading-[1.36] tracking-[-0.02em] text-foreground text-wrap-balance"
              style={{ fontSize: 'clamp(1.14rem, 0.66vw + 0.88rem, 1.3rem)' }}
            >
              Top factors ranked by weighted churn contribution
            </h3>
          </div>
          <DriversChart />
        </div>
        </Reveal>

        {/* Heatmap */}
        <Reveal delay={0.08}>
        <div>
          <div className="mb-3">
            <p className="text-gradient mb-[5px] font-mono text-[0.68rem] font-semibold uppercase tracking-[0.15em]">
              Risk Matrix
            </p>
            <h3
              className="font-[650] leading-[1.36] tracking-[-0.02em] text-foreground text-wrap-balance"
              style={{ fontSize: 'clamp(1.14rem, 0.66vw + 0.88rem, 1.3rem)' }}
            >
              Churn rate by contract type and tenure
            </h3>
          </div>
          <HeatmapChart_ />
        </div>
        </Reveal>
      </div>

      {/* Split view: Service Adoption + Payment Method */}
      <div className="grid grid-cols-[1fr_1fr] items-start gap-[clamp(20px,2.5vw,32px)] max-lg:grid-cols-1">
        {/* Service Adoption */}
        <Reveal delay={0.04}>
        <div>
          <div className="mb-3">
            <p className="text-gradient mb-[5px] font-mono text-[0.68rem] font-semibold uppercase tracking-[0.15em]">
              Service Adoption Impact
            </p>
            <h3
              className="font-[650] leading-[1.36] tracking-[-0.02em] text-foreground text-wrap-balance"
              style={{ fontSize: 'clamp(1.14rem, 0.66vw + 0.88rem, 1.3rem)' }}
            >
              Churn rate with vs without each add-on
            </h3>
          </div>
          <ServiceChart />
        </div>
        </Reveal>

        {/* Payment Method */}
        <Reveal delay={0.08}>
        <div>
          <div className="mb-3">
            <p className="text-gradient mb-[5px] font-mono text-[0.68rem] font-semibold uppercase tracking-[0.15em]">
              Payment Method
            </p>
            <h3
              className="font-[650] leading-[1.36] tracking-[-0.02em] text-foreground text-wrap-balance"
              style={{ fontSize: 'clamp(1.14rem, 0.66vw + 0.88rem, 1.3rem)' }}
            >
              Customer retention by billing type
            </h3>
          </div>
          <PaymentChart />
        </div>
        </Reveal>
      </div>

      {/* Monthly Charges */}
      <Reveal delay={0.04}>
      <div>
        <div className="mb-3">
          <p className="text-gradient mb-[5px] font-mono text-[0.68rem] font-semibold uppercase tracking-[0.15em]">
            Price Sensitivity
          </p>
          <h3
            className="font-[650] leading-[1.36] tracking-[-0.02em] text-foreground text-wrap-balance"
            style={{ fontSize: 'clamp(1.14rem, 0.66vw + 0.88rem, 1.3rem)' }}
          >
            Churn rate by monthly charge bracket
          </h3>
        </div>
        <ChargesChart />
      </div>
      </Reveal>
    </div>
  )
}
