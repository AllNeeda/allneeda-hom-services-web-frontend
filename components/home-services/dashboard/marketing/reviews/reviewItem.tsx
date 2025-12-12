// components/reviews/ReviewItem.tsx
"use client";
import React, { useState, useMemo } from "react";
import {
  Star,
  Share2,
  CheckCircle,
  Calendar,
  Target,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDate, getMarketingScore, getUserFromReview, Review } from "@/lib/review-helpers";
import MediaDisplay from "./mediadisplay";
import ShareModal from "./sharemodal";

interface ReviewItemProps {
  review: Review;
  /* eslint-disable*/
  onAddToHighlights: (review: Review) => void;
  onAddToTemplate: (review: Review) => void;
  /* eslint-enable*/
}

export default function ReviewItem({ review }: ReviewItemProps) {
  const [showShareModal, setShowShareModal] = useState(false);
  const user = getUserFromReview(review);
  const marketingScore = useMemo(() => getMarketingScore(review), [review]);

  return (
    <>
      <div className="bg-white dark:bg-gray-900 rounded-sm border border-gray-100 dark:border-gray-800 p-5 hover:shadow-md transition-all duration-200">
        {/* Header with Customer Info and Rating */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
          {/* Left Side: Customer Info */}
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <Avatar className="w-11 h-11 border-2 border-white dark:border-gray-800 shadow-sm">
              <AvatarFallback className="text-sm font-semibold bg-gradient-to-br from-[#0077B6] to-[#00A8E8] text-white">
                {user.username?.charAt(0).toUpperCase() || 'C'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              {/* Customer Name and Verified Badge */}
              <div className="flex items-center gap-2 mb-1.5">
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                  {user.username}
                </h4>
                <span className="flex items-center gap-1 px-2 py-0.5 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium rounded-full shrink-0">
                  <CheckCircle className="w-3 h-3" />
                  Verified
                </span>
              </div>

              {/* Customer Email */}
              {user.email && (
                <p className="text-gray-600 dark:text-gray-400 text-xs truncate">
                  {user.email}
                </p>
              )}
            </div>
          </div>

          {/* Right Side: Rating and Meta Info */}
          <div className="flex flex-col items-end gap-3">
            {/* Rating Container */}
            <div className="flex flex-col items-end gap-2">
              {/* Stars and Rating Number */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < review.rating
                        ? "fill-amber-400 text-amber-400"
                        : "fill-gray-100 text-gray-200 dark:fill-gray-800 dark:text-gray-700"
                        }`}
                    />
                  ))}
                </div>
                
                {/* Rating Number with precise alignment */}
                <div className="text-right">
                  <span className=" font-normal text-gray-900 dark:text-white leading-none">
                    {review.rating.toFixed(1)}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm ml-0.5">
                    /5
                  </span>
                </div>
              </div>

              {/* Date and Marketing Score - Stacked */}
              <div className="flex flex-col items-end gap-1.5">
                {/* Date */}
                <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="text-xs">{formatDate(review.createdAt)}</span>
                </div>

                {/* Marketing Score - Only show if relevant */}
                {marketingScore >= 5 && (
                  <div className="flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-[#0077B6] dark:text-blue-400" />
                    <span className="text-xs px-3 py-1 bg-gradient-to-r from-[#0077B6]/10 to-[#00A8E8]/10 text-[#0077B6] dark:text-blue-300 dark:from-blue-900/30 dark:to-blue-800/30 rounded-full font-medium border border-[#0077B6]/20 dark:border-blue-800/30">
                      Marketing Score: {marketingScore}/8
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Review Content Section */}
        <div className="mb-4">
          {/* Review Message */}
          <div className="mb-3">
            <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-sm line-clamp-3">
              {review.message}
            </p>
          </div>

          {/* Media Display */}
          {review.media && review.media.length > 0 && (
            <div className="mb-4">
              <MediaDisplay media={review.media} />
            </div>
          )}

          {/* Tags */}
          {review.tags && review.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {review.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-2 bg-[#0077B6]/5 text-[#0077B6] dark:text-blue-100 dark:bg-blue-900/20 text-xs font-medium rounded-[4px] border border-[#0077B6]/10 dark:border-blue-800/30"
                >
                  {tag}
                </span>
              ))}
              {review.tags.length > 3 && (
                <span className="px-3 py-1.5 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-medium rounded-[4px]">
                  +{review.tags.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex justify-end">
            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0077B6] to-[#00A8E8] hover:from-[#0066A0] hover:to-[#0097D6] text-white text-sm font-normal rounded-[4px] transition-all duration-200 shadow-sm hover:shadow"
            >
              <Share2 className="w-4 h-4" />
              Share Review
            </button>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <ShareModal
          review={review}
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </>
  );
}