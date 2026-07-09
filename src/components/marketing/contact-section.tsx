import Link from "next/link"
import { Mail } from "lucide-react"
import { Reveal } from "@/components/marketing/reveal"
import { SectionHeading } from "@/components/visual/SectionHeading"
import { ContactForm } from "@/components/marketing/contact-form"

export function ContactSection() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative border-t border-border/70"
    >
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32">
        <Reveal>
          <SectionHeading
            eyebrow="Get in touch"
            title={<span id="contact-heading">Talk to the lab.</span>}
            description="Research collaborations, enterprise pilots, press, or a sharp question about the system card — we'd like to hear from you."
          />
        </Reveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal delay={50}>
            <aside className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/60 p-7 sm:p-8">
              <span
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-accent/15 blur-3xl"
              />
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
                Direct line
              </p>
              <h3 className="mt-3 text-display-md font-display text-foreground">
                Email the lab
              </h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                Prefer a direct line? Drop us a note and a member of the team
                will route it to the right desk.
              </p>
              <Link
                href="mailto:hello@minimax.ai"
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-background/40 px-4 py-2 font-mono text-sm text-foreground transition-colors hover:border-accent/40 hover:bg-accent/5"
              >
                <Mail className="size-4 text-accent" aria-hidden />
                hello@minimax.ai
              </Link>

              <dl className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-border/70 bg-background/30 p-4">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    Press
                  </dt>
                  <dd className="mt-2 text-sm text-foreground">press@minimax.ai</dd>
                </div>
                <div className="rounded-xl border border-border/70 bg-background/30 p-4">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    Careers
                  </dt>
                  <dd className="mt-2 text-sm text-foreground">careers@minimax.ai</dd>
                </div>
              </dl>

              <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                San Francisco · London · Singapore
              </p>
            </aside>
          </Reveal>

          <Reveal delay={100}>
            <div className="relative">
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}