import { useEffect, useRef } from 'react'
import { animate, motion, useInView, useSpring } from 'framer-motion'
import { useScramble } from '../hooks/useScramble'
import { EMBLEM_OUTLINE, EMBLEM_VIEWBOX, toPath } from '../lib/emblem'
import { EASE } from '../lib/motion'

const VIEW = { once: true, margin: '0px 0px -12% 0px' }
const MARK = toPath(EMBLEM_OUTLINE)

export function BatMark({ className = '', ...rest }) {
  return (
    <svg viewBox={EMBLEM_VIEWBOX} className={className} fill="currentColor" aria-hidden="true" {...rest}>
      <path d={MARK} />
    </svg>
  )
}

export function Scramble({ text, run = 0, className }) {
  const out = useScramble(text, run)
  return (
    <span className={className} aria-label={text}>
      <span aria-hidden="true">{out}</span>
    </span>
  )
}

export function Reveal({ children, delay = 0, y = 24, className, as = 'div' }) {
  const Tag = motion[as]
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEW}
      transition={{ duration: 1.1, delay, ease: EASE }}
    >
      {children}
    </Tag>
  )
}

/**
 * Words rise out of a mask, one after another. The wrapper is what gets observed:
 * the words themselves start fully clipped, so they would never report as in view.
 */
export function MaskText({ text, delay = 0, stagger = 0.08, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, VIEW)
  const words = text.split(' ')
  return (
    <span ref={ref} className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="mask" aria-hidden="true">
          <motion.span
            className="inline-block"
            initial={{ y: '115%' }}
            animate={{ y: inView ? 0 : '115%' }}
            transition={{ duration: 1.15, delay: delay + i * stagger, ease: EASE }}
          >
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

/** Section opener: a ruled running head, then a title whose last word turns to italic serif. */
export function SectionHeader({ index, kicker, title, accent, children }) {
  return (
    <header className="mb-14 md:mb-24">
      <Reveal className="label flex items-baseline justify-between border-t border-white/15 pt-4">
        <span className="text-fog">
          <span className="text-flare">{index}</span>
          <span className="mx-2.5 text-smoke">/</span>
          {kicker}
        </span>
        <span className="text-smoke">{index} — 06</span>
      </Reveal>
      <h2 className="display mt-9 text-[clamp(2.3rem,7.2vw,7rem)] text-bone md:mt-14">
        <MaskText text={title} />
        {accent && (
          <>
            {' '}
            <MaskText text={accent} delay={0.14} className="accent text-blood" />
          </>
        )}
      </h2>
      {children && (
        <Reveal delay={0.15} className="mt-7 max-w-xl text-lg text-fog">
          {children}
        </Reveal>
      )}
    </header>
  )
}

/** Renders "plain [[highlighted]] plain" with the bracketed parts run over in red marker. */
export function Rich({ text }) {
  return text.split(/\[\[(.+?)\]\]/g).map((part, i) =>
    i % 2 ? (
      <mark key={i} className="hl">
        {part}
      </mark>
    ) : (
      part
    ),
  )
}

export function Magnetic({ children, strength = 0.22, className = '' }) {
  const ref = useRef(null)
  const x = useSpring(0, { stiffness: 160, damping: 20 })
  const y = useSpring(0, { stiffness: 160, damping: 20 })
  const onMove = (e) => {
    if (e.pointerType !== 'mouse' || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const onLeave = () => {
    x.set(0)
    y.set(0)
  }
  return (
    <motion.div ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} style={{ x, y }} className={`inline-block ${className}`}>
      {children}
    </motion.div>
  )
}

export function Counter({ value, decimals = 0, prefix = '', suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -12% 0px' })
  useEffect(() => {
    if (!inView) return
    const controls = animate(0, value, {
      duration: 2.2,
      ease: EASE,
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = prefix + v.toFixed(decimals) + suffix
      },
    })
    return () => controls.stop()
  }, [inView, value, decimals, prefix, suffix])
  return (
    <span ref={ref}>
      {prefix}
      {(0).toFixed(decimals)}
      {suffix}
    </span>
  )
}

/** A captioned figure, framed like a plate in a technical report. */
export function Figure({ number, caption, children, className = '', inner = '' }) {
  return (
    <figure className={className}>
      <div className={`frame ${inner}`}>{children}</div>
      <figcaption className="label mt-4 flex gap-3 text-smoke">
        <span className="shrink-0 text-fog">Fig. {number}</span>
        <span className="italic">{caption}</span>
      </figcaption>
    </figure>
  )
}
