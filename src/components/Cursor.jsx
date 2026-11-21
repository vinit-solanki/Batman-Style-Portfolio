import { useEffect, useRef, useState } from 'react'

/** Targeting-reticle cursor. Only mounts on devices with a real mouse. */
export default function Cursor() {
  const dot = useRef(null)
  const ring = useRef(null)
  const [enabled] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches,
  )

  useEffect(() => {
    if (!enabled) return
    const root = document.documentElement
    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let rx = x
    let ry = y
    let raf = 0
    let seen = false

    const move = (e) => {
      x = e.clientX
      y = e.clientY
      if (!seen) {
        seen = true
        rx = x
        ry = y
        root.classList.add('has-cursor')
        dot.current.style.opacity = 1
        ring.current.style.opacity = 1
      }
      const hot = e.target.closest?.('a, button, input, [data-hot]')
      ring.current.classList.toggle('is-hover', Boolean(hot))
    }
    const down = () => ring.current.classList.add('is-down')
    const up = () => ring.current.classList.remove('is-down')
    const loop = () => {
      rx += (x - rx) * 0.18
      ry += (y - ry) * 0.18
      dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
      ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerdown', down, { passive: true })
    window.addEventListener('pointerup', up, { passive: true })
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      root.classList.remove('has-cursor')
    }
  }, [enabled])

  if (!enabled) return null
  return (
    <>
      <div ref={ring} className="cursor-ring" style={{ opacity: 0 }} aria-hidden="true">
        <i />
      </div>
      <div ref={dot} className="cursor-dot" style={{ opacity: 0 }} aria-hidden="true" />
    </>
  )
}
