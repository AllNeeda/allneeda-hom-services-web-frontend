"use client";

import React from "react";
import { Star } from "lucide-react";
import { ReviewItem } from "@/types/reviews/types";


type Props = {
  review: ReviewItem;
  expanded: boolean;
  /* eslint-disable no-unused-vars */
  setExpanded: (value: boolean) => void;
  /* eslint-enable no-unused-vars */
};

export default function ReviewContent({ review, expanded, setExpanded }: Props) {
  const commentWords = review.comment.split(' ');
  const previewLength = 30;
  const needsTruncation = commentWords.length > previewLength;
  const previewText = needsTruncation ? commentWords.slice(0, previewLength).join(' ') + '...' : review.comment;

  return (
    <div className="p-4 pt-0">
      <div className="flex items-center gap-1 mb-2">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-600"}`}
          />
        ))}
        <span className="text-sm text-gray-500 ml-2">({review.rating}/5)</span>
      </div>
      <div className="mb-2 text-left text-[13px] text-gray-700 dark:text-gray-300">
        {expanded ? review.comment : previewText}
        {needsTruncation && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="ml-1 text-[#0077B6] dark:text-[#04689e] hover:underline font-normal"
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        )}
      </div>
    </div>
  );
}
