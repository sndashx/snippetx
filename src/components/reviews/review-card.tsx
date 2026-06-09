"use client"

import React from "react"
import { Star, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"

interface ReviewCardProps {
  review: {
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
  isOwnReview?: boolean // To show delete button if it's the user's own review
  onDelete?: (reviewId: string) => void
}

export function ReviewCard({ review, isOwnReview = false, onDelete }: ReviewCardProps) {
  const ratingStars = Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={cn("size-4", i < review.rating ? "text-yellow-400 fill-current" : "text-muted-foreground/30")}
    />
  ))

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={review.user.avatarUrl || ""} alt={review.user.displayName || review.user.email} />
            <AvatarFallback>{review.user.displayName?.charAt(0) || review.user.email.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="font-semibold leading-none">
              {review.user.displayName || review.user.email.split("@")[0]}
            </div>
            <div className="text-xs text-muted-foreground">
              Reviewed on {formatDistanceToNow(review.createdAt, { addSuffix: true })}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">{ratingStars}</div>
      </div>

      {review.comment && (
        <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
          {review.comment}
        </p>
      )}

      {isOwnReview && (
        <div className="flex justify-end">
          <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600 border-red-500/30 hover:border-red-500/50" onClick={() => onDelete?.(review.id)}>
            <Trash2 className="size-4 mr-1" /> Delete
          </Button>
        </div>
      )}
    </div>
  )
}
