import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { dossier, metrics, profile } from '../data/content'
import { Counter, Reveal, SectionHeader } from './ui'

function Word({ children, progress, range, lead }) {
  const opacity = useTransform(progress, range, [0.16, 1])
  return (
    <motion.span style={{ opacity }} className={`mr-[0.24em] inline-block ${lead ? 'serif text-[1.08em] text-blood' : ''}`}>
      {children}
    </motion.span>
  )
}

/** Each word lights up as the paragraph scrolls through the viewport. */
function ScrollWords({ text, leadWords = 2 }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 88%', 'end 48%'] })
  const words = text.split(' ')
  return (
    <p ref={ref} className="text-[clamp(1.6rem,3.1vw,2.9rem)] font-medium leading-[1.16] tracking-[-0.03em] text-bone">
      {words.map((w, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} lead={i < leadWords}>
          {w}
        </Word>
      ))}
    </p>
  )
}

/** A typed personnel file, slightly askew, that straightens when you reach for it. */
function Dossier() {
  return (
    <div className="paper mx-auto max-w-md -rotate-[1.6deg] px-7 pb-7 pt-8 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:rotate-0 md:px-9 lg:ml-auto lg:mr-0">
      <span className="absolute left-3 top-[22%] h-3 w-3 rounded-full bg-ink shadow-[inset_0_2px_3px_rgba(0,0,0,0.9)]" aria-hidden="true" />
      <span className="absolute left-3 top-[72%] h-3 w-3 rounded-full bg-ink shadow-[inset_0_2px_3px_rgba(0,0,0,0.9)]" aria-hidden="true" />

      <div className="flex items-start justify-between gap-4 pl-4">
        <div>
          <p className="text-[0.68rem] uppercase tracking-[0.14em] text-black/55">Personnel record</p>
          <p className="display mt-2 text-[1.7rem] text-[#1c1813]">File DE-0426</p>
        </div>
        <span className="stamp mt-1">Classified</span>
      </div>

      <dl className="mt-7 space-y-2.5 pl-4 text-[0.8rem] leading-snug">
        {dossier.map(([k, v]) => (
          <div key={k} className="flex items-baseline gap-2">
            <dt className="shrink-0 text-black/55">{k}</dt>
            <span className="mb-1 min-w-4 flex-1 border-b border-dotted border-black/35" aria-hidden="true" />
            <dd className="max-w-[62%] text-right font-medium">{v}</dd>
          </div>
        ))}
        <div className="flex items-baseline gap-2">
          <dt className="shrink-0 text-black/55">Status</dt>
          <span className="mb-1 min-w-4 flex-1 border-b border-dotted border-black/35" aria-hidden="true" />
          <dd className="relative px-2 font-medium">
            Active
            <svg
              viewBox="0 0 90 36"
              preserveAspectRatio="none"
              className="pointer-events-none absolute -inset-x-2 -inset-y-1.5 h-[calc(100%+0.75rem)] w-[calc(100%+1rem)]"
              aria-hidden="true"
            >
              <path
                d="M8 20C6 8 30 3 52 4s34 6 31 16-22 13-44 12S10 30 9 19c-1-7 9-12 20-13"
                fill="none"
                stroke="#b3121a"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </dd>
        </div>
      </dl>

      <div className="mt-8 flex items-end justify-between gap-4 pl-4">
        <div
          className="h-8 w-36 opacity-80"
          style={{
            background:
              'repeating-linear-gradient(90deg, #1c1813 0 2px, transparent 2px 5px, #1c1813 5px 6px, transparent 6px 11px, #1c1813 11px 14px, transparent 14px 16px)',
          }}
          aria-hidden="true"
        />
        <span className="text-right text-[0.66rem] leading-tight text-black/55">
          {profile.coords}
          <br />
          {profile.base}
        </span>
      </div>
    </div>
  )
}

const EXHIBIT = ['A', 'B', 'C', 'D']

export default function Profile() {
  return (
    <section id="profile" className="scrim relative py-28 md:py-44">
      <div className="wrap">
        <SectionHeader index="01" kicker="Subject profile" title="Behind" accent="the mask" />

        <div className="grid items-center gap-16 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <ScrollWords text={profile.summary} />
            <Reveal className="mt-9 max-w-xl text-lg leading-relaxed text-fog">{profile.focus}</Reveal>
            <Reveal delay={0.1} className="mt-9 flex flex-wrap gap-3">
              <a href={profile.resume} target="_blank" rel="noopener noreferrer" className="btn btn-red">
                Read the résumé <ArrowUpRight size={14} />
              </a>
              <a href="https://github.com/vinit-solanki" target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                GitHub <ArrowUpRight size={14} />
              </a>
            </Reveal>
          </div>
          <Reveal className="lg:col-span-5" delay={0.12}>
            <Dossier />
          </Reveal>
        </div>

        <div className="mt-24 md:mt-36">
          <Reveal className="label flex items-baseline justify-between border-t border-white/15 pt-4">
            <span className="text-fog">Evidence</span>
            <span className="text-smoke">Numbers on record</span>
          </Reveal>
          {/* each cell carries a left rule; the first in every row is clipped off by the wrapper */}
          <div className="overflow-hidden">
            <div className="-ml-5 grid grid-cols-2 md:-ml-8 xl:grid-cols-4">
            {metrics.map((m, i) => (
              <Reveal
                key={m.label}
                delay={i * 0.08}
                className={`group border-l border-white/10 py-9 pl-5 pr-4 md:py-12 md:pl-8 ${
                  i < 2 ? 'border-b xl:border-b-0' : ''
                }`}
              >
                <p className="label text-smoke">Exhibit {EXHIBIT[i]}</p>
                <p className="numeral mt-5 text-[clamp(2.7rem,6vw,5.4rem)] text-bone transition-colors duration-500 group-hover:text-blood">
                  <Counter value={m.value} decimals={m.decimals} prefix={m.prefix} suffix={m.suffix} />
                </p>
                <p className="serif mt-4 text-[1.45rem] leading-tight text-flare">{m.label}</p>
                <p className="mt-2 max-w-[17rem] text-[0.95rem] leading-snug text-fog">{m.note}</p>
              </Reveal>
            ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
