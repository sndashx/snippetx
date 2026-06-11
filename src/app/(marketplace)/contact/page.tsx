import { Suspense } from "react"
import { ContactForm } from "@/components/contact-form"

export const metadata = {
  title: "Contact — SnippetX Integration Service",
  description: "Get your snippet integrated end-to-end within 24 hours. Contact the SnippetX team.",
}

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <div className="mb-10 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
            Integration Service · Flat $250 · 24h
          </span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Let&apos;s ship it <span className="text-amber-500">for you</span>
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-lg text-muted-foreground">
          Tell us what you&apos;re building. We&apos;ll wire the snippet into your
          codebase end-to-end and have it running within 24 hours.
        </p>
      </div>

      <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-card" />}>
        <ContactForm />
      </Suspense>
    </div>
  )
}
