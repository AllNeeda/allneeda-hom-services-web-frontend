"use client";

import React, { useState } from "react";
import { Filter } from "lucide-react";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import ReviewItemComponent from "./ReviewItems";
import { ReviewItem } from "@/types/reviews/types";

export default function ReviewList({ reviews }: { reviews: ReviewItem[] }) {
  const [filter, setFilter] = useState<string>("all");
  const [reviewData, setReviewData] = useState<ReviewItem[]>(reviews);

  const filteredReviews = reviewData.filter(
    r => filter === "all" || r.status === filter
  );

  return (
    <div className="space-y-6">
      {/* Filter header */}
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-4 h-4 text-gray-500" />
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Reviews</SelectItem>
            <SelectItem value="Approved">Approved</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Declined">Declined</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredReviews.length > 0 ? (
        filteredReviews.map(review => (
          <ReviewItemComponent key={review.id} review={review} updateReview={setReviewData} />
        ))
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400">No reviews found</p>
      )}
    </div>
  );
}
