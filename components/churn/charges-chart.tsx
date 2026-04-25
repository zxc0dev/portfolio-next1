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
import chargesRaw from '@/public/data/churn/monthly_charges_churn.json'

export const ChargesChart = memo(function ChargesChart() {
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
          const item = chargesRaw.data.find((d) => d.range === p.name)
          return `<div style="font-weight:600;margin-bottom:4px;color:${PALETTE.white94}">${p.name}</div><div style="color:${PALETTE.white70}">Churn rate: <span style="font-weight:600;color:${PALETTE.white94}">${p.value}%</span></div>${item ? `<div style="color:${PALETTE.white50};font-size:11px">${item.churned} of ${item.total} customers</div>` : ''}`
        },
      },
      grid: { top: 24, right: 12, bottom: 36, left: 10, containLabel: true },
      xAxis: {
        type: 'category',
        data: chargesRaw.data.map((d) => d.range),
        axisLabel: { ...axisLabelStyle, fontSize: 10 },
        axisLine: axisLineStyle,
        axisTick: { show: false },
      },
      yAxis: {
        type: 'value',
        axisLabel: { ...axisLabelStyle, formatter: '{value}%' },
        splitLine: splitLineStyle,
        axisLine: { show: false },
      },
      series: [
        {
          type: 'bar',
          data: chargesRaw.data.map((d, i) => ({
            value: d.churnRate,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: i >= 3 ? PALETTE.white100 : PALETTE.accent3,
                },
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
        },
      ],
    }),
    [],
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
})
