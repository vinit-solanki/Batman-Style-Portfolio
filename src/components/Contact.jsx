import { useState } from 'react'
import { ArrowUp, ArrowUpRight } from 'lucide-react'
import { profile, socials } from '../data/content'
import { scrollToId } from '../lib/scroll'
import { Clock } from './Hud'
import { BatMark, Magnetic, MaskText, Reveal } from './ui'

export default function Contact() {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }

  return (
    <section id="contact" className="relative flex min-h-[112svh] flex-col justify-end pt-[46svh]">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-ink/25 to-ink" />

      <div className="wrap relative pb-16 md:pb-24">
        <Reveal className="label mb-6 text-fog">
          <span className="text-flare">06</span>
          <span className="mx-2.5 text-smoke">/</span>
          Open channel
        </Reveal>

        <h2 className="display text-[clamp(2.7rem,10.6vw,10.5rem)] text-bone">
          <MaskText text="Light the" />
          <br />
          <MaskText text="signal." delay={0.14} className="accent text-blood" />
        </h2>

        <div className="mt-12 grid items-end gap-14 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-6">
            <Reveal className="max-w-xl text-lg leading-relaxed text-fog md:text-xl">
              A pipeline that keeps breaking, a dataset nobody trusts, or a problem worth losing sleep over — send it
              through. I answer.
            </Reveal>

            <Reveal delay={0.1} className="mt-9">
              <Magnetic>
                <a
                  href={`mailto:${profile.email}`}
                  className="link title break-all text-[clamp(1.15rem,2.5vw,2.1rem)] text-bone hover:text-blood"
                >
                  {profile.email} <ArrowUpRight className="shrink-0" size={22} />
                </a>
              </Magnetic>
            </Reveal>

            <Reveal delay={0.16} className="label mt-7 flex flex-wrap items-center gap-x-7 gap-y-2 text-smoke">
              <button
                type="button"
                onClick={copy}
                className="border-b border-white/25 pb-0.5 text-fog transition-colors duration-300 hover:border-blood hover:text-bone"
                aria-live="polite"
              >
                {copied ? 'Copied to clipboard' : 'Copy address'}
              </button>
              <span>{profile.base}, India</span>
              <Clock />
            </Reveal>
          </div>

          <ul className="min-w-0 border-t border-white/15 lg:col-span-6">
            {socials.map((s, i) => (
              <Reveal as="li" key={s.key} delay={0.05 * i}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-baseline justify-between gap-6 border-b border-white/10 py-4 transition-colors duration-500 hover:border-blood"
                >
                  <span className="title text-[1.35rem] text-bone transition-colors duration-500 group-hover:text-blood">
                    {s.label}
                  </span>
                  <span className="label flex items-center gap-3 text-smoke transition-colors duration-500 group-hover:text-bone">
                    {s.handle}
                    <ArrowUpRight
                      size={15}
                      className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </span>
                </a>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>

      <footer className="relative border-t border-white/10 bg-ink">
        <div className="wrap flex flex-col gap-6 py-8 pr-20 md:flex-row md:items-center md:justify-between md:pr-28">
          <div className="flex items-center gap-5">
            <BatMark className="w-20 text-blood" />
            <div>
              <p className="title text-lg text-bone">{profile.name}</p>
              <p className="label text-smoke">© 2026 · React, Three.js, Tailwind</p>
            </div>
          </div>
          <p className="max-w-sm text-[0.8rem] leading-relaxed text-smoke md:text-right">
            A fan-made theme inspired by The Batman. Not affiliated with or endorsed by DC or Warner Bros.
          </p>
          <button type="button" onClick={() => scrollToId('top')} className="link label self-start text-fog hover:text-bone md:self-auto">
            Back to the top <ArrowUp size={14} />
          </button>
        </div>
      </footer>
    </section>
  )
}
