"use client"

import * as React from "react"
import { motion, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

interface RevealProps {
  as?: "div" | "section" | "li" | "article"
  className?: string
  children?: React.ReactNode
  delay?: number
  y?: number
  [key: string]: unknown
}

export function Reveal({ as = "div", className, children, delay = 0, y = 28, ...props }: RevealProps) {
  const reduce = useReducedMotion()
  const Tag = motion[as]
  return (
    <Tag
      className={cn(className)}
      initial={reduce ? { opacity: 1 } : { opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.21, 0.5, 0.2, 1] }}
      {...props}
    >
      {children}
    </Tag>
  )
}
