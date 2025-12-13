// app/dashboard/reviews/MarketingReviewsCard.tsx
"use client";
import React, { useState } from "react";
import {  ArrowUpDown, Star } from "lucide-react";
import { getAccessToken } from "@/app/api/axios";
import { useProfessionalLeads } from "@/hooks/useProfessionalLeads";
import GlobalLoader from "@/components/ui/global-loader";
import { toast } from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getMarketingScore, Review } from "@/lib/review-helpers";
import MarketingInsights from "./reviews/marketingInsights";
import ReviewItem from "./reviews/reviewItem";


interface ProfessionalData {
  reviews?: Review[];
}

type SortOrder = 'newest' | 'oldest' | 'highest' | 'lowest' | 'marketing';

export default function MarketingReviewsCard() {
  const token = getAccessToken();
  const { data, isLoading } = useProfessionalLeads(token!) as {
    data: ProfessionalData | undefined;
    isLoading: boolean;
    error: any;
  };

  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [selectedForEmail, setSelectedForEmail] = useState<Review[]>([]);
  const [highlights, setHighlights] = useState<Review[]>([]);

  if (isLoading) return <GlobalLoader />;
  const approvedReviews = data?.reviews?.filter(
    review => review.review_type === "approved"
  ) || [];

  // Sort reviews based on selected order
  const sortedReviews = [...approvedReviews].sort((a, b) => {
    switch (sortOrder) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'highest':
        return b.rating - a.rating;
      case 'lowest':
        return a.rating - b.rating;
      case 'marketing':
        /* eslint-disable*/
        const aScore = getMarketingScore(a);
        const bScore = getMarketingScore(b);
        /* eslint-enable*/
        return bScore - aScore;
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });


  const handleAddToHighlights = (review: Review) => {
    if (!highlights.some(h => h._id === review._id)) {
      setHighlights(prev => [...prev, review]);
      toast.success('Added to highlights!');
    }
  };

  const handleAddToTemplate = (review: Review) => {
    if (!selectedForEmail.some(r => r._id === review._id)) {
      setSelectedForEmail(prev => [...prev, review]);
      toast.success('Added to email template!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Order Filter */}
      <div className="flex items-center justify-between bg-white dark:bg-gray-900 rounded-sm border border-gray-200 dark:border-gray-800 p-3">

        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-gray-500" />
          <Select value={sortOrder} onValueChange={(value: SortOrder) => setSortOrder(value)}>
            <SelectTrigger className="w-[160px] h-8 text-[13px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="highest">Highest Rated</SelectItem>
              <SelectItem value="lowest">Lowest Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Marketing Insights Dashboard */}
      <MarketingInsights reviews={approvedReviews} />

      {/* Reviews List - One Column */}
      <div className="space-y-4">
        {sortedReviews.map((review) => (
          <ReviewItem
            key={review._id} 
            review={review}
            onAddToHighlights={handleAddToHighlights}
            onAddToTemplate={handleAddToTemplate}
          />
        ))}
      </div>



      {/* Empty State */}
      {sortedReviews.length === 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-sm border border-gray-200 dark:border-gray-800 p-8 text-center">
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-[#0077B6] dark:text-blue-400" />
          </div>
          <h3 className="text-[15px] font-semibold text-gray-900 dark:text-white mb-2">
            No Approved Reviews Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-[13px] mb-4">
            Approved reviews will appear here once they are available on allneeda
          </p>
        </div>
      )}

    </div>
  );
}