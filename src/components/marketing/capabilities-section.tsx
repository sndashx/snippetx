import { Reveal } from "@/components/marketing/reveal"
import { SectionHeading } from "@/components/visual/SectionHeading"
import { researchAxes } from "@/lib/brand"
import { cn } from "@/lib/utils"

interface Axis {
  title: string
  meta: string
  body: string
  /** Inline SVG path data drawn into a 24×24 viewBox. */
  glyph: React.ReactNode
}

const axes: Axis[] = [
  {
    title: "Foundations of Complexity",
    meta: "Axis 01 · Mathematics",
    body:
      "Phase transitions, critical phenomena, universality classes, and the limits of reduction. We study when and why microscopic rules give rise to macroscopic order.",
    glyph: (
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 18h18" />
        <path d="M5 18c2-7 5-10 7-10s5 3 7 10" />
        <circle cx="12" cy="11" r="1.4" fill="currentColor" />
      </g>
    ),
  },
  {
    title: "Computation & Information",
    meta: "Axis 02 · Learning Theory",
    body:
      "Algorithmic information, statistical learning, and the geometry of representations learned by large models — including phase transitions in representation topology at scale.",
    glyph: (
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3.5" y="5.5" width="17" height="13" rx="1.6" />
        <path d="M7 9h10M7 12h6M7 15h8" />
      </g>
    ),
  },
  {
    title: "Biological Complex Systems",
    meta: "Axis 03 · Life Sciences",
    body:
      "Morphogenesis, immune learning, neural development, and the regulatory architectures of living matter — treated as problems in statistical mechanics and learning theory.",
    glyph: (
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="3.2" />
        <circle cx="4" cy="6" r="1.6" />
        <circle cx="20" cy="6" r="1.6" />
        <circle cx="4" cy="18" r="1.6" />
        <circle cx="20" cy="18" r="1.6" />
        <path d="M12 8.8V5.2M12 15.2v2.6M9.6 12H5.4M14.4 12h3.6M6.6 7.6l1.7 1.5M16.4 14.9l1.7 1.5M6.6 16.4l1.7-1.5M16.4 9.1l1.7-1.5" />
      </g>
    ),
  },
  {
    title: "Social & Economic Complexity",
    meta: "Axis 04 · Distributed Systems",
    body:
      "Markets as distributed message-passing; institutions as equilibria; cooperation, conventions, and collapse. We bring formal tools to questions traditionally left to narrative.",
    glyph: (
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="6" cy="6" r="1.6" />
        <circle cx="18" cy="6" r="1.6" />
        <circle cx="6" cy="18" r="1.6" />
        <circle cx="18" cy="18" r="1.6" />
        <circle cx="12" cy="12" r="2.4" />
        <path d="M7.2 7.2l3.6 3.6M16.8 7.2l-3.6 3.6M7.2 16.8l3.6-3.6M16.8 16.8l-3.6-3.6" />
      </g>
    ),
  },
  {
    title: "Foundations of Inference",
    meta: "Axis 05 · Causality",
    body:
      "Causal identification under deep uncertainty, decision theory, and the epistemology of model-based reasoning. What can be known when the model itself is in question?",
    glyph: (
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="6" cy="12" r="2.4" />
        <circle cx="18" cy="12" r="2.4" />
        <path d="M8.4 12h7.2" />
        <path d="M14 9l3 3-3 3" />
      </g>
    ),
  },
]

export function CapabilitiesSection() {
  return (
    <section
      id="axes"
      aria-labelledby="axes-heading"
      className="relative isolate overflow-hidden border-t border-border/70 bg-card/20"
    >
      <div className="bg-grid-fine pointer-events-none absolute inset-0 opacity-40" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32">
        <Reveal>
          <SectionHeading
            eyebrow="Research axes"
            title={
              <span id="axes-heading">
                Five axes, one question.
              </span>
            }
            description="SN-X is organised around five research axes. They are not silos — most of our work crosses two or three of them. The question is the same in every case: how do simple rules give rise to rich behaviour?"
          />
        </Reveal>

        <ul
          role="list"
          className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {axes.map((a, i) => (
            <li key={a.title}>
              <Reveal delay={i * 80}>
                <AxisCard axis={a} index={i} />
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function AxisCard({ axis, index }: { axis: Axis; index: number }) {
  return (
    <article
      className={cn(
        "group relative h-full overflow-hidden rounded-2xl border border-border bg-card/70 p-7 sm:p-8",
        "transition-all duration-500 ease-out-expo",
        "hover:border-accent/45 hover:shadow-[0_24px_80px_-32px_color-mix(in_oklch,var(--accent)_45%,transparent)]",
        "hover:-translate-y-0.5",
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in oklch, var(--accent) 6%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklch, var(--accent) 6%, transparent) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage:
            "radial-gradient(ellipse 80% 80% at 30% 0%, #000 30%, transparent 80%)",
        }}
      />

      <div className="relative flex items-start gap-5">
        <span
          aria-hidden
          className={cn(
            "flex size-12 shrink-0 items-center justify-center rounded-xl",
            "border border-border bg-background/60 text-accent",
            "transition-colors duration-500 ease-out-expo",
            "group-hover:border-accent/60 group-hover:text-accent",
          )}
        >
          <svg
            viewBox="0 0 24 24"
            width="22"
            height="22"
            role="img"
            aria-label={`${axis.title} icon`}
          >
            {axis.glyph}
          </svg>
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              {axis.meta}
            </p>
            <span className="font-display text-[10px] text-muted-foreground/60">
              №{String(index + 1).padStart(2, "0")}
            </span>
          </div>
          <h3 className="mt-2 text-display-md font-display text-foreground">
            {axis.title}
          </h3>
          <p className="mt-3 max-w-prose text-sm leading-relaxed text-muted-foreground sm:text-base">
            {axis.body}
          </p>
        </div>
      </div>

      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-100"
      />
    </article>
  )
}

// `researchAxes` import kept for future editorial surfaces.
void researchAxes