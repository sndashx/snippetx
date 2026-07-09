import Link from "next/link"
import {
  ArrowRight,
  Atom,
  Brain,
  Cpu,
  GitBranch,
  Network,
  ShieldCheck,
  Sparkles,
  Terminal,
  Wrench,
  Zap,
  Microscope,
  Scale,
  Rocket,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlowCard } from "@/components/visual/GlowCard"
import { Marquee } from "@/components/visual/Marquee"
import { Reveal } from "@/components/visual/Reveal"
import { SectionHeading } from "@/components/visual/SectionHeading"
import { Hero } from "@/components/marketing/hero"

const models = [
  {
    name: "NUMINA-Horizon",
    size: "2.4T",
    context: "1M tokens",
    tags: ["Reasoning", "Agentic", "Multimodal"],
    desc: "Our flagship frontier model with deep tool-use and long-horizon planning.",
    metric: 94.2,
  },
  {
    name: "NUMINA-Aether",
    size: "410B",
    context: "256K tokens",
    tags: ["Code", "Science", "Long-context"],
    desc: "A research-grade model tuned for rigorous scientific and engineering tasks.",
    metric: 91.8,
  },
  {
    name: "NUMINA-Pulse",
    size: "70B",
    context: "128K tokens",
    tags: ["Fast", "Edge", "Tool-use"],
    desc: "A low-latency model for real-time agents and interactive applications.",
    metric: 88.4,
  },
]

const capabilities = [
  { icon: Wrench, title: "Tool Use", desc: "Native function calling across thousands of typed tools with verifiable execution." },
  { icon: GitBranch, title: "Planning", desc: "Decomposes goals into scored plans and adapts them under uncertainty." },
  { icon: Terminal, title: "Code Execution", desc: "Sandboxed runtime for iterative programming, testing, and debugging." },
  { icon: Brain, title: "Reasoning", desc: "Deliberative chains with self-consistency and explicit uncertainty." },
  { icon: Network, title: "Multi-Agent", desc: "Coordinates specialist agents that negotiate and delegate sub-tasks." },
  { icon: Cpu, title: "Self-Improvement", desc: "Curates its own training signals from deployed experience." },
]

const research = [
  {
    title: "Deliberative Agents at Scale",
    authors: "K. Vance, R. Okafor, L. Mercer",
    abstract:
      "We present a framework for training language agents that plan with explicit world models and recover from failure without human intervention.",
  },
  {
    title: "Sparse Mixtures for Efficient Reasoning",
    authors: "S. Haddad, M. Lindqvist",
    abstract:
      "A routing architecture that activates reasoning pathways on demand, cutting inference cost by 4.3x with no loss on benchmarks.",
  },
  {
    title: "Value Learning under Distribution Shift",
    authors: "T. Nakamura, A. Bauer",
    abstract:
      "Towards models that preserve intent when deployed far outside their training distribution.",
  },
]

const principles = [
  { icon: ShieldCheck, title: "Aligned by Construction", desc: "Safety properties are designed into training, not bolted on after." },
  { icon: Microscope, title: "Empirically Evaluated", desc: "Every release is subject to open, reproducible evaluations." },
  { icon: Scale, title: "Measured & Honest", desc: "We report capabilities and failure modes with equal rigor." },
]

const codeSnippet = `import { Numina } from "@numina/sdk"

const agent = await Numina.agent("horizon", {
  tools: ["web", "code", "files"],
  reasoning: "high",
})

const result = await agent.run(
  "Draft a research plan for low-cost carbon capture"
)
console.log(result.plan)`

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground">
      {/* HERO */}
      <Hero />

      {/* MARQUEE */}
      <section className="border-y border-border bg-card/30 py-6">
        <Marquee
          items={[
            <span key="a" className="inline-flex items-center gap-2"><Atom className="size-4 text-brand-3" /> Agentic</span>,
            <span key="b" className="inline-flex items-center gap-2"><Sparkles className="size-4 text-brand-2" /> Multimodal</span>,
            <span key="c" className="inline-flex items-center gap-2"><Brain className="size-4 text-brand-1" /> Reasoning</span>,
            <span key="d" className="inline-flex items-center gap-2"><Wrench className="size-4 text-brand-3" /> Tool-use</span>,
            <span key="e" className="inline-flex items-center gap-2"><Cpu className="size-4 text-brand-2" /> Long-context</span>,
            <span key="f" className="inline-flex items-center gap-2"><ShieldCheck className="size-4 text-brand-1" /> Safety-aligned</span>,
            <span key="g" className="inline-flex items-center gap-2"><Zap className="size-4 text-brand-3" /> Self-improving</span>,
          ]}
          duration={28}
        />
      </section>

      {/* MODELS */}
      <section className="mx-auto max-w-7xl px-6 py-24 sm:py-32">
        <Reveal>
          <SectionHeading
            eyebrow="Models"
            title="A family of frontier models"
            description="From flagship reasoning engines to fast edge agents — each trained with our agentic post-training recipe."
            id="models"
          />
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {models.map((m, i) => (
            <Reveal key={m.name} delay={i * 0.1}>
              <GlowCard className="h-full">
                <div className="flex items-center justify-between">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-1/20 to-brand-3/20 text-brand-2">
                    <Rocket className="size-5" />
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">{m.context}</span>
                </div>
                <h3 className="mt-5 text-xl font-bold tracking-tight">{m.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{m.desc}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {m.tags.map((t) => (
                    <span key={t} className="rounded-full border border-border bg-background/40 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-5 flex items-end justify-between border-t border-border/60 pt-4">
                  <div>
                    <div className="text-2xl font-bold tracking-tight">{m.size}</div>
                    <div className="text-xs text-muted-foreground">parameters</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gradient">{m.metric}</div>
                    <div className="text-xs text-muted-foreground">eval score</div>
                  </div>
                </div>
              </GlowCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* AGENTS / CAPABILITIES */}
      <section className="relative border-t border-border bg-card/20">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32">
          <Reveal>
            <SectionHeading
              eyebrow="Capabilities"
              title="Agents that get things done"
              description="NUMINA models aren't just chat — they perceive, decide, and act through tools in the real world."
              id="agents"
            />
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.07}>
                <GlowCard className="h-full" spotlight={false}>
                  <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-brand-2/15 text-brand-2">
                    <c.icon className="size-5" />
                  </div>
                  <h3 className="text-lg font-bold tracking-tight">{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
                </GlowCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* RESEARCH */}
      <section className="mx-auto max-w-7xl px-6 py-24 sm:py-32">
        <Reveal>
          <SectionHeading
            eyebrow="Research"
            title="Pushing the frontier, in the open"
            description="Selected work from the NUMINA research team."
            id="research"
          />
        </Reveal>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {research.map((r, i) => (
            <Reveal key={r.title} delay={i * 0.1}>
              <GlowCard className="flex h-full flex-col" spotlight={false}>
                <h3 className="text-lg font-bold leading-snug tracking-tight">{r.title}</h3>
                <p className="mt-2 font-mono text-xs text-brand-3">{r.authors}</p>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">{r.abstract}</p>
                <Link
                  href="/#research"
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-brand-2"
                >
                  Read paper <ArrowRight className="size-4" />
                </Link>
              </GlowCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* SAFETY */}
      <section className="relative border-t border-border bg-card/20">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32">
          <Reveal>
            <SectionHeading
              eyebrow="Safety & Approach"
              title="Power, earned through rigor"
              description="We treat safety as a research problem, not a constraint — measured, honest, and built in from the start."
              id="safety"
            />
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {principles.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.1}>
                <GlowCard className="h-full" spotlight={false}>
                  <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-1/20 to-brand-3/20 text-brand-2">
                    <p.icon className="size-5" />
                  </div>
                  <h3 className="text-lg font-bold tracking-tight">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
                </GlowCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* API CTA */}
      <section className="mx-auto max-w-7xl px-6 py-24 sm:py-32">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card/50 p-8 sm:p-14">
            <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" aria-hidden />
            <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-brand-2/20 blur-[100px]" aria-hidden />
            <div className="relative grid items-center gap-10 lg:grid-cols-2">
              <div>
                <SectionHeading
                  eyebrow="Build with NUMINA"
                  title="Ship agents in minutes"
                  description="A single SDK call gives your application a frontier agent with tools, memory, and reasoning."
                  id="api"
                />
                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <Button size="lg" className="h-12 rounded-full px-8 text-base font-semibold transition-all hover:neon-glow" render={<Link href="/login" />}>
                    Get API Key
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                  <Button variant="outline" size="lg" className="h-12 rounded-full px-8 text-base font-semibold backdrop-blur transition-all hover:bg-card" render={<Link href="/#docs" />}>
                    Read the docs
                  </Button>
                </div>
              </div>
              <div className="overflow-hidden rounded-2xl border border-border bg-background/80 backdrop-blur">
                <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
                  <span className="size-3 rounded-full bg-red-400/70" />
                  <span className="size-3 rounded-full bg-amber-400/70" />
                  <span className="size-3 rounded-full bg-emerald-400/70" />
                  <span className="ml-2 font-mono text-xs text-muted-foreground">agent.ts</span>
                </div>
                <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed text-foreground/90">
                  <code>{codeSnippet}</code>
                </pre>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
