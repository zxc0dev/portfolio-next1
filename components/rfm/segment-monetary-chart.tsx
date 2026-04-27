'use client'

import { memo, useMemo } from 'react'
import ReactEChartsCore from 'echarts-for-react/lib/core'
import {
  echarts,
  PALETTE,
  KMEANS_COLORS,
  tooltipStyle,
  axisLabelStyle,
  axisLineStyle,
  splitLineStyle,
} from './config'
import type { EParam } from './config'
import monetaryRaw from '@/public/data/rfm/segment_monetary.json'

export const SegmentMonetaryChart = memo(function SegmentMonetaryChart() {
  const data = useMemo(() => [...monetaryRaw.data].reverse(), [])

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
          const raw = monetaryRaw.data.find((d) => d.segment === p.name)
          const avgStr =
            typeof p.value === 'number'
              ? p.value.toLocaleString('en-GB', {
                  style: 'currency',
                  currency: 'GBP',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })
              : p.value
          const medStr = raw?.median_monetary
            ? raw.median_monetary.toLocaleString('en-GB', {
                style: 'currency',
                currency: 'GBP',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })
            : '—'
          return `<div style="font-weight:600;margin-bottom:4px;color:${PALETTE.white94}">${p.name}</div><div style="color:${PALETTE.white70}">Avg Revenue: <span style="font-weight:600;color:${PALETTE.white94}">${avgStr}</span></div><div style="color:${PALETTE.white70}">Median: <span style="color:${PALETTE.white50}">${medStr}</span></div>${raw ? `<div style="color:${PALETTE.white50};font-size:11px">n=${raw.count?.toLocaleString()}</div>` : ''}`
        },
      },
      grid: { top: 8, right: 80, bottom: 8, left: 10, containLabel: true },
      xAxis: {
        type: 'value',
        axisLabel: {
          ...axisLabelStyle,
          formatter: (v: number) =>
            v >= 1_000 ? `£${(v / 1_000).toFixed(0)}K` : `£${v}`,
        },
        splitLine: splitLineStyle,
        axisLine: { show: false },
      },
      yAxis: {
        type: 'category',
        data: data.map((d) => d.segment),
        axisLabel: { ...axisLabelStyle, fontSize: 12 },
        axisLine: axisLineStyle,
        axisTick: { show: false },
      },
      series: [
        {
          type: 'bar',
          data: data.map((d, i) => ({
            value: d.avg_monetary,
            name: d.segment,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                {
                  offset: 0,
                  color: KMEANS_COLORS[
                    (monetaryRaw.data.length - 1 - i) % KMEANS_COLORS.length
                  ],
                },
                { offset: 1, color: PALETTE.accent6 },
              ]),
              borderRadius: [0, 4, 4, 0],
            },
          })),
          barWidth: '48%',
          label: {
            show: true,
            position: 'right',
            formatter: (p: EParam) => {
              const v = typeof p.value === 'number' ? p.value : 0
              return v >= 1_000 ? `£${(v / 1_000).toFixed(1)}K` : `£${v}`
            },
            color: PALETTE.white50,
            fontSize: 12,
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
      style={{ height: 200, width: '100%' }}
      opts={{
        renderer: 'canvas',
        devicePixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 2,
      }}
      notMerge
      lazyUpdate
    />
  )
})
