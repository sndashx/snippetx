"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, CreditCard } from "lucide-react"

interface StripeConnectButtonProps {
  hasAccount: boolean
  status: string | null
}

export function StripeConnectButton({ hasAccount, status }: StripeConnectButtonProps) {
  const [loading, setLoading] = useState(false)

  async function handleConnect() {
    setLoading(true)
    try {
      const res = await fetch("/api/stripe/connect", { method: "POST" })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch {
      setLoading(false)
    }
  }

  if (hasAccount && status === "active") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">
        <CreditCard className="size-3.5" />
        Stripe Connected
      </span>
    )
  }

  if (hasAccount && status !== "active") {
    return (
      <Button variant="outline" onClick={handleConnect} disabled={loading}>
        {loading ? (
          <Loader2 className="mr-2 size-4 animate-spin" />
        ) : (
          <CreditCard className="mr-2 size-4" />
        )}
        Complete Onboarding
      </Button>
    )
  }

  return (
    <Button onClick={handleConnect} disabled={loading}>
      {loading ? (
        <Loader2 className="mr-2 size-4 animate-spin" />
      ) : (
        <CreditCard className="mr-2 size-4" />
      )}
      Connect with Stripe
    </Button>
  )
}
