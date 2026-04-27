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
import productsRaw from '@/public/data/rfm/top_products_by_year.json'

interface TopProductsChartProps {
  year: '2009' | '2010' | '2011'
}

export const TopProductsChart = memo(function TopProductsChart({ year }: TopProductsChartProps) {
  // Reverse so highest bar appears at top in horizontal chart
  const data = useMemo(() => {
    const rawData = productsRaw[year as keyof typeof productsRaw] ?? []
    return [...rawData].reverse()
  }, [year])

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
          const valStr =
            typeof p.value === 'number'
              ? p.value.toLocaleString('en-GB', {
                  style: 'currency',
                  currency: 'GBP',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })
              : p.value
          return `<div style="max-width:200px;word-wrap:break-word;font-weight:600;margin-bottom:4px;color:${PALETTE.white94};font-size:12px">${p.name}</div><div style="color:${PALETTE.white70}">Revenue: <span style="font-weight:600;color:${PALETTE.white94}">${valStr}</span></div>`
        },
      },
      grid: { top: 8, right: 16, bottom: 8, left: 10, containLabel: true },
      xAxis: {
        type: 'value',
        axisLabel: {
          ...axisLabelStyle,
          fontSize: 10,
          formatter: (v: number) =>
            v >= 1_000 ? `£${(v / 1_000).toFixed(0)}K` : `£${v}`,
        },
        splitLine: splitLineStyle,
        axisLine: { show: false },
      },
      yAxis: {
        type: 'category',
        data: data.map((d) => {
          // Truncate long product names
          const name = d.name
          return name.length > 22 ? name.slice(0, 20) + '…' : name
        }),
        axisLabel: { ...axisLabelStyle, fontSize: 10 },
        axisLine: axisLineStyle,
        axisTick: { show: false },
      },
      series: [
        {
          type: 'bar',
          data: data.map((d, i) => ({
            value: d.revenue,
            name: d.name,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                { offset: 0, color: i >= 7 ? PALETTE.white94 : PALETTE.accent3 },
                { offset: 1, color: PALETTE.accent6 },
              ]),
              borderRadius: [0, 4, 4, 0],
            },
          })),
          barWidth: '56%',
        },
      ],
    }),
    [data],
  )

  return (
    <ReactEChartsCore
      echarts={echarts}
      option={option}
      style={{ height: 280, width: '100%' }}
      opts={{
        renderer: 'canvas',
        devicePixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 2,
      }}
      notMerge
      lazyUpdate
    />
  )
})
