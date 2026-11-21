import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import Lenis from 'lenis'
import Arsenal from './components/Arsenal'
import CaseFiles from './components/CaseFiles'
import Contact from './components/Contact'
import Cursor from './components/Cursor'
import Hero from './components/Hero'
import Hud from './components/Hud'
import Nav from './components/Nav'
import Operations from './components/Operations'
import Preloader from './components/Preloader'
import Profile from './components/Profile'
import Terminal from './components/Terminal'
import { lenisRef, measureZones, pointer, updateScroll } from './lib/scroll'

const GothamScene = lazy(() => import('./three/GothamScene.jsx'))

function detectEnvironment() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  let webgl = false
  try {
    webgl = Boolean(document.createElement('canvas').getContext('webgl2'))
  } catch {
    webgl = false
  }
  const small = window.matchMedia('(max-width: 820px)').matches
  const weak = (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) < 4
  return { reduced, use3d: webgl && !reduced, tier: small || weak ? 'low' : 'high' }
}

export default function App() {
  const [env] = useState(detectEnvironment)
  const [booted, setBooted] = useState(false)
  const [sceneReady, setSceneReady] = useState(false)

  const onSceneReady = useCallback(() => setSceneReady(true), [])
  const onReveal = useCallback(() => setBooted(true), [])

  // Always open on the hero so the intro plays from the top.
  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
  }, [])

  // Smooth scrolling + the scroll/pointer state the 3D scene reads every frame.
  useEffect(() => {
    const sync = () => {
      measureZones()
      updateScroll()
    }
    const onPointer = (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onPointer, { passive: true })
    window.addEventListener('scroll', updateScroll, { passive: true })
    const observer = new ResizeObserver(sync)
    observer.observe(document.body)
    sync()

    let lenis = null
    let raf = 0
    if (!env.reduced) {
      lenis = new Lenis({ lerp: 0.075, wheelMultiplier: 0.85 })
      lenisRef.current = lenis
      const loop = (time) => {
        lenis.raf(time)
        raf = requestAnimationFrame(loop)
      }
      raf = requestAnimationFrame(loop)
    }

    return () => {
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('scroll', updateScroll)
      observer.disconnect()
      cancelAnimationFrame(raf)
      lenis?.destroy()
      lenisRef.current = null
    }
  }, [env.reduced])

  // Hold the page still until the boot sequence opens.
  useEffect(() => {
    const root = document.documentElement
    if (booted) {
      root.style.overflow = ''
      lenisRef.current?.start()
    } else {
      root.style.overflow = 'hidden'
      lenisRef.current?.stop()
    }
    return () => {
      root.style.overflow = ''
    }
  }, [booted])

  return (
    <>
      <div className="backdrop-static fixed inset-0 z-0" aria-hidden="true">
        {env.use3d && (
          <Suspense fallback={null}>
            <GothamScene booted={booted} tier={env.tier} onReady={onSceneReady} />
          </Suspense>
        )}
      </div>

      <Preloader sceneReady={sceneReady || !env.use3d} onReveal={onReveal} />
      <Cursor />
      <Nav booted={booted} />

      <main className="relative z-10">
        <Hero booted={booted} />
        <Profile />
        <Arsenal />
        <Operations />
        <CaseFiles />
        <Terminal />
        <Contact />
      </main>

      <Hud booted={booted} />
      <div className="grain" aria-hidden="true" />
    </>
  )
}
