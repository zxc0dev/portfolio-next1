'use client'

import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  /** Optional label shown in the fallback (e.g. "Churn Dashboard") */
  label?: string
}

interface State {
  hasError: boolean
  message: string
}

/**
 * Class-based React error boundary.
 * Wraps dashboard sections so a single chart failure can't
 * crash the whole page.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, message: '' }
  }

  static getDerivedStateFromError(error: unknown): State {
    const message = error instanceof Error ? error.message : String(error)
    return { hasError: true, message }
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[180px] flex-col items-center justify-center gap-3 rounded-md border border-error/20 bg-error/[0.05] px-6 py-8 text-center">
          <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-error/70">
            {this.props.label ?? 'Component'} failed to render
          </p>
          <p className="max-w-[42ch] text-[0.85rem] leading-[1.6] text-muted">
            {this.state.message || 'An unexpected error occurred. Reload the page to try again.'}
          </p>
        </div>
      )
    }

    return this.props.children
  }
}
