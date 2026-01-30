// components/home-services/homepage/professional/PhotosSection.tsx
import { forwardRef, useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, X, Video, Image } from "lucide-react";

interface MediaItem {
  _id: string;
  fileUrl?: string;
  fileName?: string;
  youtubeEmbed?: string;
  source?: 'featured' | 'gallery' | 'portfolio';
  fileSize?: number;
  createdAt?: string;
  updatedAt?: string;
  professionalId?: string;
  projectId?: string | null;
  isActive?: boolean;
}

interface PhotosSectionProps {
  media?: MediaItem[];
  portfolio?: any[]; // Can be array of MediaItem or strings
  currentPhotoIndex?: number;
  /* eslint-disable no-unused-vars */
  onPhotoIndexChange?: (index: number) => void;
  /* eslint-enable no-unused-vars */
}

const PhotosSection = forwardRef<HTMLDivElement, PhotosSectionProps>(
  ({ media = [], portfolio = [], currentPhotoIndex = 0, onPhotoIndexChange }, ref) => {
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Normalize all media items to a consistent format
    const allMediaItems = useMemo(() => {
      const items: Array<{
        id: string;
        url: string;
        type: 'image' | 'video' | 'youtube';
        title?: string;
        source?: string;
        isYouTube?: boolean;
        embedHtml?: string;
      }> = [];

      // Process media array (from API)
      media.forEach((item) => {
        if (item.fileUrl) {
          items.push({
            id: item._id,
            url: item.fileUrl,
            type: 'image',
            title: item.fileName,
            source: item.source
          });
        } else if (item.youtubeEmbed) {
          items.push({
            id: item._id,
            url: '', // YouTube videos don't have a fileUrl
            type: 'youtube',
            title: 'YouTube Video',
            source: item.source,
            isYouTube: true,
            embedHtml: item.youtubeEmbed
          });
        }
      });

      // Process portfolio array (could be strings or objects)
      portfolio.forEach((item, index) => {
        if (typeof item === 'string') {
          // If it's a string URL
          items.push({
            id: `portfolio-${index}`,
            url: item,
            type: item.includes('youtube') || item.includes('youtu.be') ? 'video' : 'image',
            title: `Portfolio ${index + 1}`,
            source: 'portfolio'
          });
        } else if (item && typeof item === 'object') {
          // If it's an object similar to media items
          if (item.fileUrl || item.url || item.image) {
            const url = item.fileUrl || item.url || item.image || '';
            items.push({
              id: item._id || `portfolio-obj-${index}`,
              url: url,
              type: 'image',
              title: item.fileName || item.name || `Portfolio ${index + 1}`,
              source: item.source || 'portfolio'
            });
          }
        }
      });

      return items;
    }, [media, portfolio]);

    // Safe function to get image URL
    const getImageUrl = (photoUrl: string) => {
      if (!photoUrl || typeof photoUrl !== 'string') {
        return '';
      }
      
      // Check if it's already a full URL
      if (photoUrl.startsWith('http://') || photoUrl.startsWith('https://') || photoUrl.startsWith('data:')) {
        return photoUrl;
      }
      
      // If it starts with /uploads, prepend your base URL
      if (photoUrl.startsWith('/uploads')) {
        // Use your environment variable or a default
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_MEDIA;
        return `${baseUrl}${photoUrl}`;
      }
      
      // For relative paths
      return `${process.env.NEXT_PUBLIC_API_BASE_MEDIA || ''}/${photoUrl.replace(/^\//, '')}`;
    };

    // Extract YouTube video ID from embed HTML
    const getYouTubeVideoId = (embedHtml?: string) => {
      if (!embedHtml) return null;
      
      // Try to extract video ID from iframe src
      const match = embedHtml.match(/src="https?:\/\/www\.youtube\.com\/embed\/([^"?]+)/);
      if (match && match[1]) {
        return match[1];
      }
      
      return null;
    };

    // Get YouTube thumbnail URL
    const getYouTubeThumbnail = (embedHtml?: string) => {
      const videoId = getYouTubeVideoId(embedHtml);
      if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      }
      return '';
    };

    // Handle next/previous
    const handleNext = () => {
      if (allMediaItems.length === 0) return;
      const nextIndex = (currentPhotoIndex + 1) % allMediaItems.length;
      onPhotoIndexChange?.(nextIndex);
    };

    const handlePrev = () => {
      if (allMediaItems.length === 0) return;
      const prevIndex = (currentPhotoIndex - 1 + allMediaItems.length) % allMediaItems.length;
      onPhotoIndexChange?.(prevIndex);
    };

    // If no media, show a message
    if (allMediaItems.length === 0) {
      return (
        <div ref={ref} className="space-y-4 mt-10">
          <h3 className="text-md font-semibold">Photos & Media</h3>
          <div className="text-center py-8 border border-gray-200 dark:border-gray-700 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400">
              No photos or media available
            </p>
          </div>
        </div>
      );
    }

    const currentItem = allMediaItems[currentPhotoIndex];

    return (
      <div ref={ref} className="space-y-4 mt-10">
        <h3 className="text-md font-semibold">Photos & Media</h3>
        
        {/* Main display */}
        <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
          {currentItem.type === 'youtube' && currentItem.embedHtml ? (
            // YouTube video display
            <div 
              className="w-full h-full flex items-center justify-center cursor-pointer"
              onClick={() => setIsFullscreen(true)}
            >
              <div className="relative w-full h-full">
                {/* YouTube thumbnail with play button overlay */}
                <img
                  src={getYouTubeThumbnail(currentItem.embedHtml)}
                  alt="YouTube Video Thumbnail"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                    <div className="w-0 h-0 border-t-8 border-b-8 border-l-12 border-transparent border-l-white ml-1"></div>
                  </div>
                </div>
                <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white bg-black/50 px-2 py-1 rounded">
                  <Video className="w-4 h-4" />
                  <span className="text-xs">YouTube Video</span>
                </div>
              </div>
            </div>
          ) : (
            // Image display
            <img
              src={getImageUrl(currentItem.url) || '/placeholder-image.jpg'}
              alt={currentItem.title || `Media ${currentPhotoIndex + 1}`}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => setIsFullscreen(true)}
            />
          )}
          
          {/* Navigation buttons */}
          {allMediaItems.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
          
          {/* Media info */}
          <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
            <div className="flex items-center gap-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
              {currentItem.type === 'youtube' ? (
                <>
                  <Video className="w-3 h-3" />
                  <span>Video</span>
                </>
              ) : (
                <>
                  <Image className="w-3 h-3" />
                  <span>Photo</span>
                </>
              )}
            </div>
            <div className="bg-black/50 text-white text-xs px-2 py-1 rounded">
              {currentPhotoIndex + 1} / {allMediaItems.length}
            </div>
          </div>
        </div>
        
        {/* Thumbnail grid */}
        {allMediaItems.length > 1 && (
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mt-4">
            {allMediaItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => onPhotoIndexChange?.(index)}
                className={`relative aspect-square rounded overflow-hidden border-2 ${
                  index === currentPhotoIndex 
                    ? 'border-sky-500 dark:border-sky-400' 
                    : 'border-transparent'
                }`}
              >
                {item.type === 'youtube' && item.embedHtml ? (
                  // YouTube thumbnail
                  <div className="relative w-full h-full">
                    <img
                      src={getYouTubeThumbnail(item.embedHtml) || '/placeholder-thumb.jpg'}
                      alt="YouTube Thumbnail"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                        <div className="w-0 h-0 border-t-3 border-b-3 border-l-4 border-transparent border-l-white ml-0.5"></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Image thumbnail
                  <img
                    src={getImageUrl(item.url) || '/placeholder-thumb.jpg'}
                    alt={item.title || `Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                )}
              </button>
            ))}
          </div>
        )}
        
        {/* Fullscreen modal */}
        {isFullscreen && (
          <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
            
            {currentItem.type === 'youtube' && currentItem.embedHtml ? (
              // Fullscreen YouTube video
              <div className="w-full max-w-4xl aspect-video">
                <div 
                  className="w-full h-full"
                  dangerouslySetInnerHTML={{ __html: currentItem.embedHtml }}
                />
              </div>
            ) : (
              // Fullscreen image
              <img
                src={getImageUrl(currentItem.url)}
                alt={currentItem.title || `Fullscreen media ${currentPhotoIndex + 1}`}
                className="max-w-full max-h-full object-contain"
              />
            )}
            
            {allMediaItems.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-2 hover:bg-white/10 rounded-full"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-2 hover:bg-white/10 rounded-full"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}
          </div>
        )}
      </div>
    );
  }
);

PhotosSection.displayName = "PhotosSection";

export default PhotosSection;