"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Status = "idle" | "loading" | "success" | "error"

interface ContactFormProps {
  className?: string
}

export function ContactForm({ className }: ContactFormProps) {
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [message, setMessage] = React.useState("")
  const [status, setStatus] = React.useState<Status>("idle")
  const [error, setError] = React.useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (name.trim().length < 2) {
      setError("Please provide your name.")
      return
    }
    if (!EMAIL_RE.test(email.trim())) {
      setError("Please provide a valid email address.")
      return
    }
    if (message.trim().length < 10) {
      setError("Please include a message (at least 10 characters).")
      return
    }

    setStatus("loading")
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      })
      let data: { success?: boolean; ok?: boolean; error?: string } = {}
      try {
        data = await res.json()
      } catch {
        /* noop — stub returns ok regardless */
      }
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.")
      }
      setStatus("success")
      setName("")
      setEmail("")
      setMessage("")
    } catch (err: unknown) {
      setStatus("error")
      setError(err instanceof Error ? err.message : "Something went wrong.")
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className={cn(
          "rounded-2xl border border-accent/40 bg-accent/[0.06] p-7 text-sm",
          className,
        )}
      >
        <p className="font-display text-2xl text-foreground">
          Thanks — we&rsquo;ll be in touch.
        </p>
        <p className="mt-2 text-muted-foreground">
          Your note reached the lab. We respond to every inbound message
          within two working days.
        </p>
      </div>
    )
  }

  const disabled = status === "loading"

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={cn("grid gap-4", className)}
      aria-describedby={error ? "contact-error" : undefined}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="contact-name" label="Name">
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={disabled}
            className="h-11 w-full rounded-xl border border-border bg-background/60 px-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-accent/60 focus:ring-2 focus:ring-accent/30"
            placeholder="Ada Lovelace"
          />
        </Field>
        <Field id="contact-email" label="Email">
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={disabled}
            className="h-11 w-full rounded-xl border border-border bg-background/60 px-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-accent/60 focus:ring-2 focus:ring-accent/30"
            placeholder="ada@analytical.engine"
          />
        </Field>
      </div>

      <Field id="contact-message" label="Message">
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={disabled}
          className="w-full resize-y rounded-xl border border-border bg-background/60 px-3.5 py-3 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-accent/60 focus:ring-2 focus:ring-accent/30"
          placeholder="What would you like to talk about?"
        />
      </Field>

      {error && (
        <p
          id="contact-error"
          role="alert"
          className="text-sm text-red-300/90"
        >
          {error}
        </p>
      )}

      <div className="flex items-center justify-between gap-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          We respond within 2 working days.
        </p>
        <button
          type="submit"
          disabled={disabled}
          className={cn(
            "inline-flex h-11 items-center justify-center rounded-full bg-accent px-6 text-sm font-semibold text-background",
            "transition-all duration-300 ease-out-expo",
            "hover:shadow-[0_18px_40px_-18px_color-mix(in_oklch,var(--accent)_70%,transparent)]",
            "disabled:cursor-not-allowed disabled:opacity-60",
          )}
        >
          {status === "loading" ? "Sending…" : "Send message"}
        </button>
      </div>
    </form>
  )
}

function Field({
  id,
  label,
  children,
}: {
  id: string
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="grid gap-1.5">
      <label
        htmlFor={id}
        className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground"
      >
        {label}
      </label>
      {children}
    </div>
  )
}