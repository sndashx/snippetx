"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface ModelSwitcherModel {
  name: string
  codename: string
  status: "flagship" | "available" | "preview"
  context?: string
  summary?: string
}

interface ModelSwitcherProps {
  models: readonly ModelSwitcherModel[]
  className?: string
}

/**
 * Accessible, controlled model switcher.
 *
 * - Renders as a radiogroup so AT users understand the relationship.
 * - Arrow keys move the active model; Home/End jump to ends; Enter/Space
 *   confirm (which we surface visually with a brief pulse).
 * - Selecting a sibling does NOT navigate — later beads may add real content
 *   per model.
 */
export function ModelSwitcher({ models, className }: ModelSwitcherProps) {
  const [activeIndex, setActiveIndex] = React.useState(0)
  const [pulseIndex, setPulseIndex] = React.useState<number | null>(null)
  const groupRef = React.useRef<HTMLDivElement>(null)

  const confirm = React.useCallback((i: number) => {
    setActiveIndex(i)
    setPulseIndex(i)
    window.setTimeout(() => {
      setPulseIndex((cur) => (cur === i ? null : cur))
    }, 600)
  }, [])

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const last = models.length - 1
    let next: number | null = null
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        next = activeIndex === last ? 0 : activeIndex + 1
        break
      case "ArrowLeft":
      case "ArrowUp":
        next = activeIndex === 0 ? last : activeIndex - 1
        break
      case "Home":
        next = 0
        break
      case "End":
        next = last
        break
      case "Enter":
      case " ":
        e.preventDefault()
        confirm(activeIndex)
        return
      default:
        return
    }
    e.preventDefault()
    if (next !== null) {
      setActiveIndex(next)
      const el = groupRef.current?.querySelector<HTMLButtonElement>(
        `[data-model-index="${next}"]`,
      )
      el?.focus()
    }
  }

  const active = models[activeIndex]

  return (
    <div
      className={cn(
        "glass-strong rounded-2xl p-5 sm:p-6",
        "shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)]",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent/60 opacity-75" />
            <span className="relative inline-flex size-2.5 rounded-full bg-accent" />
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Active model
          </span>
        </div>
        <span className="rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
          {active?.status ?? "—"}
        </span>
      </div>

      <div className="mt-5 flex items-baseline gap-3">
        <h3 className="font-display text-3xl leading-none tracking-tight text-foreground sm:text-4xl">
          {active?.name}
        </h3>
        <span className="font-mono text-xs text-muted-foreground">
          {active?.codename}
        </span>
      </div>

      {active?.summary ? (
        <p className="mt-3 max-w-prose text-sm leading-relaxed text-muted-foreground">
          {active.summary}
        </p>
      ) : null}

      {active?.context ? (
        <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-border/60 pt-4">
          <div>
            <dt className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
              Context
            </dt>
            <dd className="mt-1 font-display text-lg tracking-tight text-foreground">
              {active.context}
            </dd>
          </div>
          <div>
            <dt className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
              Family
            </dt>
            <dd className="mt-1 font-display text-lg tracking-tight text-foreground">
              {models.length} models
            </dd>
          </div>
        </dl>
      ) : null}

      <div
        ref={groupRef}
        role="radiogroup"
        aria-label="Select model in the M3 family"
        onKeyDown={onKeyDown}
        className="mt-6 flex flex-wrap gap-2"
      >
        {models.map((m, i) => {
          const isActive = i === activeIndex
          const isPulsing = pulseIndex === i
          return (
            <button
              key={m.codename}
              type="button"
              role="radio"
              aria-checked={isActive}
              data-model-index={i}
              tabIndex={isActive ? 0 : -1}
              onClick={() => confirm(i)}
              className={cn(
                "group relative inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5",
                "font-mono text-xs tracking-tight transition-all duration-300",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                isActive
                  ? "border-accent/60 bg-accent/10 text-foreground"
                  : "border-border bg-card/40 text-muted-foreground hover:border-foreground/30 hover:text-foreground",
                isPulsing && "ring-2 ring-accent/70",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "inline-block size-1.5 rounded-full transition-colors",
                  isActive ? "bg-accent" : "bg-muted-foreground/50",
                )}
              />
              <span>{m.codename}</span>
              {m.status === "flagship" ? (
                <span className="rounded-full border border-accent/40 px-1.5 py-px text-[9px] uppercase tracking-[0.16em] text-accent">
                  Flagship
                </span>
              ) : null}
            </button>
          )
        })}
      </div>
    </div>
  )
}