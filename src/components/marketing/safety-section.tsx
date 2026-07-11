import { Reveal } from "@/components/marketing/reveal"
import { SectionHeading } from "@/components/visual/SectionHeading"
import { labNameLong } from "@/lib/brand"

const commitments = [
  {
    title: "Open by default",
    body: "Pre-prints, instruments, and datasets are released under permissive licences at the moment of publication. We treat reproducibility as a research output, not an afterthought.",
  },
  {
    title: "Slow when it matters",
    body: "Resident fellows are protected from publication pressure. Work that takes a decade takes a decade. We do not incentivise quarterly output and we do not pretend it does not exist.",
  },
  {
    title: "Cross-discipline on purpose",
    body: "Most of our appointments are deliberately joint: a mathematician and a developmental biologist, a physicist and a historian of science. The axes cross — the corridors do too.",
  },
]

export function SafetySection() {
  return (
    <section
      id="method"
      aria-labelledby="method-heading"
      className="relative border-t border-border/70"
    >
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32">
        <Reveal>
          <SectionHeading
            eyebrow="Method"
            title={
              <span id="method-heading">How we work.</span>
            }
            description="A research institution is a method before it is a list of papers. Here is the method."
          />
        </Reveal>

        <Reveal delay={50}>
          <div className="mt-14 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div className="relative">
              <span
                aria-hidden
                className="absolute -left-3 -top-6 select-none font-display text-7xl text-accent/30 sm:-left-6 sm:text-8xl"
              >
                &ldquo;
              </span>
              <p className="font-display text-2xl leading-snug text-foreground sm:text-3xl">
                The institutions that have lasted were not the ones that
                answered the question first. They were the ones that picked
                the right question and stayed with it long enough to change
                the way the question was asked.
              </p>
              <p className="mt-6 font-mono text-xs uppercase tracking-[0.24em] text-muted-foreground">
                — {labNameLong}, founding charter, MMXXI
              </p>
            </div>

            <aside className="relative overflow-hidden rounded-2xl border border-border bg-card/60 p-7 sm:p-8">
              <span
                aria-hidden
                className="pointer-events-none absolute -right-12 -top-16 size-56 rounded-full bg-accent/15 blur-3xl"
              />
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-accent">
                Read the full charter
              </p>
              <h3 className="mt-3 text-display-md font-display text-foreground">
                The SN-X Charter
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Forty pages on what we study, how we appoint, how we publish,
                and what we will not do — including the kinds of funding we
                decline.
              </p>
              <ul className="mt-6 space-y-2 font-mono text-xs text-muted-foreground">
                <li>· Five research axes and their scope</li>
                <li>· The residential fellowship in detail</li>
                <li>· Publication and reproducibility commitments</li>
                <li>· Conflicts of interest and funding policy</li>
              </ul>
            </aside>
          </div>
        </Reveal>

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
                  <h3 className="mt-4 text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                    {c.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
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