import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { BatMark } from './ui'

const LINES = [
  [8, 'booting batcomputer v2.0'],
  [34, 'mounting data lake  s3://gotham/medallion'],
  [62, 'decrypting case files'],
  [88, 'uplink established  mumbai → gotham'],
]

const MIN_MS = 2300
const MAX_MS = 8000
const SLIDE = { duration: 1.15, ease: [0.76, 0, 0.24, 1] }

export default function Preloader({ sceneReady, onReveal }) {
  const [pct, setPct] = useState(0)
  const [phase, setPhase] = useState('load') // load → open → gone
  const ready = useRef(sceneReady)
  const reveal = useRef(onReveal)

  useEffect(() => {
    ready.current = sceneReady
    reveal.current = onReveal
  }, [sceneReady, onReveal])

  useEffect(() => {
    const start = performance.now()
    const timers = []
    let raf = 0
    const tick = (now) => {
      const elapsed = now - start
      const cap = ready.current ? 100 : 94
      setPct((p) => Math.max(p, Math.min(cap, Math.floor((elapsed / MIN_MS) * 100))))
      if ((elapsed >= MIN_MS && ready.current) || elapsed >= MAX_MS) {
        setPct(100)
        timers.push(
          setTimeout(() => {
            setPhase('open')
            reveal.current?.()
          }, 420),
          setTimeout(() => setPhase('gone'), 420 + 1300),
        )
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      timers.forEach(clearTimeout)
    }
  }, [])

  if (phase === 'gone') return null
  const open = phase === 'open'

  return (
    <div className={`fixed inset-0 z-[100] ${open ? 'pointer-events-none' : ''}`} role="status" aria-label="Loading">
      <motion.div
        className="absolute inset-x-0 top-0 h-1/2 bg-ink"
        animate={{ y: open ? '-101%' : 0 }}
        transition={SLIDE}
      />
      <motion.div
        className="absolute inset-x-0 bottom-0 h-1/2 bg-ink"
        animate={{ y: open ? '101%' : 0 }}
        transition={SLIDE}
      />

      <motion.div
        className="absolute inset-0"
        animate={{ opacity: open ? 0 : 1, scale: open ? 1.08 : 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <div className="absolute inset-x-0 top-1/2 h-px bg-white/10">
          <div className="h-full origin-left bg-blood" style={{ transform: `scaleX(${pct / 100})` }} />
        </div>

        <div className="wrap absolute inset-x-0 top-6 flex justify-between md:top-8">
          <span className="label text-smoke">VS — Portfolio v2.0</span>
          <span className="label text-smoke">Gotham / Mumbai</span>
        </div>

        <div className="absolute inset-x-0 bottom-1/2 flex justify-center pb-10">
          <BatMark className="w-56 text-blood md:w-80" />
        </div>

        <div className="wrap absolute inset-x-0 top-1/2 flex items-start justify-between gap-6 pt-6">
          <ul className="space-y-1.5">
            {LINES.map(([at, text]) => (
              <li
                key={text}
                className={`label transition-opacity duration-300 ${pct >= at ? 'opacity-100' : 'opacity-0'}`}
              >
                <span className="text-blood">&gt;</span> <span className="text-fog">{text}</span>
                <span className="ml-3 text-riddle">{pct >= at + 18 ? 'ok' : '…'}</span>
              </li>
            ))}
          </ul>
          <span className="numeral text-[clamp(3.6rem,11vw,8.5rem)] tabular-nums text-bone">
            {String(pct).padStart(3, '0')}
          </span>
        </div>
      </motion.div>
    </div>
  )
}
