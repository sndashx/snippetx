"use client"

import { motion } from "framer-motion"
import { Zap, Rocket, ArrowRight } from "lucide-react"
import Link from "next/link"

function contactHref(snippetId?: string, snippetTitle?: string) {
  const params = new URLSearchParams()
  if (snippetId) params.set("snippet", snippetId)
  if (snippetTitle) params.set("title", snippetTitle)
  const qs = params.toString()
  return qs ? `/contact?${qs}` : "/contact"
}

export function IntegrationBanner({
  snippetId,
  snippetTitle,
}: {
  snippetId?: string
  snippetTitle?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Link
        href={contactHref(snippetId, snippetTitle)}
        className="group relative block overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-amber-500/10 p-4 transition-all hover:border-amber-500/60 hover:shadow-lg hover:shadow-amber-500/10 sm:p-5"
      >
        {/* Animated background shimmer */}
        <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_0%,rgba(251,191,36,0.08)_50%,transparent_100%)] bg-[length:200%_100%] animate-[shimmer_4s_ease-in-out_infinite]" />

        <div className="relative flex items-start gap-3 sm:items-center sm:gap-4">
          <div className="flex shrink-0 size-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-500">
            <Rocket className="size-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="flex items-center gap-1.5 text-sm font-bold text-amber-500 sm:text-base">
              Need this integrated fast?
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </p>
            <p className="mt-0.5 text-xs leading-relaxed text-amber-200/80 sm:text-sm">
              Get end-to-end implementation within <strong className="text-amber-300">24 hours</strong> for a flat{" "}
              <strong className="text-amber-300">$250 fee</strong>. Contact us and we&apos;ll handle the wiring.
            </p>
          </div>
          <div className="hidden shrink-0 sm:flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3.5 py-1.5 border border-amber-500/20">
            <Zap className="size-3.5 text-amber-500" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-500">
              Contact Me
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export function IntegrationBadge({
  compact,
  snippetId,
  snippetTitle,
}: {
  compact?: boolean
  snippetId?: string
  snippetTitle?: string
}) {
  if (compact) {
    return (
      <div className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 border border-amber-500/20">
        <Rocket className="size-2.5 text-amber-500" />
        <span className="text-[9px] font-bold text-amber-500 whitespace-nowrap">
          Integrate in 24h – $250
        </span>
      </div>
    )
  }

  return (
    <Link
      href={contactHref(snippetId, snippetTitle)}
      className="group flex items-center gap-2 rounded-lg bg-amber-500/10 px-3.5 py-2.5 border border-amber-500/20 transition-all hover:bg-amber-500/20 hover:border-amber-500/40"
    >
      <Rocket className="size-4 text-amber-500 shrink-0" />
      <div className="text-xs leading-snug text-amber-200/90">
        <span className="font-bold text-amber-300">Need it integrated?</span>{" "}
        <span className="font-bold text-amber-300">Flat $250</span> — delivered{" "}
        <span className="font-semibold text-amber-300">within 24 hours</span>
      </div>
      <ArrowRight className="size-3.5 text-amber-500 shrink-0 transition-transform group-hover:translate-x-0.5" />
    </Link>
  )
}
