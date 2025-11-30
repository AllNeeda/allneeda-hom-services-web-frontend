"use client";

import React, { useState } from "react";
import { ReviewItem as ReviewType, ReviewStatus } from "@/types/reviews/types";
import ReviewHeader from "./ReviewHeader";
import ReviewContent from "./ReviewContent";
import ReviewReplies from "./ReviewReplies";
import ReplyForm from "./ReplayFrom";
import HelpfulButton from "./HelpfulReview";

type Props = {
  review: ReviewType;
  updateReview: React.Dispatch<React.SetStateAction<ReviewType[]>>;
};

export default function ReviewItemComponent({ review, updateReview }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [replying, setReplying] = useState(false);
  const [helpful, setHelpful] = useState(false);

  const toggleHelpful = () => {
    setHelpful(!helpful);
    updateReview(prev =>
      prev.map(r =>
        r.id === review.id
          ? { ...r, helpful: helpful ? Math.max(0, r.helpful - 1) : r.helpful + 1 }
          : r
      )
    );
  };

  const submitReply = (text: string) => {
    const newReply = {
      id: `reply-${Date.now()}`,
      name: "Business Owner",
      comment: text,
      timeAgo: "Just now",
      isBusiness: true
    };
    updateReview(prev =>
      prev.map(r => r.id === review.id ? { ...r, replies: [...(r.replies || []), newReply] } : r)
    );
    setReplying(false);
  };

  const updateStatus = (status: ReviewStatus) => {
    updateReview(prev => prev.map(r => r.id === review.id ? { ...r, status } : r));
  };

  return (
    <div className="border rounded-sm overflow-hidden dark:border-gray-700 shadow-sm dark:bg-gray-900">
      <ReviewHeader review={review} updateStatus={updateStatus} />
      <ReviewContent review={review} expanded={expanded}  setExpanded={setExpanded} />
      {review.replies && <ReviewReplies replies={review.replies} />}
      <div className="flex flex-col p-4 pt-0 gap-3">
        <div className="flex items-center gap-4 w-full flex-wrap">
          <HelpfulButton helpful={helpful} toggleHelpful={toggleHelpful} count={review.helpful} />
          <button
            onClick={() => setReplying(!replying)}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            Reply
          </button>
        </div>
        {replying && <ReplyForm onSubmit={submitReply} onCancel={() => setReplying(false)} />}
      </div>
    </div>
  );
}
