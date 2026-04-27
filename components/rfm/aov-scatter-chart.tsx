'use client'

import { memo, useMemo } from 'react'
import ReactEChartsCore from 'echarts-for-react/lib/core'
import {
  echarts,
  PALETTE,
  SEGMENT_COLORS,
  tooltipStyle,
  axisLabelStyle,
  splitLineStyle,
} from './config'
import type { EParam } from './config'
import scatterRaw from '@/public/data/rfm/aov_vs_return_ratio.json'

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

export const AovScatterChart = memo(function AovScatterChart() {
  const option = useMemo<echarts.EChartsCoreOption>(() => {
    const series = scatterRaw.series.map((seg) => ({
      name: SEGMENT_LABELS[seg.segment] ?? seg.segment,
      type: 'scatter' as const,
      data: seg.points.map((p) => [p.aov, p.rr]),
      symbolSize: 6,
      itemStyle: {
        color: SEGMENT_COLORS[seg.segment] ?? PALETTE.white35,
        opacity: 0.72,
      },
      emphasis: {
        itemStyle: { opacity: 1, borderColor: PALETTE.white94, borderWidth: 1 },
      },
    }))

    return {
      tooltip: {
        ...tooltipStyle,
        trigger: 'item',
        formatter: (p: EParam) => {
          const vals = p.value
          if (!Array.isArray(vals) || vals.length < 2) return ''
          const [aov, rr] = vals as [number, number]
          const aovStr = aov.toLocaleString('en-GB', {
            style: 'currency',
            currency: 'GBP',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
          const rrPct = (rr * 100).toFixed(1)
          return `<div style="font-weight:600;margin-bottom:4px;color:${PALETTE.white94}">${p.seriesName}</div><div style="color:${PALETTE.white70}">AOV: <span style="font-weight:600;color:${PALETTE.white94}">${aovStr}</span></div><div style="color:${PALETTE.white70}">Return ratio: <span style="font-weight:600;color:${PALETTE.white94}">${rrPct}%</span></div>`
        },
      },
      legend: {
        show: true,
        top: 0,
        right: 0,
        orient: 'horizontal',
        itemWidth: 8,
        itemHeight: 8,
        textStyle: {
          color: PALETTE.white50,
          fontSize: 10,
          fontFamily: 'var(--font-mono), monospace',
        },
        itemGap: 12,
      },
      grid: { top: 48, right: 20, bottom: 56, left: 64, containLabel: false },
      xAxis: {
        type: 'value',
        name: 'AOV (£)',
        nameLocation: 'middle',
        nameGap: 36,
        nameTextStyle: {
          color: PALETTE.white35,
          fontSize: 11,
          fontFamily: 'var(--font-mono), monospace',
        },
        axisLabel: {
          ...axisLabelStyle,
          formatter: (v: number) =>
            v >= 1_000 ? `£${(v / 1_000).toFixed(0)}K` : `£${v}`,
        },
        splitLine: splitLineStyle,
        axisLine: { show: false },
        min: -200,
        max: 15000,
      },
      yAxis: {
        type: 'value',
        name: 'Return Ratio',
        nameLocation: 'middle',
        nameGap: 48,
        nameTextStyle: {
          color: PALETTE.white35,
          fontSize: 11,
          fontFamily: 'var(--font-mono), monospace',
        },
        axisLabel: {
          ...axisLabelStyle,
          formatter: (v: number) => `${(v * 100).toFixed(0)}%`,
        },
        splitLine: splitLineStyle,
        axisLine: { show: false },
        min: 0,
        max: 1,
      },
      series,
    }
  }, [])

  return (
    <ReactEChartsCore
      echarts={echarts}
      option={option}
      style={{ height: 420, width: '100%' }}
      opts={{
        renderer: 'canvas',
        devicePixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 2,
      }}
      notMerge
      lazyUpdate
    />
  )
})
