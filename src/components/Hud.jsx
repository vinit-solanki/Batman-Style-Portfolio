import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import somethingInTheWay from '../assets/Nirvana - Something In The Way (Remastered).m4a'

const UNLOCK_EVENTS = ['pointerdown', 'keydown', 'touchstart']

/** Mumbai wall clock, ticking once a second. */
export function Clock({ className = '' }) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  const time = now.toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata', hour12: false })
  return <span className={`tabular-nums ${className}`}>{time} IST</span>
}

/** Background track with a bottom-right toggle. Starts on the first real interaction unless paused. */
export default function Hud({ booted }) {
  const audioRef = useRef(null)
  const btnRef = useRef(null)
  const userPaused = useRef(false)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.loop = true
    audio.volume = 0.32

    const tryPlay = () => {
      if (userPaused.current) return Promise.resolve(false)
      return audio
        .play()
        .then(() => {
          setPlaying(true)
          return true
        })
        .catch(() => {
          setPlaying(false)
          return false
        })
    }

    const unlock = (e) => {
      if (e?.target && btnRef.current?.contains(e.target)) return
      tryPlay().then((started) => {
        if (started) UNLOCK_EVENTS.forEach((name) => window.removeEventListener(name, unlock))
      })
    }

    UNLOCK_EVENTS.forEach((name) => window.addEventListener(name, unlock, { passive: true }))
    return () => UNLOCK_EVENTS.forEach((name) => window.removeEventListener(name, unlock))
  }, [])

  const toggle = (e) => {
    e.stopPropagation()
    const audio = audioRef.current
    if (!audio) return
    if (!audio.paused) {
      userPaused.current = true
      audio.pause()
      setPlaying(false)
    } else {
      userPaused.current = false
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false))
    }
  }

  return (
    <>
      <audio ref={audioRef} src={somethingInTheWay} preload="none" />
      <motion.div
        className="fixed bottom-4 right-4 z-50 md:bottom-7 md:right-8"
        initial={{ opacity: 0, y: 18 }}
        animate={booted ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
        transition={{ duration: 0.8, delay: 1.6 }}
      >
        <button
          ref={btnRef}
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={toggle}
          aria-label={playing ? 'Pause music' : 'Play music'}
          aria-pressed={playing}
          title={playing ? 'Sound on' : 'Sound off'}
          className="flex h-11 w-11 items-center justify-center border border-white/15 bg-ink/90 transition-colors duration-300 hover:border-blood"
        >
          <span className={`eq h-4 w-5 ${playing ? '' : 'paused'}`} aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} style={{ animationDelay: `${i * -0.27}s`, animationDuration: `${0.62 + i * 0.19}s` }} />
            ))}
          </span>
        </button>
      </motion.div>
    </>
  )
}
