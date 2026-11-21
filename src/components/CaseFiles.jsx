import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { archive, featured } from '../data/content'
import { EASE } from '../lib/motion'
import { Figure, Reveal, SectionHeader } from './ui'

/* ───────── generative "evidence" visuals, one per featured case ───────── */

const frac = (n) => n - Math.floor(n)
const noise = (i) => frac(Math.sin(i * 12.9898) * 43758.5453)
const MONO = 'IBM Plex Mono, monospace'

function WaveVisual() {
  return (
    <div className="flex h-full flex-col justify-between p-6 md:p-7">
      <div className="label flex justify-between text-smoke">
        <span>recommendation engine</span>
        <span>pca · knn · cosine</span>
      </div>
      <div className="eq my-6 h-32 w-full md:h-40" aria-hidden="true">
        {Array.from({ length: 44 }, (_, i) => (
          <span
            key={i}
            style={{
              height: `${28 + noise(i) * 72}%`,
              animationDuration: `${0.9 + noise(i + 9) * 1.2}s`,
              animationDelay: `${-noise(i + 3) * 1.8}s`,
            }}
          />
        ))}
      </div>
      <div className="label flex justify-between">
        <span className="text-flare">▶ now serving in 20 ms</span>
        <span className="text-smoke">27K+ tracks</span>
      </div>
    </div>
  )
}

const AGENTS = [
  [74, 62, 'analyst'],
  [326, 62, 'query'],
  [74, 218, 'visualise'],
  [326, 218, 'report'],
]

function AgentsVisual() {
  return (
    <svg viewBox="0 0 400 280" className="h-full w-full" role="img" aria-label="Agents orbiting a central model">
      {AGENTS.map(([x, y], i) => (
        <g key={i}>
          <path id={`wire-${i}`} d={`M${x} ${y} L200 140`} className="dash-flow" stroke="#e5121d" strokeWidth="1" fill="none" opacity="0.7" />
          <circle r="3" fill="#ff5347">
            <animateMotion dur={`${2.4 + i * 0.4}s`} repeatCount="indefinite" begin={`${i * 0.5}s`}>
              <mpath href={`#wire-${i}`} />
            </animateMotion>
          </circle>
        </g>
      ))}
      {AGENTS.map(([x, y, label]) => (
        <g key={label}>
          <rect x={x - 46} y={y - 15} width="92" height="30" fill="#09090b" stroke="rgba(255,255,255,.28)" />
          <text x={x} y={y + 4} textAnchor="middle" fill="#a9a9b3" fontFamily={MONO} fontSize="11">
            {label}
          </text>
        </g>
      ))}
      <circle cx="200" cy="140" r="44" fill="none" stroke="rgba(229,18,29,.35)">
        <animate attributeName="r" values="40;54;40" dur="4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values=".9;.1;.9" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="200" cy="140" r="34" fill="#12090a" stroke="#e5121d" strokeWidth="1.5" />
      <text x="200" y="138" textAnchor="middle" fill="#ece7de" fontFamily="Mona Sans Variable, sans-serif" fontWeight="700" fontSize="14">
        Gemini
      </text>
      <text x="200" y="153" textAnchor="middle" fill="#80808b" fontFamily={MONO} fontSize="8.5">
        crew core
      </text>
    </svg>
  )
}

function PulseVisual() {
  return (
    <div className="flex h-full flex-col justify-between p-6 md:p-7">
      <div className="label flex justify-between text-smoke">
        <span>dr. ross · online</span>
        <span className="text-riddle">● 72 bpm</span>
      </div>
      <svg viewBox="0 0 400 180" className="my-4 w-full" aria-hidden="true">
        <path d="M0 90 H400 M0 45 H400 M0 135 H400" stroke="rgba(255,255,255,.06)" />
        <path
          className="ecg"
          d="M0 90 H70 L82 90 L92 64 L102 118 L112 24 L124 150 L134 90 H206 L218 90 L228 68 L238 114 L248 36 L260 142 L270 90 H400"
          fill="none"
          stroke="#e5121d"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
      <div className="label space-y-2">
        <p className="w-fit border border-white/12 px-3 py-1.5 text-fog">Any slots with a cardiologist this week?</p>
        <p className="ml-auto w-fit border border-blood/50 px-3 py-1.5 text-bone">Thursday 4:30 PM is open. Book it?</p>
      </div>
    </div>
  )
}

const VISUALS = {
  wave: [WaveVisual, 'Recommendation engine, live output.'],
  agents: [AgentsVisual, 'Four agents reporting to one model.'],
  pulse: [PulseVisual, 'Patient chat on the booking flow.'],
}

/* ───────── featured ───────── */

function Featured({ project, index }) {
  const [Visual, caption] = VISUALS[project.visual]
  return (
    <Reveal as="article" className="group grid gap-x-10 gap-y-10 border-t border-white/15 py-12 md:py-16 lg:grid-cols-12">
      <div className="min-w-0 lg:col-span-7">
        <div className="flex items-baseline gap-6">
          <span className="serif text-[clamp(2.6rem,5vw,4.6rem)] leading-none text-smoke transition-colors duration-700 group-hover:text-blood">
            {project.id}
          </span>
          <p className="label text-smoke">
            Case file
            <span className={`ml-4 ${project.demo ? 'text-riddle' : 'text-fog'}`}>
              {project.demo ? '● live' : '● source available'}
            </span>
          </p>
        </div>

        <h3 className="display mt-6 text-[clamp(2.2rem,5.4vw,4.9rem)] text-bone">{project.name}</h3>
        <p className="serif mt-3 text-[clamp(1.35rem,2.2vw,1.9rem)] leading-tight text-blood">{project.tagline}</p>

        <div className="mt-8 max-w-2xl space-y-4 leading-[1.75] text-fog">
          {project.points.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>

        <dl className="mt-9 flex flex-wrap gap-x-14 gap-y-6">
          {project.stats.map(([value, label]) => (
            <div key={label}>
              <dd className="numeral text-[2.3rem] text-bone">{value}</dd>
              <dt className="label mt-2 text-smoke">{label}</dt>
            </div>
          ))}
        </dl>

        <p className="label mt-9 border-t border-white/10 pt-5 text-smoke">
          Built with <span className="text-fog">{project.tech.join(' / ')}</span>
        </p>

        <div className="mt-7 flex flex-wrap gap-x-9 gap-y-3 text-[1.02rem] font-semibold">
          {project.demo && (
            <a href={project.demo} target="_blank" rel="noopener noreferrer" className="link text-bone hover:text-blood">
              Visit the live build <ArrowUpRight size={16} />
            </a>
          )}
          <a href={project.github} target="_blank" rel="noopener noreferrer" className="link text-bone hover:text-blood">
            Read the source <ArrowUpRight size={16} />
          </a>
        </div>
      </div>

      <Figure
        number={index + 2}
        caption={caption}
        className="min-w-0 lg:col-span-5 lg:pt-3"
        inner="aspect-[4/3] bg-[radial-gradient(90%_70%_at_50%_62%,rgba(138,12,18,0.3),transparent_70%)]"
      >
        <Visual />
      </Figure>
    </Reveal>
  )
}

/* ───────── archive ───────── */

const CATEGORIES = ['ALL', 'DATA', 'ML', 'SYSTEMS', 'FULL STACK', 'FRONTEND']

function Archive() {
  const [cat, setCat] = useState('ALL')
  const rows = cat === 'ALL' ? archive : archive.filter((p) => p.category === cat)

  return (
    <div className="mt-24 md:mt-36">
      <Reveal className="flex flex-wrap items-end justify-between gap-6">
        <h3 className="display text-[clamp(1.9rem,4.6vw,4rem)] text-bone">
          Cold <span className="accent text-blood">cases</span>
        </h3>
        <div className="label flex flex-wrap gap-x-6 gap-y-2" role="group" aria-label="Filter by category">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              aria-pressed={cat === c}
              className={`border-b pb-1 transition-colors duration-300 ${
                cat === c ? 'border-blood text-bone' : 'border-transparent text-smoke hover:text-bone'
              }`}
            >
              {c.toLowerCase()}
            </button>
          ))}
        </div>
      </Reveal>

      <Reveal className="mt-8 border-t border-white/15">
        <p className="label border-b border-white/10 py-3.5 text-riddle">
          <span className="text-smoke">gotham=# </span>
          SELECT * FROM case_files{cat !== 'ALL' && ` WHERE category = '${cat}'`} ORDER BY id;
          <span className="blink ml-1">▌</span>
        </p>
        <ul>
          <AnimatePresence initial={false} mode="popLayout">
            {rows.map((p) => (
              <motion.li
                layout
                key={p.id}
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 14 }}
                transition={{ duration: 0.6, ease: EASE }}
                className="group grid grid-cols-[2.4rem_1fr_auto] items-baseline gap-x-4 border-b border-white/10 py-5 transition-colors duration-500 hover:border-blood md:grid-cols-[4rem_1fr_8rem_10.5rem] md:gap-x-8"
              >
                <span className="serif text-lg text-smoke transition-colors duration-500 group-hover:text-blood">{p.id}</span>
                <div className="min-w-0">
                  <p className="title text-[1.2rem] text-bone md:text-[1.5rem]">{p.name}</p>
                  <p className="label mt-1.5 text-smoke">{p.tech.join(' / ')}</p>
                </div>
                <span className="label hidden text-fog md:block">{p.category.toLowerCase()}</span>
                <div className="flex justify-end gap-5 text-[0.95rem] font-semibold">
                  {p.demo && (
                    <a href={p.demo} target="_blank" rel="noopener noreferrer" className="link text-bone hover:text-blood" aria-label={`${p.name} live demo`}>
                      Live <ArrowUpRight size={15} />
                    </a>
                  )}
                  <a href={p.github} target="_blank" rel="noopener noreferrer" className="link text-bone hover:text-blood" aria-label={`${p.name} source on GitHub`}>
                    Source <ArrowUpRight size={15} />
                  </a>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
        <p className="label py-3.5 text-smoke">
          ({rows.length} {rows.length === 1 ? 'row' : 'rows'})
        </p>
      </Reveal>
    </div>
  )
}

export default function CaseFiles() {
  return (
    <section id="cases" className="scrim relative py-28 md:py-44">
      <div className="wrap">
        <SectionHeader index="04" kicker="Case files" title="Solved" accent="cases">
          Three on the board, nine more in the archive.
        </SectionHeader>
        <div className="border-b border-white/15">
          {featured.map((project, i) => (
            <Featured key={project.id} project={project} index={i} />
          ))}
        </div>
        <Archive />
      </div>
    </section>
  )
}
