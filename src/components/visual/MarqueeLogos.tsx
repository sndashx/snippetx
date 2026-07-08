"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface MarqueeLogosProps {
  items: React.ReactNode[]
  direction?: "up" | "down"
  /** Seconds for one full loop. */
  duration?: number
  pauseOnHover?: boolean
  /** Number of duplicated copies used to create a seamless loop. */
  repeat?: number
  className?: string
}

export function MarqueeLogos({
  items,
  direction = "up",
  duration = 24,
  pauseOnHover = true,
  repeat = 2,
  className,
}: MarqueeLogosProps) {
  const content = (
    <ul className="flex flex-col">
      {items.map((item, i) => (
        <li key={i} className="flex items-center justify-center py-3 text-muted-foreground">
          {item}
        </li>
      ))}
    </ul>
  )

  return (
    <div className={cn("relative flex w-full overflow-hidden mask-fade-y", className)} aria-hidden>
      <div
        className={cn(
          "marquee-vertical",
          pauseOnHover && "marquee-vertical-paused",
          direction === "down" && "marquee-vertical-reverse",
        )}
        style={{ ["--marquee-duration" as string]: `${duration}s` }}
      >
        {Array.from({ length: repeat }).map((_, i) => (
          <div key={i} className="flex flex-col">
            {content}
          </div>
        ))}
      </div>
    </div>
  )
}
