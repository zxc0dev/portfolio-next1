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
import countryRaw from '@/public/data/rfm/sales_by_country.json'

export const CountryChart = memo(function CountryChart() {
  // Reverse so largest is at top
  const data = useMemo(() => [...countryRaw.data].reverse(), [])

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
          const raw = countryRaw.data.find((d) => d.country === p.name)
          const revStr =
            typeof p.value === 'number'
              ? p.value.toLocaleString('en-GB', {
                  style: 'currency',
                  currency: 'GBP',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })
              : p.value
          const totalRev = countryRaw.data.reduce((s, d) => s + d.revenue, 0)
          const pct =
            typeof p.value === 'number' ? ((p.value / totalRev) * 100).toFixed(1) : '—'
          return `<div style="font-weight:600;margin-bottom:4px;color:${PALETTE.white94}">${p.name}</div><div style="color:${PALETTE.white70}">Revenue: <span style="font-weight:600;color:${PALETTE.white94}">${revStr}</span></div><div style="color:${PALETTE.white50};font-size:11px">Share: ${pct}%${raw ? `  ·  ${raw.quantity.toLocaleString()} units` : ''}</div>`
        },
      },
      grid: { top: 8, right: 80, bottom: 8, left: 10, containLabel: true },
      xAxis: {
        type: 'value',
        axisLabel: {
          ...axisLabelStyle,
          fontSize: 11,
          formatter: (v: number) =>
            v >= 1_000_000
              ? `£${(v / 1_000_000).toFixed(1)}M`
              : v >= 1_000
                ? `£${(v / 1_000).toFixed(0)}K`
                : `£${v}`,
        },
        splitLine: splitLineStyle,
        axisLine: { show: false },
      },
      yAxis: {
        type: 'category',
        data: data.map((d) => d.country),
        axisLabel: { ...axisLabelStyle, fontSize: 11 },
        axisLine: axisLineStyle,
        axisTick: { show: false },
      },
      series: [
        {
          type: 'bar',
          data: data.map((d, i) => ({
            value: d.revenue,
            name: d.country,
            itemStyle: {
              // UK gets brightest; others fade proportionally
              color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                {
                  offset: 0,
                  color:
                    i === data.length - 1
                      ? PALETTE.white94
                      : `rgba(255,255,255,${0.28 + (i / (data.length - 1)) * 0.44})`,
                },
                { offset: 1, color: PALETTE.accent6 },
              ]),
              borderRadius: [0, 4, 4, 0],
            },
          })),
          barWidth: '62%',
          label: {
            show: true,
            position: 'right',
            formatter: (p: EParam) => {
              const v = typeof p.value === 'number' ? p.value : 0
              return v >= 1_000_000
                ? `£${(v / 1_000_000).toFixed(2)}M`
                : v >= 1_000
                  ? `£${(v / 1_000).toFixed(0)}K`
                  : `£${v}`
            },
            color: PALETTE.white50,
            fontSize: 11,
            fontFamily: 'var(--font-mono), monospace',
          },
        },
      ],
    }),
    [data],
  )

  return (
    <ReactEChartsCore
      echarts={echarts}
      option={option}
      style={{ height: 520, width: '100%' }}
      opts={{
        renderer: 'canvas',
        devicePixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 2,
      }}
      notMerge
      lazyUpdate
    />
  )
})
