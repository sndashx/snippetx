"use client"

import Link from "next/link"
import { useEffect } from "react"
import { labName } from "@/lib/brand"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="relative flex min-h-[70vh] flex-col items-center justify-center px-6 py-24 text-center">
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-60"
        aria-hidden
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,color-mix(in_oklch,var(--accent)_14%,transparent)_0%,transparent_60%)]" />
      </div>

      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
        {labName} · Error
      </p>
      <h2 className="mt-6 max-w-2xl text-balance font-display text-4xl leading-[1.1] tracking-tight text-foreground sm:text-6xl">
        Something <em className="text-accent">failed</em>.
      </h2>
      <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
        An unexpected error occurred while rendering this page. You can retry,
        or head back home and try a different route.
      </p>
      {error.digest ? (
        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground/70">
          ref · {error.digest}
        </p>
      ) : null}
      <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-accent px-7 text-sm font-semibold text-background transition-all hover:neon-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border bg-card/40 px-7 text-sm font-semibold text-foreground backdrop-blur transition-colors hover:bg-card/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Back to homepage
        </Link>
      </div>
    </div>
  )
}