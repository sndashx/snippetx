import { Reveal } from "@/components/visual/Reveal"
import { SectionHeading } from "@/components/visual/SectionHeading"
import { modelFlagship } from "@/lib/brand"
import { cn } from "@/lib/utils"

interface Capability {
  title: string
  body: string
  meta: string
  /** Inline SVG path data drawn into a 24×24 viewBox. */
  glyph: React.ReactNode
}

const capabilities: Capability[] = [
  {
    title: "Long-horizon reasoning",
    meta: "Reasoning · Planning",
    body: `${modelFlagship.name} holds a one-million-token window in working memory and plans across hundreds of steps without losing the goal. It commits to intermediate claims and recovers when they're falsified.`,
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
    title: "Native tool-use",
    meta: "Tools · Function calling",
    body: "Call typed functions across web, code, files, and your own APIs with verifiable execution traces. The model writes the schema, not just the call — and refuses when the contract is ambiguous.",
    glyph: (
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14.5 4.5l5 5-9.5 9.5H5v-5z" />
        <path d="M13 6l5 5" />
        <path d="M8.5 14.5l1.5 1.5" />
      </g>
    ),
  },
  {
    title: "Multimodal I/O",
    meta: "Vision · Audio · Text",
    body: "Reads documents, charts, screenshots, and photographs. Writes structured output — JSON, code, LaTeX, SVG — with the same fidelity it brings to prose.",
    glyph: (
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
        <circle cx="9" cy="10.5" r="1.6" />
        <path d="M4 16l4.5-4.5 4 4 3-3 4.5 4.5" />
      </g>
    ),
  },
  {
    title: "Deliberative agents",
    meta: "Multi-step · Self-recover",
    body: "Plans are scored against a learned world model before they touch the real environment. When a step fails, the agent revises its commitment instead of re-rolling the whole trace.",
    glyph: (
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 7h10" />
        <path d="M9 12h10" />
        <path d="M5 17h10" />
        <path d="M3 7h.01M7 12h.01M3 17h.01" />
        <path d="M19 4l2 2-7 7h-2v-2z" />
      </g>
    ),
  },
]

export function CapabilitiesSection() {
  return (
    <section
      id="capabilities"
      aria-labelledby="capabilities-heading"
      className="relative isolate overflow-hidden border-t border-border/70 bg-card/20"
    >
      <div className="bg-grid-fine pointer-events-none absolute inset-0 opacity-40" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32">
        <Reveal>
          <SectionHeading
            eyebrow="Capabilities"
            title={
              <span id="capabilities-heading">
                What {modelFlagship.name} can do
              </span>
            }
            description="A frontier model isn't defined by a benchmark number — it's defined by the kinds of work it can carry end-to-end. Here are the four we care about most."
          />
        </Reveal>

        <ul
          role="list"
          className="mt-14 grid gap-5 sm:grid-cols-2"
        >
          {capabilities.map((c, i) => (
            <li key={c.title}>
              <Reveal delay={i * 0.08}>
                <CapabilityCard capability={c} />
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function CapabilityCard({ capability }: { capability: Capability }) {
  return (
    <article
      className={cn(
        "group relative h-full overflow-hidden rounded-2xl border border-border bg-card/70 p-7 sm:p-8",
        "transition-all duration-500 ease-out-expo",
        "hover:border-accent/45 hover:shadow-[0_24px_80px_-32px_color-mix(in_oklch,var(--accent)_45%,transparent)]",
        "hover:-translate-y-0.5",
      )}
    >
      {/* Faint grid wash on hover */}
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
            aria-label={`${capability.title} icon`}
          >
            {capability.glyph}
          </svg>
        </span>

        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            {capability.meta}
          </p>
          <h3 className="mt-2 text-display-md font-display text-foreground">
            {capability.title}
          </h3>
          <p className="mt-3 max-w-prose text-sm leading-relaxed text-muted-foreground sm:text-base">
            {capability.body}
          </p>
        </div>
      </div>

      {/* Bottom hairline that brightens on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-100"
      />
    </article>
  )
}