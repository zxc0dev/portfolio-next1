'use client'

import { memo, useMemo } from 'react'
import ReactEChartsCore from 'echarts-for-react/lib/core'
import {
  echarts,
  PALETTE,
  tooltipStyle,
  axisLabelStyle,
  axisLineStyle,
  splitLineStyle,
} from './config'
import type { EParam } from './config'
import raw from '@/public/data/rfm/segment_revenue.json'

const SEGMENT_LABELS: Record<string, string> = {
  champions: 'Champions',
  loyal_customers: 'Loyal Customers',
  potential_loyalists: 'Potential Loyalists',
  new_customers: 'New Customers',
  promising: 'Promising',
  need_attention: 'Need Attention',
  about_to_sleep: 'About to Sleep',
  at_risk: 'At Risk',
  cant_lose: "Can't Lose",
  hibernating: 'Hibernating',
  lost: 'Lost',
}

const fmtGBP = (v: number) =>
  v >= 1_000_000
    ? `£${(v / 1_000_000).toFixed(2)}M`
    : v >= 1_000
      ? `£${(v / 1_000).toFixed(1)}K`
      : `£${v.toFixed(0)}`

export const SegmentRevenueChart = memo(function SegmentRevenueChart() {
  const data = useMemo(
    () =>
      [...raw.data]
        .filter((d) => d.total_monetary > 0)
        .sort((a, b) => a.total_monetary - b.total_monetary), // ascending so top is at chart top
    [],
  )

  const option = useMemo<echarts.EChartsCoreOption>(
    () => ({
      tooltip: {
        ...tooltipStyle,
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
          shadowStyle: { color: 'rgba(255,255,255,0.03)' },
        },
        formatter: (params: EParam | EParam[]) => {
          const p = Array.isArray(params) ? params[0] : params
          if (!p) return ''
          const row = raw.data.find((d) => SEGMENT_LABELS[d.segment] === p.name)
          if (!row) return ''
          return [
            `<div style="font-weight:600;margin-bottom:5px;color:${PALETTE.white94}">${p.name}</div>`,
            `<div style="color:${PALETTE.white70}">Revenue share: <span style="font-weight:600;color:${PALETTE.white94}">${row.pct_revenue}%</span></div>`,
            `<div style="color:${PALETTE.white70}">Total revenue: <span style="font-weight:600;color:${PALETTE.white94}">${fmtGBP(row.total_monetary)}</span></div>`,
            `<div style="color:${PALETTE.white70}">Avg per customer: <span style="color:${PALETTE.white94}">${fmtGBP(row.avg_monetary)}</span></div>`,
            `<div style="color:${PALETTE.white50};font-size:11px">Customers: ${row.count.toLocaleString()} · Avg recency: ${row.avg_recency}d · Avg freq: ${row.avg_frequency}×</div>`,
          ].join('')
        },
      },
      grid: { top: 8, right: 60, bottom: 8, left: 10, containLabel: true },
      xAxis: {
        type: 'value',
        axisLabel: {
          ...axisLabelStyle,
          formatter: (v: number) => `${v}%`,
        },
        max: Math.ceil((Math.max(...data.map((d) => d.pct_revenue)) + 2) / 5) * 5,
        splitLine: splitLineStyle,
        axisLine: { show: false },
      },
      yAxis: {
        type: 'category',
        data: data.map((d) => SEGMENT_LABELS[d.segment] ?? d.segment),
        axisLabel: { ...axisLabelStyle, fontSize: 12 },
        axisLine: axisLineStyle,
        axisTick: { show: false },
      },
      series: [
        {
          type: 'bar',
          barMaxWidth: 22,
          label: {
            show: true,
            position: 'right',
            color: PALETTE.white50,
            fontSize: 11,
            fontFamily: 'JetBrains Mono, monospace',
            formatter: (p: EParam) => {
              const row = raw.data.find((d) => SEGMENT_LABELS[d.segment] === p.name)
              return row ? `${row.pct_revenue}%` : ''
            },
          },
          data: data.map((d, i) => ({
            value: d.pct_revenue,
            name: SEGMENT_LABELS[d.segment] ?? d.segment,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                {
                  offset: 0,
                  color: `rgba(255,255,255,${0.55 + (i / (data.length - 1)) * 0.35})`,
                },
                { offset: 1, color: 'rgba(255,255,255,0.08)' },
              ]),
              borderRadius: [0, 2, 2, 0],
            },
          })),
        },
      ],
    }),
    [data],
  )

  return (
    <ReactEChartsCore
      echarts={echarts}
      option={option}
      style={{ height: 340 }}
      notMerge
    />
  )
})
