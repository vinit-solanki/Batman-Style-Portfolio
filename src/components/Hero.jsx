import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDownRight } from 'lucide-react'
import { profile, roles } from '../data/content'
import { useScramble } from '../hooks/useScramble'
import { EASE } from '../lib/motion'
import { scrollToId } from '../lib/scroll'
import { Clock } from './Hud'

function Letters({ word, className, base, booted }) {
  return [...word].map((ch, i) => (
    <span key={i} className="mask">
      <motion.span
        className={`inline-block ${className}`}
        initial={{ y: '115%' }}
        animate={{ y: booted ? 0 : '115%' }}
        transition={{ duration: 1.3, delay: base + i * 0.045, ease: EASE }}
      >
        {ch}
      </motion.span>
    </span>
  ))
}

function Fade({ booted, delay, className, children }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={booted ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 1.2, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

export default function Hero({ booted }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, -130])
  const opacity = useTransform(scrollYProgress, [0, 0.62], [1, 0])

  const [roleIndex, setRoleIndex] = useState(0)
  useEffect(() => {
    if (!booted) return
    const id = setInterval(() => setRoleIndex((i) => (i + 1) % roles.length), 3600)
    return () => clearInterval(id)
  }, [booted])
  const role = useScramble(roles[roleIndex], booted ? 1 : 0)

  const go = (id) => (e) => {
    e.preventDefault()
    scrollToId(id)
  }

  return (
    <section id="top" ref={ref} className="relative flex h-[100svh] min-h-[620px] flex-col justify-end overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] bg-[linear-gradient(to_top,transparent_0%,rgba(5,5,6,0.8)_15%,rgba(5,5,6,0.42)_60%,transparent_100%)]" />

      <motion.div data-hero-copy style={{ y, opacity }} className="wrap relative pb-4 md:pb-6">
        <div className="mb-6 flex flex-col gap-7 md:mb-5 md:flex-row md:items-end md:justify-between">
          <Fade booted={booted} delay={0.9}>
            <p className="label flex items-center gap-3 text-fog">
              <span className="pulse-dot text-blood" />
              On duty — {profile.role} at {profile.company}
            </p>
            <p className="mt-3 font-mono text-[0.95rem] font-medium tracking-[0.04em] text-bone md:text-base" aria-live="off">
              <span className="text-blood">&gt;</span> {role}
              <span className="blink text-blood">_</span>
            </p>
          </Fade>

          <Fade booted={booted} delay={1.05} className="md:max-w-[26rem] md:text-right">
            <p className="hidden text-[1.02rem] leading-relaxed text-fog sm:block">
              Production ETL/ELT pipelines, AWS data lakes and large-scale enrichment systems — engineered for scale,
              data quality and cost.
            </p>
            <div className="mt-5 flex flex-wrap gap-3 md:justify-end">
              <a href="#cases" onClick={go('cases')} className="btn btn-red">
                Open case files <ArrowDownRight size={14} />
              </a>
              <a href="#contact" onClick={go('contact')} className="btn btn-ghost">
                Light the signal
              </a>
            </div>
          </Fade>
        </div>

        <h1 className="display hero-name select-none" aria-label={profile.name}>
          <span className="block whitespace-nowrap md:inline" aria-hidden="true">
            <Letters word="VINIT" className="text-bone" base={0.2} booted={booted} />
          </span>
          <span className="hidden w-[0.26em] md:inline-block" />
          <span className="block whitespace-nowrap md:inline" aria-hidden="true">
            <Letters word="SOLANKI" className="text-blood" base={0.42} booted={booted} />
          </span>
        </h1>

        <Fade
          booted={booted}
          delay={1.3}
          className="label mt-4 flex items-center justify-between gap-4 border-t border-white/12 pr-16 pt-3 text-smoke md:pr-20"
        >
          <span className="flex items-center gap-2">
            <motion.span
              className="inline-block"
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              ↓
            </motion.span>
            Scroll to descend
          </span>
          <span className="hidden md:block">
            {profile.coords} — {profile.base}
          </span>
          <Clock />
        </Fade>
      </motion.div>
    </section>
  )
}
