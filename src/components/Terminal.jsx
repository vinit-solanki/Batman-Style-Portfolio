import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { archive, commendations, experience, featured, profile, skills, socials } from '../data/content'
import { scrollToId } from '../lib/scroll'
import { Reveal, SectionHeader } from './ui'

const PROMPT = 'guest@batcomputer:~$'
const SUGGESTIONS = ['help', 'whoami', 'stack', 'ops', 'cases', 'riddle', 'signal']

const RIDDLES = [
  {
    q: 'I move your data while the city sleeps. I extract, I transform, I load. What am I?',
    a: /pipeline|etl|elt/i,
    answer: 'a pipeline',
  },
  {
    q: 'I start raw as bronze, get scrubbed to silver, and leave as gold. What am I?',
    a: /medallion|lake|data/i,
    answer: 'a medallion data lake',
  },
  {
    q: 'I hold every message in line and never lose my place, even when the workers crash. What am I?',
    a: /queue|sqs/i,
    answer: 'a queue',
  },
]

const line = (text, tone = 'out') => ({ text, tone })
const allCases = [...featured, ...archive]

const HELP = [
  ['whoami', 'who you are dealing with'],
  ['stack', 'tools in the utility belt'],
  ['ops', 'field operations (experience)'],
  ['cases', 'list every case file'],
  ['open <id>', 'open a case, e.g. open 001'],
  ['awards', 'commendations on record'],
  ['contact', 'ways to reach me'],
  ['resume', 'open the résumé'],
  ['signal', 'light the signal'],
  ['riddle', 'riddle me this'],
  ['clear', 'wipe the screen'],
]

function execute(raw, ctx) {
  const input = raw.trim()
  const [cmd, ...rest] = input.toLowerCase().split(/\s+/)
  const arg = rest.join(' ')

  if (ctx.riddle !== null && cmd !== 'riddle' && cmd !== 'clear') {
    const r = RIDDLES[ctx.riddle]
    ctx.setRiddle(null)
    return r.a.test(input)
      ? [line('Correct. You would have made a fine detective.', 'ok')]
      : [line(`Not quite — the answer was ${r.answer}.`, 'err')]
  }

  switch (cmd) {
    case '':
      return []
    case 'help':
    case 'ls':
      return [line('Available commands:', 'dim'), ...HELP.map(([c, d]) => line(`  ${c.padEnd(12)} ${d}`))]
    case 'whoami':
      return [
        line(`${profile.name} — ${profile.role} @ ${profile.company}`, 'ok'),
        line(profile.summary),
        line(`Base: ${profile.base}   Coordinates: ${profile.coords}`, 'dim'),
      ]
    case 'stack':
    case 'skills':
      return skills.map((s) => line(`${s.title.toUpperCase().padEnd(22)} ${s.items.join(', ')}`))
    case 'ops':
    case 'experience':
      return experience.flatMap((e) => [
        line(`${e.id}  ${e.role} — ${e.org}`, 'ok'),
        line(`       ${e.period} · ${e.place}`, 'dim'),
      ])
    case 'cases':
    case 'projects':
      return [
        ...allCases.map((p) => line(`  ${p.id}  ${p.name}`)),
        line('Type "open <id>" to pull a file.', 'dim'),
      ]
    case 'open': {
      const found = allCases.find((p) => p.id === arg.padStart(3, '0') || p.name.toLowerCase() === arg)
      if (!found) return [line(`No case file matching "${arg}". Try "cases".`, 'err')]
      window.open(found.demo || found.github, '_blank', 'noopener')
      return [line(`Opening case ${found.id} — ${found.name} …`, 'ok')]
    }
    case 'awards':
      return commendations.map((c) => line(`  ${c.title} — ${c.detail}`))
    case 'contact':
      return [
        line(`  email      ${profile.email}`),
        ...socials.map((s) => line(`  ${s.label.toLowerCase().padEnd(10)} ${s.href}`)),
      ]
    case 'resume':
    case 'cv':
      window.open(profile.resume, '_blank', 'noopener')
      return [line('Opening résumé …', 'ok')]
    case 'signal':
      scrollToId('contact')
      return [line('Signal lit. Look up.', 'ok')]
    case 'riddle': {
      const next = ((ctx.riddle ?? ctx.lastRiddle.current) + 1) % RIDDLES.length
      ctx.lastRiddle.current = next
      ctx.setRiddle(next)
      return [line(RIDDLES[next].q, 'riddle'), line('Type your answer.', 'dim')]
    }
    case 'sudo':
      return [line('Nice try. This incident will be reported to Alfred.', 'err')]
    case 'vengeance':
    case 'batman':
      return [line('I’m not hiding in the shadows. I am the scheduled job.', 'ok')]
    case 'exit':
      return [line('There is no exit. Only more data.', 'dim')]
    default:
      return [line(`command not found: ${cmd} — type "help"`, 'err')]
  }
}

const TONE = {
  out: 'text-bone/90',
  dim: 'text-smoke',
  ok: 'text-riddle',
  err: 'text-flare',
  riddle: 'text-gold',
  cmd: 'text-bone',
}

const BOOT = [
  line('BATCOMPUTER v2.0 — secure shell', 'dim'),
  line('Connection established. Type "help" to look around.', 'dim'),
]

export default function Terminal() {
  const [lines, setLines] = useState(BOOT)
  const [value, setValue] = useState('')
  const [riddle, setRiddle] = useState(null)
  const [history, setHistory] = useState([])
  const [cursor, setCursor] = useState(-1)
  const lastRiddle = useRef(-1)
  const body = useRef(null)
  const input = useRef(null)
  const wrap = useRef(null)
  const inView = useInView(wrap, { once: true, margin: '0px 0px -30% 0px' })
  const greeted = useRef(false)
  const demo = useRef([])

  const stopDemo = () => {
    if (!demo.current.length) return
    demo.current.forEach(clearTimeout)
    demo.current = []
    setValue('')
  }

  const run = (raw) => {
    stopDemo()
    if (raw.trim().toLowerCase() === 'clear') {
      setLines([])
      setRiddle(null)
      return
    }
    const out = execute(raw, { riddle, setRiddle, lastRiddle })
    setLines((prev) => [...prev, line(raw, 'cmd'), ...out].slice(-160))
    if (raw.trim()) setHistory((h) => [raw, ...h].slice(0, 30))
    setCursor(-1)
  }

  // Demonstrate the shell once, the first time it scrolls into view.
  useEffect(() => {
    if (!inView || greeted.current) return
    greeted.current = true
    const text = 'whoami'
    let i = 0
    const timers = demo.current
    const type = () => {
      i += 1
      setValue(text.slice(0, i))
      if (i < text.length) timers.push(setTimeout(type, 110))
      else
        timers.push(
          setTimeout(() => {
            demo.current = []
            setValue('')
            setLines((prev) => [...prev, line(text, 'cmd'), ...execute(text, { riddle: null, setRiddle: () => {}, lastRiddle })])
          }, 380),
        )
    }
    timers.push(setTimeout(type, 500))
  }, [inView])

  useEffect(() => () => demo.current.forEach(clearTimeout), [])

  useEffect(() => {
    if (body.current) body.current.scrollTop = body.current.scrollHeight
  }, [lines])

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      run(value)
      setValue('')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const next = Math.min(history.length - 1, cursor + 1)
      if (next >= 0) {
        setCursor(next)
        setValue(history[next])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = cursor - 1
      setCursor(Math.max(-1, next))
      setValue(next >= 0 ? history[next] : '')
    }
  }

  return (
    <section id="terminal" className="scrim relative py-28 md:py-44">
      <div className="wrap">
        <SectionHeader index="05" kicker="Batcomputer" title="Ask the" accent="machine">
          Prefer a prompt to a page? The whole dossier is queryable.
        </SectionHeader>

        <Reveal>
          <div
            ref={wrap}
            className="scanlines relative mx-auto max-w-5xl border border-white/15 bg-[#070709]/95 shadow-[0_50px_90px_-50px_rgba(0,0,0,1)]"
            onClick={() => input.current?.focus({ preventScroll: true })}
          >
            <div className="label flex items-center justify-between border-b border-white/10 px-5 py-3 text-smoke">
              <div className="flex items-center gap-2" aria-hidden="true">
                <span className="h-2.5 w-2.5 bg-blood" />
                <span className="h-2.5 w-2.5 bg-white/20" />
                <span className="h-2.5 w-2.5 bg-white/20" />
              </div>
              <span>ssh guest@batcomputer</span>
              <span className="text-riddle">● online</span>
            </div>

            <div
              ref={body}
              data-lenis-prevent
              className="term-scroll h-[22rem] overflow-y-auto px-5 py-5 font-mono text-[0.82rem] leading-[1.7] md:h-[26rem] md:px-7 md:text-[0.9rem]"
              aria-live="polite"
            >
              {lines.map((l, i) => (
                <p key={i} className={`whitespace-pre-wrap break-words ${TONE[l.tone]}`}>
                  {l.tone === 'cmd' && <span className="text-blood">{PROMPT} </span>}
                  {l.text}
                </p>
              ))}
              <label className="flex items-center gap-2">
                <span className="shrink-0 text-blood">{riddle !== null ? 'answer>' : PROMPT}</span>
                <input
                  ref={input}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={onKeyDown}
                  onFocus={stopDemo}
                  spellCheck={false}
                  autoComplete="off"
                  autoCapitalize="off"
                  aria-label="Terminal input"
                  className="w-full min-w-0 bg-transparent text-bone caret-blood outline-none"
                />
              </label>
            </div>

            <div className="label flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/10 px-5 py-3.5 md:px-7">
              <span className="text-smoke">try</span>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  className="border-b border-white/25 pb-0.5 text-fog transition-colors duration-300 hover:border-blood hover:text-bone"
                  onClick={() => run(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
