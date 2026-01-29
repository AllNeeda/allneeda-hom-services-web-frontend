"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Star,
    Shield,
    ChevronDown,
    ChevronUp,
    CheckCircle2,
    XCircle,
    X,
    Play,
    Pause,
    Maximize2,
    Minimize2,
    Volume2,
    VolumeX
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { capitalizeTag } from './helpers'
import Image from 'next/image'

const ReviewsList = ({
    reviews,
    expandedReview,
    setExpandedReview,
    handleApproveReview,
    handleDeclineReview,
}: any) => {
    const Backend_URL = process.env.NEXT_PUBLIC_API_BASE_MEDIA || 'http://localhost:4000';
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentMedia, setCurrentMedia] = useState<any>(null);
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
    const [mediaItems, setMediaItems] = useState<any[]>([]);
    const [videoPlaying, setVideoPlaying] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [videoVolume, setVideoVolume] = useState(1);
    const [videoMuted, setVideoMuted] = useState(false);

    const openLightbox = useCallback((src: string, type: 'image' | 'video', index: number, reviewMedia: any[]) => {
        setCurrentMedia({ src, type });
        setCurrentMediaIndex(index);
        setMediaItems(reviewMedia);
        setLightboxOpen(true);
        setVideoPlaying(type === 'video');
    }, []);

    const closeLightbox = useCallback(() => {
        setLightboxOpen(false);
        setCurrentMedia(null);
        setCurrentMediaIndex(0);
        setMediaItems([]);
        setVideoPlaying(false);
        setIsFullscreen(false);
    }, []);

    const navigateMedia = useCallback((direction: 'next' | 'prev') => {
        if (mediaItems.length === 0) return;

        const newIndex = direction === 'next'
            ? (currentMediaIndex + 1) % mediaItems.length
            : (currentMediaIndex - 1 + mediaItems.length) % mediaItems.length;

        const item = mediaItems[newIndex];
        const src = typeof item === 'string' && item.startsWith('http')
            ? item
            : `${Backend_URL}/uploads/reviews/${item}`;

        const isVideo = /\.(mp4|webm|ogg|mov|mkv)(\?.*)?$/i.test(item) || item?.startsWith('data:video');

        setCurrentMedia({ src, type: isVideo ? 'video' : 'image' });
        setCurrentMediaIndex(newIndex);
        setVideoPlaying(isVideo);
    }, [currentMediaIndex, mediaItems, Backend_URL]);

    const toggleFullscreen = useCallback(() => {
        if (!isFullscreen) {
            const elem = document.querySelector('.lightbox-content');
            if (elem?.requestFullscreen) {
                elem.requestFullscreen();
            }
            setIsFullscreen(true);
        } else {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            }
            setIsFullscreen(false);
        }
    }, [isFullscreen]);

    const toggleVideoPlayback = useCallback(() => {
        const video = document.querySelector('.lightbox-video') as HTMLVideoElement;
        if (video) {
            if (video.paused) {
                video.play();
                setVideoPlaying(true);
            } else {
                video.pause();
                setVideoPlaying(false);
            }
        }
    }, []);

    const toggleMute = useCallback(() => {
        const video = document.querySelector('.lightbox-video') as HTMLVideoElement;
        if (video) {
            video.muted = !video.muted;
            setVideoMuted(video.muted);
            if (!video.muted) {
                video.volume = videoVolume;
            }
        }
    }, [videoVolume]);

    const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const volume = parseFloat(e.target.value);
        const video = document.querySelector('.lightbox-video') as HTMLVideoElement;
        if (video) {
            video.volume = volume;
            setVideoVolume(volume);
            setVideoMuted(volume === 0);
        }
    }, []);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!lightboxOpen) return;

            switch (e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    navigateMedia('prev');
                    break;
                case 'ArrowRight':
                    navigateMedia('next');
                    break;
                case ' ':
                    if (currentMedia?.type === 'video') {
                        e.preventDefault();
                        toggleVideoPlayback();
                    }
                    break;
                case 'f':
                case 'F':
                    toggleFullscreen();
                    break;
                case 'm':
                case 'M':
                    if (currentMedia?.type === 'video') {
                        toggleMute();
                    }
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightboxOpen, currentMedia, closeLightbox, navigateMedia, toggleVideoPlayback, toggleFullscreen, toggleMute]);

    // Fullscreen change listener
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    // Touch gestures for mobile
    useEffect(() => {
        if (!lightboxOpen || typeof window === 'undefined') return;

        let touchStartX = 0;
        let touchStartY = 0;
        const threshold = 50;

        const handleTouchStart = (e: TouchEvent) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        };

        const handleTouchEnd = (e: TouchEvent) => {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;

            // Horizontal swipe (for navigation)
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
                if (deltaX > 0) {
                    navigateMedia('prev');
                } else {
                    navigateMedia('next');
                }
            }

            // Vertical swipe down to close (only if not interacting with controls)
            if (deltaY > threshold && Math.abs(deltaX) < threshold) {
                const target = e.target as HTMLElement;
                if (!target.closest('.lightbox-controls')) {
                    closeLightbox();
                }
            }
        };

        document.addEventListener('touchstart', handleTouchStart, { passive: true });
        document.addEventListener('touchend', handleTouchEnd, { passive: true });

        return () => {
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchend', handleTouchEnd);
        };
    }, [lightboxOpen, navigateMedia, closeLightbox]);

    // Video ended handler
    useEffect(() => {
        const video = document.querySelector('.lightbox-video') as HTMLVideoElement;
        if (video) {
            const handleEnded = () => setVideoPlaying(false);
            video.addEventListener('ended', handleEnded);
            return () => video.removeEventListener('ended', handleEnded);
        }
    }, [currentMedia]);

    const renderMediaGrid = (review: any) => {
        const rawMedia = review.media;
        if (!rawMedia) return null;

        const items = Array.isArray(rawMedia)
            ? rawMedia
            : typeof rawMedia === 'string'
                ? rawMedia.split(',').map(s => s.trim()).filter(Boolean)
                : [rawMedia];

        const isVideo = (filename: string) =>
            /\.(mp4|webm|ogg|mov|mkv)(\?.*)?$/i.test(filename) ||
            filename?.startsWith('data:video');

        return (
            <div className="flex flex-wrap gap-2 mb-4">
                {items.map((item: any, index: number) => {
                    const src = typeof item === 'string' && item.startsWith('http')
                        ? item
                        : `${Backend_URL}/uploads/reviews/${item}`;
                    const videoFlag = isVideo(item);

                    if (videoFlag) {
                        return (
                            <motion.div
                                key={`${review._id}-media-${index}`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="relative rounded-sm overflow-hidden border-2 border-white dark:border-gray-800 
                                         w-28 h-20 sm:w-40 sm:h-28 md:w-48 md:h-32 cursor-pointer 
                                         group hover:border-[#0077B6]/40 transition-all duration-200"
                                onClick={() => openLightbox(src, 'video', index, items)}
                            >
                                <video
                                    src={src}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-200" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center
                                                   group-hover:bg-white group-hover:scale-110 transition-all duration-200">
                                        <Play className="w-5 h-5 text-gray-800 ml-0.5" />
                                    </div>
                                </div>
                            </motion.div>
                        );
                    }

                    return (
                        <motion.div
                            key={`${review._id}-media-${index}`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="relative rounded-sm overflow-hidden border-2 border-white dark:border-gray-800 
                                     w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 cursor-pointer
                                     group hover:border-[#0077B6]/40 transition-all duration-200"
                            onClick={() => openLightbox(src, 'image', index, items)}
                        >
                            <Image
                                src={src}
                                alt={review.client_name ? `${review.client_name} media ${index + 1}` : `Review media ${index + 1}`}
                                width={160}
                                height={160}
                                priority={index < 2}
                                unoptimized
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/20 to-transparent opacity-0 
                                           group-hover:opacity-100 transition-opacity duration-200" />
                        </motion.div>
                    );
                })}
            </div>
        );
    };

    return (
        <AnimatePresence>
            <div className="space-y-4">
                {reviews.map((review: any, index: number) => (
                    <motion.div
                        key={review._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: index * 0.03 }}
                        className="group bg-white dark:bg-gray-900 rounded-lg md:rounded-sm p-4 md:p-5 
                                 border border-gray-200 dark:border-gray-700 
                                 hover:border-[#0077B6]/20 dark:hover:border-[#0077B6]/30 
                                 transition-all hover:shadow-sm shadow-sm md:shadow-none"
                    >
                        {/* Header Section */}
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-3">
                            <div className="flex items-start gap-3 flex-1">
                                <div className="relative ">
                                    <div className="w-10 h-10 bg-[#0077B6] dark:bg-[#0077B6]/80 
                                                   rounded-lg md:rounded-sm flex items-center justify-center 
                                                   text-white font-bold text-sm">
                                        {review.client_name?.charAt(0) || 'C'}
                                    </div>
                                    {review.verified && (
                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#6742EE] 
                                                       rounded-sm flex items-center justify-center">
                                            <Shield className="w-2 h-2 text-white" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                                        <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                                            {review.client_name || 'Anonymous Client'}
                                        </h4>
                                        <span className={`
                                            px-2 py-0.5 rounded-sm text-xs font-medium w-fit 
                                            ${review.review_type === 'approved' ? 'bg-[#6742EE]/10 text-[#6742EE] dark:bg-[#6742EE]/20 dark:text-[#6742EE]/80' : ''}
                                        `}>
                                            {review.review_type
                                                ? review.review_type.charAt(0).toUpperCase() + review.review_type.slice(1)
                                                : 'Unknown'
                                            }
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2 md:gap-3 text-sm">
                                        <div className="flex items-center gap-1">
                                            <div className="flex gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-4 h-4 ${i < review.rating
                                                            ? 'text-yellow-500 fill-yellow-500'
                                                            : 'text-gray-300 dark:text-gray-600'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="font-semibold text-gray-900 dark:text-white ml-0.5">
                                                {review.rating}.0
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-start sm:items-end gap-1">
                                <div className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                    {new Date(review.createdAt).toLocaleString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Review Message */}
                        <div className="mb-4">
                            <p className={`text-sm mb-3 ${expandedReview === review._id ? '' : 'line-clamp-3'} 
                                        text-gray-700 dark:text-gray-300 leading-relaxed`}>
                                {review.message || 'The client left a rating without additional comments.'}
                            </p>
                            {review.message && review.message.length > 150 && (
                                <button
                                    onClick={() => setExpandedReview(expandedReview === review._id ? null : review._id)}
                                    className="text-xs font-medium flex items-center gap-0.5 
                                               text-[#0077B6] dark:text-[#0077B6]/80 
                                               hover:text-[#0066A3] dark:hover:text-[#0077B6]"
                                >
                                    {expandedReview === review._id ? 'Show less' : 'Read more'}
                                    {expandedReview === review._id ? (
                                        <ChevronUp className="w-3 h-3" />
                                    ) : (
                                        <ChevronDown className="w-3 h-3" />
                                    )}
                                </button>
                            )}
                        </div>

                        {/* Tags */}
                        {review.tags?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-4">
                                {review.tags.map((tag: string, i: number) => (
                                    <span
                                        key={i}
                                        className="py-1 px-2 rounded-lg md:rounded-sm text-xs 
                                                 bg-[#0077B6]/10 text-[#0077B6] 
                                                 dark:bg-[#0077B6]/20 dark:text-white/90 
                                                 border border-transparent dark:border-[#0077B6]/30"
                                    >
                                        {capitalizeTag(tag)}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Media Grid */}
                        {renderMediaGrid(review)}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 
                                     border-t border-gray-200 dark:border-gray-800 gap-3 sm:gap-0">
                            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                                <Button
                                    onClick={() => handleApproveReview(review._id)}
                                    size="sm"
                                    className={`h-8 px-3 rounded-lg md:rounded-sm text-xs 
                                             ${review.review_type === 'approved'
                                            ? 'border border-[#0077B6] text-[#0077B6] bg-white dark:bg-transparent dark:text-[#0077B6]/80'
                                            : 'border border-[#0077B6] bg-white dark:bg-transparent hover:bg-[#0066A3] hover:text-white dark:hover:bg-[#0066A3] dark:hover:text-white text-[#0077B6] dark:text-[#0077B6]/80'
                                        } w-full sm:w-auto`}
                                    disabled={review.review_type === 'approved'}
                                >
                                    <CheckCircle2 className="w-3 h-3 mr-1 " />
                                    {review.review_type === 'approved' ? 'Approved' : 'Approve'}
                                </Button>

                                <Button
                                    onClick={() => handleDeclineReview(review._id)}
                                    size="sm"
                                    variant={review.review_type === 'declined' ? undefined : 'destructive'}
                                    className={`h-8 px-3 text-xs rounded-lg md:rounded-sm 
                                             ${review.review_type === 'declined'
                                            ? 'border border-[#0077B6] text-[#0077B6] bg-white dark:bg-transparent dark:text-[#0077B6]/80'
                                            : 'border border-[#0077B6] bg-white dark:bg-transparent hover:bg-[#0066A3] hover:text-white dark:hover:bg-[#0066A3] dark:hover:text-white text-[#0077B6] dark:text-[#0077B6]/80'
                                        } w-full sm:w-auto`}
                                    disabled={review.review_type === 'declined'}
                                >
                                    <XCircle className="w-3 h-3 mr-1 " />
                                    {review.review_type === 'declined' ? 'Declined' : 'Decline'}
                                </Button>
                            </div>
                        </div>


                    </motion.div>
                ))}

                {/* Enhanced Lightbox */}
                {lightboxOpen && currentMedia && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center 
                                 bg-black/95 backdrop-blur-sm p-2 sm:p-4"
                        onClick={(e) => {
                            if (e.target === e.currentTarget) closeLightbox();
                        }}
                    >
                        {/* Close Button */}
                        <button
                            onClick={closeLightbox}
                            className="absolute top-4 right-4 z-10 p-2 
                                     bg-black/50 hover:bg-black/70 
                                     rounded-full transition-colors duration-200
                                     focus:outline-none focus:ring-2 focus:ring-white/50"
                            aria-label="Close lightbox"
                        >
                            <X className="w-6 h-6 text-white" />
                        </button>

                        {/* Navigation Arrows */}
                        {mediaItems.length > 1 && (
                            <>
                                <button
                                    onClick={() => navigateMedia('prev')}
                                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 p-3
                                             bg-black/50 hover:bg-black/70 rounded-full
                                             transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                                    aria-label="Previous media"
                                >
                                    <ChevronUp className="w-6 h-6 text-white rotate-90" />
                                </button>
                                <button
                                    onClick={() => navigateMedia('next')}
                                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 p-3
                                             bg-black/50 hover:bg-black/70 rounded-full
                                             transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                                    aria-label="Next media"
                                >
                                    <ChevronUp className="w-6 h-6 text-white -rotate-90" />
                                </button>
                            </>
                        )}

                        {/* Media Counter */}
                        {mediaItems.length > 1 && (
                            <div className="absolute top-4 left-4 z-10 px-3 py-1 
                                         bg-black/50 backdrop-blur-sm rounded-full">
                                <span className="text-sm text-white font-medium">
                                    {currentMediaIndex + 1} / {mediaItems.length}
                                </span>
                            </div>
                        )}

                        {/* Media Container */}
                        <div className="lightbox-content relative w-full max-w-6xl max-h-[90vh] 
                                     flex items-center justify-center">
                            {currentMedia.type === 'image' ? (
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                    className="relative w-full h-full flex items-center justify-center"
                                >
                                    <Image
                                        src={currentMedia.src}
                                        alt="Enlarged media"
                                        width={800}
                                        className="max-h-[60vh] w-auto object-contain"
                                        height="800"
                                    />
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                    className="relative w-full max-w-4xl bg-black rounded-lg overflow-hidden"
                                >
                                    <video
                                        src={currentMedia.src}
                                        className="lightbox-video w-full h-auto max-h-[80vh]"
                                        controls={false}
                                        autoPlay
                                        loop
                                    />

                                    {/* Custom Video Controls */}
                                    <div className="lightbox-controls absolute bottom-0 left-0 right-0 
                                                 bg-black/90 to-transparent 
                                                 p-4 sm:p-6 transition-opacity duration-300">
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-3 sm:gap-4 flex-1">
                                                <button
                                                    onClick={toggleVideoPlayback}
                                                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                                                    aria-label={videoPlaying ? 'Pause' : 'Play'}
                                                >
                                                    {videoPlaying ? (
                                                        <Pause className="w-5 h-5 text-white" />
                                                    ) : (
                                                        <Play className="w-5 h-5 text-white" />
                                                    )}
                                                </button>

                                                <button
                                                    onClick={toggleMute}
                                                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                                                    aria-label={videoMuted ? 'Unmute' : 'Mute'}
                                                >
                                                    {videoMuted ? (
                                                        <VolumeX className="w-5 h-5 text-white" />
                                                    ) : (
                                                        <Volume2 className="w-5 h-5 text-white" />
                                                    )}
                                                </button>

                                                {!videoMuted && (
                                                    <div className="hidden sm:flex items-center gap-2 flex-1 max-w-xs">
                                                        <input
                                                            type="range"
                                                            min="0"
                                                            max="1"
                                                            step="0.1"
                                                            value={videoVolume}
                                                            onChange={handleVolumeChange}
                                                            className="w-full accent-white"
                                                            aria-label="Volume"
                                                        />
                                                    </div>
                                                )}

                                                <div className="text-sm text-white font-medium">
                                                    {currentMediaIndex + 1} / {mediaItems.length}
                                                </div>
                                            </div>

                                            <button
                                                onClick={toggleFullscreen}
                                                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                                                aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                                            >
                                                {isFullscreen ? (
                                                    <Minimize2 className="w-5 h-5 text-white" />
                                                ) : (
                                                    <Maximize2 className="w-5 h-5 text-white" />
                                                )}
                                            </button>
                                        </div>

                                        {/* Mobile Volume Control */}
                                        {!videoMuted && (
                                            <div className="sm:hidden mt-3 px-2">
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="1"
                                                    step="0.1"
                                                    value={videoVolume}
                                                    onChange={handleVolumeChange}
                                                    className="w-full accent-white"
                                                    aria-label="Volume"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Swipe Hint for Mobile */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 
                                     flex items-center gap-2 px-4 py-2 
                                     bg-black/50 backdrop-blur-sm rounded-full
                                     animate-pulse pointer-events-none">
                            <span className="text-xs text-white/80 font-medium">
                                Swipe to navigate • Tap to close
                            </span>
                        </div>
                    </motion.div>
                )}
            </div>
        </AnimatePresence>
    )
}

export default ReviewsList