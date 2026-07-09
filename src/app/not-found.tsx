import Link from "next/link"
import { buildMetadata } from "@/lib/metadata"
import { labName } from "@/lib/brand"

export const metadata = buildMetadata({
  title: "Not found",
  description: `The page you are looking for does not exist on ${labName}.`,
  path: "/404",
})

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground">
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-60"
        aria-hidden
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,color-mix(in_oklch,var(--accent)_14%,transparent)_0%,transparent_60%)]" />
        <div className="grain absolute inset-0" />
      </div>

      <main
        id="main"
        className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
          Error · 404
        </p>
        <h1 className="mt-6 max-w-2xl text-balance font-display text-5xl leading-[1.05] tracking-tight text-foreground sm:text-7xl">
          This page is <em className="text-accent">off the lattice</em>.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          The page you are looking for does not exist, was renamed, or is still
          being trained. Head back to the {labName} homepage to keep exploring.
        </p>
        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-accent px-7 text-sm font-semibold text-background transition-all hover:neon-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Back to homepage
          </Link>
          <Link
            href="/research"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border bg-card/40 px-7 text-sm font-semibold text-foreground backdrop-blur transition-colors hover:bg-card/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Read research
          </Link>
        </div>
      </main>
    </div>
  )
}