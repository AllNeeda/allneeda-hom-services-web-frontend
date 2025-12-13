// components/reviews/MediaDisplay.tsx
"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { MediaItem } from "@/lib/review-helpers";

interface MediaDisplayProps {
  media: MediaItem[];
}

const Backend_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

export default function MediaDisplay({ media }: MediaDisplayProps) {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  if (!media || media.length === 0) return null;

  const validMedia = media.filter(item => item && item.media_url);

  if (validMedia.length === 0) return null;

  return (
    <>
      <div className="mt-3">
        <h4 className="text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-2">
          Media ({validMedia.length})
        </h4>
        <div className="flex gap-2 flex-wrap">
          {validMedia.map((item, index) => (
            <div
              key={item._id || index}
              className="relative w-16 h-16 rounded-sm overflow-hidden border border-gray-200 dark:border-gray-700 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setSelectedMedia(item)}
            >
              {item.type === "image" ? (
                <Image
                  src={`${Backend_URL}/uploads/professionals/${item.media_url}`}
                  alt="Review media"
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = `
                      <div class="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <span class="text-[11px] text-gray-500">Image</span>
                      </div>
                    `;
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center relative">
                  <Play className="w-5 h-5 text-gray-600 dark:text-gray-400 absolute" />
                  <div className="absolute inset-0 bg-black/10"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Media Modal */}
      {selectedMedia && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedMedia(null)}
        >
          <button
            onClick={() => setSelectedMedia(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10 p-2"
          >
            <span className="text-2xl">×</span>
          </button>

          <div className="relative max-w-4xl w-full max-h-[80vh]" onClick={(e) => e.stopPropagation()}>
            {selectedMedia.type === "image" ? (
              <div className="relative w-full h-[60vh]">
                <Image
                  src={`${Backend_URL}/uploads/professionals/${selectedMedia.media_url}`}
                  alt="Full size review media"
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="w-full">
                <video
                  controls
                  autoPlay
                  className="w-full max-h-[60vh]"
                  src={`${Backend_URL}/uploads/professionals/${selectedMedia.media_url}`}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}