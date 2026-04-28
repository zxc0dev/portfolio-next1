'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { useAppStore } from '@/stores/app-store'

// ── Timing ────────────────────────────────────────────────────────────────
const CHAR        = 55    // ms per char for shell commands
const CHAR_SELECT = 22    // ms per char for the long SELECT query
const P           = 340   // pause after command completes

const CMD_LS    = 'ls -F'
const CMD_SQ3   = 'sqlite3 profile.db'
const CMD_SEL   = 'SELECT name, specialty, current_loc FROM profile WHERE id = 1;'
const CMD_ABOUT = 'about_me.txt'
const CMD_STACK = 'stack.zx'
const CMD_EXP   = 'experience.json'
const CMD_CERTS = 'certifications.csv'

// Computed timing constants
const T_PASS_PROMPT  = 7 * CHAR + 180
const T_PASS_DONE    = T_PASS_PROMPT + 960
const T_LS_START     = T_PASS_DONE
const T_LS_OUTPUT    = T_LS_START + CMD_LS.length * CHAR + P
const T_SQ3_START    = T_LS_OUTPUT
const T_SQLITE_INFO  = T_SQ3_START + CMD_SQ3.length * CHAR + P
const T_SEL_START    = T_SQLITE_INFO + 280
const T_TABLE        = T_SEL_START + CMD_SEL.length * CHAR_SELECT + P
const CMD_EXIT              = '.exit'
const T_SQLITE_EXIT_START   = T_TABLE + 280
const T_SQLITE_EXIT_DONE    = T_SQLITE_EXIT_START + CMD_EXIT.length * CHAR + P
const T_ABOUT_START  = T_SQLITE_EXIT_DONE
const T_ABOUT_SHOWN  = T_ABOUT_START + CMD_ABOUT.length * CHAR + P
const T_STACK_START  = T_ABOUT_SHOWN + 280
const T_STACK_SHOWN  = T_STACK_START + CMD_STACK.length * CHAR + P
const T_EXP_START    = T_STACK_SHOWN + 280
const T_EXP_SHOWN    = T_EXP_START + CMD_EXP.length * CHAR + P
const T_CERT_START   = T_EXP_SHOWN + 280
const T_CERT_SHOWN   = T_CERT_START + CMD_CERTS.length * CHAR + P

// ── Sub-components ────────────────────────────────────────────────────────

function Cursor() {
  return (
    <span
      className="inline-block ml-px w-[5px] h-[0.86em] bg-foreground/50 align-middle animate-[blink_0.9s_step-end_infinite]"
      aria-hidden="true"
    />
  )
}

const PROMPT = '[zxc0dev@portfolio ~]$ '

function ShellPrompt() {
  return <span className="text-white/[0.28]">{PROMPT}</span>
}

// ── Vim buffer wrapper ────────────────────────────────────────────────────

function VimBuffer({ filename, children }: { filename: string; children: React.ReactNode }) {
  const displayName = filename.replace(/\.[^.]+$/, '')
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="mt-2"
    >
      <div className="font-mono text-[1.14rem] font-semibold text-white mb-1.5 tracking-[-0.01em]">{displayName}</div>
      {children}
    </motion.div>
  )
}

// ── Profile table (transposed — NAME | SPECIALTY | CURRENT_LOC) ───────────

function ProfileTable() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="mt-2 overflow-x-auto"
    >
      <table
        className="border-collapse font-mono text-[0.78rem] leading-[1.7]"
        style={{ borderSpacing: 0 }}
      >
        <thead>
          <tr>
            <th style={{ border: '1px solid rgba(255,255,255,0.22)' }} className="px-3 py-1.5 text-left font-semibold text-muted whitespace-nowrap">
              name
            </th>
            <th style={{ border: '1px solid rgba(255,255,255,0.22)' }} className="px-3 py-1.5 text-left font-semibold text-muted whitespace-nowrap">
              specialty
            </th>
            <th style={{ border: '1px solid rgba(255,255,255,0.22)' }} className="px-3 py-1.5 text-left font-semibold text-muted whitespace-nowrap">
              current_loc
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border: '1px solid rgba(255,255,255,0.22)' }} className="px-3 py-1.5 text-secondary whitespace-nowrap">
              Pavlo
            </td>
            <td style={{ border: '1px solid rgba(255,255,255,0.22)' }} className="px-3 py-1.5 text-secondary whitespace-nowrap">
              Data Analytics & Engineering
            </td>
            <td style={{ border: '1px solid rgba(255,255,255,0.22)' }} className="px-3 py-1.5 text-secondary whitespace-nowrap">
              Slovakia, EU
            </td>
          </tr>
        </tbody>
      </table>
      <div className="mt-1 font-mono text-[0.72rem] text-muted">1 row in set</div>
    </motion.div>
  )
}

// ── About text ────────────────────────────────────────────────────────────

function AboutText({ showArrow }: { showArrow?: boolean }) {
  return (
    <div className="mt-3 flex flex-col gap-4 max-w-[560px]">
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
        <h2 className="text-[0.9rem] font-medium text-foreground leading-[1.45] tracking-[-0.015em]">
          A data analyst who turns complexity into clarity.
        </h2>
        {showArrow && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-1.5 font-mono text-[0.65rem] text-white/40 shrink-0"
          >
            <svg
              width="38" height="18"
              viewBox="0 0 38 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* curved body: right-bottom to left-middle, S-curve for hand-drawn feel */}
              <path d="M 35 11 C 22 7 16 15 4 9" />
              {/* arrowhead at left tip */}
              <path d="M 4 9 L 9 4" />
              <path d="M 4 9 L 10 13" />
            </svg>
            <span>What a cliché...</span>
          </motion.div>
        )}
      </div>
      <div className="flex flex-col gap-4 text-[0.95rem] text-secondary leading-[1.82]">
        <p>
          Anyways, I love data. Specifically: analytics and engineering. I enjoy
          architecting, transforming, optimizing, and analyzing it.
        </p>
        <p>
          My journey started at Foxconn, where I spent 1.5+ years embedded in
          electronics manufacturing. There I analyzed production-line data to improve
          pass rates and built automation scripts that cut hours of manual work down
          to minutes.
        </p>
        <p>
          What drives how I work is a mix of philosophy and pragmatism. I approach
          problems through first principles: strip everything back to its essential
          structure, understand it from the ground up. I ask a lot of questions,
          partly Socratic<sup className="text-[0.7em]">*</sup> habit, partly because
          the right question often does more work than the right answer, and because
          ideas only matter if they prove their value in practice.
        </p>
        <p>
          Stepping from &ldquo;true&rdquo; philosophy, I also believe the only honest
          path to mastering a craft is through the kind of deliberate practice Anders
          Ericsson described: focused, corrective, and sustained without burning out.
        </p>
        <p>
          Outside of data, I read broadly &mdash; philosophy, cognitive science, sometimes
          history, less for credentials than for better mental furniture. And I usually
          have a side project running: something I&apos;m building to understand it,
          not necessarily to showcase it.
        </p>
        <p className="font-mono text-[0.69rem] tracking-[0.04em] text-muted">
          *&thinsp;the dude casually asking lots of questions
        </p>
      </div>
    </div>
  )
}

// ── Stack block (horizontal rows) ─────────────────────────────────────────

function StackBlock() {
  const rows = [
    { key: 'languages',   vals: 'english (C1), russian (Native), ukrainian (Native), slovak (A2)' },
    { key: 'programming', vals: 'Python, SQL, VBA' },
    { key: 'libraries',   vals: 'Pandas, NumPy, Scikit-learn, Matplotlib, Seaborn' },
    { key: 'tools',       vals: 'Power BI, dbt, Git, Linux, Excel, Power Query' },
  ]
  return (
    <div className="font-mono text-[0.78rem] leading-[1.75]">
      {rows.map(({ key, vals }) => (
        <div key={key} className="flex">
          <span className="text-secondary shrink-0 inline-block min-w-[7.5rem]">{key}</span>
          <span className="text-foreground/30 mr-2">:</span>
          <span className="text-muted">{vals}</span>
        </div>
      ))}
    </div>
  )
}

// ── JSON block ────────────────────────────────────────────────────────────

function JsonBlock() {
  const B  = 'text-foreground/40'
  const K  = 'text-muted'
  const Vt = 'text-secondary'
  return (
    <div className="font-mono text-[0.78rem] leading-[1.75]">
      <div><span className={B}>{'{'}</span></div>
      <div className="pl-4">
        <span className={K}>&quot;experience&quot;</span>
        <span className={B}>: [</span>
      </div>
      <div className="pl-8"><span className={B}>{'{'}</span></div>
      <div className="pl-12">
        <span className={K}>&quot;job_title&quot;</span>
        <span className={B}>: </span>
        <span className={Vt}>&quot;Production Data Analysis &amp; Reporting&quot;</span>
        <span className={B}>,</span>
      </div>
      <div className="pl-12">
        <span className={K}>&quot;company&quot;</span>
        <span className={B}>: </span>
        <span className={Vt}>&quot;Foxconn&quot;</span>
        <span className={B}>,</span>
      </div>
      <div className="pl-12">
        <span className={K}>&quot;location&quot;</span>
        <span className={B}>: </span>
        <span className={Vt}>&quot;Hungary&quot;</span>
        <span className={B}>,</span>
      </div>
      <div className="pl-12">
        <span className={K}>&quot;start_date&quot;</span>
        <span className={B}>: </span>
        <span className={Vt}>&quot;Mar 2023&quot;</span>
        <span className={B}>,</span>
      </div>
      <div className="pl-12">
        <span className={K}>&quot;end_date&quot;</span>
        <span className={B}>: </span>
        <span className={Vt}>&quot;Oct 2024&quot;</span>
      </div>
      <div className="pl-8"><span className={B}>{'}'}</span></div>
      <div className="pl-4"><span className={B}>{']'}</span></div>
      <div><span className={B}>{'}'}</span></div>
    </div>
  )
}

// ── CSV block (certifications, no issuer) ─────────────────────────────────

const CERT_ROWS = [
  { name: 'IBM Data Science Professional Certificate',               start: 'Sep 2025', end: 'Feb 2026' },
  { name: 'DeepLearning.AI Machine Learning Specialization',         start: 'Apr 2025', end: 'Jul 2025' },
  { name: 'Statistics with Python Univ. of Michigan Specialization', start: 'Feb 2026', end: '\u2014'   },
]

function CsvBlock() {
  return (
    <div className="font-mono text-[0.73rem] leading-[1.9]">
      <div className="text-secondary whitespace-nowrap">course_name,start_date,end_date</div>
      {CERT_ROWS.map((row, i) => (
        <div key={i} className="text-muted whitespace-nowrap">
          {row.name},{row.start},{row.end}
        </div>
      ))}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────

export function AboutSection() {
  const isLoaded     = useAppStore((s) => s.isLoaded)
  const setCertsDone = useAppStore((s) => s.setCertificatesDone)
  const sectionRef   = useRef<HTMLElement>(null)
  const startedRef   = useRef(false)
  const [inView, setInView] = useState(false)

  // ── login + password
  const [loginChars,     setLoginChars]     = useState(0)
  const [showPassPrompt, setShowPassPrompt] = useState(false)
  const [passChars,      setPassChars]      = useState(0)
  const [passDone,       setPassDone]       = useState(false)

  // ── ls
  const [lsChars,      setLsChars]      = useState(0)
  const [showLsOutput, setShowLsOutput] = useState(false)

  // ── sqlite3 command
  const [showSq3Prompt,  setShowSq3Prompt]  = useState(false)
  const [sq3Chars,       setSq3Chars]       = useState(0)
  const [showSqliteInfo, setShowSqliteInfo] = useState(false)

  // ── SELECT query (inside sqlite> prompt)
  const [selChars,  setSelChars]  = useState(0)
  const [showTable, setShowTable] = useState(false)
  const [showSqliteExit, setShowSqliteExit] = useState(false)
  const [exitChars,      setExitChars]      = useState(0)

  // ── about_me.txt (left col)
  const [showAboutPrompt, setShowAboutPrompt] = useState(false)
  const [aboutChars,      setAboutChars]      = useState(0)
  const [showAbout,       setShowAbout]       = useState(false)
  const [showArrow,       setShowArrow]       = useState(false)

  // ── right column (strict sequential, starts after about is shown)
  const [showRightCol,    setShowRightCol]    = useState(false)
  const [stackChars,      setStackChars]      = useState(0)
  const [showStack,       setShowStack]       = useState(false)
  const [showExpPrompt,   setShowExpPrompt]   = useState(false)
  const [expChars,        setExpChars]        = useState(0)
  const [showExp,         setShowExp]         = useState(false)
  const [showCertsPrompt, setShowCertsPrompt] = useState(false)
  const [certChars,       setCertChars]       = useState(0)
  const [showCerts,       setShowCerts]       = useState(false)

  // ── IntersectionObserver
  useEffect(() => {
    if (!isLoaded) return
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold: 0.04 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [isLoaded])

  // ── Sequence scheduler
  useEffect(() => {
    if (!isLoaded || !inView || startedRef.current) return
    startedRef.current = true

    const ts: ReturnType<typeof setTimeout>[] = []
    const at = (t: number, fn: () => void) => { ts.push(setTimeout(fn, t)) }

    // LOGIN: type "zxc0dev" (7 chars)
    for (let i = 1; i <= 7; i++) at(i * CHAR, () => setLoginChars(i))
    at(T_PASS_PROMPT, () => setShowPassPrompt(true))
    for (let i = 1; i <= 12; i++) at(T_PASS_PROMPT + i * 65, () => setPassChars(c => c + 1))
    at(T_PASS_DONE,   () => setPassDone(true))

    // LS -F
    for (let i = 1; i <= CMD_LS.length; i++)
      at(T_LS_START + i * CHAR, () => setLsChars(i))
    at(T_LS_OUTPUT, () => { setShowLsOutput(true); setShowSq3Prompt(true) })

    // SQLITE3 PROFILE.DB
    for (let i = 1; i <= CMD_SQ3.length; i++)
      at(T_SQ3_START + i * CHAR, () => setSq3Chars(i))
    at(T_SQLITE_INFO, () => setShowSqliteInfo(true))

    // SELECT query (typed in sqlite> prompt)
    for (let i = 1; i <= CMD_SEL.length; i++)
      at(T_SEL_START + i * CHAR_SELECT, () => setSelChars(i))
    at(T_TABLE, () => { setShowTable(true) })

    // SQLITE> .EXIT
    at(T_SQLITE_EXIT_START, () => setShowSqliteExit(true))
    for (let i = 1; i <= CMD_EXIT.length; i++)
      at(T_SQLITE_EXIT_START + i * CHAR, () => setExitChars(i))
    at(T_SQLITE_EXIT_DONE, () => setShowAboutPrompt(true))

    // ABOUT_ME.TXT
    for (let i = 1; i <= CMD_ABOUT.length; i++)
      at(T_ABOUT_START + i * CHAR, () => setAboutChars(i))
    at(T_ABOUT_SHOWN, () => { setShowAbout(true); setShowRightCol(true); setCertsDone() })
    at(T_ABOUT_SHOWN + 600, () => setShowArrow(true))

    // STACK.ZX (right col — only after about_me.txt is shown)
    for (let i = 1; i <= CMD_STACK.length; i++)
      at(T_STACK_START + i * CHAR, () => setStackChars(i))
    at(T_STACK_SHOWN, () => { setShowStack(true); setShowExpPrompt(true) })

    // EXPERIENCE.JSON
    for (let i = 1; i <= CMD_EXP.length; i++)
      at(T_EXP_START + i * CHAR, () => setExpChars(i))
    at(T_EXP_SHOWN, () => { setShowExp(true); setShowCertsPrompt(true) })

    // CERTIFICATIONS.CSV
    for (let i = 1; i <= CMD_CERTS.length; i++)
      at(T_CERT_START + i * CHAR, () => setCertChars(i))
    at(T_CERT_SHOWN, () => { setShowCerts(true) })

    return () => ts.forEach(clearTimeout)
  }, [isLoaded, inView, setCertsDone])

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative pt-[140px] pb-[clamp(100px,12vw,160px)] scroll-mt-[92px]"
    >
      <div className="mx-auto max-w-[1360px] px-[clamp(20px,4vw,48px)]">
        <div className="font-mono text-[0.78rem] leading-[1.9]">

          {/* login prompt */}
          <div>
            <span className="text-white/[0.28]">login: </span>
            <span className="text-foreground">{'zxc0dev'.slice(0, loginChars)}</span>
            {loginChars < 7 && isLoaded && inView && <Cursor />}
          </div>

          {/* password prompt */}
          {showPassPrompt && (
            <div>
              <span className="text-white/[0.28]">password: </span>
              <span className="text-foreground/60 tracking-[0.15em]">{`*`.repeat(passChars)}</span>
              {!passDone && <Cursor />}
            </div>
          )}

          {/* ls -F */}
          {passDone && (
            <div>
              <ShellPrompt />
              <span className="text-foreground">{CMD_LS.slice(0, lsChars)}</span>
              {lsChars < CMD_LS.length && <Cursor />}
            </div>
          )}

          {/* ls output */}
          {showLsOutput && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="text-secondary"
            >
              {'about_me.txt  projects/  profile.db  stack.zx  certifications.csv  experience.json'}
            </motion.div>
          )}
        </div>

        {/* two-column grid (sqlite3 onward) */}
        {showLsOutput && (
          <div className="mt-0 grid grid-cols-[3fr_2fr] gap-[clamp(28px,5vw,64px)] items-start max-lg:grid-cols-1">

            {/* ─── LEFT COLUMN ─── */}
            <div className="font-mono text-[0.78rem] leading-[1.9]">

              {/* sqlite3 profile.db */}
              {showSq3Prompt && (
                <div>
                  <ShellPrompt />
                  <span className="text-foreground">{CMD_SQ3.slice(0, sq3Chars)}</span>
                  {sq3Chars < CMD_SQ3.length && <Cursor />}
                </div>
              )}

              {/* SQLite version info + SELECT query */}
              {showSqliteInfo && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="text-muted">SQLite version 3.47.2</div>
                  <div className="text-muted">Enter &quot;.help&quot; for usage hints.</div>
                  <div>
                    <span className="text-white/[0.28]">sqlite&gt;</span>
                    <span className="text-foreground ml-1">{CMD_SEL.slice(0, selChars)}</span>
                    {selChars < CMD_SEL.length && <Cursor />}
                  </div>
                </motion.div>
              )}

              {/* profile table */}
              {showTable && <ProfileTable />}

              {/* sqlite> .exit */}
              {showSqliteExit && (
                <div className="mt-1">
                  <span className="text-white/[0.28]">sqlite&gt; </span>
                  <span className="text-foreground">{CMD_EXIT.slice(0, exitChars)}</span>
                  {exitChars < CMD_EXIT.length && <Cursor />}
                </div>
              )}

              {/* about_me.txt prompt */}
              {showAboutPrompt && (
                <div className="">
                  <ShellPrompt />
                  <span className="text-foreground">{CMD_ABOUT.slice(0, aboutChars)}</span>
                  {aboutChars < CMD_ABOUT.length && <Cursor />}
                </div>
              )}

              {/* about text */}
              {showAbout && <VimBuffer filename="about_me.txt"><AboutText showArrow={showArrow} /></VimBuffer>}
            </div>

            {/* ─── RIGHT COLUMN (appears after about_me.txt is shown) ─── */}
            {showRightCol && (
              <div className="font-mono text-[0.78rem] leading-[1.9]">

                {/* stack.zx prompt */}
                <div>
                  <ShellPrompt />
                  <span className="text-foreground">{CMD_STACK.slice(0, stackChars)}</span>
                  {stackChars < CMD_STACK.length && <Cursor />}
                </div>

                {/* stack content */}
                {showStack && <VimBuffer filename="stack.zx"><StackBlock /></VimBuffer>}

                {/* experience.json prompt */}
                {showExpPrompt && (
                  <div className="mt-3">
                    <ShellPrompt />
                    <span className="text-foreground">{CMD_EXP.slice(0, expChars)}</span>
                    {expChars < CMD_EXP.length && <Cursor />}
                  </div>
                )}

                {/* experience content */}
                {showExp && <VimBuffer filename="experience.json"><JsonBlock /></VimBuffer>}

                {/* certifications.csv prompt */}
                {showCertsPrompt && (
                  <div className="mt-3">
                    <ShellPrompt />
                    <span className="text-foreground">{CMD_CERTS.slice(0, certChars)}</span>
                    {certChars < CMD_CERTS.length && <Cursor />}
                  </div>
                )}

                {/* certifications content */}
                {showCerts && <VimBuffer filename="certifications.csv"><CsvBlock /></VimBuffer>}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
