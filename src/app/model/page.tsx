import type { Metadata } from "next"
import Link from "next/link"
import { Check, ArrowRight } from "lucide-react"
import { buildMetadata, modelFlagship } from "@/lib/brand"
import { CodeBlock } from "@/components/marketing/highlight"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = buildMetadata({
  title: "Model",
  description:
    "minimax M3 — a frontier agentic language model. Capabilities, context window, modalities, pricing tiers, and API examples.",
  path: "/model",
})

const capabilities = [
  {
    name: "Long-horizon reasoning",
    body: "Deliberative rollouts let M3 plan, commit, and recover across hundreds of tool calls without drifting off-task.",
  },
  {
    name: "Native tool-use",
    body: "A first-class JSON tool-call channel with structured refusal, idempotency hints, and automatic schema recovery.",
  },
  {
    name: "One-million-token context",
    body: "1M tokens of working memory with sparse mixture routing — cost-effective for long documents and codebases.",
  },
  {
    name: "Code generation",
    body: "92.4 on HumanEval+. Native understanding of multi-file diffs and toolchains across 18 languages.",
  },
  {
    name: "Vision",
    body: "Charts, diagrams, screenshots, and UI mockups — with grounded region citations and refusal on ambiguous inputs.",
  },
  {
    name: "Streaming & function calls",
    body: "Server-sent token streaming with interleaved tool calls and traceable reasoning.",
  },
] as const

const tiers = [
  {
    name: "M3-nano",
    price: "$0.05 / 1M input · $0.20 / 1M output",
    blurb: "Sub-second latency for high-volume classification, extraction, and autocomplete workloads.",
  },
  {
    name: "M3-mini",
    price: "$0.30 / 1M input · $1.20 / 1M output",
    blurb: "The everyday workhorse. Tool-use, 256k context, and most enterprise workflows at a sensible price.",
  },
  {
    name: "minimax M3",
    price: "$2.50 / 1M input · $10.00 / 1M output",
    blurb: "The full flagship. 1M-token context, deliberative rollouts, vision, and the strongest reasoning profile.",
  },
] as const

const changelog = [
  {
    date: "2026-01-15",
    tag: "M3",
    title: "minimax M3 — general availability",
    body: "Reasoning v2, vision, 1M context, structured tool calls, and an updated safety stack.",
  },
  {
    date: "2025-11-04",
    tag: "M3-mini",
    title: "M3-mini — context doubled to 256k",
    body: "Same price, twice the working memory. Latency unchanged.",
  },
  {
    date: "2025-09-22",
    tag: "M3-nano",
    title: "M3-nano — released",
    body: "A 3B sparse-mixture model purpose-built for high-volume, low-latency workloads.",
  },
  {
    date: "2025-07-01",
    tag: "Preview",
    title: "Public preview",
    body: "Limited preview under the codename \"M3-preview\". Replaced by GA on 2026-01-15.",
  },
] as const

const curlExample = `curl https://api.minimax.dev/v1/chat/completions \\
  -H "Authorization: Bearer $MINIMAX_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "minimax-m3",
    "temperature": 0.7,
    "messages": [
      { "role": "system", "content": "You are a careful research assistant." },
      { "role": "user", "content": "Summarise the safety properties of M3." }
    ]
  }'`

const tsExample = `import OpenAI from "openai"

const client = new OpenAI({
  apiKey: process.env.MINIMAX_API_KEY,
  baseURL: "https://api.minimax.dev/v1",
})

const response = await client.chat.completions.create({
  model: "minimax-m3",
  temperature: 0.7,
  messages: [
    { role: "system", content: "You are a careful research assistant." },
    { role: "user", content: "Summarise the safety properties of M3." },
  ],
})

console.log(response.choices[0].message.content)`

export default function ModelPage() {
  return (
    <div className="relative min-h-[100svh] bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-6 pb-32 pt-36 sm:pt-44">
        <header className="mb-16 max-w-3xl">
          <p className="text-eyebrow">Model · Flagship</p>
          <h1 className="mt-4 text-display-xl text-foreground">
            {modelFlagship.name}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            {modelFlagship.tagline}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              render={<Link href="/playground" />}
              className="h-12 rounded-full bg-accent px-7 text-base font-semibold text-background shadow-[0_18px_40px_-18px_color-mix(in_oklch,var(--accent)_70%,transparent)] hover:neon-glow"
            >
              Try in playground
              <ArrowRight className="ml-2 size-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              render={<Link href="/research/m3-system-card" />}
              className="h-12 rounded-full border-border bg-card/40 px-7 text-base font-semibold backdrop-blur hover:bg-card/70"
            >
              Read the system card
            </Button>
          </div>
        </header>

        {/* Headline specs */}
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border lg:grid-cols-4">
          {[
            { k: "Context window", v: "1,048,576 tokens" },
            { k: "Modalities", v: "Text · Vision" },
            { k: "Tool-use", v: "JSON schema · streaming" },
            { k: "Languages", v: "18 source · 90 read" },
          ].map((s) => (
            <div key={s.k} className="bg-card/40 p-6">
              <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {s.k}
              </dt>
              <dd className="mt-2 text-lg font-medium text-foreground">
                {s.v}
              </dd>
            </div>
          ))}
        </dl>

        {/* Capabilities */}
        <section className="mt-24">
          <p className="text-eyebrow">Capabilities</p>
          <h2 className="mt-3 text-display-md text-foreground">
            What {modelFlagship.codename} is good at.
          </h2>
          <ul className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
            {capabilities.map((c) => (
              <li key={c.name} className="bg-card/40 p-6">
                <div className="flex items-start gap-3">
                  <span className="mt-1 inline-flex size-5 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-accent/10">
                    <Check className="size-3 text-accent" />
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-foreground">
                      {c.name}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {c.body}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* API example */}
        <section className="mt-24">
          <p className="text-eyebrow">API</p>
          <h2 className="mt-3 text-display-md text-foreground">
            Drop-in OpenAI-compatible endpoint.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Same request shape as the OpenAI Chat Completions API. Switch your
            <code className="mx-1 rounded bg-card/70 px-1.5 py-0.5 font-mono text-sm text-accent">baseURL</code>
            and
            <code className="mx-1 rounded bg-card/70 px-1.5 py-0.5 font-mono text-sm text-accent">model</code>
            and you&apos;re running {modelFlagship.codename}.
          </p>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <CodeBlock code={curlExample} lang="bash" filename="curl" />
            <CodeBlock code={tsExample} lang="ts" filename="client.ts" />
          </div>
        </section>

        {/* Pricing */}
        <section className="mt-24">
          <p className="text-eyebrow">Pricing</p>
          <h2 className="mt-3 text-display-md text-foreground">
            Pay for what you use.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Token-based pricing across three model sizes. Volume discounts
            available above 10B tokens / month.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {tiers.map((t, i) => (
              <div
                key={t.name}
                className={`flex flex-col rounded-2xl border p-6 transition-colors ${
                  i === tiers.length - 1
                    ? "border-accent/40 bg-accent/[0.04]"
                    : "border-border bg-card/40"
                }`}
              >
                <div className="flex items-baseline justify-between">
                  <h3 className="text-lg font-semibold text-foreground">
                    {t.name}
                  </h3>
                  {i === tiers.length - 1 && (
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
                      Flagship
                    </span>
                  )}
                </div>
                <p className="mt-4 font-mono text-sm text-foreground/90">
                  {t.price}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {t.blurb}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Availability */}
        <section className="mt-24">
          <p className="text-eyebrow">Availability</p>
          <h2 className="mt-3 text-display-md text-foreground">
            Where you can run it.
          </h2>
          <ul className="mt-10 grid gap-3 sm:grid-cols-2">
            {[
              { k: "Hosted API", v: "api.minimax.dev — global, 99.9% SLA" },
              { k: "Region", v: "US-East · US-West · EU-West · AP-South" },
              { k: "Self-hosted", v: "AWS, GCP, Azure — via the minimax runtime image" },
              { k: "On-device", v: "M3-nano on Apple Silicon, Snapdragon X, and Linux/ROCm" },
            ].map((s) => (
              <li
                key={s.k}
                className="flex items-start justify-between gap-6 rounded-xl border border-border bg-card/30 p-5"
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  {s.k}
                </span>
                <span className="text-right text-sm text-foreground/85">
                  {s.v}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Changelog */}
        <section className="mt-24">
          <p className="text-eyebrow">Changelog</p>
          <h2 className="mt-3 text-display-md text-foreground">Releases.</h2>
          <ol className="mt-10 flex flex-col divide-y divide-border/60 rounded-2xl border border-border">
            {changelog.map((c) => (
              <li
                key={c.date + c.title}
                className="grid gap-2 px-6 py-5 sm:grid-cols-[10rem_1fr] sm:gap-8"
              >
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <time className="font-mono">{c.date}</time>
                  <span className="rounded-full border border-border bg-card/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em]">
                    {c.tag}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-medium text-foreground">
                    {c.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {c.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <div className="mt-24 rounded-2xl border border-border bg-card/30 p-10 text-center">
          <h2 className="text-display-md text-foreground">Try it now.</h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-muted-foreground">
            No account required for the playground — just type a prompt and
            watch the stream.
          </p>
          <Button
            size="lg"
            render={<Link href="/playground" />}
            className="mt-6 h-12 rounded-full bg-accent px-7 text-base font-semibold text-background hover:neon-glow"
          >
            Open playground
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}