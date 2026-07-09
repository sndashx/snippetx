"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * HeroCanvas — a subtle drifting mesh for the lab homepage.
 *
 * Implementation notes:
 * - CSS-only animation (keyframes + transform: translate3d) for cheap GPU paint.
 * - All motion is gated by `prefers-reduced-motion: reduce`. When reduced, we
 *   render a single static radial gradient (still on-brand, zero paint cost).
 * - The mesh is composed of three large blurred gradient blobs that drift at
 *   very slow speeds (40s+ cycles) so the frame cost is <1ms at 1080p.
 * - Pointer-events are disabled so the canvas is purely decorative.
 */
export function HeroCanvas({ className }: { className?: string }) {
  const [reduce, setReduce] = React.useState(false)

  React.useEffect(() => {
    if (typeof window === "undefined") return
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setReduce(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

  if (reduce) {
    return (
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
          className,
        )}
      >
        <div className="absolute inset-0 bg-background" />
        <div
          className="absolute left-1/2 top-[-20%] size-[120%] -translate-x-1/2"
          style={{
            background:
              "radial-gradient(45% 55% at 50% 40%, color-mix(in oklch, var(--accent) 14%, transparent), transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div className="absolute inset-0 bg-grid opacity-40" />
      </div>
    )
  }

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        className,
      )}
    >
      <div className="absolute inset-0 bg-background" />

      {/* Drifting mesh — three large blurred gradients, very slow cycles. */}
      <div
        className="absolute left-[-10%] top-[-10%] size-[55%] rounded-full opacity-60"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in oklch, var(--accent) 30%, transparent), transparent 70%)",
          filter: "blur(80px)",
          animation: "hero-mesh-a 48s var(--ease-in-out-expo) infinite",
          willChange: "transform",
        }}
      />
      <div
        className="absolute right-[-15%] top-[-5%] size-[60%] rounded-full opacity-50"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in oklch, var(--brand-2) 22%, transparent), transparent 70%)",
          filter: "blur(100px)",
          animation: "hero-mesh-b 64s var(--ease-in-out-expo) infinite",
          willChange: "transform",
        }}
      />
      <div
        className="absolute bottom-[-25%] left-[20%] size-[70%] rounded-full opacity-45"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in oklch, var(--brand-3) 22%, transparent), transparent 70%)",
          filter: "blur(110px)",
          animation: "hero-mesh-c 72s var(--ease-in-out-expo) infinite",
          willChange: "transform",
        }}
      />

      {/* Editorial grid overlay + grain for depth. */}
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute inset-0 grain opacity-[0.18] mix-blend-soft-light" />

      {/* Vignette to focus attention on the headline. */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/0 to-background" />

      <style jsx>{`
        @keyframes hero-mesh-a {
          0%   { transform: translate3d(0%, 0%, 0) scale(1); }
          50%  { transform: translate3d(8%, 6%, 0) scale(1.08); }
          100% { transform: translate3d(0%, 0%, 0) scale(1); }
        }
        @keyframes hero-mesh-b {
          0%   { transform: translate3d(0%, 0%, 0) scale(1); }
          50%  { transform: translate3d(-6%, 8%, 0) scale(1.12); }
          100% { transform: translate3d(0%, 0%, 0) scale(1); }
        }
        @keyframes hero-mesh-c {
          0%   { transform: translate3d(0%, 0%, 0) scale(1); }
          50%  { transform: translate3d(10%, -6%, 0) scale(1.1); }
          100% { transform: translate3d(0%, 0%, 0) scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          [data-hero-canvas-anim] { animation: none !important; }
        }
      `}</style>
    </div>
  )
}