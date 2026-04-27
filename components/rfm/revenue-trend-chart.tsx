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
import trendRaw from '@/public/data/rfm/revenue_trend.json'

export const RevenueTrendChart = memo(function RevenueTrendChart() {
  const option = useMemo<echarts.EChartsCoreOption>(() => {
    const months = trendRaw.data.map((d) => d.month)
    const revenues = trendRaw.data.map((d) => d.revenue)

    return {
      tooltip: {
        ...tooltipStyle,
        trigger: 'axis',
        axisPointer: {
          type: 'line',
          lineStyle: { color: PALETTE.white20, type: 'dashed' },
        },
        formatter: (params: EParam | EParam[]) => {
          const p = Array.isArray(params) ? params[0] : params
          if (!p) return ''
          const val = typeof p.value === 'number' ? p.value.toLocaleString('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0, maximumFractionDigits: 0 }) : p.value
          return `<div style="margin-bottom:5px;font-weight:600;color:${PALETTE.white94}">${p.axisValue}</div><div style="display:flex;align-items:center;gap:6px"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${p.color}"></span><span style="color:${PALETTE.white70}">Revenue:</span><span style="font-weight:600;color:${PALETTE.white94}">${val}</span></div>`
        },
      },
      grid: { top: 28, right: 20, bottom: 56, left: 64, containLabel: false },
      xAxis: {
        type: 'category',
        data: months,
        axisLabel: {
          ...axisLabelStyle,
          fontSize: 11,
          rotate: 35,
          interval: 0,
        },
        axisLine: axisLineStyle,
        axisTick: { show: false },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          ...axisLabelStyle,
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
      series: [
        {
          type: 'line',
          data: revenues,
          smooth: 0.35,
          symbol: 'circle',
          symbolSize: 5,
          lineStyle: {
            color: PALETTE.white94,
            width: 2,
          },
          itemStyle: { color: PALETTE.white100 },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(255,255,255,0.14)' },
              { offset: 1, color: 'rgba(255,255,255,0.02)' },
            ]),
          },
          emphasis: {
            itemStyle: { color: PALETTE.white100, borderWidth: 2 },
          },
        },
      ],
    }
  }, [])

  return (
    <ReactEChartsCore
      echarts={echarts}
      option={option}
      style={{ height: 320, width: '100%' }}
      opts={{
        renderer: 'canvas',
        devicePixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 2,
      }}
      notMerge
      lazyUpdate
    />
  )
})
