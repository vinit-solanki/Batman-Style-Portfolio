import { marquee, pipeline, skills } from '../data/content'
import { Figure, Reveal, SectionHeader } from './ui'

const TIER = {
  bronze: 'border-bronze text-bronze',
  silver: 'border-silver text-silver',
  gold: 'border-gold text-gold',
}

function Stage({ step, title, children, className = '' }) {
  return (
    <div className={`node shrink-0 ${className}`}>
      <p className="label text-smoke">{step}</p>
      <p className="title mt-1 text-[1.2rem] text-bone">{title}</p>
      {children}
    </div>
  )
}

const Note = ({ children }) => <p className="label mt-2 text-fog">{children}</p>

const List = ({ items }) => (
  <ul className="label mt-2 space-y-0.5 text-fog">
    {items.map((s) => (
      <li key={s}>— {s}</li>
    ))}
  </ul>
)

function Pipeline() {
  return (
    <Figure
      number="1"
      caption="Serverless ETL/ELT on AWS, landing in a medallion data lake."
      inner="blueprint px-5 py-8 md:px-9 md:py-11"
    >
      <div className="mx-auto flex max-w-sm flex-col items-stretch xl:max-w-none xl:flex-row">
        <Stage step="01 Sources" title="Ingest">
          <List items={pipeline.sources} />
        </Stage>
        <span className="flow" />
        <Stage step="02 Queue" title="Amazon SQS">
          <Note>decouple, buffer, retry</Note>
        </Stage>
        <span className="flow" />
        <Stage step="03 Compute" title="AWS Lambda">
          <Note>python, event-driven</Note>
        </Stage>
        <span className="flow" />
        <Stage step="04 Data lake" title="Amazon S3" className="xl:flex-[1.5]">
          <div className="mt-3 flex items-stretch gap-2">
            {pipeline.tiers.map((t) => (
              <div key={t.key} className={`flex-1 border-t-2 bg-white/[0.04] px-2.5 pb-2 pt-1.5 ${TIER[t.key]}`}>
                <p className="text-[0.9rem] font-semibold leading-tight">{t.name}</p>
                <p className="label text-fog">{t.note}</p>
              </div>
            ))}
          </div>
        </Stage>
        <span className="flow" />
        <Stage step="05 Serve" title="Consumers">
          <List items={pipeline.consumers} />
        </Stage>
      </div>

      <table className="label mt-9 w-full border-t border-white/10 text-left">
        <tbody>
          {pipeline.log.map(([cadence, job, result]) => (
            <tr key={job} className="border-b border-white/[0.07]">
              <td className="w-20 py-2.5 pr-4 align-top text-smoke">{cadence.toLowerCase()}</td>
              <td className="py-2.5 pr-4 align-top text-bone">{job}</td>
              <td className="hidden py-2.5 pr-4 align-top text-fog sm:table-cell">{result}</td>
              <td className="py-2.5 text-right align-top text-riddle">ok</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Figure>
  )
}

/** The stack as an index, not a wall of badges: one ruled line per discipline. */
function Stack() {
  return (
    <ul className="mt-20 border-t border-white/15 md:mt-28">
      {skills.map((s, i) => (
        <Reveal
          as="li"
          key={s.key}
          delay={Math.min(i * 0.05, 0.25)}
          className="group grid items-baseline gap-x-8 gap-y-3 border-b border-white/10 py-6 transition-colors duration-500 hover:border-blood md:grid-cols-12 md:py-8"
        >
          <span className="label text-smoke md:col-span-1">{String(i + 1).padStart(2, '0')}</span>
          <h3 className="title text-[1.65rem] text-bone transition-colors duration-500 group-hover:text-blood md:col-span-4 md:text-[2.1rem]">
            {s.title}
          </h3>
          <p className="text-[1.05rem] leading-[1.9] text-bone/85 md:col-span-7">
            {s.items.map((item, k) => (
              <span key={item}>
                {k > 0 && <span className="px-1 text-blood/80">{' / '}</span>}
                <span className="whitespace-nowrap">{item}</span>
              </span>
            ))}
          </p>
        </Reveal>
      ))}
    </ul>
  )
}

function Tape({ reverse, className }) {
  const row = [...marquee, ...marquee]
  return (
    <div className={`overflow-hidden py-3.5 md:py-5 ${className}`}>
      <div className={`marquee ${reverse ? 'reverse' : ''}`}>
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center" aria-hidden={k === 1}>
            {row.map((word, i) => (
              <span key={i} className="display flex items-center whitespace-nowrap text-[clamp(1.3rem,3vw,2.5rem)]">
                <span className="px-5 md:px-8">{word}</span>
                <span className="text-[0.55em]">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Arsenal() {
  return (
    <>
      <section id="arsenal" className="scrim relative py-28 md:py-44">
        <div className="wrap">
          <SectionHeader index="02" kicker="The arsenal" title="Utility" accent="belt">
            The stack behind the work — and how it fits together when the data starts moving.
          </SectionHeader>

          <Reveal>
            <Pipeline />
          </Reveal>

          <Stack />
        </div>
      </section>

      {/* Interlude: tape across an open view of the city */}
      <div className="relative flex h-[62vh] min-h-[380px] flex-col justify-center overflow-hidden" aria-hidden="true">
        <Tape className="-mx-[4%] -rotate-[2.5deg] bg-blood text-ink" />
        <Tape reverse className="-mx-[4%] mt-3 rotate-[1.5deg] border-y border-white/15 bg-ink/75 text-bone" />
      </div>
    </>
  )
}
