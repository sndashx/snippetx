"use client"

import { useEffect, useRef, useState } from "react"
import { animate, useInView, useReducedMotion } from "framer-motion"

interface StatCounterProps {
  value: number
  label: string
  prefix?: string
  suffix?: string
  decimals?: number
  className?: string
}

export function StatCounter({
  value,
  label,
  prefix = "",
  suffix = "",
  decimals = 0,
  className,
}: StatCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const reduce = useReducedMotion()
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView || reduce) return
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(v),
    })
    return () => controls.stop()
  }, [inView, value, reduce])

  const shown = reduce ? value : display
  const formatted = shown.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

  return (
    <div className={className}>
      <div className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
        <span ref={ref} className="text-gradient tabular-nums">
          {prefix}
          {formatted}
          {suffix}
        </span>
      </div>
      <div className="mt-2 text-sm text-muted-foreground">{label}</div>
    </div>
  )
}
