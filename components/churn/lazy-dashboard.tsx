'use client'

import dynamic from 'next/dynamic'

export const ChurnDashboard = dynamic(
  () => import('@/components/churn-dashboard').then((m) => m.ChurnDashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[400px] items-center justify-center">
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-white/20">
          Loading dashboard…
        </span>
      </div>
    ),
  },
)
