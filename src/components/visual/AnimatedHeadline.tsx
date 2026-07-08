"use client"

import * as React from "react"
import { motion, useReducedMotion, type Variants } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedHeadlineProps {
  text: string
  as?: "h1" | "h2" | "h3"
  className?: string
  gradientWords?: string[]
  delay?: number
}

export function AnimatedHeadline({
  text,
  as = "h1",
  className,
  gradientWords = [],
  delay = 0,
}: AnimatedHeadlineProps) {
  const reduce = useReducedMotion()
  const words = text.split(" ")
  const Tag = motion[as]

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: delay } },
  }
  const child: Variants = {
    hidden: reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 24, filter: "blur(8px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: [0.21, 0.5, 0.2, 1] } },
  }

  return (
    <Tag
      className={cn("font-heading font-bold tracking-tight", className)}
      variants={container}
      initial="hidden"
      animate="show"
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span className="inline-block" variants={child}>
            <span className={gradientWords.includes(word) ? "text-gradient" : undefined}>{word}</span>
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}
