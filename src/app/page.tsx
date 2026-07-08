import Link from "next/link"
import {
  ArrowRight,
  ArrowUpRight,
  Cpu,
  Brain,
  Wrench,
  Network,
  Code2,
  ShieldCheck,
  Microscope,
  BookOpen,
  Gauge,
  Terminal,
  CheckCircle2,
  Orbit,
  type LucideIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AuroraBackground,
  GlowCard,
  Marquee,
  AnimatedHeadline,
  Reveal,
  SectionHeading,
  StatCounter,
} from "@/components/visual"

const CAPABILITIES = [
  "Agentic",
  "Multimodal",
  "Reasoning",
  "Tool-use",
  "Long-context",
  "Safety-aligned",
  "Self-improving",
]

interface Model {
  name: string
  spec: string
  tags: string[]
  description: string
  metric: { label: string; value: string }
  spark: number[]
}

const MODELS: Model[] = [
  {
    name: "NUMINA-Horizon",
    spec: "1.8T params · 1M context",
    tags: ["Reasoning", "Agentic", "Multimodal"],
    description:
      "Our flagship frontier model with native tool-use and long-horizon planning across multimodal inputs.",
    metric: { label: "GPQA Diamond", value: "94.7" },
    spark: [12, 18, 16, 28, 26, 40, 44, 58, 64, 80, 92],
  },
  {
    name: "NUMINA-Atlas",
    spec: "400B params · 256K context",
    tags: ["Long-context", "Tool-use"],
    description:
      "An efficiency-optimized reasoning model purpose-built for production agent workloads.",
    metric: { label: "MMLU Pro", value: "91.2" },
    spark: [20, 24, 22, 30, 34, 38, 42, 48, 52, 60, 66],
  },
  {
    name: "NUMINA-Spark",
    spec: "70B params · 128K context",
    tags: ["Fast", "Multimodal"],
    description:
      "Low-latency model tuned for real-time agent loops and interactive assistance.",
    metric: { label: "Latency p50", value: "110ms" },
    spark: [40, 42, 38, 44, 46, 50, 48, 54, 52, 58, 60],
  },
  {
    name: "NUMINA-Forge",
    spec: "Reasoning · Code",
    tags: ["Code-exec", "Self-improving"],
    description:
      "Specialized for autonomous software engineering — plans, writes, and verifies code end-to-end.",
    metric: { label: "SWE-bench", value: "82.4" },
    spark: [16, 22, 20, 30, 36, 42, 50, 58, 66, 74, 82],
  },
]

interface AgentCapability {
  icon: LucideIcon
  title: string
  description: string
}

const AGENT_CAPABILITIES: AgentCapability[] = [
  {
    icon: Wrench,
    title: "Tool-use",
    description:
      "Models invoke APIs, databases, and external tools with typed arguments, then reason over the results.",
  },
  {
    icon: Network,
    title: "Planning",
    description:
      "Decompose objectives into verifiable sub-tasks and adapt the plan as the world changes.",
  },
  {
    icon: Code2,
    title: "Code execution",
    description:
      "Write, run, and self-correct code in a sandboxed runtime — turning reasoning into action.",
  },
  {
    icon: Brain,
    title: "Multi-step reasoning",
    description:
      "Sustain coherence across thousands of steps with explicit memory and reflection.",
  },
]

const PAPERS = [
  {
    title: "Horizon: Scaling Agentic Reasoning with Verifier-Guided Rollouts",
    authors: "K. Rao, L. Mendes, et al.",
    abstract:
      "We introduce a verifier-guided rollout procedure that improves long-horizon task completion by 23% while reducing compute per step.",
    href: "/#research",
  },
  {
    title: "Towards Self-Improving Agents via Online Critique",
    authors: "A. Holm, S. Okafor, et al.",
    abstract:
      "A framework in which agents generate and act on their own critiques, yielding consistent gains without human labels.",
    href: "/#research",
  },
  {
    title: "Structured Evaluations for Deceptive Tool-Use",
    authors: "M. Lindqvist, R. Devi, et al.",
    abstract:
      "We propose a battery of adversarial evals measuring whether agents resist manipulation and preserve intent under pressure.",
    href: "/#research",
  },
]

const PRINCIPLES = [
  {
    icon: ShieldCheck,
    title: "Alignment by construction",
    description:
      "Safety properties are designed into training and inference, not bolted on after the fact.",
  },
  {
    icon: Gauge,
    title: "Continuous evaluation",
    description:
      "Every release is gated by adversarial and capability evals run on a rolling cadence.",
  },
  {
    icon: Microscope,
    title: "Open science",
    description:
      "We publish methods, failures, and eval suites so the field can build on and scrutinize our work.",
  },
]

function Sparkline({ data, className }: { data: number[]; className?: string }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * 100
      const y = 28 - ((v - min) / range) * 24 - 2
      return `${x.toFixed(2)},${y.toFixed(2)}`
    })
    .join(" ")
  return (
    <svg viewBox="0 0 100 28" preserveAspectRatio="none" className={className} aria-hidden>
      <polyline
        points={points}
        fill="none"
        stroke="var(--brand-3)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

export default function Home() {
  return (
    <div className="relative">
      {/* ============================ HERO ============================ */}
      <section className="relative isolate overflow-hidden">
        <AuroraBackground />
        <div className="relative mx-auto flex max-w-6xl flex-col items-center px-5 pb-20 pt-20 text-center sm:px-8 sm:pt-28 lg:pt-36">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-1.5 text-xs font-medium text-foreground/80 backdrop-blur-sm">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full rounded-full bg-brand-3 animate-pulse-ring" />
                <span className="relative inline-flex size-2 rounded-full bg-brand-3" />
              </span>
              New: NUMINA-Horizon is now live
            </span>
          </Reveal>

          <div className="mt-8">
            <AnimatedHeadline
              text="Frontier intelligence, built to act."
              gradientWords={["act."]}
            />
          </div>

          <Reveal delay={0.25} className="mt-7">
            <p className="mx-auto max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground sm:text-xl">
              We research and train agentic language models that reason, plan, and
              act in the world — and publish the science behind them.
            </p>
          </Reveal>

          <Reveal delay={0.35} className="mt-10">
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                size="lg"
                className="h-12 rounded-full px-7 text-base font-semibold transition-all hover:neon-glow"
                render={<Link href="/#models" />}
              >
                Explore the models
                <ArrowRight className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-12 rounded-full border-white/15 bg-white/[0.02] px-7 text-base font-semibold backdrop-blur-sm transition-colors hover:bg-white/5"
                render={<Link href="/#research" />}
              >
                Read the research
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.45} className="mt-16 w-full">
            <div className="mx-auto grid max-w-4xl grid-cols-2 gap-x-6 gap-y-10 border-t border-white/10 pt-10 md:grid-cols-4">
              <StatCounter value={2.4} suffix="T" label="Parameters trained" />
              <StatCounter value={1} suffix="M" label="Token context window" />
              <StatCounter value={94.7} decimals={1} label="GPQA Diamond" />
              <StatCounter value={18} suffix="K" label="Agents in production" />
            </div>
          </Reveal>

          <div className="mt-16 flex flex-col items-center gap-2 text-muted-foreground animate-float">
            <span className="text-xs uppercase tracking-[0.2em]">Scroll</span>
            <ArrowDown className="size-4" />
          </div>
        </div>
      </section>

      {/* ============================ MARQUEE ============================ */}
      <section className="relative border-y border-white/10 bg-white/[0.015] py-6">
        <Marquee duration={34}>
          {CAPABILITIES.map((cap) => (
            <span
              key={cap}
              className="mx-3 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2 text-sm font-medium text-foreground/85"
            >
              <span className="size-1.5 rounded-full bg-brand-2 shadow-[0_0_8px_var(--brand-2)]" />
              {cap}
            </span>
          ))}
        </Marquee>
      </section>

      {/* ============================ MODELS ============================ */}
      <section id="models" className="relative scroll-mt-20 px-5 py-24 sm:px-8 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <SectionHeading
              eyebrow="Models"
              title={
                <>
                  Frontier models, <span className="text-gradient">built to act.</span>
                </>
              }
              description="A family of agentic models spanning flagship reasoning to real-time interaction — each trained for tool-use, planning, and verifiable outcomes."
            />
          </Reveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {MODELS.map((model, i) => (
              <Reveal key={model.name} delay={i * 0.08}>
                <GlowCard className="flex h-full flex-col p-6">
                  <div className="flex items-center justify-between">
                    <span className="grid size-9 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-brand-2">
                      <Cpu className="size-4" />
                    </span>
                    {i === 0 && (
                      <span className="rounded-full border border-brand-1/30 bg-brand-1/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-1">
                        Flagship
                      </span>
                    )}
                  </div>

                  <h3 className="mt-5 font-heading text-lg font-semibold tracking-tight">
                    {model.name}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">{model.spec}</p>

                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {model.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {model.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[11px] font-medium text-foreground/70"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 flex items-end justify-between gap-3 border-t border-white/10 pt-4">
                    <div>
                      <div className="font-heading text-xl font-semibold text-gradient tabular-nums">
                        {model.metric.value}
                      </div>
                      <div className="text-[11px] text-muted-foreground">{model.metric.label}</div>
                    </div>
                    <Sparkline data={model.spark} className="h-7 w-20 opacity-80" />
                  </div>
                </GlowCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ AGENTS ============================ */}
      <section
        id="agents"
        className="relative scroll-mt-20 border-t border-white/10 bg-white/[0.015] px-5 py-24 sm:px-8 sm:py-32"
      >
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <SectionHeading
              eyebrow="Agents"
              title={
                <>
                  Models that <span className="text-gradient">do the work.</span>
                </>
              }
              description="NUMINA models are trained for agency — not just completion. They plan, call tools, execute code, and reflect across long horizons."
            />
          </Reveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {AGENT_CAPABILITIES.map((cap, i) => (
              <Reveal key={cap.title} delay={i * 0.06}>
                <GlowCard className="flex h-full items-start gap-5 p-7">
                  <span className="grid size-12 shrink-0 place-items-center rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-transparent text-brand-2 transition-transform duration-300 group-hover/glow:scale-110">
                    <cap.icon className="size-6" />
                  </span>
                  <div>
                    <h3 className="font-heading text-xl font-semibold tracking-tight">{cap.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {cap.description}
                    </p>
                  </div>
                </GlowCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ RESEARCH ============================ */}
      <section id="research" className="relative scroll-mt-20 px-5 py-24 sm:px-8 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <SectionHeading
              align="left"
              eyebrow="Research"
              title="Science, in the open."
              description="Selected releases from the NUMINA research program. We publish methods, evaluations, and the limits we encounter."
            />
          </Reveal>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {PAPERS.map((paper, i) => (
              <Reveal key={paper.title} delay={i * 0.08}>
                <GlowCard className="flex h-full flex-col p-7">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <BookOpen className="size-3.5 text-brand-2" />
                    <span>Preprint</span>
                  </div>
                  <h3 className="mt-4 font-heading text-lg font-semibold leading-snug tracking-tight">
                    {paper.title}
                  </h3>
                  <p className="mt-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {paper.authors}
                  </p>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {paper.abstract}
                  </p>
                  <Link
                    href={paper.href}
                    className="group mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-brand-2 transition-colors hover:text-brand-3"
                  >
                    Read paper
                    <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </GlowCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ SAFETY ============================ */}
      <section
        id="safety"
        className="relative scroll-mt-20 border-t border-white/10 bg-white/[0.015] px-5 py-24 sm:px-8 sm:py-32"
      >
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <SectionHeading
              eyebrow="Safety & Approach"
              title={
                <>
                  Capability with <span className="text-gradient">care.</span>
                </>
              }
              description="We treat safety as a research problem, not a release gate. Our approach rests on three commitments."
            />
          </Reveal>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {PRINCIPLES.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <GlowCard className="flex h-full flex-col p-7">
                  <span className="grid size-11 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-brand-2">
                    <p.icon className="size-5" />
                  </span>
                  <h3 className="mt-5 font-heading text-lg font-semibold tracking-tight">{p.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
                </GlowCard>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1} className="mt-10">
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center glass glow-border sm:p-12">
              <Orbit className="size-8 text-brand-2" />
              <p className="max-w-2xl text-balance text-lg leading-relaxed text-foreground/90 sm:text-xl">
                Before any model ships, it passes structured capability and adversarial
                evaluations — and the results are shared with the research community.
              </p>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-brand-3" /> Red-teamed
                </span>
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-brand-3" /> Eval-gated
                </span>
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-brand-3" /> Disclosed
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================ CTA / API ============================ */}
      <section id="api" className="relative scroll-mt-20 px-5 py-24 sm:px-8 sm:py-32">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <SectionHeading
              align="left"
              eyebrow="Build with NUMINA"
              title={
                <>
                  Ship agents on the <span className="text-gradient">frontier.</span>
                </>
              }
              description="Access our models through a single API. Bring your tools, your data, and your objectives — we handle reasoning, planning, and execution."
            />
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                className="h-12 rounded-full px-7 text-base font-semibold transition-all hover:neon-glow"
                render={<Link href="/login" />}
              >
                Open the console
                <ArrowUpRight className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-12 rounded-full border-white/15 bg-white/[0.02] px-7 text-base font-semibold backdrop-blur-sm transition-colors hover:bg-white/5"
                render={<Link href="/#research" />}
              >
                Read the docs
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-2xl">
              <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-4 py-3">
                <Terminal className="size-4 text-brand-2" />
                <span className="text-xs font-medium text-muted-foreground">quickstart.sh</span>
                <span className="ml-auto flex gap-1.5">
                  <span className="size-2.5 rounded-full bg-white/15" />
                  <span className="size-2.5 rounded-full bg-white/15" />
                  <span className="size-2.5 rounded-full bg-white/15" />
                </span>
              </div>
              <pre className="overflow-x-auto p-5 text-[13px] leading-relaxed">
                <code className="font-mono">
                  <span className="text-muted-foreground"># Run an agentic task</span>
                  {"\n"}
                  <span className="text-brand-3">curl</span> https://api.numina.ai/v1/agents \
                  {"\n"}
                  {"  "}-H <span className="text-brand-1">&quot;Authorization: Bearer $NUMINA_KEY&quot;</span> \
                  {"\n"}
                  {"  "}-d <span className="text-brand-1">{`'{ "model": "numina-horizon", `}</span>
                  {"\n"}
                  {"     "}<span className="text-brand-1">{`'task": "Plan and book travel", `}</span>
                  {"\n"}
                  {"     "}<span className="text-brand-1">{`'tools": ["calendar", "web"] }'`}</span>
                  {"\n\n"}
                  <span className="text-muted-foreground"># → streaming steps, tool calls, final answer</span>
                </code>
              </pre>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}

function ArrowDown({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M12 5v14M19 12l-7 7-7-7" />
    </svg>
  )
}
