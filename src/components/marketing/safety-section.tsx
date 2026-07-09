import { Reveal } from "@/components/marketing/reveal"
import { SectionHeading } from "@/components/visual/SectionHeading"
import { labNameLong } from "@/lib/brand"

const commitments = [
  {
    title: "Build safety in, not on",
    body: "Safety properties are designed into the training objective. We do not bolt filters onto a finished system and call it aligned — we ship models whose behaviour emerges from how they were trained.",
  },
  {
    title: "Evaluate honestly, in public",
    body: "Every release ships with an open evaluation suite covering capability, jailbreak resistance, and domain-specific risks. When we find failure modes, we publish them before we patch them.",
  },
  {
    title: "Keep humans meaningfully in the loop",
    body: "As agents grow more capable, the human role shifts from operator to reviewer. We design for that — clear commitments, legible traces, and refusal paths that respect operator intent.",
  },
]

export function SafetySection() {
  return (
    <section
      id="safety"
      aria-labelledby="safety-heading"
      className="relative border-t border-border/70"
    >
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32">
        <Reveal>
          <SectionHeading
            eyebrow="Safety & alignment"
            title={
              <span id="safety-heading">Power, earned through rigor.</span>
            }
            description="We treat safety as a research problem, not a compliance checklist. Here is what we owe the people who use our models — and the people who don't."
          />
        </Reveal>

        {/* Manifesto */}
        <Reveal delay={50}>
          <div className="mt-14 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div className="relative">
              <span
                aria-hidden
                className="absolute -left-3 -top-6 select-none font-display text-7xl text-accent/30 sm:-left-6 sm:text-8xl"
              >
                &ldquo;
              </span>
              <p className="dropcap font-display text-balance text-2xl leading-snug text-foreground sm:text-3xl">
                A model that can do more can also be misused more. The honest
                answer is not fewer capabilities — it is better measurements,
                better refusal paths, and a research culture that treats
                alignment as the load-bearing wall, not the wallpaper.
              </p>
              <p className="mt-6 text-eyebrow">
                — {labNameLong}, Safety manifesto
              </p>
            </div>

            <aside className="relative overflow-hidden rounded-2xl border border-border bg-card/60 p-7 sm:p-8">
              <span
                aria-hidden
                className="pointer-events-none absolute -right-12 -top-16 size-56 rounded-full bg-accent/15 blur-3xl"
              />
              <p className="text-eyebrow text-accent">
                Read the full position
              </p>
              <h3 className="mt-3 text-display-md text-balance">
                The minimax Safety Charter
              </h3>
              <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">
                Twelve pages on how we evaluate, when we decline, and how we
                communicate model limits to operators and the public.
              </p>
              <ul className="mt-6 space-y-2 font-mono text-xs text-muted-foreground">
                <li>· Capability, refusal, and jailbreak benchmarks</li>
                <li>· Pre-deployment red-team protocol</li>
                <li>· External review and disclosure commitments</li>
                <li>· Incident response and rollback policy</li>
              </ul>
            </aside>
          </div>
        </Reveal>

        {/* Numbered commitments */}
        <ol
          role="list"
          className="mt-20 grid gap-px overflow-hidden rounded-2xl border border-border/70 bg-border/60 md:grid-cols-3"
        >
          {commitments.map((c, i) => (
            <li key={c.title} className="bg-card/70">
              <Reveal delay={i * 80}>
                <article className="relative h-full p-7 sm:p-8">
                  <span
                    aria-hidden
                    className="select-none font-display text-6xl text-accent/55 sm:text-7xl"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 text-balance text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                    {c.title}
                  </h3>
                  <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {c.body}
                  </p>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}