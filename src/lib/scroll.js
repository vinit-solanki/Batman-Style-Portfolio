// Shared, mutable frame state. The WebGL scene reads these every frame, so they live
// outside React to avoid re-rendering the tree on scroll or pointer movement.
export const scrollState = {
  p: 0, // raw page progress 0..1
  t: 0, // camera timeline 0..1 (hero / journey / contact zones)
  heroEnd: 0.12,
  contactStart: 0.88,
  // where the open sky above the hero copy sits, as fractions of the hero's height
  heroMid: 0.31,
  heroFree: 0.4,
}

export const pointer = { x: 0, y: 0 }

export const lenisRef = { current: null }

const HERO_T = 0.143
const NAV_HEIGHT = 76
const CONTACT_T = 0.857

export function measureZones() {
  const max = document.documentElement.scrollHeight - window.innerHeight
  if (max <= 0) return
  const hero = document.getElementById('top')
  const contact = document.getElementById('contact')
  if (hero) scrollState.heroEnd = Math.min(0.5, hero.offsetHeight / max)
  const copy = hero?.querySelector('[data-hero-copy]')
  if (copy) {
    const top = NAV_HEIGHT
    const bottom = Math.max(top + 40, copy.offsetTop)
    scrollState.heroMid = Math.min(0.45, Math.max(0.12, (top + bottom) / 2 / hero.offsetHeight))
    scrollState.heroFree = Math.min(0.6, Math.max(0.06, (bottom - top) / hero.offsetHeight))
  }
  if (contact) {
    const top = contact.getBoundingClientRect().top + window.scrollY
    scrollState.contactStart = Math.max(scrollState.heroEnd + 0.05, Math.min(0.98, (top - window.innerHeight * 0.6) / max))
  }
}

export function updateScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight
  const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
  const { heroEnd: a, contactStart: b } = scrollState
  let t
  if (p <= a) t = (p / a) * HERO_T
  else if (p <= b) t = HERO_T + ((p - a) / (b - a)) * (CONTACT_T - HERO_T)
  else t = CONTACT_T + ((p - b) / (1 - b)) * (1 - CONTACT_T)
  scrollState.p = p
  scrollState.t = t
}

export function scrollToId(id) {
  const el = document.getElementById(id)
  if (!el) return
  if (lenisRef.current) lenisRef.current.scrollTo(el, { duration: 1.6 })
  else el.scrollIntoView({ behavior: 'smooth' })
}
