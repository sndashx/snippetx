"use client"

import React, { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { MessageSquareCode } from "lucide-react"
import { ReviewCard } from "./review-card"
import { ReviewForm } from "./review-form"
import type { ReviewInput } from "@/lib/validations/review"

interface Review {
  id: string
  rating: number
  comment: string | null
  createdAt: Date
  user: {
    id: string
    displayName: string | null
    email: string
    avatarUrl: string | null
  }
  snippet: {
    id: string
    title: string
  }
}

interface ReviewsSectionProps {
  snippetId: string
  isPurchased: boolean
  currentUserId: string | null
}

export function ReviewsSection({ snippetId, isPurchased, currentUserId }: ReviewsSectionProps) {
  const router = useRouter()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/reviews?snippetId=${snippetId}`)
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to fetch reviews")
      }
      const data = await res.json()
      setReviews(data)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [snippetId])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  const handleSubmitReview = async (data: ReviewInput) => {
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ snippetId, ...data }),
    })

    if (!res.ok) {
      const errData = await res.json()
      throw new Error(errData.error || "Failed to submit review")
    }

    // Refresh the list
    await fetchReviews()
    router.refresh()
  }

  const handleDeleteReview = async (reviewId: string) => {
    const res = await fetch(`/api/reviews?reviewId=${reviewId}`, {
      method: "DELETE",
    })

    if (!res.ok) {
      const errData = await res.json()
      throw new Error(errData.error || "Failed to delete review")
    }

    await fetchReviews()
    router.refresh()
  }

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Reviews</h2>
          {reviews.length > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              {averageRating.toFixed(1)} average rating &middot; {reviews.length}{" "}
              {reviews.length === 1 ? "review" : "reviews"}
            </p>
          )}
        </div>
        <MessageSquareCode className="size-6 text-muted-foreground" />
      </div>

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 p-3 rounded-lg">
          {error}
        </p>
      )}

      {isPurchased && currentUserId && (
        <ReviewForm
          snippetId={snippetId}
          isPurchased={isPurchased}
          onSubmitReview={handleSubmitReview}
        />
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm animate-pulse"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="size-10 rounded-full bg-muted" />
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-muted rounded" />
                  <div className="h-3 w-16 bg-muted rounded" />
                </div>
              </div>
              <div className="h-4 w-full bg-muted rounded" />
            </div>
          ))}
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              isOwnReview={currentUserId === review.user.id}
              onDelete={handleDeleteReview}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm text-center">
          <MessageSquareCode className="size-10 mx-auto mb-3 text-muted-foreground/50" />
          <p className="text-muted-foreground">
            No reviews yet. Be the first to share your thoughts!
          </p>
        </div>
      )}
    </div>
  )
}
