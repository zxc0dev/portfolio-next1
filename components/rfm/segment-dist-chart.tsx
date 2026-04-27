'use client'

import { memo, useMemo } from 'react'
import ReactEChartsCore from 'echarts-for-react/lib/core'
import { echarts, PALETTE, KMEANS_COLORS, tooltipStyle } from './config'
import type { EParam } from './config'
import distRaw from '@/public/data/rfm/segment_distribution.json'

export const SegmentDistChart = memo(function SegmentDistChart() {
  const option = useMemo<echarts.EChartsCoreOption>(
    () => ({
      tooltip: {
        ...tooltipStyle,
        trigger: 'item',
        formatter: (p: EParam) => {
          const item = distRaw.data.find((d) => d.segment === p.name)
          return `<div style="font-weight:600;margin-bottom:4px;color:${PALETTE.white94}">${p.name}</div><div style="color:${PALETTE.white70}">Customers: <span style="font-weight:600;color:${PALETTE.white94}">${item?.count?.toLocaleString()}</span></div><div style="color:${PALETTE.white70}">Share: <span style="font-weight:600;color:${PALETTE.white94}">${p.percent?.toFixed(1)}%</span></div>`
        },
      },
      legend: {
        show: true,
        orient: 'vertical',
        right: 0,
        top: 'middle',
        itemWidth: 8,
        itemHeight: 8,
        textStyle: {
          color: PALETTE.white70,
          fontSize: 12,
          fontFamily: 'var(--font-mono), monospace',
        },
        itemGap: 14,
        formatter: (name: string) => {
          const item = distRaw.data.find((d) => d.segment === name)
          return `{name|${name}}  {pct|${item?.pct}%}`
        },
        rich: {
          name: {
            color: PALETTE.white70,
            fontSize: 12,
            fontFamily: 'var(--font-mono), monospace',
          },
          pct: {
            color: PALETTE.white50,
            fontSize: 11,
            fontFamily: 'var(--font-mono), monospace',
          },
        },
      },
      series: [
        {
          type: 'pie',
          radius: ['52%', '80%'],
          center: ['38%', '50%'],
          data: distRaw.data.map((d, i) => ({
            value: d.count,
            name: d.segment,
            itemStyle: {
              color: KMEANS_COLORS[i % KMEANS_COLORS.length],
              borderColor: 'rgba(0,0,0,0.6)',
              borderWidth: 2,
              borderRadius: 3,
            },
          })),
          label: {
            show: true,
            position: 'inside',
            formatter: (p: EParam) =>
              typeof p.percent === 'number' && p.percent > 8
                ? `${p.percent?.toFixed(0)}%`
                : '',
            color: '#000',
            fontSize: 13,
            fontWeight: 700,
            fontFamily: 'var(--font-mono), monospace',
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 16,
              shadowOffsetX: 0,
              shadowColor: 'rgba(255,255,255,0.15)',
            },
            scale: true,
            scaleSize: 4,
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
