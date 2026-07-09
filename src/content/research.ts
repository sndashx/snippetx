export type ResearchKind = "paper" | "post" | "release"

export interface ResearchAuthor {
  name: string
  affiliation?: string
}

export interface ResearchPaper {
  slug: string
  title: string
  date: string
  /** ISO date — optional, used for sorting/SEO. */
  iso?: string
  kind: ResearchKind
  authors: ResearchAuthor[]
  abstract: string
  /** Tags shown as small pills (e.g. "Reasoning", "Safety"). */
  tags?: string[]
  /** Long-form markdown body used by /research/[slug]. */
  body: string
  /** External canonical link (arXiv, blog, etc.). Used by detail page CTA. */
  canonical?: { label: string; href: string }
}

const m3 = {
  slug: "m3",
  label: "minimax M3",
} as const

/**
 * Editorial source-of-truth for the lab's research output.
 *
 * The homepage section, the /research index, and the /research/[slug]
 * reader all consume this file — change content here, not in components.
 *
 * Authors are real-feeling placeholders for the minimax research team.
 * Abstracts and bodies are realistic but fictional.
 */
export const researchPapers: ResearchPaper[] = [
  {
    slug: "deliberative-agents-at-scale",
    title: "Deliberative Agents at Scale",
    date: "Mar 2026",
    iso: "2026-03-12",
    kind: "paper",
    authors: [
      { name: "Kara Vance", affiliation: "minimax Research" },
      { name: "R. Okafor" },
      { name: "L. Mercer" },
    ],
    abstract:
      "We present a framework for training language agents that plan with explicit world models and recover from failure without human intervention. Across long-horizon benchmarks the method closes 71% of the gap between single-shot inference and human-expert trajectories, while reducing tool-call errors by 38%.",
    tags: ["Agents", "Planning", "Tool-use"],
    canonical: {
      label: "arXiv",
      href: "https://arxiv.org/abs/2603.01101",
    },
    body: `## Motivation

Most production agents today act as greedy few-step reasoners: they pick the next
tool, call it, and stop. The result is brittle behaviour on tasks that require
holding a goal in working memory for hundreds of steps.

## Method

We introduce **Deliberative Rollouts**, an objective that scores partial plans
against a learned world model before they touch a real environment. The agent
must justify each transition with an explicit commitment, and recovers when that
commitment is falsified.

## Results

On \`agentbench-lite\` and our internal \`forge-512\` suite, deliberative agents
match human-expert success rates within 4 points while using 3.1× fewer tool
calls than a comparable chain-of-thought baseline.

## What we learned

Explicit commitments are a strong regulariser. They cut reward-hacking and make
behaviour legible — most failure modes can now be diagnosed from the trace
without re-running the episode.`,
  },
  {
    slug: "sparse-mixtures-for-efficient-reasoning",
    title: "Sparse Mixtures for Efficient Reasoning",
    date: "Feb 2026",
    iso: "2026-02-21",
    kind: "paper",
    authors: [
      { name: "Sami Haddad" },
      { name: "M. Lindqvist", affiliation: "minimax Research" },
      { name: "Y. Park" },
    ],
    abstract:
      "A routing architecture that activates reasoning pathways on demand, cutting inference cost by 4.3× with no loss on MMLU, GPQA, or HumanEval. We share ablation studies on expert granularity and routing temperature.",
    tags: ["Architecture", "Efficiency"],
    canonical: {
      label: "arXiv",
      href: "https://arxiv.org/abs/2602.04418",
    },
    body: `## Why sparse?

Dense transformers waste capacity on easy tokens. We route each token to the
top-2 of 64 reasoning experts and show that, beyond a critical batch size,
sparsity does not cost accuracy.

## Recipe

- Shared trunk for low-level features.
- Top-2 router with load-balancing auxiliary loss.
- Per-expert learning-rate warmup.

## Findings

Granularity matters more than expert count. 64 experts with capacity factor
1.25 outperforms 128 experts at 0.75 across all benchmarks we tried.`,
  },
  {
    slug: "value-learning-under-distribution-shift",
    title: "Value Learning under Distribution Shift",
    date: "Feb 2026",
    iso: "2026-02-04",
    kind: "paper",
    authors: [
      { name: "Tomoko Nakamura" },
      { name: "A. Bauer", affiliation: "minimax Research" },
    ],
    abstract:
      "Towards models that preserve intent when deployed far outside their training distribution. We study a small suite of held-out environments and measure when learned reward models remain aligned with their specification.",
    tags: ["Alignment", "Reward modelling"],
    body: `## Setup

We train reward models on three proxy tasks (summarisation, code review, web
search) and evaluate them on a fourth (clinical note drafting) that no model
in our study has seen.

## Headline

Linear probes on intermediate layers detect distribution shift before the
reward model's predictions degrade. We argue this is the right place to put
the safety tripwire.

## Open questions

Can we train reward models to *degrade gracefully* — refusing with calibrated
uncertainty rather than confidently misranking? Early results say yes, but
only when the model has been exposed to explicit abstention examples.`,
  },
  {
    slug: "tool-use-reliability-on-real-apis",
    title: "Tool-Use Reliability on Real APIs",
    date: "Dec 2025",
    iso: "2025-12-15",
    kind: "paper",
    authors: [
      { name: "I. Kostov", affiliation: "minimax Research" },
      { name: "D. Romero" },
      { name: "P. Singh" },
    ],
    abstract:
      "An empirical study of agent reliability when calling real, rate-limited, occasionally-flaky public APIs. We release a frozen benchmark and a tracing toolkit so future work can be compared on equal terms.",
    tags: ["Agents", "Evaluation"],
    body: `## What we measured

Across 18 production APIs (payments, calendars, maps, weather, CRMs), our
agent completed 87.4% of intended workflows. The remaining 12.6% were
dominated by three failure modes: stale schema, silent retries, and idempotency
violations.

## What we released

- \`agentreliability-bench-v1\` — 240 frozen scenarios.
- \`agenttrace\` — an open-source tracer for OpenAI-, Anthropic-, and
  our-style tool calls.`,
  },
  {
    slug: "self-consistency-without-sampling-cost",
    title: "Self-Consistency without Sampling Cost",
    date: "Nov 2025",
    iso: "2025-11-22",
    kind: "paper",
    authors: [
      { name: "M. Lindqvist" },
      { name: "R. Okafor", affiliation: "minimax Research" },
    ],
    abstract:
      "We replace naive majority-vote self-consistency with a single learned aggregator, recovering 91% of the gains at one-tenth the inference cost.",
    tags: ["Inference", "Reasoning"],
    body: `## Problem

Self-consistency helps — but it costs. Each problem requires k=32 samples.

## Our fix

A tiny aggregator head reads the k hidden states and produces the final
answer in a single forward pass. Trained on 200k labelled traces.

## Result

We match majority-vote self-consistency on GSM8K and AQuA within 0.3 points,
at the cost of a single sample.`,
  },
  {
    slug: "long-context-evaluation-suite-v2",
    title: "Long-Context Evaluation Suite v2",
    date: "Jan 2026",
    iso: "2026-01-29",
    kind: "post",
    authors: [{ name: "minimax Evals Team" }],
    abstract:
      "An open suite for evaluating retrieval, reasoning, and faithfulness across 128k–1M token windows, with adversarial distractors built in.",
    tags: ["Evaluation", "Long-context"],
    body: `## Why a new suite

Existing long-context benchmarks are saturated, and most measure retrieval
alone. \`lce-v2\` measures retrieval, multi-hop reasoning, and faithfulness on
the same documents.

## What's in it

- 1,400 questions across 8 domains.
- Adversarial distractors with 0.83 cosine similarity to the answer span.
- A \`faithfulness\` track that grades whether the model invents facts when
  the document does not contain them.`,
  },
  {
    slug: "m3-system-card",
    title: "minimax M3 — System Card",
    date: "Jan 2026",
    iso: "2026-01-15",
    kind: "release",
    authors: [{ name: "minimax Safety Team" }],
    abstract:
      "A detailed account of how minimax M3 was trained, evaluated, and red-teamed — including capability, jailbreak, and bio-risk evaluations.",
    tags: ["Release", "Safety"],
    body: `## Summary

minimax M3 is a frontier agentic language model trained with deliberative
rollouts and sparse mixture routing. This system card covers:

1. Training data composition.
2. Capability evaluations across 27 benchmarks.
3. Red-team findings, including 14 jailbreak classes.
4. The mitigations shipped in the production API.

## Headline numbers

| Benchmark            | Score |
|----------------------|-------|
| MMLU-Pro             | 84.2  |
| GPQA                 | 71.6  |
| HumanEval+           | 92.4  |
| agentbench-lite      | 78.1  |

The full document runs to 96 pages and is mirrored at
\`/research/m3-system-card\`.`,
  },
]

/** Featured subset used by the homepage marquee / hero ticker. */
export const recentResearch = researchPapers.map((p) => ({
  title: p.title,
  date: p.date,
  kind: p.kind,
}))

export function getPaperBySlug(slug: string): ResearchPaper | undefined {
  return researchPapers.find((p) => p.slug === slug)
}

export { m3 }