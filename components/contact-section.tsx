'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { Mail, Linkedin, Github, ArrowUpRight } from 'lucide-react'
import { SectionHeader } from '@/components/section-header'
import { Reveal } from '@/components/reveal'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Please enter a valid email').max(200),
  message: z.string().min(1, 'Message is required').max(5000),
})

type ContactFormData = z.infer<typeof contactSchema>

const CHANNELS = [
  {
    label: 'Email',
    value: 'pavlo.v.popovych@outlook.com',
    href: 'mailto:pavlo.v.popovych@outlook.com',
    icon: Mail,
    external: false,
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/pavlo-popovych',
    href: 'https://linkedin.com/in/pavlo-popovych',
    icon: Linkedin,
    external: true,
  },
  {
    label: 'GitHub',
    value: 'github.com/zxrc0dev',
    href: 'https://github.com/zxrc0dev',
    icon: Github,
    external: true,
  },
]

export function ContactSection() {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    try {
      const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_ID || 'xzdaozee'
      const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        setStatus('success')
        reset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <section
      id="contact"
      className="relative py-[clamp(100px,12vw,160px)] scroll-mt-[92px]"
    >
      <div className="mx-auto max-w-[1360px] px-[clamp(20px,4vw,48px)]">
        <SectionHeader
          number="06"
          title="Let's Talk"
          subtitle="How to reach me"
          className="mb-[clamp(20px,2.5vw,32px)]"
        />

        <Reveal className="ml-[42px] max-md:ml-0">
          <div className="grid grid-cols-[1.35fr_1fr] items-start gap-[clamp(40px,6vw,80px)] max-md:grid-cols-1">
              {/* Left — form */}
              <div className="flex flex-col">
                <span className="mb-[18px] inline-block font-mono text-[0.68rem] font-semibold uppercase tracking-[0.2em] opacity-90">
                  Send a message
                </span>
                <p className="mb-7 max-w-[40ch] text-[1.18rem] leading-[1.75] text-secondary">
                  Have a project, a role, or an idea — feel free to reach out, I will get
                  back to you.
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
                  {/* Honeypot */}
                  <div className="absolute -left-[5000px]" aria-hidden="true">
                    <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" />
                  </div>

                  <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="mb-1.5 block text-[0.72rem] font-semibold uppercase tracking-[0.11em] text-secondary"
                      >
                        Name
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        autoComplete="name"
                        placeholder="Your name"
                        className={cn(
                          'w-full min-h-[48px] rounded-md border bg-white/[0.014] px-4 py-[13px] text-[0.97rem] leading-[1.4] text-foreground caret-accent outline-none',
                          'placeholder:text-white/64',
                          'transition-all duration-[280ms]',
                          'hover:border-border-hover hover:bg-white/[0.022]',
                          'focus:border-white/38 focus:bg-white/[0.03] focus:[box-shadow:var(--focus-ring)]',
                          errors.name ? 'border-error' : 'border-border',
                        )}
                        {...register('name')}
                      />
                      {errors.name && (
                        <p className="mt-1 text-[0.75rem] text-error">{errors.name.message}</p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="contact-email"
                        className="mb-1.5 block text-[0.72rem] font-semibold uppercase tracking-[0.11em] text-secondary"
                      >
                        Email
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        autoComplete="email"
                        inputMode="email"
                        placeholder="your@email.com"
                        className={cn(
                          'w-full min-h-[48px] rounded-md border bg-white/[0.014] px-4 py-[13px] text-[0.97rem] leading-[1.4] text-foreground caret-accent outline-none',
                          'placeholder:text-white/64',
                          'transition-all duration-[280ms]',
                          'hover:border-border-hover hover:bg-white/[0.022]',
                          'focus:border-white/38 focus:bg-white/[0.03] focus:[box-shadow:var(--focus-ring)]',
                          errors.email ? 'border-error' : 'border-border',
                        )}
                        {...register('email')}
                      />
                      {errors.email && (
                        <p className="mt-1 text-[0.75rem] text-error">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="mb-1.5 block text-[0.72rem] font-semibold uppercase tracking-[0.11em] text-secondary"
                    >
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      placeholder="What would you like to talk about?"
                      rows={5}
                      className={cn(
                        'w-full min-h-[132px] resize-y rounded-md border bg-white/[0.014] px-4 py-[11px] text-[0.97rem] leading-[1.4] text-foreground caret-accent outline-none',
                        'placeholder:text-white/64',
                        'transition-all duration-[280ms]',
                        'hover:border-border-hover hover:bg-white/[0.022]',
                        'focus:border-white/38 focus:bg-white/[0.03] focus:[box-shadow:var(--focus-ring)]',
                        errors.message ? 'border-error' : 'border-border',
                      )}
                      {...register('message')}
                    />
                    {errors.message && (
                      <p className="mt-1 text-[0.75rem] text-error">
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="mt-1.5 w-full"
                    disabled={isSubmitting}
                  >
                    <Mail className="h-4 w-4" />
                    <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                  </Button>

                  {status === 'success' && (
                    <p className="mt-3 rounded-md border border-success/25 bg-success/10 px-4 py-3 text-center text-[0.81rem] text-success shadow-[inset_0_1px_0_rgba(255,255,255,0.015)]">
                      Message sent successfully! I&apos;ll get back to you soon.
                    </p>
                  )}
                  {status === 'error' && (
                    <p className="mt-3 rounded-md border border-error/25 bg-error/10 px-4 py-3 text-center text-[0.81rem] text-error shadow-[inset_0_1px_0_rgba(255,255,255,0.015)]">
                      Something went wrong. Please try again or email me directly.
                    </p>
                  )}
                </form>
              </div>

              {/* Right — channels */}
              <div className="max-md:pt-2">
                {/* Separator line — visible on mobile, vertical on desktop handled by border */}
                <div className="mb-6 hidden h-px w-full bg-[linear-gradient(90deg,transparent,rgba(242,242,242,0.18),transparent)] opacity-75 max-md:block" />
                <div className="relative max-md:hidden">
                  <div className="absolute -left-[clamp(20px,3vw,40px)] top-0 bottom-0 w-px bg-[linear-gradient(180deg,transparent,rgba(242,242,242,0.18),transparent)] opacity-75" />
                </div>
                <span className="mb-[18px] inline-block font-mono text-[0.68rem] font-semibold uppercase tracking-[0.2em] opacity-90">
                  Or reach out directly
                </span>
                <div className="flex flex-col gap-2">
                  {CHANNELS.map((ch) => (
                    <a
                      key={ch.label}
                      href={ch.href}
                      target={ch.external ? '_blank' : undefined}
                      rel={ch.external ? 'noopener noreferrer' : undefined}
                      className="group flex items-center gap-3.5 rounded-md border border-white/[0.058] bg-white/[0.022] p-[13px_15px] text-secondary transition-all duration-[180ms] ease-out-expo hover:-translate-y-[var(--lift-control)] hover:border-white/15 hover:bg-white/[0.055] hover:text-foreground hover:shadow-[0_8px_24px_rgba(242,242,242,0.08)]"
                    >
                      <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px] bg-white/8 text-accent transition-colors duration-[280ms] group-hover:bg-white/16">
                        <ch.icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <span className="block text-[0.67rem] font-semibold uppercase tracking-[0.11em] text-muted leading-none">
                          {ch.label}
                        </span>
                        <span className="mt-1 block truncate text-[0.91rem] leading-[1.3]">
                          {ch.value}
                        </span>
                      </div>
                      <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-muted opacity-38 transition-all duration-[280ms] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-85" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
        </Reveal>
      </div>
    </section>
  )
}
