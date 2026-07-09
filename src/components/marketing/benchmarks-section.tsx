import { Reveal } from "@/components/marketing/reveal"
import { SectionHeading } from "@/components/visual/SectionHeading"
import { modelFlagship } from "@/lib/brand"
import { cn } from "@/lib/utils"

interface BenchmarkRow {
  name: string
  description: string
  /** Higher is better — scores are percentages 0–100. */
  scores: Record<string, number>
  unit?: "%" | "pass@1" | "F1" | "EM"
}

const models = [
  { key: "minimax M3", color: "var(--accent)", highlight: true },
  { key: "GPT-5-class", color: "var(--brand-3)", highlight: false },
  { key: "Claude 4-class", color: "var(--brand-3)", highlight: false },
  { key: "Gemini 2-class", color: "var(--brand-3)", highlight: false },
] as const

const benchmarks: BenchmarkRow[] = [
  {
    name: "MMLU-Pro",
    description: "Multitask language understanding, 57 subjects.",
    scores: {
      "minimax M3": 84.2,
      "GPT-5-class": 82.7,
      "Claude 4-class": 83.1,
      "Gemini 2-class": 81.5,
    },
    unit: "%",
  },
  {
    name: "GPQA",
    description: "Graduate-level science Q&A, diamond subset.",
    scores: {
      "minimax M3": 71.6,
      "GPT-5-class": 68.4,
      "Claude 4-class": 70.2,
      "Gemini 2-class": 67.9,
    },
    unit: "%",
  },
  {
    name: "HumanEval+",
    description: "Functional correctness, expanded tests.",
    scores: {
      "minimax M3": 92.4,
      "GPT-5-class": 90.8,
      "Claude 4-class": 91.6,
      "Gemini 2-class": 89.7,
    },
    unit: "%",
  },
  {
    name: "SWE-Bench Verified",
    description: "Real GitHub issues resolved end-to-end.",
    scores: {
      "minimax M3": 68.9,
      "GPT-5-class": 65.2,
      "Claude 4-class": 67.4,
      "Gemini 2-class": 62.1,
    },
    unit: "%",
  },
  {
    name: "agentbench-lite",
    description: "Long-horizon agentic tasks, sandboxed.",
    scores: {
      "minimax M3": 78.1,
      "GPT-5-class": 71.4,
      "Claude 4-class": 74.8,
      "Gemini 2-class": 69.6,
    },
    unit: "%",
  },
  {
    name: "MATH-500",
    description: "Competition math, 500 problems.",
    scores: {
      "minimax M3": 96.1,
      "GPT-5-class": 95.2,
      "Claude 4-class": 95.7,
      "Gemini 2-class": 94.4,
    },
    unit: "%",
  },
  {
    name: "FACTS-1M",
    description: "Faithfulness over a 1M-token window.",
    scores: {
      "minimax M3": 81.3,
      "GPT-5-class": 74.6,
      "Claude 4-class": 79.0,
      "Gemini 2-class": 73.2,
    },
    unit: "%",
  },
]

const BAR_HEIGHT = 18
const BAR_GAP = 10
const CHART_WIDTH = 360
const TRACK_HEIGHT = BAR_HEIGHT * models.length + BAR_GAP * (models.length - 1)

function pct(score: number) {
  return Math.max(0, Math.min(100, score))
}

export function BenchmarksSection() {
  return (
    <section
      id="benchmarks"
      aria-labelledby="benchmarks-heading"
      className="relative border-t border-border/70 bg-card/20"
    >
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32">
        <Reveal>
          <SectionHeading
            eyebrow="Benchmarks"
            title={
              <span id="benchmarks-heading">
                Measured against the field
              </span>
            }
            description={`${modelFlagship.name} versus a representative set of comparators across seven public evaluations. Higher is better; full methodology in the system card.`}
          />
        </Reveal>

        {/* Legend */}
        <Reveal delay={100}>
          <ul
            role="list"
            className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground"
          >
            {models.map((m) => (
              <li key={m.key} className="inline-flex items-center gap-2">
                <span
                  aria-hidden
                  className={cn(
                    "inline-block size-2.5 rounded-sm",
                    m.highlight ? "bg-accent" : "bg-brand-3/70",
                  )}
                />
                <span className={cn(m.highlight ? "text-foreground" : undefined)}>
                  {m.key}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>

        <ul role="list" className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-x-12">
          {benchmarks.map((b, i) => (
            <li key={b.name}>
              <Reveal delay={Math.min(i * 60, 300)}>
                <BenchmarkChart benchmark={b} />
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal delay={200}>
          <p className="mt-12 max-w-2xl font-mono text-[11px] leading-relaxed text-muted-foreground">
            All numbers from public leaderboards and our internal replications, March 2026.
            The full evaluation suite — including held-out tasks — is reproducible from the
            <span className="text-foreground/80"> minimax-eval </span>
            repository.
          </p>
        </Reveal>
      </div>
    </section>
  )
}

function BenchmarkChart({ benchmark }: { benchmark: BenchmarkRow }) {
  const top = models[0]
  const topScore = benchmark.scores[top.key]
  const accentScore = benchmark.scores["minimax M3"]
  const leadBy = (accentScore - topScore).toFixed(1)

  return (
    <article className="group rounded-2xl border border-border/70 bg-card/60 p-6 transition-colors duration-500 ease-out-expo hover:border-accent/35 sm:p-7">
      <header className="flex items-baseline justify-between gap-4">
        <div>
          <h3 className="text-balance text-display-sm font-medium tracking-tight text-foreground">
            {benchmark.name}
          </h3>
          <p className="mt-1 text-pretty text-sm text-muted-foreground">
            {benchmark.description}
          </p>
        </div>
        <span className="shrink-0 text-eyebrow">
          higher is better
        </span>
      </header>

      <div className="mt-6">
        <svg
          viewBox={`0 0 ${CHART_WIDTH} ${TRACK_HEIGHT}`}
          width="100%"
          height={TRACK_HEIGHT}
          role="img"
          aria-label={`${benchmark.name} benchmark bar chart, scores: ${models
            .map((m) => `${m.key} ${benchmark.scores[m.key]}${benchmark.unit ?? "%"}`)
            .join(", ")}`}
          className="overflow-visible"
        >
          {/* Subtle background grid */}
          <g aria-hidden>
            {[25, 50, 75, 100].map((g) => (
              <line
                key={g}
                x1={(g / 100) * CHART_WIDTH}
                y1={0}
                x2={(g / 100) * CHART_WIDTH}
                y2={TRACK_HEIGHT}
                stroke="currentColor"
                strokeOpacity={0.08}
                strokeWidth={1}
                strokeDasharray="2 4"
              />
            ))}
          </g>

          {models.map((m, idx) => {
            const score = benchmark.scores[m.key]
            const w = (pct(score) / 100) * CHART_WIDTH
            const y = idx * (BAR_HEIGHT + BAR_GAP)
            return (
              <g
                key={m.key}
                transform={`translate(0 ${y})`}
                role="presentation"
              >
                <rect
                  x={0}
                  y={0}
                  width={CHART_WIDTH}
                  height={BAR_HEIGHT}
                  rx={4}
                  fill="currentColor"
                  fillOpacity={0.04}
                />
                <rect
                  x={0}
                  y={0}
                  width={w}
                  height={BAR_HEIGHT}
                  rx={4}
                  fill={m.color}
                  fillOpacity={m.highlight ? 0.95 : 0.55}
                />
                <text
                  x={CHART_WIDTH - 6}
                  y={BAR_HEIGHT / 2 + 4}
                  textAnchor="end"
                  fontFamily="var(--font-mono), ui-monospace, monospace"
                  fontSize={11}
                  fontVariant="tabular-nums"
                  fill="currentColor"
                  fillOpacity={m.highlight ? 0.95 : 0.75}
                >
                  {score.toFixed(1)}
                  {benchmark.unit ?? "%"}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        <span className="text-accent">{modelFlagship.name}</span>{" "}
        leads on {benchmark.name} by{" "}
        <span className="text-foreground">{leadBy} pts</span>{" "}
        vs. {top.key}.
      </p>
    </article>
  )
}