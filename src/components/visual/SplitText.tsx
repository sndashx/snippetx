"use client"

import * as React from "react"
import { motion, useReducedMotion, type Variants } from "framer-motion"
import { cn } from "@/lib/utils"

type SplitTag = "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div"

export interface SplitTextProps {
  text: string
  as?: SplitTag
  /** Reveal unit: whole words (default) or individual characters. */
  by?: "word" | "char"
  /** Seconds between each unit's entrance. */
  staggerChildren?: number
  /** Seconds before the first unit animates. */
  delay?: number
  className?: string
}

export function SplitText({
  text,
  as = "div",
  by = "word",
  staggerChildren = 0.06,
  delay = 0,
  className,
}: SplitTextProps) {
  const reduce = useReducedMotion()
  const units = by === "char" ? Array.from(text) : text.split(" ")
  const Tag = motion[as]

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren, delayChildren: delay } },
  }
  const child: Variants = {
    hidden: reduce
      ? { opacity: 1, y: 0, filter: "blur(0px)" }
      : { opacity: 0, y: 20, filter: "blur(6px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.5, ease: [0.21, 0.5, 0.2, 1] },
    },
  }

  return (
    <Tag className={cn(className)} variants={container} initial="hidden" animate="show" aria-label={text}>
      {units.map((unit, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom" aria-hidden>
          <motion.span className="inline-block" variants={child}>
            {unit === " " ? " " : unit}
            {by === "word" && i < units.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}
