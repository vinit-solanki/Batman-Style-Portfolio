import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { commendations, education, experience, extra } from '../data/content'
import { Reveal, Rich, SectionHeader } from './ui'

function Entry({ job }) {
  return (
    <li className="relative pl-8 md:pl-16">
      <span
        className={`absolute left-0 top-[0.4rem] h-[11px] w-[11px] -translate-x-[5px] ${
          job.active ? 'bg-blood shadow-[0_0_16px_rgba(229,18,29,0.9)]' : 'border border-white/40 bg-ink'
        }`}
        aria-hidden="true"
      />
      <Reveal>
        <p className="label flex flex-wrap items-center gap-x-5 gap-y-1 text-fog">
          <span>{job.period}</span>
          <span className="text-smoke">{job.place}</span>
          {job.active && <span className="text-riddle">● current</span>}
        </p>
        <h3 className="display mt-5 text-[clamp(1.7rem,4.3vw,3.9rem)] text-bone">{job.role}</h3>
        <p className="serif mt-2 text-[clamp(1.5rem,2.6vw,2.2rem)] leading-tight text-blood">at {job.org}</p>
      </Reveal>

      <ol className={`mt-9 grid gap-x-14 ${job.points.length > 1 ? 'lg:grid-cols-2' : 'max-w-3xl'}`}>
        {job.points.map((point, i) => (
          <Reveal as="li" key={i} delay={i * 0.06} className="flex gap-5 border-t border-white/10 py-6">
            <span className="serif w-7 shrink-0 text-[1.35rem] leading-[1.35] text-smoke">{i + 1}</span>
            <p className="leading-[1.75] text-fog">
              <Rich text={point} />
            </p>
          </Reveal>
        ))}
      </ol>

      <Reveal className="label mt-2 border-t border-white/10 pt-5 text-smoke">
        Built with <span className="text-fog">{job.stack.join(' / ')}</span>
      </Reveal>
    </li>
  )
}

function Column({ heading, delay, children }) {
  return (
    <Reveal delay={delay} className="border-t border-white/15 pt-4">
      <p className="label text-fog">{heading}</p>
      <div className="mt-7">{children}</div>
    </Reveal>
  )
}

export default function Operations() {
  const list = useRef(null)
  const { scrollYProgress } = useScroll({ target: list, offset: ['start 75%', 'end 55%'] })
  const line = useSpring(scrollYProgress, { stiffness: 70, damping: 26 })

  return (
    <section id="operations" className="scrim relative py-28 md:py-44">
      <div className="wrap">
        <SectionHeader index="03" kicker="Field operations" title="On the" accent="record">
          Where the pipelines were built, what they moved, and what changed because of them.
        </SectionHeader>

        <div ref={list} className="relative">
          <div className="absolute bottom-0 left-0 top-2 w-px bg-white/10" aria-hidden="true">
            <motion.div className="h-full w-full origin-top bg-blood" style={{ scaleY: line }} />
          </div>
          <ol className="space-y-24 md:space-y-32">
            {experience.map((job) => (
              <Entry key={job.id} job={job} />
            ))}
          </ol>
        </div>

        <div className="mt-28 grid gap-x-12 gap-y-16 md:mt-40 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Column heading="Training">
              <h3 className="title text-[1.7rem] text-bone">{education.degree}</h3>
              <p className="mt-3 text-fog">{education.school}</p>
              <p className="label mt-5 text-smoke">
                {education.period} · {education.place}
              </p>
              <p className="mt-6 flex items-baseline gap-3">
                <span className="numeral text-[3.4rem] text-bone">{education.score.split(' ')[1]}</span>
                <span className="serif text-xl text-flare">{education.score.split(' ')[0]}</span>
              </p>
            </Column>
          </div>

          <div className="lg:col-span-3">
            <Column heading="Off duty" delay={0.08}>
              <h3 className="title text-[1.7rem] text-bone">{extra.role}</h3>
              <p className="serif mt-1 text-xl text-blood">{extra.org}</p>
              <p className="mt-4 text-fog">{extra.text}</p>
            </Column>
          </div>

          <div className="lg:col-span-5">
            <Column heading="Commendations" delay={0.16}>
              <ul className="-mt-4">
                {commendations.map((c) => (
                  <li
                    key={c.title}
                    className="group flex items-baseline justify-between gap-6 border-b border-white/10 py-4 transition-colors duration-500 hover:border-blood"
                  >
                    <div>
                      <p className="title text-[1.2rem] text-bone transition-colors duration-500 group-hover:text-blood">
                        {c.title}
                      </p>
                      <p className="label mt-0.5 text-smoke">{c.kind}</p>
                    </div>
                    <span className="serif shrink-0 text-lg text-flare">{c.detail}</span>
                  </li>
                ))}
              </ul>
            </Column>
          </div>
        </div>
      </div>
    </section>
  )
}
