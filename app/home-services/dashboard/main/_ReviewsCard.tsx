"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Mail, Star, Video, X, Download, Clock } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getAccessToken } from "@/app/api/axios";
import { useProfessionalLeads } from "@/hooks/useProfessionalLeads";
import GlobalLoader from "@/components/ui/global-loader";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Backend_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

interface ReviewUser {
  _id: string;
  username: string;
  email: string;
  profilePicture?: string;
}

interface MediaItem {
  media_url: string;
  type: "image" | "video";
  _id: string;
}

interface Review {
  _id: string;
  user_id: string | ReviewUser | null;
  professional_id: string;
  rating: number;
  message: string;
  review_type: "pending" | "approved" | "rejected";
  tags: string[];
  media: MediaItem[];
  helpful_by: string[];
  createdAt: string;
  updatedAt: string;
  username?: string;
  email?: string;
  user?: ReviewUser;
}

interface ProfessionalData {
  reviews?: Review[];
}



function formatDateTime(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  } catch {
    return "Invalid date";
  }
}

function getUserFromReview(review: Review) {
  if (review.user_id && typeof review.user_id === 'object' && review.user_id !== null) {
    const userObj = review.user_id as ReviewUser;
    if (userObj.username && userObj.email) {
      return {
        username: userObj.username,
        email: userObj.email,
        profilePicture: userObj.profilePicture
      };
    }
  }

  if (review.username && review.email) {
    return {
      username: review.username,
      email: review.email
    };
  }

  if (review.user && review.user.username && review.user.email) {
    return {
      username: review.user.username,
      email: review.user.email,
      profilePicture: review.user.profilePicture
    };
  }

  return null;
}

// Components
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating
            ? "fill-yellow-400 text-yellow-400"
            : "fill-gray-200 text-gray-300"
            }`}
        />
      ))}
      <span className="ml-1 text-[13px] font-medium text-gray-900 dark:text-white">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

function ReviewTypeBadge({ type }: { type: "pending" | "approved" | "rejected" }) {
  const styles = {
    approved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium capitalize ${styles[type]}`}>
      {type}
    </span>
  );
}

function DateTimeDisplay({ dateStr }: { dateStr: string }) {
  return (
    <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
      <div className="flex items-center gap-1">
        <Clock className="w-3 h-3" />
        <span>{formatDateTime(dateStr)}</span>
      </div>
    </div>
  );
}

function MediaModal({ media, isOpen, onClose }: { media: MediaItem; isOpen: boolean; onClose: () => void }) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const videoUrlRef = useRef<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const loadVideo = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetch(`${Backend_URL}/uploads/professionals/${media.media_url}`);
      if (!response.ok) throw new Error(`Failed to fetch video: ${response.status}`);

      const blob = await response.blob();
      if (blob.type.startsWith('video/') || blob.size > 0) {
        const url = URL.createObjectURL(blob);
        videoUrlRef.current = url;
        setVideoUrl(url);
      } else {
        throw new Error('Invalid video file');
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [media.media_url]);

  useEffect(() => {
    if (isOpen && media.type === 'video') {
      loadVideo();
    } else {
      if (videoUrlRef.current) {
        URL.revokeObjectURL(videoUrlRef.current);
        videoUrlRef.current = null;
      }
      setVideoUrl(null);
      setError(false);
    }

    return () => {
      if (videoUrlRef.current) {
        URL.revokeObjectURL(videoUrlRef.current);
      }
    };
  }, [isOpen, media.type, loadVideo]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = `${Backend_URL}/uploads/professionals/${media.media_url}`;
    link.download = media.media_url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRetry = () => {
    if (videoUrlRef.current) {
      URL.revokeObjectURL(videoUrlRef.current);
      videoUrlRef.current = null;
      setVideoUrl(null);
    }
    loadVideo();
  };


  if (!isOpen) return null;

  const imageUrl = `${Backend_URL}/uploads/professionals/${media.media_url}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="relative max-w-4xl w-full">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 z-10 p-2"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="bg-black rounded-sm overflow-hidden" onClick={(e) => e.stopPropagation()}>
          {media.type === "image" ? (
            <div className="relative w-full h-96">
              <Image
                src={imageUrl}
                alt="Review image"
                fill
                className="object-contain"
                priority
              />
            </div>
          ) : (
            <div className="w-full">
              {loading ? (
                <div className="w-full h-96 flex items-center justify-center text-white">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <p>Loading video...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="w-full h-96 flex flex-col items-center justify-center text-white p-4">
                  <Video className="w-16 h-16 text-gray-400 mb-4" />
                  <p className="text-lg mb-2 text-center">Failed to Load Video</p>
                  <p className="text-sm text-gray-400 mb-6 text-center">
                    There was an issue loading the video.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={handleRetry}
                      className="px-4 py-2 bg-[#0077B6] hover:bg-[#0077B6] rounded-sm transition-colors"
                    >
                      Try Again
                    </button>
                    <button
                      onClick={handleDownload}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-sm flex items-center gap-2 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download Instead
                    </button>
                  </div>
                </div>
              ) : videoUrl ? (
                <div className="relative">
                  <video
                    controls
                    autoPlay
                    className="w-full h-96 object-contain"
                    src={videoUrl}
                  >
                    Your browser does not support the video tag.
                  </video>
                  <div className="absolute top-4 right-4">
                    <button
                      onClick={handleDownload}
                      className="p-2 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-sm text-white transition-all"
                      title="Download original video"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="w-full h-96 flex items-center justify-center text-white">
                  <p>Video not available</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MediaThumbnail({ media, onClick }: { media: MediaItem; onClick: () => void }) {
  const [error, setError] = useState(false);
  const mediaUrl = `${Backend_URL}/uploads/professionals/${media.media_url}`;

  if (media.type === "image") {
    return (
      <div
        className="relative w-16 h-16 rounded-sm overflow-hidden border border-gray-300 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={onClick}
      >
        {!error ? (
          <Image
            src={mediaUrl}
            alt="Review image"
            fill
            className="object-cover"
            onError={() => setError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-xs text-gray-500">Error</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="relative w-16 h-16 rounded-sm overflow-hidden border border-gray-300 cursor-pointer hover:opacity-80 transition-opacity bg-gray-100 flex items-center justify-center"
      onClick={onClick}
    >
      <Video className="w-6 h-6 text-gray-600" />
    </div>
  );
}

function MediaGallery({ media }: { media: MediaItem[] }) {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const validMedia = media?.filter(item => item && item.media_url) || [];

  if (validMedia.length === 0) return null;

  return (
    <>
      <div className="mt-3">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Media ({validMedia.length})
        </h4>
        <div className="flex gap-2">
          {validMedia.map((item, index) => (
            <MediaThumbnail
              key={item._id || index}
              media={item}
              onClick={() => setSelectedMedia(item)}
            />
          ))}
        </div>
      </div>

      {selectedMedia && (
        <MediaModal
          media={selectedMedia}
          isOpen={!!selectedMedia}
          onClose={() => setSelectedMedia(null)}
        />
      )}
    </>
  );
}

function UserInfo({ review }: { review: Review }) {
  const user = getUserFromReview(review);

  return (
    <div className="flex-1">
      <div className="flex items-center gap-2 flex-wrap">
        <h5 className="font-semibold text-[13px] text-gray-900 dark:text-white truncate">
          {user?.username || 'Anonymous User'}
        </h5>
        <ReviewTypeBadge type={review.review_type} />
      </div>
      <p className="flex items-center gap-1 text-[12px] text-gray-500 dark:text-gray-400 mt-1">
        <Mail className="w-3 h-3" />
        {user?.email || 'No email provided'}
      </p>
    </div>
  );
}

function ReviewItem({ review }: { review: Review }) {
  const user = getUserFromReview(review);
  const hasMedia = review.media && review.media.length > 0;
  

  return (
    <div className="flex gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
      <Avatar className="w-10 h-10 border border-gray-200 dark:border-gray-600">
        <AvatarFallback className="text-[13px] font-medium bg-[#0077B6] text-white">
          {user?.username?.charAt(0).toUpperCase() || 'U'}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-3">
          <UserInfo review={review} />
          <div className="text-right">
            <StarRating rating={review.rating} />
            <DateTimeDisplay dateStr={review.createdAt} />
          </div>
        </div>

        <p className="text-[13px] text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
          {review.message}
        </p>

        {hasMedia && <MediaGallery media={review.media} />}

        {review.tags && review.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {review.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-block px-2.5 py-1 text-[11px] bg-[#0077B6]/10 text-[#0077B6] dark:bg-[#0077B6]/20 dark:text-[#0077B6] rounded-md border border-[#0077B6]/20"
              >
                {tag}
              </span>
            ))}
            {review.tags.length > 3 && (
              <span className="inline-block px-2.5 py-1 text-[11px] bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 rounded-md border border-gray-200 dark:border-gray-700">
                +{review.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function RecentReviewsCard() {
  const token = getAccessToken();
  const { data, isLoading, error } = useProfessionalLeads(token!) as {
    data: ProfessionalData | undefined;
    isLoading: boolean;
    error: any;
  };

  const router = useRouter();
  const handleReviewsClick = useCallback(() => {
    router.push("/home-services/dashboard/pro_reviews");
  }, [router]);

  if (isLoading) return <GlobalLoader />;

  if (error) {
    return (
      <div className="w-full rounded-sm border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-700 p-4">
        <div className="h-[300px] flex flex-col items-center justify-center text-center">
          <p className="text-[13px] font-semibold text-red-600 dark:text-red-400 mb-2">
            Error loading reviews
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-3 py-1.5 bg-[#0077B6] hover:bg-[#005885] text-white rounded-sm text-[13px] transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  const reviews: Review[] = Array.isArray(data?.reviews) ? data!.reviews : [];
  const recentReviews = reviews
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);


  if (reviews.length === 0) {
    return (
      <div className="w-full rounded-sm border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-700 p-4">
        <div className="flex flex-col space-y-3 mb-4">
          <h3 className="text-[15px] font-semibold text-gray-900 dark:text-white">Recent Reviews</h3>
        </div>
        <div className="h-[200px] flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <Star className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
          <p className="text-[13px] font-medium text-gray-900 dark:text-white mb-1">No reviews yet</p>
          <p className="text-[12px] text-gray-500 dark:text-gray-400">
            Customer reviews will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-sm border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-700 p-4">
      <div className="flex flex-col space-y-3 mb-4">
        <h3 className="text-[15px] font-semibold text-gray-900 dark:text-white">
          Recent {recentReviews.length} Reviews
        </h3>
      </div>

      <div className="space-y-4">
        {recentReviews.map((review) => (
          <ReviewItem key={review._id} review={review} />
        ))}
      </div>

      {reviews.length > 3 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button onClick={() => handleReviewsClick()} className="w-full text-center text-[13px] text-[#0077B6] hover:text-[#005885] font-medium transition-colors duration-200">
            View All {reviews.length} Reviews
          </button>
        </div>
      )}
    </div>
  );
}