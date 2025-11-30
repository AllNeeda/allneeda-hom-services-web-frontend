// src/components/marketing-hub/ReviewCard.tsx
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Review } from "@/types/marketing/type";

interface ReviewCardProps {
  review: Review;
  ref?: React.Ref<HTMLDivElement>;
}

const ReviewCard: React.FC<ReviewCardProps> = React.forwardRef(({ review }, ref) => {
  const stars = useMemo(
    () =>
      Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className={`h-4 w-4 ${i < review.rating ? "fill-primary text-primary" : "text-muted-foreground"}`}
        >
          <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.167L12 18.896l-7.334 3.868 1.4-8.167L.132 9.21l8.2-1.192z" />
        </svg>
      )),
    [review]
  );

  return (
    <motion.div
      ref={ref}
      layout
      className="rounded-2xl border bg-white shadow-sm p-4 sm:p-5 md:p-6 w-full"
    >
      {/* Stars */}
      <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">{stars}</div>

      {/* Review Content */}
      <blockquote className="text-base sm:text-lg md:text-xl leading-relaxed font-medium mb-3 sm:mb-4">
        {review.content}
      </blockquote>

      {/* Reviewer Info */}
      <div className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
        — {review.name} · {review.city} · {review.service}
      </div>

      {/* Footer */}
      <div className="mt-2 sm:mt-4 pt-2 sm:pt-4 border-t text-xs sm:text-sm text-muted-foreground">
        Book trusted {review.service.toLowerCase()} pros in minutes at your location.
      </div>
    </motion.div>
  );
});

ReviewCard.displayName = "ReviewCard";

export default ReviewCard;
