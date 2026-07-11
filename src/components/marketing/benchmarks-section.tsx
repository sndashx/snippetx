import { Reveal } from "@/components/marketing/reveal"
import { SectionHeading } from "@/components/visual/SectionHeading"
import { cn } from "@/lib/utils"

/**
 * SN-X — Indicators.
 *
 * A research institution is measured by its output. The numbers below are the
 * ones we hold ourselves to. They update yearly with the State of the
 * Institution report.
 */
interface Indicator {
  name: string
  description: string
  value: number
  unit: string
  /** 0–100 — how close we are to our 2028 target. */
  toTarget: number
  targetNote: string
}

const indicators: Indicator[] = [
  {
    name: "Working papers",
    description: "Published or posted in the last twelve months, across all five axes.",
    value: 47,
    unit: "papers / yr",
    toTarget: 78,
    targetNote: "Target 60 by 2028",
  },
  {
    name: "Resident fellows",
    description: "Doctoral and postdoctoral researchers in residence at Cambridge or Marfa.",
    value: 23,
    unit: "fellows",
    toTarget: 92,
    targetNote: "Target 25 by 2028",
  },
  {
    name: "Open instruments",
    description: "Released under permissive licence — simulators, benchmarks, datasets.",
    value: 8,
    unit: "releases",
    toTarget: 53,
    targetNote: "Target 15 by 2028",
  },
  {
    name: "Median citation half-life",
    description: "Years until half of a paper's eventual citations have accrued.",
    value: 3.4,
    unit: "years",
    toTarget: 71,
    targetNote: "Target ≤ 3.0 yrs by 2028",
  },
  {
    name: "Visiting faculty weeks",
    description: "Weeks of residency by external researchers from other institutions.",
    value: 64,
    unit: "weeks / yr",
    toTarget: 80,
    targetNote: "Target 80 weeks by 2028",
  },
  {
    name: "Public lectures",
    description: "Lectures open to the public — Cambridge, Marfa, and on tour.",
    value: 19,
    unit: "lectures / yr",
    toTarget: 63,
    targetNote: "Target 30 by 2028",
  },
]

const BAR_HEIGHT = 12
const TRACK_HEIGHT = BAR_HEIGHT
const CHART_WIDTH = 360

function pct(value: number) {
  return Math.max(0, Math.min(100, value))
}

export function BenchmarksSection() {
  return (
    <section
      id="indicators"
      aria-labelledby="indicators-heading"
      className="relative border-t border-border/70 bg-card/20"
    >
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32">
        <Reveal>
          <SectionHeading
            eyebrow="Indicators"
            title={
              <span id="indicators-heading">
                The shape of the work.
              </span>
            }
            description="A research institution is measured by its output. These are the numbers we hold ourselves to — updated yearly with the State of the Institution report."
          />
        </Reveal>

        <ul role="list" className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {indicators.map((ind, i) => (
            <li key={ind.name}>
              <Reveal delay={i * 70}>
                <IndicatorCard indicator={ind} />
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal delay={200}>
          <p className="mt-12 max-w-2xl font-mono text-[11px] leading-relaxed text-muted-foreground">
            Numbers are as of 30 June 2026 and are reconciled with the
            <span className="text-foreground/80"> State of the Institution 2026 </span>
            report, available from the publications office.
          </p>
        </Reveal>
      </div>
    </section>
  )
}

function IndicatorCard({ indicator }: { indicator: Indicator }) {
  return (
    <article className="group rounded-2xl border border-border/70 bg-card/60 p-6 transition-colors duration-500 ease-out-expo hover:border-accent/35 sm:p-7">
      <header className="flex items-baseline justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
            {indicator.name}
          </h3>
          <p className="mt-1 max-w-xs text-sm text-muted-foreground">
            {indicator.description}
          </p>
        </div>
      </header>

      <div className="mt-6 flex items-baseline gap-2">
        <span className="font-display text-[clamp(2.5rem,5vw,3.5rem)] leading-none tracking-tight text-foreground">
          {indicator.value}
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          {indicator.unit}
        </span>
      </div>

      <div className="mt-5">
        <svg
          viewBox={`0 0 ${CHART_WIDTH} ${TRACK_HEIGHT + 18}`}
          width="100%"
          height={TRACK_HEIGHT + 18}
          role="img"
          aria-label={`Progress to 2028 target: ${indicator.toTarget}%`}
          className="overflow-visible"
        >
          <g aria-hidden>
            <rect
              x={0}
              y={0}
              width={CHART_WIDTH}
              height={BAR_HEIGHT}
              rx={3}
              fill="currentColor"
              fillOpacity={0.04}
            />
            <rect
              x={0}
              y={0}
              width={(pct(indicator.toTarget) / 100) * CHART_WIDTH}
              height={BAR_HEIGHT}
              rx={3}
              fill="var(--accent)"
              fillOpacity={0.85}
            />
            <text
              x={0}
              y={BAR_HEIGHT + 13}
              fontFamily="var(--font-mono), ui-monospace, monospace"
              fontSize={10}
              fill="currentColor"
              fillOpacity={0.65}
            >
              {indicator.targetNote.toUpperCase()}
            </text>
          </g>
        </svg>
      </div>
    </article>
  )
}