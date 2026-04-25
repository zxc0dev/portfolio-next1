'use client'

import { memo, useMemo } from 'react'
import ReactEChartsCore from 'echarts-for-react/lib/core'
import { echarts, PALETTE, tooltipStyle, axisLabelStyle, axisLineStyle } from './config'
import type { EParam } from './config'
import heatmapRaw from '@/public/data/churn/churn_risk_heatmap.json'

const CONTRACTS = ['Month-to-month', 'One year', 'Two year']

export const HeatmapChart = memo(function HeatmapChart() {
  const tenureBands = useMemo(
    () => [...new Set(heatmapRaw.data.map((d) => d.tenure))],
    [],
  )
  const heatData = useMemo(
    () =>
      heatmapRaw.data.map((d) => [
        tenureBands.indexOf(d.tenure),
        CONTRACTS.indexOf(d.contract),
        d.churnRate,
      ]),
    [tenureBands],
  )

  const option = useMemo<echarts.EChartsCoreOption>(
    () => ({
      tooltip: {
        ...tooltipStyle,
        formatter: (p: EParam) => {
          const raw = p.data
          if (!Array.isArray(raw) || raw.length < 3) return ''
          const [ti, ci, val] = raw as [number, number, number]
          const item = heatmapRaw.data.find(
            (d) => d.tenure === tenureBands[ti] && d.contract === CONTRACTS[ci],
          )
          return `<div style="font-weight:600;margin-bottom:4px;color:${PALETTE.white94}">${CONTRACTS[ci]}</div><div style="color:${PALETTE.white70}">Tenure: ${tenureBands[ti]} mo</div><div style="color:${PALETTE.white70}">Churn: <span style="font-weight:600;color:${PALETTE.white94}">${val}%</span></div>${item ? `<div style="color:${PALETTE.white50};font-size:11px">n=${item.count}</div>` : ''}`
        },
      },
      grid: { top: 8, right: 12, bottom: 48, left: 10, containLabel: true },
      xAxis: {
        type: 'category',
        data: tenureBands,
        axisLabel: { ...axisLabelStyle, fontSize: 11 },
        axisLine: axisLineStyle,
        axisTick: { show: false },
        name: 'Tenure (months)',
        nameLocation: 'middle',
        nameGap: 34,
        nameTextStyle: {
          color: PALETTE.white35,
          fontSize: 11,
          fontFamily: 'var(--font-mono), monospace',
        },
      },
      yAxis: {
        type: 'category',
        data: CONTRACTS,
        axisLabel: { ...axisLabelStyle, fontSize: 11 },
        axisLine: { show: false },
        axisTick: { show: false },
      },
      visualMap: {
        min: 0,
        max: 60,
        calculable: false,
        show: false,
        inRange: {
          color: [
            'rgba(255,255,255,0.04)',
            'rgba(255,255,255,0.12)',
            'rgba(255,255,255,0.24)',
            'rgba(255,255,255,0.42)',
            'rgba(255,255,255,0.62)',
            'rgba(255,255,255,0.85)',
          ],
        },
      },
      series: [
        {
          type: 'heatmap',
          data: heatData,
          itemStyle: {
            borderColor: 'rgba(0,0,0,0.6)',
            borderWidth: 2,
            borderRadius: 3,
          },
          label: {
            show: true,
            formatter: (p: EParam) => {
              const val = Array.isArray(p.data) ? (p.data as number[])[2] : undefined
              if (val == null) return ''
              return val > 30 ? `{dark|${val}%}` : `{light|${val}%}`
            },
            rich: {
              dark: {
                color: '#000',
                fontSize: 12,
                fontWeight: 600,
                fontFamily: 'var(--font-mono), monospace',
              },
              light: {
                color: PALETTE.white84,
                fontSize: 12,
                fontWeight: 600,
                fontFamily: 'var(--font-mono), monospace',
              },
            },
          },
          emphasis: {
            itemStyle: { borderColor: PALETTE.white100, borderWidth: 2 },
          },
        },
      ],
    }),
    [tenureBands, heatData],
  )

  return (
    <ReactEChartsCore
      echarts={echarts}
      option={option}
      style={{ height: 200, width: '100%' }}
      opts={{ renderer: 'canvas', devicePixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 2 }}
      notMerge
      lazyUpdate
    />
  )
})
