"use client"

import * as React from "react"
import { useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

export interface TypewriterProps {
  /** A single string, or an array of phrases to cycle through. */
  text: string | string[]
  /** Milliseconds per character. */
  speed?: number
  /** Milliseconds before typing begins. */
  startDelay?: number
  /** Cycle through phrases indefinitely. */
  loop?: boolean
  /** Show a blinking cursor. */
  cursor?: boolean
  className?: string
}

export function Typewriter({
  text,
  speed = 60,
  startDelay = 0,
  loop = false,
  cursor = true,
  className,
}: TypewriterProps) {
  const reduce = useReducedMotion()
  const phrases = React.useMemo(() => (Array.isArray(text) ? text : [text]), [text])
  const [phraseIndex, setPhraseIndex] = React.useState(0)
  const [count, setCount] = React.useState(
    reduce ? (Array.isArray(text) ? text[0].length : text.length) : 0,
  )
  const [deleting, setDeleting] = React.useState(false)

  React.useEffect(() => {
    if (reduce) return
    const current = phrases[phraseIndex]
    let timer: ReturnType<typeof setTimeout>
    if (!deleting && count === current.length) {
      if (!loop) return
      timer = setTimeout(() => setDeleting(true), 1400)
      return () => clearTimeout(timer)
    }
    const isFirst = !deleting && count === 0 && phraseIndex === 0 && startDelay > 0
    timer = setTimeout(
      () => {
        if (deleting && count === 0) {
          setDeleting(false)
          setPhraseIndex((i) => (i + 1) % phrases.length)
        } else {
          setCount((c) => (deleting ? c - 1 : c + 1))
        }
      },
      isFirst ? startDelay : deleting ? speed / 2 : speed,
    )
    return () => clearTimeout(timer)
  }, [phraseIndex, count, deleting, reduce, speed, startDelay, loop, phrases])

  const current = phrases[phraseIndex]

  return (
    <span className={cn("inline-flex", className)} role="text" aria-label={current}>
      <span aria-hidden>{current.slice(0, reduce ? current.length : count)}</span>
      {cursor && (
        <span className="ml-0.5 inline-block w-[1ch] animate-pulse text-brand-2" aria-hidden>
          |
        </span>
      )}
    </span>
  )
}
