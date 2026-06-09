import { z } from 'zod';

export const reviewSchema = z.object({
  rating: z.number()
    .min(1, 'Rating must be at least 1 star.')
    .max(5, 'Rating cannot be more than 5 stars.'),
  comment: z.string()
    .max(500, 'Comment must be at most 500 characters.')
    .optional(),
});

export type ReviewInput = z.infer<typeof reviewSchema>;