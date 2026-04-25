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
import paymentRaw from '@/public/data/churn/payment_method_churn.json'

export function PaymentChart() {
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
            html += `<div style="display:flex;align-items:center;gap:6px;margin:2px 0"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${s.color}"></span><span style="color:${PALETTE.white70}">${s.seriesName}:</span><span style="font-weight:600;color:${PALETTE.white94}">${(s.value ?? 0).toLocaleString()}</span></div>`
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
        data: paymentRaw.data.map((d) => d.method),
        axisLabel: { ...axisLabelStyle, fontSize: 10, rotate: 18 },
        axisLine: axisLineStyle,
        axisTick: { show: false },
      },
      yAxis: {
        type: 'value',
        axisLabel: axisLabelStyle,
        splitLine: splitLineStyle,
        axisLine: { show: false },
      },
      series: [
        {
          name: 'Retained',
          type: 'bar',
          stack: 'total',
          data: paymentRaw.data.map((d) => d.retained),
          itemStyle: { color: PALETTE.accent3, borderRadius: [0, 0, 0, 0] },
          emphasis: { itemStyle: { color: PALETTE.accent2 } },
        },
        {
          name: 'Churned',
          type: 'bar',
          stack: 'total',
          data: paymentRaw.data.map((d) => d.churned),
          itemStyle: {
            color: PALETTE.white100,
            borderRadius: [4, 4, 0, 0],
          },
          emphasis: { itemStyle: { color: PALETTE.white100 } },
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
}
