import { useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from 'framer-motion'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { nav, profile } from '../data/content'
import { scrollToId } from '../lib/scroll'
import { EASE } from '../lib/motion'
import { BatMark, Scramble } from './ui'

function NavLink({ item, index }) {
  const [run, setRun] = useState(0)
  return (
    <a
      href={`#${item.id}`}
      onClick={(e) => {
        e.preventDefault()
        scrollToId(item.id)
      }}
      onMouseEnter={() => setRun((r) => r + 1)}
      className="label flex items-center gap-2 text-fog transition-colors duration-300 hover:text-bone"
    >
      <span className="text-blood">{String(index + 1).padStart(2, '0')}</span>
      <Scramble text={item.label} run={run} />
    </a>
  )
}

export default function Nav({ booted }) {
  const { scrollY, scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 32, restDelta: 0.001 })
  const [hidden, setHidden] = useState(false)
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setHidden(y > prev && y > 360)
    setSolid(y > 90)
  })

  const go = (id) => (e) => {
    e.preventDefault()
    setOpen(false)
    scrollToId(id)
  }

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: !booted || (hidden && !open) ? -100 : 0 }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        <motion.div className="absolute inset-x-0 top-0 h-[2px] origin-left bg-blood" style={{ scaleX: progress }} />
        <div
          className={`border-b transition-colors duration-500 ${
            solid ? 'border-white/10 bg-ink/90' : 'border-transparent'
          }`}
        >
          <div className="wrap flex h-16 items-center justify-between md:h-20">
            <a href="#top" onClick={go('top')} className="flex items-center gap-3" aria-label="Back to top">
              <BatMark className="w-[4.5rem] text-blood" />
              <span className="title hidden text-[1.02rem] text-bone sm:block">Vinit Solanki</span>
            </a>

            <nav className="hidden items-center gap-8 lg:flex" aria-label="Sections">
              {nav.map((item, i) => (
                <NavLink key={item.id} item={item} index={i} />
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <a
                href={profile.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost hidden px-4 py-3 sm:inline-flex"
              >
                Résumé <ArrowUpRight size={14} />
              </a>
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center text-bone lg:hidden"
                onClick={() => setOpen((o) => !o)}
                aria-label={open ? 'Close menu' : 'Open menu'}
                aria-expanded={open}
              >
                {open ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col justify-center bg-ink/[0.97] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="wrap flex flex-col gap-1" aria-label="Sections">
              {nav.map((item, i) => (
                <motion.a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={go(item.id)}
                  className="display flex items-baseline gap-4 py-2 text-[clamp(1.9rem,8.5vw,3.4rem)] text-bone"
                  initial={{ opacity: 0, x: -28 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.05 + i * 0.05, ease: EASE }}
                >
                  <span className="label text-blood">{String(i + 1).padStart(2, '0')}</span>
                  {item.label}
                </motion.a>
              ))}
              <a href={profile.resume} target="_blank" rel="noopener noreferrer" className="btn btn-red mt-8 self-start">
                Résumé <ArrowUpRight size={14} />
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
