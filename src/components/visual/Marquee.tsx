"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface MarqueeProps {
  items: React.ReactNode[]
  direction?: "left" | "right"
  duration?: number
  pauseOnHover?: boolean
  className?: string
}

export function Marquee({
  items,
  direction = "left",
  duration = 32,
  pauseOnHover = true,
  className,
}: MarqueeProps) {
  const content = (
    <>
      {items.map((item, i) => (
        <span
          key={i}
          className="mx-6 inline-flex items-center gap-3 whitespace-nowrap text-lg text-muted-foreground"
        >
          {item}
        </span>
      ))}
    </>
  )

  return (
    <div className={cn("relative flex w-full overflow-hidden mask-fade-x", className)} aria-hidden>
      <div
        className={cn(
          "marquee flex shrink-0",
          pauseOnHover && "marquee-paused",
          direction === "right" && "marquee-reverse",
        )}
        style={{ ["--marquee-duration" as string]: `${duration}s` }}
      >
        {content}
        {content}
      </div>
    </div>
  )
}
