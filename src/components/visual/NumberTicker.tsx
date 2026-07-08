"use client"

import * as React from "react"
import { useInView, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

export interface NumberTickerProps {
  value: number
  /** "plain" shows the raw number; "compact" abbreviates with K/M/B/T. */
  format?: "plain" | "compact"
  prefix?: string
  suffix?: string
  decimals?: number
  duration?: number
  className?: string
}

function compact(n: number): { num: number; suffix: string } {
  const abs = Math.abs(n)
  if (abs >= 1e12) return { num: n / 1e12, suffix: "T" }
  if (abs >= 1e9) return { num: n / 1e9, suffix: "B" }
  if (abs >= 1e6) return { num: n / 1e6, suffix: "M" }
  if (abs >= 1e3) return { num: n / 1e3, suffix: "K" }
  return { num: n, suffix: "" }
}

export function NumberTicker({
  value,
  format = "plain",
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1800,
  className,
}: NumberTickerProps) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  const reduce = useReducedMotion()
  const [display, setDisplay] = React.useState(reduce ? value : 0)

  React.useEffect(() => {
    if (!inView || reduce) return
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(value * eased)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, value, duration, reduce])

  let text: string
  if (format === "compact") {
    const { num, suffix: s } = compact(display)
    const d = decimals > 0 ? decimals : Number.isInteger(num) ? 0 : 1
    text = `${prefix}${num.toLocaleString(undefined, {
      minimumFractionDigits: d,
      maximumFractionDigits: d,
    })}${s}${suffix}`
  } else {
    text = `${prefix}${display.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}${suffix}`
  }

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {text}
    </span>
  )
}
