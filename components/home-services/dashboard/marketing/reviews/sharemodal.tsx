// components/reviews/ShareModal.tsx
"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  CheckCircle,
  ExternalLink,
  Calendar,
  Image as ImageIcon,
  Mail,
  Star,
  Video,
  FileText,
  Download,
  Copy,
  Zap,
  Sparkles,
  Eye,
  Camera,
} from "lucide-react";
import { toast } from "react-hot-toast";
import html2canvas from 'html2canvas';

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

interface ShareModalProps {
  review: Review;
  isOpen: boolean;
  onClose: () => void;
}

const Backend_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

function getUserFromReview(review: Review) {
  if (review.user_id && typeof review.user_id === 'object' && review.user_id !== null) {
    const userObj = review.user_id as ReviewUser;
    if (userObj.username) {
      return {
        username: userObj.username,
        email: userObj.email,
        profilePicture: userObj.profilePicture
      };
    }
  }

  if (review.username || review.email) {
    return {
      username: review.username || "Happy Customer",
      email: review.email
    };
  }

  if (review.user && review.user.username) {
    return {
      username: review.user.username,
      email: review.user.email,
      profilePicture: review.user.profilePicture
    };
  }

  return { username: "Happy Customer" };
}

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
  } catch {
    return "";
  }
}

// Card theme options
const CARD_THEMES = [
  { name: "Modern Blue", gradient: "from-blue-500 to-indigo-700", accent: "#4F46E5" },
  { name: "Professional Green", gradient: "from-emerald-500 to-teal-700", accent: "#059669" },
  { name: "Elegant Purple", gradient: "from-purple-600 to-pink-600", accent: "#9333EA" },
  { name: "Vibrant Orange", gradient: "from-amber-500 to-orange-600", accent: "#F59E0B" },
  { name: "Dark Mode", gradient: "from-gray-900 to-black", accent: "#3B82F6" },
];



export default function ShareModal({ review, isOpen, onClose }: ShareModalProps) {
  const [selectedTheme] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [shareMode, setShareMode] = useState<'social' | 'image' | 'text' | 'platform'>('social');
  const [quoteText, setQuoteText] = useState("");
  const cardRef = useRef<HTMLDivElement>(null);

  const user = getUserFromReview(review);
  const reviewUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/reviews/${review._id}`
    : '';

  const hasMedia = review.media && review.media.length > 0;
  const videos = hasMedia ? review.media.filter(m => m.type === 'video') : [];
  const images = hasMedia ? review.media.filter(m => m.type === 'image') : [];
  const hasVideo = videos.length > 0;
  const hasImages = images.length > 0;

  // Initialize quote text
  useEffect(() => {
    if (review.message) {
      const shortQuote = review.message.length > 100 
        ? `${review.message.substring(0, 100)}...` 
        : review.message;
      setQuoteText(shortQuote);
    }
  }, [review.message]);



  const generateSocialCard = async (options?: { themeIndex?: number; includeQuote?: boolean }) => {
    setIsGenerating(true);
    try {
      const themeIndex = options?.themeIndex ?? selectedTheme;
      const theme = CARD_THEMES[themeIndex];
      
      const card = document.createElement('div');
      card.style.cssText = `
        width: 1200px;
        height: 630px;
        position: fixed;
        top: -9999px;
        left: -9999px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
      `;
      
      if (hasVideo && videos.length > 0) {
        // Video-based card
        card.innerHTML = `
          <div style="width: 100%; height: 100%; position: relative; overflow: hidden; border-radius: 24px;">
            <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(135deg, ${theme.gradient.split(' ').map(g => g.replace('from-', '').replace('to-', '')).join(', ')}); opacity: 0.9;"></div>
            
            <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; align-items: center; justify-content: center; padding: 40px;">
              <div style="display: grid; grid-template-columns: 1fr 400px; gap: 40px; width: 100%; height: 100%; align-items: center;">
                <div style="color: white; display: flex; flex-direction: column; justify-content: center; height: 100%;">
                  <div style="margin-bottom: 30px;">
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                      <div style="width: 50px; height: 50px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; color: ${theme.accent};">
                        ${user.username?.charAt(0).toUpperCase() || 'C'}
                      </div>
                      <div>
                        <div style="font-size: 28px; font-weight: 700;">${user.username}</div>
                        <div style="font-size: 18px; opacity: 0.8; display: flex; align-items: center; gap: 5px;">
                          <span>Verified Review</span>
                          <span style="font-size: 24px;">•</span>
                          <span>Video Testimonial</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div style="flex: 1; display: flex; flex-direction: column; justify-content: center;">
                    <div style="font-size: 42px; font-weight: 800; line-height: 1.2; margin-bottom: 30px; text-shadow: 0 2px 10px rgba(0,0,0,0.2);">
                      ${options?.includeQuote ? `"${quoteText}"` : 'Watch Their Story'}
                    </div>
                    
                    <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px;">
                      <div style="display: flex; gap: 4px;">
                        ${Array(5).fill(0).map((_, i) => 
                          `<div style="font-size: 24px; color: ${i < review.rating ? '#FFD700' : 'rgba(255,255,255,0.3)'};">★</div>`
                        ).join('')}
                      </div>
                      <div style="font-size: 28px; font-weight: 700;">${review.rating.toFixed(1)}</div>
                    </div>
                    
                    <div style="display: flex; align-items: center; gap: 20px; margin-top: 20px;">
                      <div style="background: white; color: ${theme.accent}; padding: 12px 32px; border-radius: 12px; font-weight: 700; font-size: 18px; display: inline-block;">
                        Play Video Testimonial
                      </div>
                      <div style="font-size: 16px; opacity: 0.9;">
                        ${formatDate(review.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div style="position: relative;">
                  <div style="width: 100%; height: 400px; background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); border-radius: 20px; overflow: hidden; display: flex; align-items: center; justify-content: center; position: relative;">
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 2; width: 80px; height: 80px; background: ${theme.accent}; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                      <div style="width: 0; height: 0; border-left: 20px solid white; border-top: 12px solid transparent; border-bottom: 12px solid transparent; margin-left: 5px;"></div>
                    </div>
                    <div style="position: absolute; bottom: 20px; right: 20px; background: rgba(0,0,0,0.6); color: white; padding: 8px 16px; border-radius: 8px; font-size: 14px; font-weight: 500;">
                      Click to Play
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
      } else if (hasImages && images.length > 0) {
        // Image gallery card
        const imageUrl = `${Backend_URL}/uploads/professionals/${images[0].media_url}`;
        card.innerHTML = `
          <div style="width: 100%; height: 100%; position: relative; overflow: hidden; border-radius: 24px; background: linear-gradient(135deg, ${theme.gradient.split(' ').map(g => g.replace('from-', '').replace('to-', '')).join(', ')});">
            <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; padding: 40px;">
              <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between; color: white; position: relative; z-index: 2;">
                <div>
                  <div style="font-size: 32px; font-weight: 800; letter-spacing: 2px; margin-bottom: 10px; color: white;">allneeda</div>
                  <div style="font-size: 16px; opacity: 0.8;">Visual Customer Testimonial</div>
                </div>
                
                <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; max-width: 600px;">
                  <div style="font-size: 36px; font-weight: 700; line-height: 1.3; margin-bottom: 30px;">
                    "${review.message.substring(0, 150)}..."
                  </div>
                  
                  <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px;">
                    <div style="width: 60px; height: 60px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 24px; color: ${theme.accent};">
                      ${user.username?.charAt(0).toUpperCase() || 'C'}
                    </div>
                    <div>
                      <div style="font-size: 24px; font-weight: 700;">${user.username}</div>
                      <div style="display: flex; align-items: center; gap: 10px; margin-top: 5px;">
                        <div style="display: flex; gap: 3px;">
                          ${Array(5).fill(0).map((_, i) => 
                            `<div style="font-size: 16px; color: ${i < review.rating ? '#FFD700' : 'rgba(255,255,255,0.3)'};">★</div>`
                          ).join('')}
                        </div>
                        <span style="font-size: 18px; font-weight: 600;">${review.rating.toFixed(1)}</span>
                        <span style="opacity: 0.8;">•</span>
                        <span style="opacity: 0.8;">${formatDate(review.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  
                  ${images.length > 1 ? `
                    <div style="display: flex; gap: 10px; margin-top: 20px;">
                      ${images.slice(0, 3).map((_, i) => `
                        <div style="width: 40px; height: 40px; background: rgba(255,255,255,0.2); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 500;">
                          ${i === 2 && images.length > 3 ? `+${images.length - 2}` : i + 1}
                        </div>
                      `).join('')}
                    </div>
                  ` : ''}
                </div>
                
                <div>
                  <div style="background: white; color: ${theme.accent}; padding: 12px 32px; border-radius: 12px; font-weight: 700; font-size: 16px; display: inline-block;">
                    See ${images.length > 1 ? 'More Photos' : 'Full Review'}
                  </div>
                </div>
              </div>
              
              <div style="width: 500px; height: 100%; position: relative; margin-left: 40px;">
                <div style="width: 100%; height: 100%; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
                  <img src="${imageUrl}" style="width: 100%; height: 100%; object-fit: cover;" />
                  <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(to right, transparent 0%, rgba(0,0,0,0.2) 100%);"></div>
                </div>
                
                ${images.length > 1 ? `
                  <div style="position: absolute; bottom: -20px; right: -20px; width: 200px; height: 150px; border-radius: 12px; overflow: hidden; border: 4px solid white; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
                    <img src="${Backend_URL}/uploads/professionals/${images[1].media_url}" style="width: 100%; height: 100%; object-fit: cover;" />
                  </div>
                ` : ''}
              </div>
            </div>
          </div>
        `;
      } else {
        // Text-only card
        card.innerHTML = `
          <div style="width: 100%; height: 100%; background: linear-gradient(135deg, ${theme.gradient.split(' ').map(g => g.replace('from-', '').replace('to-', '')).join(', ')}); border-radius: 24px; overflow: hidden; position: relative;">
            <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; padding: 60px; display: flex; flex-direction: column; justify-content: center; color: white;">
              <div style="max-width: 800px; margin: 0 auto; text-align: center;">
                <div style="font-size: 48px; font-weight: 800; margin-bottom: 40px; letter-spacing: 1px;">allneeda</div>
                
                <div style="font-size: 42px; font-weight: 700; line-height: 1.2; margin-bottom: 40px; text-shadow: 0 2px 20px rgba(0,0,0,0.2);">
                  "${review.message.substring(0, 180)}..."
                </div>
                
                <div style="background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); border-radius: 20px; padding: 30px; margin-bottom: 40px; display: inline-block;">
                  <div style="display: flex; align-items: center; justify-content: center; gap: 20px; margin-bottom: 15px;">
                    <div style="width: 80px; height: 80px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 32px; color: ${theme.accent};">
                      ${user.username?.charAt(0).toUpperCase() || 'C'}
                    </div>
                    <div style="text-align: left;">
                      <div style="font-size: 28px; font-weight: 700;">${user.username}</div>
                      ${user.email ? `<div style="font-size: 18px; opacity: 0.8; margin-top: 5px;">${user.email}</div>` : ''}
                    </div>
                  </div>
                  
                  <div style="display: flex; align-items: center; justify-content: center; gap: 15px; margin-top: 15px;">
                    <div style="display: flex; gap: 5px;">
                      ${Array(5).fill(0).map((_, i) => 
                        `<div style="font-size: 24px; color: ${i < review.rating ? '#FFD700' : 'rgba(255,255,255,0.3)'};">★</div>`
                      ).join('')}
                    </div>
                    <div style="font-size: 32px; font-weight: 700; margin-left: 10px;">${review.rating.toFixed(1)}</div>
                    <div style="font-size: 18px; opacity: 0.8; margin-left: 20px;">
                      ${formatDate(review.createdAt)}
                    </div>
                  </div>
                </div>
                
                <div style="display: flex; align-items: center; justify-content: center; gap: 20px; margin-top: 40px;">
                  ${review.tags && review.tags.length > 0 ? review.tags.slice(0, 3).map(tag => `
                    <div style="background: rgba(255,255,255,0.2); padding: 10px 20px; border-radius: 20px; font-weight: 600; font-size: 14px; backdrop-filter: blur(5px);">
                      ${tag}
                    </div>
                  `).join('') : ''}
                </div>
              </div>
            </div>
            
            <!-- Decorative elements -->
            <div style="position: absolute; top: 50px; right: 50px; width: 200px; height: 200px; background: rgba(255,255,255,0.05); border-radius: 50%;"></div>
            <div style="position: absolute; bottom: 100px; left: 100px; width: 150px; height: 150px; background: rgba(255,255,255,0.03); border-radius: 50%;"></div>
          </div>
        `;
      }
      
      document.body.appendChild(card);
      
      // Wait for images to load
      const imagesInCard = card.querySelectorAll('img');
      if (imagesInCard.length > 0) {
        await Promise.all(Array.from(imagesInCard).map(img => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        }));
      }
      
      const canvas = await html2canvas(card, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        logging: false,
      });
      
      const image = canvas.toDataURL('image/png');
      
      const link = document.createElement('a');
      link.href = image;
      link.download = `allneeda-review-${user.username?.replace(/\s+/g, '-').toLowerCase()}-${review._id}-${theme.name.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.click();
      
      document.body.removeChild(card);
      toast.success(`Social card generated with ${theme.name} theme!`);
    } catch (error) {
      console.error('Error generating social card:', error);
      toast.error('Failed to generate social card');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyReviewLink = () => {
    navigator.clipboard.writeText(reviewUrl)
      .then(() => toast.success('Link copied to clipboard!'))
      .catch(() => toast.error('Failed to copy link'));
  };


  const downloadMedia = async () => {
    if (hasVideo && videos.length > 0) {
      // For video, create a download link
      const videoUrl = `${Backend_URL}/uploads/professionals/${videos[0].media_url}`;
      const link = document.createElement('a');
      link.href = videoUrl;
      link.download = `testimonial-${user.username}-${review._id}.mp4`;
      link.click();
      toast.success('Video download started!');
    } else if (hasImages && images.length > 0) {
      // For images, download the first image
      const imageUrl = `${Backend_URL}/uploads/professionals/${images[0].media_url}`;
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `testimonial-${user.username}-${review._id}.jpg`;
      link.click();
      toast.success('Image downloaded!');
    }
  };

  const previewCard = () => {
    if (cardRef.current) {
      const previewWindow = window.open('', '_blank');
      if (previewWindow) {
        previewWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Card Preview</title>
              <style>
                body { margin: 0; padding: 20px; background: #f5f5f5; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
                .preview-container { transform: scale(0.7); transform-origin: top center; }
              </style>
            </head>
            <body>
              <div class="preview-container">
                ${cardRef.current.innerHTML}
              </div>
            </body>
          </html>
        `);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-2xl w-full shadow-2xl border border-gray-200 dark:border-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with modes */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-xl">
                Advanced Sharing Tools
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {hasVideo ? 'Video Testimonial' : hasImages ? 'Photo Testimonial' : 'Text Testimonial'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={previewCard}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title="Preview Card"
            >
              <Eye className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <span className="text-2xl text-gray-500 hover:text-gray-700 dark:text-gray-400">×</span>
            </button>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setShareMode('social')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${shareMode === 'social' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
          >
            <Sparkles className="w-4 h-4 inline mr-2" />
            Social Cards
          </button>
          {hasVideo && (
            <button
              onClick={() => setShareMode('platform')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${shareMode === 'platform' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
            >
              <Video className="w-4 h-4 inline mr-2" />
              Share Video
            </button>
          )}
          {hasImages && (
            <button
              onClick={() => setShareMode('image')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${shareMode === 'image' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
            >
              <ImageIcon className="w-4 h-4 inline mr-2" />
              Share Images
            </button>
          )}
          <button
            onClick={() => setShareMode('text')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${shareMode === 'text' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Text Only
          </button>
        </div>

        {/* Review Preview */}
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                {user.username?.charAt(0).toUpperCase() || 'C'}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <h4 className="font-bold text-gray-900 dark:text-white text-lg">
                    {user.username}
                  </h4>
                  <span className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-semibold rounded-lg">
                    <CheckCircle className="w-3 h-3" />
                    Verified
                  </span>
                  {hasVideo && (
                    <span className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-xs font-semibold rounded-lg">
                      <Video className="w-3 h-3" />
                      Video
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1.5 rounded-lg">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < review.rating ? "fill-white text-white" : "fill-gray-300 text-gray-300"}`}
                    />
                  ))}
                  <span className="text-sm font-bold text-white ml-2">
                    {review.rating.toFixed(1)}
                  </span>
                </div>
              </div>
              
              {user.email && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm truncate">{user.email}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-3">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">{formatDate(review.createdAt)}</span>
              </div>
              
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                {review.message.substring(0, 140)}...
              </p>
              
              {review.tags && review.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {review.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quote Editor (for text sharing) */}
        {shareMode === 'text' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Custom Quote Text
            </label>
            <textarea
              value={quoteText}
              onChange={(e) => setQuoteText(e.target.value)}
              className="w-full h-24 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
              placeholder="Customize the quote text for sharing..."
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{quoteText.length}/280 characters</span>
              <button
                onClick={() => setQuoteText(review.message.substring(0, 280))}
                className="text-blue-600 hover:text-blue-700"
              >
                Reset to original
              </button>
            </div>
          </div>
        )}


        {/* Action Buttons */}
        <div className="space-y-3">
          {shareMode === 'social' && (
            <>
              <button
                onClick={() => generateSocialCard()}
                disabled={isGenerating}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold text-base transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Camera className="w-5 h-5" />
                    Generate Social Card
                  </>
                )}
              </button>
              
              <div className="grid grid-cols-2 gap-3">
                {CARD_THEMES.slice(0, 2).map((theme, index) => (
                  <button
                    key={theme.name}
                    onClick={() => generateSocialCard({ themeIndex: index })}
                    className="px-4 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg font-medium text-sm transition-colors"
                  >
                    {theme.name} Theme
                  </button>
                ))}
              </div>
            </>
          )}

          {shareMode === 'platform' && (
            <button
              onClick={downloadMedia}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold text-base transition-all shadow-lg hover:shadow-xl"
            >
              <Download className="w-5 h-5" />
              Download {hasVideo ? 'Video' : 'Image'}
            </button>
          )}

          {shareMode === 'text' && (
            <button
              onClick={copyReviewLink}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-semibold text-base transition-all shadow-lg hover:shadow-xl"
            >
              <Copy className="w-5 h-5" />
              Copy Review Link
            </button>
          )}

          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-200 dark:border-gray-800">
            <button
              onClick={copyReviewLink}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg font-medium text-sm transition-colors"
            >
              <Copy className="w-4 h-4" />
              Copy Link
            </button>
            <button
              onClick={() => window.open(reviewUrl, '_blank')}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg font-medium text-sm transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              View Full
            </button>
            <button
              onClick={onClose}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg font-medium text-sm transition-colors"
            >
              Done
            </button>
          </div>
        </div>

        {/* Hidden card for preview */}
        <div ref={cardRef} className="fixed top-[-9999px] left-[-9999px]">
          {/* This div will be used for preview */}
        </div>
      </div>
    </div>
  );
}