"use client"

import { useEffect, useRef, useState } from "react"
import { Reveal } from "@/components/marketing/reveal"
import { SectionHeading } from "@/components/visual/SectionHeading"
import { modelFlagship } from "@/lib/brand"
import { cn } from "@/lib/utils"

interface BenchmarkRow {
  name: string
  description: string
  category: BenchmarkCategory
  scores: Record<string, number>
  unit?: "%" | "pass@1" | "F1" | "EM"
}

type BenchmarkCategory =
  | "Knowledge"
  | "Reasoning"
  | "Coding"
  | "Agentic"
  | "Faithfulness"

type Metric = "score" | "lead" | "rank"

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
    category: "Knowledge",
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
    category: "Reasoning",
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
    category: "Coding",
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
    category: "Coding",
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
    category: "Agentic",
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
    category: "Reasoning",
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
    category: "Faithfulness",
    scores: {
      "minimax M3": 81.3,
      "GPT-5-class": 74.6,
      "Claude 4-class": 79.0,
      "Gemini 2-class": 73.2,
    },
    unit: "%",
  },
]

const categories: BenchmarkCategory[] = [
  "Knowledge",
  "Reasoning",
  "Coding",
  "Agentic",
  "Faithfulness",
]

const BAR_HEIGHT = 18
const BAR_GAP = 10
const CHART_WIDTH = 360
const TRACK_HEIGHT = BAR_HEIGHT * models.length + BAR_GAP * (models.length - 1)

function pct(score: number) {
  return Math.max(0, Math.min(100, score))
}

const metrics: { id: Metric; label: string; hint: string }[] = [
  { id: "score", label: "Score", hint: "Absolute benchmark percentage" },
  { id: "lead",  label: "Lead",  hint: "Δ vs. next-best comparator" },
  { id: "rank",  label: "Rank",  hint: "Ordinal rank among comparators" },
]

export function BenchmarksSection() {
  const [category, setCategory] = useState<BenchmarkCategory | "All">("All")
  const [metric, setMetric] = useState<Metric>("score")

  const filtered =
    category === "All"
      ? benchmarks
      : benchmarks.filter((b) => b.category === category)

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

        {/* Toolbar: category filter + metric toggle */}
        <Reveal delay={80}>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <ul
              role="list"
              aria-label="Filter by category"
              className="flex flex-wrap items-center gap-1.5"
            >
              <CategoryChip
                label="All"
                active={category === "All"}
                onClick={() => setCategory("All")}
              />
              {categories.map((c) => (
                <CategoryChip
                  key={c}
                  label={c}
                  active={category === c}
                  onClick={() => setCategory(c)}
                />
              ))}
            </ul>

            <div
              role="group"
              aria-label="Comparison metric"
              className="inline-flex items-center rounded-full border border-border bg-card/60 p-1 font-mono text-[11px] uppercase tracking-[0.16em]"
            >
              {metrics.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  aria-pressed={metric === m.id}
                  title={m.hint}
                  onClick={() => setMetric(m.id)}
                  className={cn(
                    "relative inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-foreground/70 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    metric === m.id &&
                      "bg-accent text-background hover:text-background",
                  )}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Legend */}
        <Reveal delay={120}>
          <ul
            role="list"
            className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground"
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
          {filtered.map((b, i) => (
            <li key={b.name}>
              <Reveal delay={Math.min(i * 60, 300)}>
                <BenchmarkChart benchmark={b} metric={metric} index={i} />
              </Reveal>
            </li>
          ))}
        </ul>

        {filtered.length === 0 && (
          <p className="mt-12 font-mono text-sm text-muted-foreground">
            No benchmarks in this category yet — check back soon.
          </p>
        )}

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

function CategoryChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <li>
      <button
        type="button"
        aria-pressed={active}
        onClick={onClick}
        className={cn(
          "inline-flex items-center rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          active
            ? "border-accent bg-accent/10 text-foreground"
            : "border-border bg-card/40 text-muted-foreground hover:border-foreground/20 hover:text-foreground",
        )}
      >
        {label}
      </button>
    </li>
  )
}

function BenchmarkChart({
  benchmark,
  metric,
  index,
}: {
  benchmark: BenchmarkRow
  metric: Metric
  index: number
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const supportsIO = typeof IntersectionObserver !== "undefined"
  const [inView, setInView] = useState(!supportsIO)

  useEffect(() => {
    if (!supportsIO) return
    const el = wrapRef.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true)
            io.disconnect()
          }
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [supportsIO])

  const sortedByScore = [...models].sort(
    (a, b) => benchmark.scores[b.key] - benchmark.scores[a.key],
  )
  const sortedModels =
    metric === "rank" ? sortedByScore : [...models]

  const worstScore = benchmark.scores[sortedByScore[sortedByScore.length - 1]?.key]
  const accentScore = benchmark.scores["minimax M3"]
  const topComparator = sortedByScore.find((m) => m.key !== "minimax M3")
  const leadBy = topComparator
    ? (accentScore - benchmark.scores[topComparator.key]).toFixed(1)
    : "0.0"

  return (
    <article
      ref={wrapRef}
      className="group rounded-2xl border border-border/70 bg-card/60 p-6 transition-colors duration-500 ease-out-expo hover:border-accent/35 sm:p-7"
    >
      <header className="flex items-baseline justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-balance text-display-sm font-medium tracking-tight text-foreground">
              {benchmark.name}
            </h3>
            <span className="inline-flex items-center rounded-full border border-border bg-card/40 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
              {benchmark.category}
            </span>
          </div>
          <p className="mt-1 text-pretty text-sm text-muted-foreground">
            {benchmark.description}
          </p>
        </div>
        <span className="shrink-0 text-eyebrow">
          {metric === "lead" ? "Δ lead" : metric === "rank" ? "by rank" : "higher is better"}
        </span>
      </header>

      <div className="mt-6" data-bench-chart>
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

          {sortedModels.map((m, idx) => {
            const score = benchmark.scores[m.key]
            const fill =
              metric === "lead"
                ? Math.max(0, score - worstScore)
                : metric === "rank"
                ? 100 - idx * 18
                : pct(score)
            const w = (fill / 100) * CHART_WIDTH
            const y = idx * (BAR_HEIGHT + BAR_GAP)
            const delay = `${idx * 120 + index * 80}ms`
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
                  className={cn("bench-bar-track", inView && "bench-bar-track--in")}
                  style={{ "--bar-delay": delay } as React.CSSProperties}
                />
                <rect
                  x={0}
                  y={0}
                  width={w}
                  height={BAR_HEIGHT}
                  rx={4}
                  fill={m.color}
                  fillOpacity={m.highlight ? 0.95 : 0.55}
                  filter={m.highlight ? "url(#bench-glow)" : undefined}
                  className={cn("bench-bar", inView && "bench-bar--in")}
                  style={{ "--bar-delay": delay } as React.CSSProperties}
                >
                  <title>
                    {m.key}: {score.toFixed(1)}
                    {benchmark.unit ?? "%"} — {benchmark.name}
                  </title>
                </rect>
                <text
                  x={CHART_WIDTH - 6}
                  y={BAR_HEIGHT / 2 + 4}
                  textAnchor="end"
                  fontFamily="var(--font-mono), ui-monospace, monospace"
                  fontSize={11}
                  fontVariant="tabular-nums"
                  fill="currentColor"
                  fillOpacity={m.highlight ? 0.95 : 0.75}
                  className={cn("bench-bar-text", inView && "bench-bar-text--in")}
                  style={{ "--bar-delay": delay } as React.CSSProperties}
                >
                  {metric === "rank"
                    ? `#${idx + 1} · ${score.toFixed(1)}${benchmark.unit ?? "%"}`
                    : metric === "lead"
                    ? `+${(score - benchmark.scores[sortedModels[sortedModels.length - 1]?.key ?? m.key]).toFixed(1)}`
                    : `${score.toFixed(1)}${benchmark.unit ?? "%"}`}
                </text>
              </g>
            )
          })}

          <defs>
            <filter id="bench-glow" x="-10%" y="-50%" width="120%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>
      </div>

      <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        <span className="text-accent">{modelFlagship.name}</span>{" "}
        {metric === "lead"
          ? `leads ${benchmark.name} by up to ${Math.max(
              ...models.map(
                (m) =>
                  benchmark.scores[m.key] -
                  benchmark.scores[
                    models.reduce((a, b) =>
                      benchmark.scores[a.key] < benchmark.scores[b.key] ? a : b,
                    ).key
                  ],
              ),
            ).toFixed(1)} pts over the field.`
          : metric === "rank"
          ? `is the top-ranked model on ${benchmark.name}.`
          : `leads on ${benchmark.name} by ${leadBy} pts vs. ${topComparator?.key ?? "the field"}.`}
      </p>
    </article>
  )
}