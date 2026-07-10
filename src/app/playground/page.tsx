"use client"

import { useEffect, useRef, useState, useCallback, type FormEvent } from "react"
import { ArrowUp, Sparkles, Square, RotateCcw, Cpu, Thermometer } from "lucide-react"
import { modelFlagship } from "@/lib/brand"
import { cn } from "@/lib/utils"

interface ModelChoice {
  id: string
  label: string
  hint: string
}

const models: ModelChoice[] = [
  { id: modelFlagship.name, label: modelFlagship.name, hint: "Flagship · 1M ctx" },
  { id: "minimax M3-mini", label: "minimax M3-mini", hint: "Workhorse · 256k ctx" },
  { id: "minimax M3-nano", label: "minimax M3-nano", hint: "Fast · 3B sparse-MoE" },
]

const examplePrompts = [
  {
    label: "Explain deliberation",
    text:
      "Explain deliberative alignment in one short paragraph — assume the reader is a policy researcher.",
  },
  {
    label: "Refactor to async",
    text:
      "Refactor this Python function to be fully async and add type hints:\n\ndef fetch_users(ids):\n    return [db.get(i) for i in ids]",
  },
  {
    label: "Haiku about routing",
    text: "Write a haiku about gradient routing in mixture-of-experts models.",
  },
] as const

const placeholders = [
  "Explain deliberative rollouts in one paragraph.",
  "Write a haiku about gradient routing.",
  "Refactor this Python function to be async…",
  "Draft a status update for the M3 launch.",
  "Summarise the safety properties of M3.",
]

const THINKING_PHRASES = [
  "Thinking",
  "Considering",
  "Composing",
  "Routing",
  "Drafting",
]

export default function PlaygroundPage() {
  const [model, setModel] = useState<string>(modelFlagship.name)
  const [temperature, setTemperature] = useState(0.7)
  const [prompt, setPrompt] = useState("")
  const [response, setResponse] = useState("")
  const [streaming, setStreaming] = useState(false)
  const [thinking, setThinking] = useState(false)
  const [thinkingPhrase, setThinkingPhrase] = useState(THINKING_PHRASES[0])
  const [stubMessage, setStubMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [tokenCount, setTokenCount] = useState(0)
  const [charsPerSec, setCharsPerSec] = useState(0)
  const abortRef = useRef<AbortController | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const responseScrollRef = useRef<HTMLDivElement | null>(null)
  const startTimeRef = useRef<number>(0)
  const [placeholderIdx, setPlaceholderIdx] = useState(0)
  const [userScrolled, setUserScrolled] = useState(false)

  useEffect(() => {
    if (prompt) return
    const id = setInterval(
      () => setPlaceholderIdx((i) => (i + 1) % placeholders.length),
      4000,
    )
    return () => clearInterval(id)
  }, [prompt])

  useEffect(() => {
    if (!thinking) return
    const id = setInterval(() => {
      setThinkingPhrase(
        THINKING_PHRASES[Math.floor(Math.random() * THINKING_PHRASES.length)],
      )
    }, 1400)
    return () => clearInterval(id)
  }, [thinking])

  // Smooth auto-scroll while streaming, unless the user has scrolled up to read.
  useEffect(() => {
    if (!streaming) return
    const el = responseScrollRef.current
    if (!el) return
    if (userScrolled) return
    const id = requestAnimationFrame(() => {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" })
    })
    return () => cancelAnimationFrame(id)
  }, [response, streaming, userScrolled])

  // Live chars/sec meter — averages over the last second of streaming.
  useEffect(() => {
    if (!streaming) return
    const id = setInterval(() => {
      const elapsed = (performance.now() - startTimeRef.current) / 1000
      if (elapsed > 0.05) {
        setCharsPerSec(response.length / elapsed)
      }
    }, 500)
    return () => clearInterval(id)
  }, [streaming, response])

  const handleResponseScroll = useCallback(() => {
    const el = responseScrollRef.current
    if (!el) return
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
    // If the user is reading prior content (scrolled > 60px from the bottom),
    // pause auto-scroll until they return to the bottom.
    if (distFromBottom > 60) {
      setUserScrolled(true)
    } else {
      setUserScrolled(false)
    }
  }, [])

  const stop = useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
    setStreaming(false)
    setThinking(false)
  }, [])

  const reset = useCallback(() => {
    stop()
    setResponse("")
    setError(null)
    setStubMessage(null)
    setPrompt("")
    setTokenCount(0)
    setCharsPerSec(0)
    textareaRef.current?.focus()
  }, [stop])

  const submit = useCallback(
    async (e?: FormEvent, overridePrompt?: string) => {
      e?.preventDefault()
      if (streaming) return
      const text = (overridePrompt ?? prompt).trim()
      if (!text) return
      if (overridePrompt !== undefined) setPrompt(overridePrompt)
      setError(null)
      setStubMessage(null)
      setResponse("")
      setTokenCount(0)
      setCharsPerSec(0)
      setThinking(true)
      setStreaming(true)
      startTimeRef.current = performance.now()
      setUserScrolled(false)

      const ctrl = new AbortController()
      abortRef.current = ctrl
      try {
        const res = await fetch("/api/playground", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: text, model, temperature }),
          signal: ctrl.signal,
        })
        if (!res.ok || !res.body) {
          throw new Error(`Request failed: ${res.status}`)
        }
        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let buf = ""
        while (true) {
          const { value, done } = await reader.read()
          if (done) break
          buf += decoder.decode(value, { stream: true })
          // SSE: events separated by a blank line.
          const events = buf.split("\n\n")
          buf = events.pop() ?? ""
          for (const evt of events) {
            // Each event: lines starting with "event:" and "data:".
            const line = evt.trim()
            if (!line) continue
            const dataLine = line
              .split("\n")
              .find((l) => l.startsWith("data:"))
            if (!dataLine) continue
            const payload = dataLine.slice(5).trim()
            try {
              const parsed = JSON.parse(payload) as {
                delta?: string
                done?: boolean
              }
              if (parsed.delta) {
                // First real token — drop the "thinking" state.
                setThinking(false)
                setResponse((prev) => prev + parsed.delta)
                setTokenCount((c) => c + 1)
              }
              if (parsed.done) {
                setStubMessage(
                  "Streaming complete. The /api/playground endpoint is a stub — wire it to the real provider to replace this response.",
                )
              }
            } catch {
              // Ignore malformed payloads — the stub is best-effort.
            }
          }
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          // User cancelled — leave the partial response on screen.
        } else {
          setError((err as Error).message ?? "Unknown error")
        }
      } finally {
        setStreaming(false)
        setThinking(false)
        abortRef.current = null
        setCharsPerSec(0)
      }
    },
    [prompt, model, temperature, streaming],
  )

  return (
    <div className="relative min-h-[100svh] bg-background text-foreground">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 pb-24 pt-28 sm:pt-36 lg:pt-32">
        <header className="flex flex-col gap-2">
          <p className="text-eyebrow">Playground · STUB</p>
          <h1 className="text-display-md text-balance text-foreground">
            Talk to {modelFlagship.name}.
          </h1>
          <p className="max-w-2xl text-pretty text-base text-muted-foreground">
            Streaming chat UI that demonstrates how the production endpoint
            will feel. The backend is a stub that emits a placeholder response.
          </p>
        </header>

        {/* Controls */}
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card/40 p-4 sm:flex-row sm:items-end sm:gap-5 sm:p-5">
          <div className="flex flex-1 flex-col gap-1.5">
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              <Cpu className="size-3" aria-hidden />
              Model
            </span>
            <ModelSelect
              value={model}
              onChange={setModel}
              disabled={streaming}
              options={models}
            />
          </div>

          <div className="flex flex-col gap-1.5 sm:w-72">
            <span className="inline-flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Thermometer className="size-3" aria-hidden />
                Temperature
              </span>
              <span className="font-mono text-foreground/90 tabular-nums">
                {temperature.toFixed(2)}
              </span>
            </span>
            <TemperatureSlider
              value={temperature}
              onChange={setTemperature}
              disabled={streaming}
            />
          </div>

          <div className="flex items-center gap-2 sm:ml-auto">
            {streaming ? (
              <button
                type="button"
                onClick={stop}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-card/60 px-4 text-sm font-medium text-foreground transition-colors hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <Square className="size-3.5" />
                Stop
              </button>
            ) : (
              <button
                type="button"
                onClick={reset}
                disabled={!prompt && !response}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-card/60 px-4 text-sm font-medium text-foreground transition-colors hover:bg-card disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <RotateCcw className="size-3.5" />
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Two-pane */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Prompt */}
          <form
            onSubmit={submit}
            className="flex min-h-[28rem] flex-col rounded-2xl border border-border bg-card/30 p-5"
          >
            <label
              htmlFor="playground-prompt"
              className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
            >
              Prompt
            </label>
            <textarea
              id="playground-prompt"
              ref={textareaRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                  e.preventDefault()
                  submit()
                }
              }}
              placeholder={placeholders[placeholderIdx]}
              rows={12}
              disabled={streaming}
              className="mt-3 flex-1 resize-none rounded-xl border border-border bg-background/60 p-4 font-mono text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60"
            />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
              <span className="font-mono tabular-nums">
                {prompt.length.toLocaleString()} chars
              </span>
              <span className="font-mono">
                ⌘ / Ctrl + Enter to send
              </span>
            </div>

            {/* Example prompt chips — only visible while idle. */}
            {!streaming && !prompt && !response && (
              <div className="mt-4 flex flex-col gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  Try a prompt
                </span>
                <div className="flex flex-wrap gap-2">
                  {examplePrompts.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => submit(undefined, p.text)}
                      className="group inline-flex items-center gap-2 rounded-full border border-border bg-background/40 px-3 py-1.5 text-xs text-foreground/90 transition-all hover:border-accent/40 hover:bg-accent/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      <Sparkles
                        className="size-3 text-accent transition-transform group-hover:rotate-12"
                        aria-hidden
                      />
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={streaming || !prompt.trim()}
              className={cn(
                "mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition-all",
                "bg-accent text-background hover:neon-glow",
                "disabled:cursor-not-allowed disabled:opacity-40",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              )}
            >
              {streaming ? (
                <>
                  <Sparkles className="size-4 animate-pulse" />
                  Streaming…
                </>
              ) : (
                <>
                  Send
                  <ArrowUp className="size-4" />
                </>
              )}
            </button>
          </form>

          {/* Response */}
          <div
            aria-live="polite"
            aria-busy={streaming || thinking}
            className="relative flex min-h-[28rem] flex-col rounded-2xl border border-border bg-card/30 p-5"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Response
              </span>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                {streaming && (
                  <span className="inline-flex items-center gap-1.5 font-mono tabular-nums">
                    <span
                      aria-hidden
                      className="size-1.5 animate-pulse rounded-full bg-accent"
                    />
                    {Math.round(charsPerSec)} chars/s
                  </span>
                )}
                {response && (
                  <span className="font-mono tabular-nums">
                    {tokenCount} tok · {response.length.toLocaleString()} chars
                  </span>
                )}
              </div>
            </div>

            <div
              ref={responseScrollRef}
              onScroll={handleResponseScroll}
              className="relative mt-3 flex-1 overflow-auto rounded-xl border border-border bg-background/60 p-4"
            >
              {error ? (
                <p className="font-mono text-sm text-destructive">{error}</p>
              ) : thinking ? (
                <ThinkingState phrase={thinkingPhrase} />
              ) : response ? (
                <ResponseText text={response} streaming={streaming} />
              ) : (
                <EmptyState />
              )}
              {/* Cinematic edge fade */}
              <div
                aria-hidden
                className="pointer-events-none sticky bottom-0 -mx-4 -mb-4 h-8 bg-gradient-to-t from-background/90 to-transparent"
              />
            </div>

            {userScrolled && streaming && (
              <button
                type="button"
                onClick={() => {
                  setUserScrolled(false)
                  const el = responseScrollRef.current
                  el?.scrollTo({ top: el.scrollHeight, behavior: "smooth" })
                }}
                className="absolute bottom-20 right-7 inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-accent backdrop-blur-sm transition-colors hover:bg-accent/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <ArrowUp className="size-3" />
                Jump to live
              </button>
            )}

            {stubMessage && (
              <p className="mt-3 rounded-lg border border-accent/30 bg-accent/5 p-3 font-mono text-xs leading-relaxed text-accent">
                {stubMessage}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ───────────────────────── Sub-components ───────────────────────── */

function EmptyState() {
  return (
    <div className="flex h-full flex-col items-start justify-center gap-3 text-muted-foreground/70">
      <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em]">
        <span
          aria-hidden
          className="size-1.5 animate-pulse rounded-full bg-accent"
        />
        Awaiting prompt
      </div>
      <p className="font-mono text-sm">
        The assistant&apos;s reply will stream here, token by token.
      </p>
    </div>
  )
}

function ThinkingState({ phrase }: { phrase: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex h-full flex-col items-start justify-center gap-3"
    >
      <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
        <span>{phrase}</span>
        <span aria-hidden className="thinking-dots inline-flex gap-1">
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
        </span>
      </div>
      <p className="font-mono text-sm text-foreground/70">
        Spinning up{" "}
        <span className="text-accent">{modelFlagship.name}</span> and
        composing the first tokens…
      </p>
    </div>
  )
}

function ResponseText({
  text,
  streaming,
}: {
  text: string
  streaming: boolean
}) {
  return (
    <p
      className={cn(
        "whitespace-pre-wrap font-mono text-sm leading-relaxed text-foreground/90",
        streaming && "response-streaming",
      )}
    >
      {text}
      {streaming && <span aria-hidden className="caret" />}
    </p>
  )
}

function ModelSelect({
  value,
  onChange,
  disabled,
  options,
}: {
  value: string
  onChange: (v: string) => void
  disabled?: boolean
  options: ModelChoice[]
}) {
  const current = options.find((o) => o.id === value) ?? options[0]
  return (
    <div className="relative">
      <select
        aria-label="Model"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={cn(
          "peer relative w-full appearance-none rounded-lg border border-border bg-background/60",
          "px-3 pt-5 pb-2 pr-9 text-sm text-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:cursor-not-allowed disabled:opacity-50",
        )}
      >
        {options.map((m) => (
          <option key={m.id} value={m.id}>
            {m.label} · {m.hint}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute left-3 top-1 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/70">
        Selected
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[10px] text-muted-foreground"
      >
        ▾
      </span>
      <span className="sr-only">{current.label}</span>
    </div>
  )
}

function TemperatureSlider({
  value,
  onChange,
  disabled,
}: {
  value: number
  onChange: (v: number) => void
  disabled?: boolean
}) {
  const pct = (value / 2) * 100
  return (
    <div className="relative pt-1.5">
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-border/60">
        <div
          aria-hidden
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-accent-soft via-accent to-accent"
          style={{ width: `${pct}%` }}
        />
      </div>
      <input
        type="range"
        min={0}
        max={2}
        step={0.05}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className={cn(
          "temperature-slider absolute inset-0 h-2 w-full appearance-none bg-transparent",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:cursor-not-allowed",
        )}
        aria-label="Temperature"
        aria-valuetext={`${value.toFixed(2)}`}
        style={{ "--thumb-position": `${pct}%` } as React.CSSProperties}
      />
    </div>
  )
}