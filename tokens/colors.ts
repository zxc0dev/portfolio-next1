export const colors = {
  background: 'var(--color-background)',
  elevated: 'var(--color-elevated)',
  panel: 'var(--color-panel)',
  surfaceAlt: 'var(--color-surface-alt)',

  border: {
    DEFAULT: 'var(--color-border)',
    hover: 'var(--color-border-hover)',
    subtle: 'var(--color-border-subtle)',
  },

  foreground: 'var(--color-foreground)',
  secondary: 'var(--color-secondary)',
  muted: 'var(--color-muted)',

  accent: {
    DEFAULT: 'var(--color-accent)',
    2: 'var(--color-accent-2)',
    3: 'var(--color-accent-3)',
    soft: 'var(--color-accent-soft)',
  },

  cta: {
    DEFAULT: 'var(--color-cta)',
    hover: 'var(--color-cta-hover)',
    active: 'var(--color-cta-active)',
    foreground: 'var(--color-cta-foreground)',
  },

  success: 'var(--color-success)',
  warning: 'var(--color-warning)',
  error: 'var(--color-error)',

  glow: {
    soft: 'var(--color-glow-soft)',
    strong: 'var(--color-glow-strong)',
  },
} as const
