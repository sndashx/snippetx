"use client"

import * as React from "react"
import { useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

export interface GradientBorderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Border thickness in pixels. */
  size?: number
  /** Opacity of the gradient ring (0–1). */
  intensity?: number
  /** Corner radius in pixels. */
  radius?: number
  children: React.ReactNode
}

export function GradientBorder({
  className,
  size = 1,
  intensity = 0.8,
  radius = 16,
  children,
  ...props
}: GradientBorderProps) {
  const reduce = useReducedMotion()

  return (
    <div className={cn("relative", className)} style={{ borderRadius: radius, padding: size }} {...props}>
      <div
        aria-hidden
        className={cn(
          "gradient-spin pointer-events-none absolute inset-0 rounded-[inherit]",
          !reduce && "animate-spin",
        )}
        style={{
          animationDuration: "6s",
          background:
            "conic-gradient(from 0deg, var(--brand-1), var(--brand-3), var(--brand-2), var(--brand-1))",
          opacity: intensity,
          padding: size,
          WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          maskComposite: "exclude",
        }}
      />
      <div
        className="relative h-full w-full"
        style={{ borderRadius: Math.max(0, radius - size) }}
      >
        {children}
      </div>
    </div>
  )
}
