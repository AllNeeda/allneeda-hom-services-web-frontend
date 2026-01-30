// components/home-services/professional-profile/components/sections/ReviewsSection.tsx
import { forwardRef, useMemo } from "react";
import Link from "next/link";
import { Star } from "lucide-react";

interface Review {
  id: string;
  rating: number;
  comment: string;
  user_name?: string;
  created_at?: string;
  // Add other review properties as needed
}

interface ReviewsSectionProps {
  rating: number;
  reviewCount: number;
  totalHire: number;
  reviews?: Review[]; // Make it optional for backward compatibility
}

const ReviewsSection = forwardRef<HTMLDivElement, ReviewsSectionProps>(
  ({ rating, reviewCount, totalHire, reviews = [] }, ref) => {
    
    // Calculate review statistics from actual data
    const reviewStats = useMemo(() => {
      const stats = {
        5: 0, 4: 0, 3: 0, 2: 0, 1: 0
      };
      
      // Count ratings if we have reviews
      if (reviews.length > 0) {
        reviews.forEach(review => {
          const roundedRating = Math.round(review.rating);
          if (roundedRating >= 1 && roundedRating <= 5) {
            stats[roundedRating as keyof typeof stats]++;
          }
        });
      } else {
        // Fallback to hardcoded stats
        stats[5] = 87;
        stats[4] = 10;
        stats[3] = 2;
        stats[2] = 1;
        stats[1] = 0;
      }
      
      // Convert to percentage
      const totalReviews = Object.values(stats).reduce((a, b) => a + b, 0) || 1;
      
      return [
        { stars: 5, count: stats[5], percentage: Math.round((stats[5] / totalReviews) * 100) },
        { stars: 4, count: stats[4], percentage: Math.round((stats[4] / totalReviews) * 100) },
        { stars: 3, count: stats[3], percentage: Math.round((stats[3] / totalReviews) * 100) },
        { stars: 2, count: stats[2], percentage: Math.round((stats[2] / totalReviews) * 100) },
        { stars: 1, count: stats[1], percentage: Math.round((stats[1] / totalReviews) * 100) },
      ];
    }, [reviews]);

    // Sort reviews by date (newest first)
    const sortedReviews = useMemo(() => {
      return [...reviews].sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      });
    }, [reviews]);

    // Format date
    const formatDate = (dateString?: string) => {
      if (!dateString) return "Recently";
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    return (
      <div ref={ref} className="space-y-6 mt-10">
        <div className="">
          <p className="text-md font-semibold">Reviews</p>
          <p className="text-xs text-gray-800 dark:text-gray-300">
            Customers consistently praised this professional for their{" "}
            <b>work quality</b>, <b>professionalism</b>, and{" "}
            <b>responsiveness</b>.
          </p>
        </div>

        {/* Rating Summary */}
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="flex flex-col items-center sm:items-start">
            <p className="text-3xl font-bold text-emerald-500 dark:text-emerald-400">
              {rating >= 4.5 ? "Great" : rating >= 3.5 ? "Good" : "Average"} {rating?.toFixed(1) || "4.5"}
            </p>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(rating || 4.5)
                      ? "fill-emerald-500 text-emerald-500"
                      : i < (rating || 4.5)
                      ? "fill-emerald-500/50 text-emerald-500/50"
                      : "text-gray-300 dark:text-gray-600"
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Based on {reviewCount || reviews.length || 0} reviews
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Hired {totalHire || 0} times
            </p>
          </div>

          {/* Rating Breakdown */}
          <div className="flex-1 w-full space-y-2">
            {reviewStats.map((stat, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="flex items-center w-8">
                  <span className="text-xs text-gray-500">
                    {stat.stars}
                  </span>
                  <Star className="w-4 h-4 fill-gray-200 text-gray-200 ml-1" />
                </div>
                <div className="relative flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${stat.percentage}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 w-10 text-right">
                  {stat.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Actual Reviews List */}
        {sortedReviews.length > 0 ? (
          <div className="space-y-4 mt-6">
            <h4 className="text-lg font-semibold">Customer Reviews</h4>
            {sortedReviews.slice(0, 5).map((review) => (
              <div 
                key={review.id} 
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(review.rating || 5)
                              ? "fill-yellow-400 text-yellow-400"
                              : i < (review.rating || 5)
                              ? "fill-yellow-400/50 text-yellow-400/50"
                              : "text-gray-300 dark:text-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium ml-2">
                      {review.rating?.toFixed(1) || "5.0"}
                    </span>
                  </div>
                  {review.created_at && (
                    <span className="text-xs text-gray-500">
                      {formatDate(review.created_at)}
                    </span>
                  )}
                </div>
                {review.comment && (
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {review.comment}
                  </p>
                )}
                {review.user_name && (
                  <p className="text-xs text-gray-500 mt-2">
                    — {review.user_name}
                  </p>
                )}
              </div>
            ))}
            
            {reviews.length > 5 && (
              <button className="text-sky-500 font-medium text-sm hover:underline mt-2">
                View all {reviews.length} reviews
              </button>
            )}
          </div>
        ) : (
          <div className="text-center py-8 border border-gray-200 dark:border-gray-700 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400">
              No reviews yet. Be the first to review this professional!
            </p>
          </div>
        )}

        {/* Guidelines Link */}
        <p className="text-xs text-gray-800 dark:text-gray-300">
          Your trust means everything to us.{" "}
          <Link
            href={"/guidelines"}
            className="font-bold text-sky-500"
          >
            Learn about our review guidelines.
          </Link>
        </p>
      </div>
    );
  }
);

ReviewsSection.displayName = "ReviewsSection";

export default ReviewsSection;