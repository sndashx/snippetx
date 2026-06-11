"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { FormField } from "@/components/ui/form-field"
import { reviewSchema, type ReviewInput } from "@/lib/validations/review"
import { cn } from "@/lib/utils"

interface ReviewFormProps {
  snippetId: string
  initialRating?: number
  initialComment?: string
  onSubmitReview: (data: ReviewInput) => Promise<void>
  isPurchased: boolean
}

export function ReviewForm({ snippetId, onSubmitReview, isPurchased, initialRating = 0, initialComment = "" }: ReviewFormProps) {
  const router = useRouter()
  const [rating, setRating] = useState(initialRating)
  const [hoverRating, setHoverRating] = useState(0)
  const [submitError, setSubmitError] = useState("")

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReviewInput>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: initialRating,
      comment: initialComment,
    },
  })

  const handleRatingClick = (r: number) => {
    setRating(r)
  }

  const onSubmit = async (data: ReviewInput) => {
    if (!isPurchased) {
      setSubmitError("You must purchase the snippet to leave a review.")
      return
    }
    if (rating === 0) {
      setSubmitError("Please provide a rating.")
      return
    }

    const reviewData = { ...data, rating }
    try {
      await onSubmitReview(reviewData)
      reset() // Reset form after successful submission
      setRating(0) // Reset rating
      setSubmitError("")
      router.refresh() // Refresh page to show new review
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error)
      setSubmitError(message || "Failed to submit review. Please try again.")
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
      <h3 className="text-xl font-bold tracking-tight">Leave a Review</h3>
      
      {!isPurchased && (
        <p className="text-sm text-primary/80 bg-primary/10 border border-primary/20 p-3 rounded-lg">
          You need to purchase this snippet to leave a review.
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormField label="Rating" htmlFor="rating" error={errors.rating?.message || submitError} required>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  "size-6 cursor-pointer",
                  star <= (hoverRating || rating) ? "text-yellow-400 fill-current" : "text-muted-foreground/30"
                )}
                onClick={() => handleRatingClick(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
              />
            ))}
          </div>
          {/* Hidden input to register rating value */}
          <input type="hidden" {...register("rating")} value={rating} />
        </FormField>

        <FormField label="Comment" htmlFor="comment" error={errors.comment?.message}>
          <Textarea
            id="comment"
            placeholder="Share your thoughts about this snippet..."
            rows={4}
            aria-invalid={!!errors.comment}
            {...register("comment")}
          />
          <p className="mt-1 text-xs text-muted-foreground">Optional, but appreciated!</p>
        </FormField>

        <Button type="submit" size="lg" disabled={isSubmitting || !isPurchased || rating === 0}>
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </Button>
      </form>
    </div>
  )
}
