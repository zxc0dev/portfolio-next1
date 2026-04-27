import * as echarts from 'echarts/core'
import { BarChart, LineChart, HeatmapChart, ScatterChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  VisualMapComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
  BarChart,
  LineChart,
  HeatmapChart,
  ScatterChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  VisualMapComponent,
  CanvasRenderer,
])

export { echarts }

export interface EParam {
  color?: string
  seriesName?: string
  value?: number | string | number[]
  axisValue?: string
  name?: string
  percent?: number
  data?: number[]
}

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

export const SERIES_COLORS = [
  PALETTE.white100,
  PALETTE.white70,
  PALETTE.accent3,
  PALETTE.white50,
  PALETTE.accent4,
  PALETTE.white35,
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
