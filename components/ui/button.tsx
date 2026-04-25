'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  [
    'relative inline-flex items-center justify-center gap-2 overflow-hidden',
    'text-[0.88rem] font-[560] leading-none tracking-[0.02em]',
    'rounded-md border transition-all duration-[220ms] ease-out-expo',
    'disabled:pointer-events-none disabled:opacity-60',
    'focus-visible:outline-none focus-visible:[box-shadow:var(--focus-ring)]',
  ].join(' '),
  {
    variants: {
      variant: {
        primary: [
          'min-h-[50px] border-accent-soft bg-cta text-cta-foreground font-[580]',
          'shadow-[0_4px_10px_rgba(242,242,242,0.08)]',
          'hover:-translate-y-px hover:bg-cta-hover hover:shadow-[0_8px_14px_rgba(242,242,242,0.1)]',
          'active:translate-y-0 active:bg-cta-active',
        ].join(' '),
        ghost: [
          'min-h-[50px] border-border bg-white/[0.014] text-secondary gradient-border',
          'hover:text-foreground hover:bg-white/[0.028] hover:-translate-y-px',
          'hover:border-border-hover hover:shadow-[0_5px_12px_rgba(242,242,242,0.08)]',
          'active:translate-y-0 active:bg-white/[0.024]',
        ].join(' '),
        chip: [
          'min-h-[42px] border-border bg-white/[0.012] text-secondary gradient-border',
          'text-[0.72rem] font-[560] tracking-[0.02em]',
          'hover:text-foreground hover:bg-white/[0.026] hover:-translate-y-px',
          'hover:border-border-hover hover:shadow-[0_4px_10px_rgba(242,242,242,0.08)]',
          'active:translate-y-0 active:bg-white/[0.024]',
        ].join(' '),
      },
      size: {
        default: 'px-[22px] py-[15px]',
        lg: 'min-h-[54px] px-7 py-4 text-[0.86rem] gap-[9px]',
        sm: 'min-h-[38px] px-3 py-2 text-[0.78rem]',
        chip: 'px-3 py-2.5',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export interface ButtonLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof buttonVariants> {}

const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <a
        className={cn(buttonVariants({ variant, size, className }), 'no-underline')}
        ref={ref}
        {...props}
      />
    )
  },
)
ButtonLink.displayName = 'ButtonLink'

export { Button, ButtonLink, buttonVariants }
