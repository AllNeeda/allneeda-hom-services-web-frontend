import React, { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon, DownloadIcon } from "lucide-react";
import { Review } from "./ReviewMarketingSection";
import Image from "next/image";

interface ReviewCarouselProps {
  reviews: Review[];
  caption: string;
  /* eslint-disable no-unused-vars */

  onCaptionChange: (caption: string) => void;
  onSelectReview: (review: Review) => void;
  /* eslint-enable no-unused-vars */

}

const ReviewCarousel: React.FC<ReviewCarouselProps> = ({
  reviews,
  caption,
  onSelectReview
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const reviewCardRef = useRef<HTMLDivElement>(null);
  const [isDownloading] = useState(false);

  const nextReview = () => {
    const newIndex = (currentIndex + 1) % reviews.length;
    setCurrentIndex(newIndex);
    onSelectReview(reviews[newIndex]);
  };

  const prevReview = () => {
    const newIndex = (currentIndex - 1 + reviews.length) % reviews.length;
    setCurrentIndex(newIndex);
    onSelectReview(reviews[newIndex]);
  };

  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No reviews available</p>
        </CardContent>
      </Card>
    );
  }

  const currentReview = reviews[currentIndex];

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Review Card with Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={prevReview}
          disabled={reviews.length <= 1}
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>

        <div className="flex-1 mx-0 sm:mx-4 w-full sm:w-auto" ref={reviewCardRef}>
          <CardContent className="p-0 w-full">
            {/* Existing card content remains unchanged */}
            {currentReview.type === "video" && currentReview.media ? (
              <div className="relative w-full">
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-6">
                  <video
                    src={currentReview.media.url}
                    controls
                    className="w-full h-full object-contain"
                    poster={currentReview.media.thumbnail}
                  />
                </div>
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
                    {currentReview.profile.photo ? (
                      <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow-md">
                        <Image
                          src={currentReview.profile.photo}
                          alt={`${currentReview.profile.firstName} ${currentReview.profile.lastName}`}
                          width={48}
                          height={48}
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0077B6] to-[#0077B6] flex items-center justify-center flex-shrink-0 border-2 border-white shadow-md">
                        <span className="text-white font-semibold text-lg">
                          {currentReview.profile.firstName[0]}
                          {currentReview.profile.lastName[0]}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-base sm:text-lg">
                        {currentReview.profile.firstName} {currentReview.profile.lastName}
                      </p>
                      <p className="text-gray-600 text-xs sm:text-sm mt-1 truncate">
                        {currentReview.profile.email}
                      </p>
                      <div className="flex items-center mt-2">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className="w-4 h-4 text-yellow-400 fill-current"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="text-gray-500 text-xs sm:text-sm ml-2">5.0</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-800 mb-4 leading-relaxed text-sm sm:text-base">
                    {currentReview.content}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {currentReview.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-[#0077B6] text-white px-3 py-1.5 rounded-full font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 sm:p-6 w-full">
                {/* Same as above for non-video reviews */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
                  {currentReview.profile.photo ? (
                    <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow-md">
                      <Image
                        src={currentReview.profile.photo}
                        alt={`${currentReview.profile.firstName} ${currentReview.profile.lastName}`}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0077B6] to-[#0077B6] flex items-center justify-center flex-shrink-0 border-2 border-white shadow-md">
                      <span className="text-white font-semibold text-lg">
                        {currentReview.profile.firstName[0]}
                        {currentReview.profile.lastName[0]}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-base sm:text-lg">
                      {currentReview.profile.firstName} {currentReview.profile.lastName}
                    </p>
                    <p className="text-gray-600 text-xs sm:text-sm mt-1 truncate">
                      {currentReview.profile.email}
                    </p>
                    <div className="flex items-center mt-2">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-4 h-4 text-yellow-400 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="text-gray-500 text-xs sm:text-sm ml-2">5.0</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-800 mb-4 leading-relaxed text-sm sm:text-base">
                  {currentReview.content}
                </p>
                <div className="flex flex-wrap gap-2">
                  {currentReview.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-[#0077B6] text-white px-3 py-1.5 rounded-full font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {caption && (
              <div className="mt-4 sm:mt-6 pt-2 sm:pt-4 border-t border-gray-100 px-2 sm:px-6 pb-4 sm:pb-6">
                <p className="text-gray-600 text-xs sm:text-sm italic">{caption}</p>
              </div>
            )}
          </CardContent>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={nextReview}
          disabled={reviews.length <= 1}
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>

      {/* Dots & Download Button */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-4">
        <div className="flex justify-center space-x-2">
          {reviews.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                onSelectReview(reviews[index]);
              }}
              className={`h-3 w-3 rounded-full transition-all ${
                index === currentIndex ? "bg-[#0077B6] scale-125" : "bg-gray-300"
              }`}
              aria-label={`Go to review ${index + 1}`}
            />
          ))}
        </div>

        <Button
          onClick={() => console.log("Download")} // Keep your existing download logic
          disabled={isDownloading}
          className="flex items-center gap-2"
          variant="outline"
          size="sm"
        >
          <DownloadIcon className="h-4 w-4" />
          {isDownloading ? "Downloading..." : "Download to Share"}
        </Button>
      </div>
    </div>
  );
};

export default ReviewCarousel;
