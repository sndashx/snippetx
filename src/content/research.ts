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
  /** Tags shown as small pills (e.g. "Criticality", "Morphogenesis"). */
  tags?: string[]
  /** Long-form markdown body used by /research/[slug]. */
  body: string
  /** External canonical link (arXiv, journal, blog). Used by detail page CTA. */
  canonical?: { label: string; href: string }
}

/**
 * Editorial source-of-truth for the institution's research output.
 *
 * The homepage section, the /research index, and the /research/[slug]
 * reader all consume this file — change content here, not in components.
 *
 * Authors are real-feeling placeholders for the SN-X resident fellows.
 * Abstracts and bodies are realistic but fictional.
 */
export const researchPapers: ResearchPaper[] = [
  {
    slug: "criticality-without-fine-tuning",
    title: "Criticality Without Fine-Tuning",
    date: "Mar 2026",
    iso: "2026-03-12",
    kind: "paper",
    authors: [
      { name: "K. Vance", affiliation: "SN-X" },
      { name: "R. Okafor" },
      { name: "L. Mercer", affiliation: "SN-X" },
    ],
    abstract:
      "Self-organizing criticality is often treated as a fragile phenomenon requiring precise tuning of a control parameter. We show that in sufficiently heterogeneous networks, critical-like scaling emerges robustly across a finite region of parameter space — and propose a practical detector that does not require direct access to the underlying dynamics.",
    tags: ["Criticality", "Phase Transitions"],
    canonical: {
      label: "arXiv",
      href: "https://arxiv.org/abs/2603.01101",
    },
    body: `## Motivation

Power-law signatures in natural data are routinely attributed to self-organized
criticality. The usual objection is that criticality sits on a knife-edge; only
delicate tuning can keep a system there. We test whether that intuition survives
in heterogeneous, high-dimensional networks.

## Setup

We sweep three classes of systems — neuronal cultures, simulated regulatory
networks, and an engineered Boolean ensemble — over a 7-dimensional parameter
grid. For each, we estimate the branching parameter ρ and the avalanche
exponents τ, σ.

## Result

All three classes exhibit a finite *critical region* — not a point — where
avalanches obey scale-free statistics. The width of the region grows linearly
with the log of network heterogeneity.

## Implication

If criticality in nature is heterogeneous by default, we may have been hunting
for the wrong thing. The detectable signature is not a single exponent but a
*band* of exponents, with width predicted by the heterogeneity of the substrate.`,
  },
  {
    slug: "geometry-of-representations",
    title: "The Geometry of Representations in Deep Networks",
    date: "Feb 2026",
    iso: "2026-02-21",
    kind: "paper",
    authors: [
      { name: "S. Haddad", affiliation: "SN-X" },
      { name: "M. Lindqvist" },
      { name: "Y. Park", affiliation: "SN-X" },
    ],
    abstract:
      "We study the intrinsic dimension and curvature of learned representations across 47 pre-trained models. We find a robust phase transition in representation geometry at the same scale where downstream capabilities begin to appear — and show that this transition is preceded by a measurable signal in the spectrum of the representation operator.",
    tags: ["Learning Theory", "Geometry"],
    canonical: {
      label: "arXiv",
      href: "https://arxiv.org/abs/2602.04418",
    },
    body: `## Question

Do representations undergo a qualitative change in geometry at the scale where
new capabilities emerge, or is the transition smooth?

## Method

We compute persistent homology and effective dimension profiles across training
checkpoints for 47 pre-trained models spanning four orders of magnitude in
parameter count.

## Findings

- Below a critical scale (≈ 6B parameters), representations are topologically
  trivial — essentially a low-dimensional manifold.
- Above the scale, a second cohomology class appears, persists across fine-tunes,
  and predicts downstream capability gains (ρ = 0.78 with held-out evals).
- The transition is *sharp* — a 1.4× increase in compute changes the topological
  signature by more than 0.5σ.

## Implication

Capability may not be a smooth function of scale after all. The data are
consistent with a phase transition, and the order parameter is geometric.`,
  },
  {
    slug: "morphogenesis-as-inference",
    title: "Morphogenesis as Inference",
    date: "Feb 2026",
    iso: "2026-02-04",
    kind: "paper",
    authors: [
      { name: "T. Nakamura", affiliation: "SN-X" },
      { name: "A. Bauer" },
    ],
    abstract:
      "We recast developmental pattern formation as approximate Bayesian inference over a generative model of tissue. The resulting dynamics reproduce classical Turing patterns, recover experimentally observed stripe-spot transitions in zebrafish, and predict a previously unreported bistable regime in chick feather primordia.",
    tags: ["Morphogenesis", "Inference"],
    body: `## Reframing

A developing embryo is not executing a pre-written program; it is *inferring*
its own shape from noisy positional cues. We make that intuition precise.

## Model

Tissue is a Markov random field; positional information is a noisy projection
of a latent target morphology. Patterning dynamics minimise variational free
energy in this field.

## Result

The same equations reproduce Turing patterns, Hopfield-style stored morphologies,
and a previously unreported bistable regime — feather spots that admit two
stable spacings depending on initial conditions. We observe both experimentally
in chick primordia cultures.

## Why it matters

It reframes developmental biology as a problem in statistical mechanics, and
makes concrete predictions that can be tested with current experimental tools.`,
  },
  {
    slug: "markets-as-distributed-computation",
    title: "Markets as Distributed Computation",
    date: "Dec 2025",
    iso: "2025-12-15",
    kind: "paper",
    authors: [
      { name: "I. Kostov", affiliation: "SN-X" },
      { name: "D. Romero" },
      { name: "P. Singh", affiliation: "SN-X" },
    ],
    abstract:
      "We formalize a price-mediated exchange market as a distributed message-passing algorithm computing a global price vector, and prove convergence under assumptions that match the empirically observed structure of limit-order books. The theory predicts a previously unreported phase transition between two qualitatively different price-discovery regimes.",
    tags: ["Markets", "Distributed Computing"],
    body: `## Setup

A market is a set of agents exchanging messages (orders) over a noisy channel.
The market clearing price is the fixed point of a belief-propagation operator.

## Main theorem

Under conditions that are satisfied whenever the order book is *not* pathologically
thin, the system converges in O(log n) rounds to a price vector that is
ε-close to the Walrasian equilibrium, with ε bounded by the channel noise.

## Predictions

- A phase transition in price-discovery regime as a function of order-book depth.
- A quantitative formula for the latency–volatility trade-off observed in
  high-frequency data.
- An explanation for the empirical failure of TWAP benchmarks in illiquid markets.`,
  },
  {
    slug: "causal-identification-under-deep-uncertainty",
    title: "Causal Identification Under Deep Uncertainty",
    date: "Nov 2025",
    iso: "2025-11-22",
    kind: "paper",
    authors: [
      { name: "M. Lindqvist", affiliation: "SN-X" },
      { name: "R. Okafor" },
    ],
    abstract:
      "Classical causal identification assumes the analyst can enumerate the relevant variables. We relax this assumption: when the variable set itself is uncertain, what can be identified? We give necessary and sufficient conditions, and demonstrate them on a climate-policy case study where the standard approach fails.",
    tags: ["Causality", "Decision Theory"],
    body: `## Problem

The do-calculus tells us what is identifiable given a known causal graph. It
says nothing about whether the graph itself is the right one.

## Contribution

We introduce *graph-robust identification*: a causal claim is graph-robust if it
holds for every member of a hypothesis class of graphs consistent with the data.
We give necessary and sufficient conditions, an algorithm, and a worst-case
sample complexity bound.

## Case study

Re-analysis of a published climate-policy attribution finding: the original
conclusion does not survive graph-robust identification. We identify the
specific additional observation that would settle the question.`,
  },
  {
    slug: "immune-system-as-learning-system",
    title: "The Immune System as a Learning System",
    date: "Jan 2026",
    iso: "2026-01-29",
    kind: "post",
    authors: [{ name: "SN-X Biology Group" }],
    abstract:
      "An essay review: we argue that adaptive immunity is best understood as a continual, embodied reinforcement-learning process operating on a population of B and T cells, with somatic hypermutation playing the role of a parameterised policy and affinity maturation as policy-gradient ascent.",
    tags: ["Immunology", "Learning"],
    body: `## Thesis

The adaptive immune system is a continual, embodied reinforcement learner. It
observes (peptide–MHC presentation), acts (clonal expansion and differentiation),
and updates (somatic hypermutation and selection).

## Implications

- Vaccine design becomes a problem in curriculum design.
- Autoimmunity is a failure mode of the same learning algorithm that confers
  protection — and so is intelligible in the same vocabulary.
- The architecture of the immune system offers concrete predictions for the
  design of continual-learning artificial agents.`,
  },
  {
    slug: "sn-x-instruments-release",
    title: "SN-X Instruments — Inaugural Release",
    date: "Jan 2026",
    iso: "2026-01-15",
    kind: "release",
    authors: [{ name: "SN-X Instruments Group" }],
    abstract:
      "We release the first three SN-X Instruments: a criticality detector for time-series, a large benchmark for emergent communication in multi-agent simulations, and a dataset of regulatory networks reconstructed from single-cell data.",
    tags: ["Release", "Instruments"],
    body: `## What we are releasing

- **\`criticality-detect-v1\`** — a library that estimates branching parameters
  and avalanche exponents from short, noisy time-series without requiring access
  to the underlying dynamics.
- **\`emergent-comm-bench-v1\`** — 240 frozen multi-agent scenarios with
  ground-truth communication protocols, for studying emergent communication.
- **\`regulatory-networks-v1\`** — 1,820 reconstructed regulatory networks from
  published single-cell datasets, in a common format with provenance metadata.

## How to use them

All three are open-source under MIT. Pipelines, baselines, and a leaderboard
are at \`/instruments\`.`,
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