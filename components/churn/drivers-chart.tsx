'use client'

import { useMemo } from 'react'
import ReactEChartsCore from 'echarts-for-react/lib/core'
import {
  echarts,
  PALETTE,
  SERIES_COLORS,
  tooltipStyle,
  axisLabelStyle,
  axisLineStyle,
  splitLineStyle,
} from './config'
import type { EParam } from './config'
import driversRaw from '@/public/data/churn/churn_drivers.json'

export function DriversChart() {
  const data = useMemo(() => [...driversRaw.data].reverse(), [])
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
          const item = driversRaw.data.find((d) => d.driver === p.name)
          return `<div style="font-weight:600;margin-bottom:4px;color:${PALETTE.white94}">${p.name}</div><div style="color:${PALETTE.white70}">Weighted churn: <span style="font-weight:600;color:${PALETTE.white94}">${p.value}%</span></div>${item ? `<div style="color:${PALETTE.white50};font-size:11px;margin-top:4px">${item.signal}</div>` : ''}`
        },
      },
      grid: { top: 8, right: 56, bottom: 8, left: 10, containLabel: true },
      xAxis: {
        type: 'value',
        axisLabel: { ...axisLabelStyle, formatter: '{value}%' },
        splitLine: splitLineStyle,
        axisLine: { show: false },
      },
      yAxis: {
        type: 'category',
        data: data.map((d) => d.driver),
        axisLabel: {
          ...axisLabelStyle,
          fontSize: 11,
          width: 140,
          overflow: 'truncate',
        },
        axisLine: axisLineStyle,
        axisTick: { show: false },
      },
      series: [
        {
          type: 'bar',
          data: data.map((d, i) => ({
            value: d.weightedChurn,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 0,
                  color: SERIES_COLORS[i % SERIES_COLORS.length],
                },
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
        },
      ],
    }),
    [data],
  )

  return (
    <ReactEChartsCore
      echarts={echarts}
      option={option}
      style={{ height: 260, width: '100%' }}
      opts={{ renderer: 'canvas' }}
      notMerge
      lazyUpdate
    />
  )
}
