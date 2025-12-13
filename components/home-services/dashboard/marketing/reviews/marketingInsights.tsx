// components/reviews/MarketingInsights.tsx
"use client";
import React, { useMemo } from "react";
import { BarChart3, Video, ImageIcon, Hash } from "lucide-react";
import { toast } from "react-hot-toast";
import { calculateAverageRating, extractTopKeywords, findMostDetailedReview, getMarketingBestReviews, Review } from "@/lib/review-helpers";

interface MarketingInsightsProps {
  reviews: Review[];
}

export default function MarketingInsights({ reviews }: MarketingInsightsProps) {
  const insights = useMemo(() => {
    const videoReviews = reviews.filter(r => 
      r.media?.some(m => m.type === 'video')
    ).length;
    
    const imageReviews = reviews.filter(r => 
      r.media?.some(m => m.type === 'image')
    ).length;
    
    const keywordFrequency = extractTopKeywords(reviews);
    const bestReview = findMostDetailedReview(reviews);
    
    return {
      totalReviews: reviews.length,
      avgRating: calculateAverageRating(reviews),
      videoReviews,
      imageReviews,
      keywordFrequency,
      bestReview,
      marketingBest: getMarketingBestReviews(reviews).length
    };
  }, [reviews]);

  if (reviews.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-sm border border-gray-200 dark:border-gray-800 p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-[#0077B6]" />
          Marketing Insights
        </h3>
      </div>
      
      {/* Responsive Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {/* Avg Rating Card */}
        <div className="p-3 bg-[#0077B6]/5 dark:bg-[#0077B6]/10 rounded-sm border border-[#0077B6]/10 dark:border-[#0077B6]/20">
          <div className="text-2xl font-bold text-[#0077B6] dark:text-blue-400">
            {insights.avgRating.toFixed(1)}
          </div>
          <div className="text-[11px] text-gray-600 dark:text-gray-400 mt-1">
            Avg Rating
          </div>
        </div>
        
        {/* Video Reviews Card */}
        <div className="p-3 bg-[#00A8E8]/5 dark:bg-[#00A8E8]/10 rounded-sm border border-[#00A8E8]/10 dark:border-[#00A8E8]/20">
          <div className="text-2xl font-bold text-[#00A8E8] dark:text-cyan-400">
            {insights.videoReviews}
          </div>
          <div className="flex items-center text-[11px] text-gray-600 dark:text-gray-400 mt-1">
            <Video className="w-3 h-3 mr-1.5 text-[#00A8E8]" />
            Video Reviews
          </div>
        </div>
        
        {/* Total Reviews Card */}
        <div className="p-3 bg-gradient-to-br from-[#0077B6]/5 to-[#00A8E8]/5 dark:from-[#0077B6]/10 dark:to-[#00A8E8]/10 rounded-sm border border-gray-200 dark:border-gray-800">
          <div className="text-2xl font-bold text-[#0077B6] dark:text-blue-400">
            {insights.totalReviews}
          </div>
          <div className="text-[11px] text-gray-600 dark:text-gray-400 mt-1">
            Total Reviews
          </div>
        </div>
        
        {/* Photo Reviews Card */}
        <div className="p-3 bg-gradient-to-br from-[#0077B6]/5 via-[#00A8E8]/5 to-amber-100/20 dark:from-[#0077B6]/10 dark:via-[#00A8E8]/10 dark:to-amber-900/10 rounded-sm border border-gray-200 dark:border-gray-800">
          <div className="text-2xl font-bold text-[#0077B6] dark:text-blue-400">
            {insights.imageReviews}
          </div>
          <div className="flex items-center text-[11px] text-gray-600 dark:text-gray-400 mt-1">
            <ImageIcon className="w-3 h-3 mr-1.5 text-[#0077B6] dark:text-blue-400" />
            Photo Reviews
          </div>
        </div>
      </div>
      {/* Keyword Cloud */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-[12px] font-medium text-gray-900 dark:text-white flex items-center gap-1.5">
            <Hash className="w-3 h-3 text-[#0077B6]" />
            Top Review Keywords
          </h4>
          <span className="text-[10px] text-gray-500 dark:text-gray-400">
            Click to copy
          </span>
        </div>
        
        {/* Responsive Keyword Grid */}
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
          {insights.keywordFrequency.slice(0, 12).map(([word, count]) => (
            <button
              key={word}
              onClick={() => {
                navigator.clipboard.writeText(word);
                toast.success(`Copied`);
              }}
              className={`px-2.5 py-1.5 rounded-sm text-[11px] font-medium transition-all hover:scale-[1.02] active:scale-95 
                ${count > 4 
                  ? 'bg-gradient-to-r from-[#0077B6] to-[#00A8E8] text-white hover:from-[#0066A0] hover:to-[#0097D7]' 
                  : count > 2 
                  ? 'bg-[#0077B6]/10 dark:bg-[#0077B6]/20 text-[#0077B6] dark:text-blue-300 hover:bg-[#0077B6]/20 dark:hover:bg-[#0077B6]/30' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
            >
              <span className="block truncate text-center">{word}</span>
              <span className={`text-[10px] mt-0.5 block ${count > 4 ? 'text-white/80' : 'opacity-70'}`}>
                ({count})
              </span>
            </button>
          ))}
        </div>
        
        {/* Show More Keywords on Larger Screens */}
        <div className="hidden lg:grid grid-cols-6 gap-2 mt-2">
          {insights.keywordFrequency.slice(12, 18).map(([word, count]) => (
            <button
              key={word}
              onClick={() => {
                navigator.clipboard.writeText(word);
                toast.success(`Copied: ${word}`);
              }}
              className="px-2.5 py-1.5 rounded-sm bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 text-[11px] font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="block truncate text-center">{word}</span>
              <span className="text-[10px] mt-0.5 block opacity-70">({count})</span>
            </button>
          ))}
        </div>
        
        {/* Mobile/Tablet Extra Keywords */}
        <div className="flex flex-wrap gap-1.5 mt-2 lg:hidden">
          {insights.keywordFrequency.slice(12, 15).map(([word, count]) => (
            <button
              key={word}
              onClick={() => {
                navigator.clipboard.writeText(word);
                toast.success(`Copied: ${word}`);
              }}
              className="px-2 py-1 rounded-sm bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 text-[10px] font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {word} <span className="opacity-70">({count})</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}