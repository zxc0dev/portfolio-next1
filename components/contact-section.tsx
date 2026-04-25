'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { Mail, Linkedin, Github, ArrowUpRight } from 'lucide-react'
import { SectionHeader } from '@/components/section-header'
import { Reveal } from '@/components/reveal'
import { TerminalQuery } from '@/components/terminal-query'
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
    value: 'github.com/zxc0dev',
    href: 'https://github.com/zxc0dev',
    icon: Github,
    external: true,
  },
]

const inputBase = cn(
  'w-full min-h-[48px] rounded-md border bg-white/[0.014] px-4 py-[13px]',
  'text-[0.97rem] leading-[1.4] text-foreground caret-accent outline-none',
  'placeholder:text-white/64 transition-all duration-[280ms]',
  'hover:border-border-hover hover:bg-white/[0.022]',
  'focus:border-white/38 focus:bg-white/[0.03] focus:[box-shadow:var(--focus-ring)]',
)

export function ContactSection() {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({ resolver: zodResolver(contactSchema) })

  const onSubmit = async (data: ContactFormData) => {
    setStatus('idle')
    try {
      const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_ID
      // Reject missing or non-alphanumeric IDs to prevent path injection
      if (!formspreeId || !/^[a-zA-Z0-9]+$/.test(formspreeId)) { setStatus('error'); return }
      const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) { setStatus('success'); reset() } else { setStatus('error') }
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
        <TerminalQuery
          query={`SELECT * FROM contact\n  WHERE available = TRUE;`}
          rowsText="1 row returned"
        >
        <SectionHeader
          number="05"
          title="Let's Talk"
          subtitle="How to reach me"
          className="mb-[clamp(20px,2.5vw,32px)]"
        />

        <div className="ml-[42px] max-md:ml-0">
          <div className="grid grid-cols-[1.35fr_1fr] items-start gap-[clamp(40px,6vw,80px)] max-md:grid-cols-1">
            {/* Left — form */}
            <Reveal>
              <div className="flex flex-col">
                <span className="mb-[18px] inline-block font-mono text-[0.68rem] font-semibold uppercase tracking-[0.2em] opacity-90">
                  Send a message
                </span>
                <p className="mb-7 max-w-[40ch] text-[1.26rem] leading-[1.8] text-secondary">
                  Have a project, a role, or an idea — feel free to reach out, I will get
                  back to you.
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
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
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? 'contact-name-error' : undefined}
                        className={cn(inputBase, errors.name ? 'border-error' : 'border-border')}
                        {...register('name')}
                      />
                      {errors.name && (
                        <p id="contact-name-error" className="mt-1 text-[0.75rem] text-error" role="alert">
                          {errors.name.message}
                        </p>
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
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? 'contact-email-error' : undefined}
                        className={cn(inputBase, errors.email ? 'border-error' : 'border-border')}
                        {...register('email')}
                      />
                      {errors.email && (
                        <p id="contact-email-error" className="mt-1 text-[0.75rem] text-error" role="alert">
                          {errors.email.message}
                        </p>
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
                      aria-invalid={!!errors.message}
                      aria-describedby={errors.message ? 'contact-message-error' : undefined}
                      className={cn(
                        inputBase,
                        'min-h-[132px] resize-y',
                        errors.message ? 'border-error' : 'border-border',
                      )}
                      {...register('message')}
                    />
                    {errors.message && (
                      <p id="contact-message-error" className="mt-1 text-[0.75rem] text-error" role="alert">
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
                    <p
                      role="status"
                      className="mt-3 rounded-md border border-success/25 bg-success/10 px-4 py-3 text-center text-[0.81rem] text-success"
                    >
                      Message sent successfully! I&apos;ll get back to you soon.
                    </p>
                  )}
                  {status === 'error' && (
                    <p
                      role="alert"
                      className="mt-3 rounded-md border border-error/25 bg-error/10 px-4 py-3 text-center text-[0.81rem] text-error"
                    >
                      Something went wrong. Please try again or email me directly.
                    </p>
                  )}
                </form>
              </div>
            </Reveal>

            {/* Right — direct channels */}
            <Reveal delay={0.06}>
              <div className="border-l border-white/10 pl-[clamp(20px,3vw,40px)] max-md:border-l-0 max-md:pl-0 max-md:border-t max-md:border-white/10 max-md:pt-6">
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
                      className="group flex items-center gap-3.5 rounded-md border border-white/[0.058] bg-white/[0.022] p-[13px_15px] text-secondary transition-all duration-[180ms] ease-out-expo hover:-translate-y-px hover:border-white/15 hover:bg-white/[0.055] hover:text-foreground hover:shadow-[0_8px_24px_rgba(242,242,242,0.08)]"
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
            </Reveal>
          </div>
        </div>
        </TerminalQuery>
      </div>
    </section>
  )
}
