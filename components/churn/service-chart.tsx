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
import serviceRaw from '@/public/data/churn/service_adoption_churn.json'

export const ServiceChart = memo(function ServiceChart() {
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
        textStyle: {
          color: PALETTE.white50,
          fontSize: 11,
          fontFamily: 'var(--font-mono), monospace',
        },
        itemGap: 18,
      },
      grid: { top: 42, right: 12, bottom: 52, left: 10, containLabel: true },
      xAxis: {
        type: 'category',
        data: serviceRaw.data.map((d) => d.service),
        axisLabel: { ...axisLabelStyle, fontSize: 10, rotate: 22 },
        axisLine: axisLineStyle,
        axisTick: { show: false },
      },
      yAxis: {
        type: 'value',
        axisLabel: { ...axisLabelStyle, formatter: '{value}%' },
        splitLine: splitLineStyle,
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
    }),
    [],
  )

  return (
    <ReactEChartsCore
      echarts={echarts}
      option={option}
      style={{ height: 300, width: '100%' }}
      opts={{ renderer: 'canvas' }}
      notMerge
      lazyUpdate
    />
  )
})
