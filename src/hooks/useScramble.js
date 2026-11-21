import { useEffect, useState } from 'react'

const GLYPHS = '<>-_\\/[]{}=+*^?#01'

/** Decodes `text` out of noise, left to right. Re-runs whenever `text` or `run` changes. */
export function useScramble(text, run = 0) {
  const [out, setOut] = useState(text)
  useEffect(() => {
    let frame = 0
    const id = setInterval(() => {
      frame += 1
      const reveal = Math.floor(frame / 1.5)
      let s = ''
      for (let i = 0; i < text.length; i++) {
        if (i < reveal || text[i] === ' ') s += text[i]
        else s += GLYPHS[(Math.random() * GLYPHS.length) | 0]
      }
      setOut(s)
      if (reveal >= text.length) clearInterval(id)
    }, 26)
    return () => clearInterval(id)
  }, [text, run])
  return out
}
