"use client"

import * as React from "react"
import { useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

export interface LogoWordmarkProps {
  /** Height of the wordmark in pixels. */
  size?: number
  /** Animate the flowing gradient sweep. */
  animated?: boolean
  className?: string
}

export function LogoWordmark({ size = 28, animated = true, className }: LogoWordmarkProps) {
  const reduce = useReducedMotion()
  const animate = animated && !reduce
  const rawId = React.useId()
  const id = `numina-${rawId.replace(/[:]/g, "")}`
  const width = Math.round(size * (200 / 48))

  return (
    <svg
      className={cn("text-foreground", className)}
      width={width}
      height={size}
      viewBox="0 0 200 48"
      role="img"
      aria-label="NUMINA"
    >
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--brand-1)" />
          <stop offset="50%" stopColor="var(--brand-2)" />
          <stop offset="100%" stopColor="var(--brand-3)" />
          {animate && (
            <>
              <animate attributeName="x1" from="-100%" to="100%" dur="4s" repeatCount="indefinite" />
              <animate attributeName="x2" from="0%" to="200%" dur="4s" repeatCount="indefinite" />
            </>
          )}
        </linearGradient>
      </defs>
      <text
        x="0"
        y="36"
        fontSize="40"
        fontWeight="700"
        letterSpacing="2"
        fill={`url(#${id})`}
        fontFamily="var(--font-heading), ui-sans-serif, system-ui, sans-serif"
      >
        NUMINA
      </text>
    </svg>
  )
}
