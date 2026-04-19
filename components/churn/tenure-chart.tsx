'use client'

import { useMemo } from 'react'
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
import tenureRaw from '@/public/data/churn/churn_by_tenure.json'

export function TenureChart() {
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
          const band = p[0]?.axisValue ?? ''
          let html = `<div style="margin-bottom:6px;font-weight:600;font-size:13px;color:${PALETTE.white94}">Tenure ${band} mo</div>`
          p.forEach((s: EParam) => {
            const unit = s.seriesName === 'Churn Rate' ? '%' : ''
            const val =
              typeof s.value === 'number' ? s.value.toLocaleString() : s.value
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
        textStyle: {
          color: PALETTE.white50,
          fontSize: 11,
          fontFamily: 'var(--font-mono), monospace',
        },
        itemGap: 18,
      },
      grid: { top: 48, right: 56, bottom: 36, left: 56, containLabel: false },
      xAxis: {
        type: 'category',
        data: tenureRaw.data.map((d) => d.band),
        axisLabel: { ...axisLabelStyle, fontSize: 11 },
        axisLine: axisLineStyle,
        axisTick: { show: false },
      },
      yAxis: [
        {
          type: 'value',
          name: 'Customers',
          nameTextStyle: {
            color: PALETTE.white35,
            fontSize: 10,
            fontFamily: 'var(--font-mono), monospace',
          },
          axisLabel: axisLabelStyle,
          splitLine: splitLineStyle,
          axisLine: { show: false },
        },
        {
          type: 'value',
          name: 'Churn %',
          nameTextStyle: {
            color: PALETTE.white35,
            fontSize: 10,
            fontFamily: 'var(--font-mono), monospace',
          },
          axisLabel: { ...axisLabelStyle, formatter: '{value}%' },
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
    }),
    [],
  )

  return (
    <ReactEChartsCore
      echarts={echarts}
      option={option}
      style={{ height: 360, width: '100%' }}
      opts={{ renderer: 'canvas' }}
      notMerge
      lazyUpdate
    />
  )
}
