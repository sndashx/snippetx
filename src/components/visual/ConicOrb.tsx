"use client"

import * as React from "react"
import { useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

export interface ConicOrbProps {
  /** Diameter in pixels. */
  size?: number
  /** Opacity of the glow (0–1). */
  intensity?: number
  /** Hue rotation in radians. */
  hueShift?: number
  /** Full rotation duration in seconds. */
  speed?: number
  className?: string
}

export function ConicOrb({
  size = 320,
  intensity = 0.6,
  hueShift = 0,
  speed = 14,
  className,
}: ConicOrbProps) {
  const reduce = useReducedMotion()

  return (
    <div
      className={cn("pointer-events-none relative", className)}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <div
        className={cn("orb-spin absolute inset-0 rounded-full blur-3xl", !reduce && "animate-spin")}
        style={{
          animationDuration: `${speed}s`,
          background:
            "conic-gradient(from 0deg, var(--brand-1), var(--brand-3), var(--brand-2), var(--brand-1))",
          opacity: intensity,
          filter: `hue-rotate(${hueShift}rad)`,
        }}
      />
    </div>
  )
}
