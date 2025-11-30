// src/components/marketing-hub/ReviewMarketingSection.tsx
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReviewCarousel from "./ReviewCarousel";
import { Button } from "@/components/ui/button";
import { ShareIcon, DownloadIcon } from "lucide-react";

// Define types for our reviews
export interface Review {
  id: string;
  type: 'video' | 'text';
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    photo?: string;
  };
  content: string;
  tags: string[];
  media?: {
    type: 'image' | 'video';
    url: string;
    thumbnail?: string;
  };
  timestamp: Date;
}

// Sample reviews data
const sampleReviews: Review[] = [
  {
    id: "1",
    type: 'text',
    profile: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    content: "Amazing service! The team was professional and completed the work faster than expected. Highly recommended!",
    tags: ["Homeservices", "Satisfied", "Professional"],
    timestamp: new Date("2023-10-15")
  },
  {
    id: "2",
    type: 'video',
    profile: {
      firstName: "Sarah",
      lastName: "Smith",
      email: "sarah.smith@example.com"
    },
    content: "I've never been happier with a home service. They went above and beyond!",
    tags: ["quality", "excellent", "recommend"],
    media: {
      type: 'video',
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      thumbnail: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=300&h=200&fit=crop"
    },
    timestamp: new Date("2023-10-10")
  },
  {
    id: "3",
    type: 'text',
    profile: {
      firstName: "Mike",
      lastName: "Johnson",
      email: "mike.johnson@example.com",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    content: "Fair pricing and excellent workmanship. Will definitely use again for future projects.",
    tags: ["fairpricing", "qualitywork", "reliable"],
    media: {
      type: 'image',
      url: "https://images.unsplash.com/photo-1585123388860-be6b28cb9c43?w=300&h=200&fit=crop"
    },
    timestamp: new Date("2023-10-05")
  }
];

const ReviewMarketingSection: React.FC = () => {
  const [caption, setCaption] = useState("Show your happy customers. Boost trust. #localpros #trustedreviews");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);

  // Simulate loading reviews from an API
  useEffect(() => {
    setTimeout(() => {
      setReviews(sampleReviews);
      if (sampleReviews.length > 0) {
        setSelectedReview(sampleReviews[0]);
      }
    }, 500);
  }, []);

  const handleShareToShootak = async (review: Review) => {
    try {
      if (review.type === 'video' && review.media) {
        console.log("Sharing video to Shootak:", review.media.url);
      } else {
        console.log("Sharing text review to Shootak");
      }
      alert(`Review shared successfully to Shootak!`);
    } catch (error) {
      console.error("Failed to share to Shootak:", error);
      alert("Failed to share review. Please try again.");
    }
  };

  const handleDownload = (review: Review) => {
    if (review.type === 'video' && review.media) {
      const link = document.createElement('a');
      link.href = review.media.url;
      link.download = `review-${review.id}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const element = document.createElement("a");
      const file = new Blob([review.content], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `review-${review.id}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="w-full border-0 bg-gray-50 dark:bg-gray-900 shadow-none">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle className="text-xl md:text-2xl text-center md:text-left">
            Review–Driven Marketing for Professionals
          </CardTitle>
          {selectedReview && (
            <div className="flex justify-center md:justify-end space-x-2 w-full md:w-auto">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center"
                onClick={() => handleDownload(selectedReview)}
              >
                <DownloadIcon className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Download</span>
              </Button>
              <Button
                size="sm"
                className="flex items-center"
                onClick={() => handleShareToShootak(selectedReview)}
              >
                <ShareIcon className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Share to Shootak</span>
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            Turn your satisfied customers into your best sales tool. Share reviews as ready-made posts on Instagram/TikTok or directly to Shootak, and increase your visibility in search results.
          </p>

          {reviews.length > 0 ? (
            <ReviewCarousel
              reviews={reviews}
              caption={caption}
              onCaptionChange={setCaption}
              onSelectReview={setSelectedReview}
            />
          ) : (
            <div className="flex items-center justify-center h-40">
              <p className="text-muted-foreground">Loading reviews...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewMarketingSection;