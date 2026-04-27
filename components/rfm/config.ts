/**
 * RFM dashboard — ECharts config & shared design tokens.
 * Extends the churn/config with PieChart support.
 */
import * as echarts from 'echarts/core'
import { BarChart, LineChart, ScatterChart, PieChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  TitleComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
  BarChart,
  LineChart,
  ScatterChart,
  PieChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  TitleComponent,
  CanvasRenderer,
])

export { echarts }

export interface EParam {
  color?: string
  seriesName?: string
  value?: number | string | number[] | [number, number]
  axisValue?: string
  name?: string
  percent?: number
  data?: number[] | { value: number; name: string }
}

/* ── Palette ─────────────────────────────────────────────────────────── */
export const PALETTE = {
  white100: 'rgba(255,255,255,1)',
  white94: 'rgba(255,255,255,0.94)',
  white84: 'rgba(255,255,255,0.84)',
  white70: 'rgba(255,255,255,0.70)',
  white50: 'rgba(255,255,255,0.50)',
  white35: 'rgba(255,255,255,0.35)',
  white20: 'rgba(255,255,255,0.20)',
  white12: 'rgba(255,255,255,0.12)',
  white08: 'rgba(255,255,255,0.08)',
  white04: 'rgba(255,255,255,0.04)',
  accent1: 'rgba(242,242,242,0.92)',
  accent2: 'rgba(242,242,242,0.72)',
  accent3: 'rgba(242,242,242,0.52)',
  accent4: 'rgba(242,242,242,0.36)',
  accent5: 'rgba(242,242,242,0.22)',
  accent6: 'rgba(242,242,242,0.14)',
}

/** 10 distinct shades for scatter segment coloring */
export const SEGMENT_COLORS: Record<string, string> = {
  champions:           'rgba(255,255,255,0.96)',
  loyal_customers:     'rgba(255,255,255,0.76)',
  potential_loyalists: 'rgba(255,255,255,0.58)',
  new_customers:       'rgba(255,255,255,0.44)',
  promising:           'rgba(255,255,255,0.34)',
  need_attention:      'rgba(220,200,160,0.70)',
  about_to_sleep:      'rgba(200,180,130,0.58)',
  at_risk:             'rgba(200,140,100,0.70)',
  cant_lose:           'rgba(220,100,80,0.72)',
  hibernating:         'rgba(255,255,255,0.24)',
  lost:                'rgba(255,255,255,0.14)',
}

/** 3 shades for K-means segment pie */
export const KMEANS_COLORS = [
  PALETTE.white94,
  PALETTE.white50,
  PALETTE.accent4,
]

export const tooltipStyle = {
  backgroundColor: 'rgba(12,12,12,0.95)',
  borderColor: 'rgba(255,255,255,0.1)',
  borderWidth: 1,
  textStyle: {
    color: PALETTE.white94,
    fontSize: 12,
    fontFamily: 'var(--font-mono), monospace',
  },
  extraCssText:
    'backdrop-filter:blur(12px);border-radius:10px;box-shadow:0 12px 40px rgba(0,0,0,0.4);',
}

export const axisLabelStyle = {
  color: PALETTE.white50,
  fontSize: 12,
  fontFamily: 'var(--font-mono), monospace',
}

export const axisLineStyle = { lineStyle: { color: PALETTE.white08 } }
export const splitLineStyle = {
  lineStyle: { color: PALETTE.white08, type: 'dashed' as const },
}
