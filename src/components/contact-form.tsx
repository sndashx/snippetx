"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Loader2, CheckCircle2, AlertCircle, Send, Mail } from "lucide-react"

const PROJECT_TYPES = [
  "Snippet integration",
  "Custom feature build",
  "Bug fix / debugging",
  "Code review",
  "Other",
]

const BUDGETS = [
  "$250 (flat integration)",
  "$250 – $1,000",
  "$1,000 – $5,000",
  "$5,000+",
  "Not sure yet",
]

export function ContactForm() {
  const searchParams = useSearchParams()
  const snippetId = searchParams.get("snippet") ?? ""
  const snippetTitle = searchParams.get("title") ?? ""

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [projectType, setProjectType] = useState(PROJECT_TYPES[0])
  const [budget, setBudget] = useState(BUDGETS[0])
  const [message, setMessage] = useState(
    snippetTitle ? `I'm interested in getting "${snippetTitle}" integrated into my project.\n\n` : ""
  )

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("loading")
    setError(null)

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          projectType,
          budget,
          message,
          snippetId,
          snippetTitle,
        }),
      })

      let data: { success?: boolean; error?: string } = {}
      try {
        data = await res.json()
      } catch {
        throw new Error("Unexpected server response. Please try again.")
      }

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to send your message.")
      }

      setStatus("success")
    } catch (err: unknown) {
      setStatus("error")
      setError(err instanceof Error ? err.message : "Something went wrong.")
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-xl glass">
        <CheckCircle2 className="mx-auto mb-4 size-14 text-green-500" />
        <h2 className="text-2xl font-bold">Message sent!</h2>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
          Thanks for reaching out. We&apos;ll get back to you at{" "}
          <span className="font-medium text-foreground">{email}</span> within 24 hours.
        </p>
        <Link
          href="/browse"
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:neon-glow"
        >
          Back to Browse
        </Link>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-xl glass sm:p-8"
    >
      {snippetTitle && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm">
          <span className="text-muted-foreground">Regarding snippet: </span>
          <span className="font-semibold text-amber-400">{snippetTitle}</span>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-sm font-medium">
            Your name <span className="text-destructive">*</span>
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Developer"
            className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium">
            Email <span className="text-destructive">*</span>
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="projectType" className="text-sm font-medium">
            What do you need?
          </label>
          <select
            id="projectType"
            value={projectType}
            onChange={(e) => setProjectType(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
          >
            {PROJECT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="budget" className="text-sm font-medium">
            Budget
          </label>
          <select
            id="budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
          >
            {BUDGETS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="message" className="text-sm font-medium">
          Tell us about your project <span className="text-destructive">*</span>
        </label>
        <textarea
          id="message"
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="What are you building, what's the timeline, and how can we help?"
          className="w-full resize-y rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-amber-500 px-6 py-3 text-sm font-bold text-black transition-all hover:bg-amber-400 disabled:opacity-60"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Sending...
          </>
        ) : (
          <>
            <Send className="size-4" /> Send message
          </>
        )}
      </button>

      <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
        <Mail className="size-3.5" />
        Or email us directly at{" "}
        <a href="mailto:taylor@numina.org" className="font-medium text-amber-500 hover:underline">
          taylor@numina.org
        </a>
      </p>
    </form>
  )
}
