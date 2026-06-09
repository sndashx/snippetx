"use client"

import React, { useEffect, useState, useCallback } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface WishlistButtonProps {
  snippetId: string
  price: number
  isAuthenticated: boolean
}

export function WishlistButton({ snippetId, price, isAuthenticated }: WishlistButtonProps) {
  const router = useRouter()
  const [inWishlist, setInWishlist] = useState(false)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      setInitialLoading(false)
      return
    }
    fetch(`/api/wishlist?snippetId=${snippetId}`)
      .then((res) => res.json())
      .then((data) => {
        setInWishlist(data.inWishlist)
      })
      .catch(console.error)
      .finally(() => setInitialLoading(false))
  }, [snippetId, isAuthenticated])

  const handleToggle = useCallback(async () => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    setLoading(true)
    try {
      if (inWishlist) {
        const res = await fetch(`/api/wishlist?snippetId=${snippetId}`, { method: "DELETE" })
        if (!res.ok) throw new Error("Failed to remove")
        setInWishlist(false)
      } else {
        const res = await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ snippetId, price }),
        })
        if (!res.ok) throw new Error("Failed to add")
        setInWishlist(true)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [inWishlist, snippetId, price, isAuthenticated, router])

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleToggle}
      disabled={loading || initialLoading}
      className="relative"
      title={inWishlist ? "Remove from wishlist" : "Add to wishlist for price alerts"}
    >
      <Heart
        className={cn(
          "size-5 transition-all",
          inWishlist ? "fill-red-500 text-red-500" : "text-muted-foreground"
        )}
      />
    </Button>
  )
}
