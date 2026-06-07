"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"

export function PurchaseButton({
  snippetId,
  hasPurchased,
  orderId,
}: {
  snippetId: string
  hasPurchased: boolean
  orderId: string | null
}) {
  const [loading, setLoading] = useState(false)

  async function handlePurchase() {
    setLoading(true)
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ snippetId }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } finally {
      setLoading(false)
    }
  }

  if (hasPurchased && orderId) {
    return (
      <a href={`/api/download/${orderId}`} className="w-full">
        <Button className="w-full" size="lg">
          <Download className="size-4" />
          Download Snippet
        </Button>
      </a>
    )
  }

  return (
    <Button
      className="w-full"
      size="lg"
      onClick={handlePurchase}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        "Purchase Snippet"
      )}
    </Button>
  )
}
