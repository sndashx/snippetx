"use client"

import { useEffect, useRef, useState, useCallback, type FormEvent } from "react"
import { ArrowUp, Sparkles, Square, RotateCcw } from "lucide-react"
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

const placeholders = [
  "Explain deliberative rollouts in one paragraph.",
  "Write a haiku about gradient routing.",
  "Refactor this Python function to be async…",
  "Draft a status update for the M3 launch.",
  "Summarise the safety properties of M3.",
]

export default function PlaygroundPage() {
  const [model, setModel] = useState<string>(modelFlagship.name)
  const [temperature, setTemperature] = useState(0.7)
  const [prompt, setPrompt] = useState("")
  const [response, setResponse] = useState("")
  const [streaming, setStreaming] = useState(false)
  const [stubMessage, setStubMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const [placeholderIdx, setPlaceholderIdx] = useState(0)

  useEffect(() => {
    if (prompt) return
    const id = setInterval(
      () => setPlaceholderIdx((i) => (i + 1) % placeholders.length),
      4000,
    )
    return () => clearInterval(id)
  }, [prompt])

  const stop = useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
    setStreaming(false)
  }, [])

  const reset = useCallback(() => {
    stop()
    setResponse("")
    setError(null)
    setStubMessage(null)
    setPrompt("")
    textareaRef.current?.focus()
  }, [stop])

  const submit = useCallback(
    async (e?: FormEvent) => {
      e?.preventDefault()
      if (streaming) return
      const text = prompt.trim()
      if (!text) return
      setError(null)
      setStubMessage(null)
      setResponse("")
      setStreaming(true)

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
            const line = evt.trim()
            if (!line) continue
            // Each event: lines starting with "event:" and "data:".
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
                setResponse((prev) => prev + parsed.delta)
              }
              if (parsed.done) {
                // Footer event from the stub — surfaces the source clearly.
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
        abortRef.current = null
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
        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card/40 p-4 sm:flex-row sm:items-center sm:gap-4 sm:p-5">
          <label className="flex flex-1 flex-col gap-1.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Model
            </span>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              disabled={streaming}
              className="w-full appearance-none rounded-lg border border-border bg-background/60 px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50"
            >
              {models.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label} · {m.hint}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5 sm:w-72">
            <span className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              <span>Temperature</span>
              <span className="font-mono text-foreground/90">
                {temperature.toFixed(2)}
              </span>
            </span>
            <input
              type="range"
              min={0}
              max={2}
              step={0.05}
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              disabled={streaming}
              className="accent-[var(--accent)] disabled:opacity-50"
              aria-label="Temperature"
            />
          </label>

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
            className="flex min-h-[26rem] flex-col rounded-2xl border border-border bg-card/30 p-5"
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
              className="mt-3 flex-1 resize-none rounded-xl border border-border bg-background/60 p-4 font-mono text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            />
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-mono">
                {prompt.length.toLocaleString()} chars
              </span>
              <span className="font-mono">
                ⌘ / Ctrl + Enter to send
              </span>
            </div>
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
            aria-busy={streaming}
            className="flex min-h-[26rem] flex-col rounded-2xl border border-border bg-card/30 p-5"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Response
              </span>
              {streaming && (
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span
                    aria-hidden
                    className="size-1.5 animate-pulse rounded-full bg-accent"
                  />
                  streaming
                </span>
              )}
            </div>
            <div className="mt-3 flex-1 overflow-auto rounded-xl border border-border bg-background/60 p-4">
              {error ? (
                <p className="font-mono text-sm text-destructive">{error}</p>
              ) : response ? (
                <p className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-foreground/90">
                  {response}
                </p>
              ) : (
                <p className="font-mono text-sm text-muted-foreground/70">
                  {streaming
                    ? "Generating…"
                    : "The assistant's reply will stream here."}
                </p>
              )}
            </div>
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