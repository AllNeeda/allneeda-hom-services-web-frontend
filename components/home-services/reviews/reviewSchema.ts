import { z } from "zod";

export const reviewSchema = z.object({
  rating: z.number().int().min(1, "Please provide a rating between 1 and 5").max(5),
  tags: z.array(z.string()).optional(),
  additionalComments: z
    .string()
    .min(10, "Comment must be at least 10 characters")
    .max(500, "Comment must be 500 characters or less"),
});

export type ReviewSchema = z.infer<typeof reviewSchema>;
