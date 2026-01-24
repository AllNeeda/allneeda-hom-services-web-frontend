"use client";

import React, { useState, useRef, ChangeEvent, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star, X, Video, Check, Upload,
  ThumbsUp, Award, Clock, Shield,
  Send, Loader2, Camera,
  MessageSquare, Building,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import toast from "react-hot-toast";
import RegisterUserModal from "./createUser";
import { useReviewSubmission } from "@/hooks/useReviews";
import { useReviews } from "@/hooks/useReviews";
import GlobalLoader from "@/components/ui/global-loader";

type ReviewsProps = {
  id: string;
};

type MediaFile = {
  id: string;
  type: "image" | "video";
  url: string;
  file: File;
  preview: string;
  uploaded: boolean;
};

const REVIEW_TAGS = [
  {
    id: "value",
    label: "Value",
    description: "Great value for money",
    icon: <Award className="w-3 h-3" />
  },
  {
    id: "punctuality",
    label: "Punctuality",
    description: "Always on time",
    icon: <Clock className="w-3 h-3" />
  },
  {
    id: "Work-quality",
    label: "Work Quality",
    description: "Excellent craftsmanship",
    icon: <ThumbsUp className="w-3 h-3" />
  },
  {
    id: "Professionalism",
    label: "Professionalism",
    description: "Professional conduct",
    icon: <Shield className="w-3 h-3" />
  },
  {
    id: "responsiveness",
    label: "Responsiveness",
    description: "Quick responses",
    icon: <MessageSquare className="w-3 h-3" />
  },
];

export default function Reviews({ id }: ReviewsProps) {
  const { data, isLoading, isError, error } = useReviews(id);
  const professionalData = data?.data || data?.professional || data || null;
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [additionalComments, setAdditionalComments] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragAreaRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const submitReview = useReviewSubmission();
  const [createdUserId, setCreatedUserId] = useState<string | undefined>(undefined);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const pendingSubmitRef = useRef<any>(null);
  const handleFilesRef = React.useRef<any>(null);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent) => {
      if (!dragAreaRef.current?.contains(e.relatedTarget as Node)) {
        setIsDragging(false);
      }
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      if (e.dataTransfer?.files) {
        handleFilesRef.current?.(Array.from(e.dataTransfer.files));
      }
    };

    const area = dragAreaRef.current;
    if (area) {
      area.addEventListener('dragover', handleDragOver);
      area.addEventListener('dragleave', handleDragLeave);
      area.addEventListener('drop', handleDrop);
    }

    return () => {
      if (area) {
        area.removeEventListener('dragover', handleDragOver);
        area.removeEventListener('dragleave', handleDragLeave);
        area.removeEventListener('drop', handleDrop);
      }
    };
  }, []);

  const handleFiles = useCallback((files: File[]) => {
    const MAX_FILES = 3;
    const MAX_FILE_SIZE_MB = 20;

    const remainingSlots = MAX_FILES - mediaFiles.length;
    if (remainingSlots <= 0) {
      toast.error(`Maximum ${MAX_FILES} files allowed`);
      return;
    }

    const filesToAdd = files.slice(0, remainingSlots);
    if (filesToAdd.length === 0) {
      toast.error(`Maximum ${MAX_FILES} files allowed`);
      return;
    }

    filesToAdd.forEach(file => {
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");

      if (!isImage && !isVideo) {
        toast.error("Only image and video files are allowed");
        return;
      }

      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB > MAX_FILE_SIZE_MB) {
        toast.error(`File ${file.name} exceeds ${MAX_FILE_SIZE_MB}MB limit`);
        return;
      }

      const url = URL.createObjectURL(file);
      const mediaItem: MediaFile = {
        id: `media-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: isImage ? "image" : "video",
        url,
        file,
        preview: url,
        uploaded: false
      };
      setMediaFiles(prev => [...prev, mediaItem]);

      setTimeout(() => {
        setMediaFiles(prev =>
          prev.map(m => m.id === mediaItem.id ? { ...m, uploaded: true } : m)
        );
      }, 1000);
    });
  }, [mediaFiles]);

  useEffect(() => {
    handleFilesRef.current = handleFiles;
  }, [handleFiles]);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const handleTagClick = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(prev => prev.filter(id => id !== tagId));
      return;
    }

    if (selectedTags.length >= 3) {
      toast.error("Maximum 3 tags allowed");
      return;
    }
    setSelectedTags(prev => [...prev, tagId]);
  };

  const removeMediaFile = (id: string) => {
    setMediaFiles(prev => {
      const fileToRemove = prev.find(file => file.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.url);
      }
      return prev.filter(file => file.id !== id);
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async () => {
    pendingSubmitRef.current = async (overrideUserId?: string) => {
      await runSubmit(overrideUserId);
    };
    setShowRegisterModal(true);
  };

  const runSubmit = async (overrideUserId?: string) => {
    try {
      const validationData: any = {
        rating,
        additionalComments,
      };
      if (rating >= 3) validationData.tags = selectedTags;
      setIsSubmitting(true);
      if (mediaFiles.length > 0) {
        const form = new FormData();
        // backend expects snake_case field names
        form.append("professional_id", id);
        form.append("rating", String(rating));
        form.append("comments", additionalComments);
        if (rating >= 3) {
          selectedTags.forEach((t) => form.append("tags[]", t));
        }
        form.append(
          "mediaMeta",
          JSON.stringify(mediaFiles.map((m) => ({ type: m.type, name: m.file.name })))
        );
        mediaFiles.forEach((m) => {
          form.append("media", m.file, m.file.name);
        });

        const userIdToUse = overrideUserId ?? createdUserId;
        if (userIdToUse) {
          form.append("user_id", userIdToUse as string);
        }
        await submitReview.mutateAsync(form);
      } else {
        const payload = {
          professional_id: id,
          rating,
          tags: rating >= 3 ? selectedTags : [],
          comments: additionalComments,
          media: mediaFiles.map((m) => ({ type: m.type, name: m.file.name })),
          user_id: overrideUserId ?? createdUserId,
        };

        await submitReview.mutateAsync(payload);
      }

      setIsSubmitting(false);
      setRating(0);
      setSelectedTags([]);
      setMediaFiles([]);
      setAdditionalComments("");
    } catch {
      setIsSubmitting(false);
    }
  };

  const RatingTooltip = ({ value }: { value: number }) => {
    const labels = [
      "Terrible",
      "Poor",
      "Average",
      "Good",
      "Excellent"
    ];

    return (
      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-3 py-2 bg-gray-900 dark:bg-gray-900 text-white text-xs rounded-sm whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-10">
        {labels[value - 1]}
      </div>
    );
  };

  const isSubmitDisabled = rating === 0 || (rating >= 3 && selectedTags.length === 0) || isSubmitting || additionalComments.trim().length === 0;
  const showTagSection = rating >= 3;

  if (isLoading) return <GlobalLoader />;
  if (isError) return <div className="text-red-600 dark:text-red-400">Error loading data: {String(error)}</div>;
  const yearsInBusiness = professionalData?.founded_year ? Math.max(0, new Date().getFullYear() - Number(professionalData.founded_year)) : 0;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Review Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[#0077B6] rounded-sm">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Share Your Experience
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Your feedback helps others make better decisions about {professionalData?.business_name || "this professionalData"}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Professional Info Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 bg-white dark:bg-gray-900 rounded-sm p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left Column - Profile Info */}
            <div className="flex-1">
              <div className="flex items-start gap-4 mb-6">
                {professionalData?.profile_image ? (
                  <div className="relative w-16 h-16 rounded-sm overflow-hidden">
                    <Image
                      src={`${backendUrl}/uploads/professionals/${professionalData.profile_image}`}
                      alt={professionalData.business_name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-[#0077B6] rounded-sm flex items-center justify-center">
                    <Building className="w-8 h-8 text-white" />
                  </div>
                )}
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    {professionalData?.business_name || "Professional"}
                  </h1>
                  <div className="flex items-center gap-3">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {professionalData?.business_type === "company" ? "Company" : "Individual"} • {yearsInBusiness > 0 ? `${yearsInBusiness} Year${yearsInBusiness > 1 ? 's' : ''} in business` : "New business"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Rating Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 rounded-sm p-6 mb-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-[#0077B6]/10 dark:bg-[#0077B6]/20 rounded-sm">
              <Star className="w-5 h-5 text-[#0077B6] dark:text-[#40A9FF]" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                How would you rate your overall experience with {professionalData?.business_name || "this professional"}?
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Select your rating below
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex gap-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <div key={star} className="relative group">
                      <button
                        type="button"
                        className="relative p-1 transition-transform hover:scale-105"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                      >
                        <div className={cn(
                          "w-9 h-9 md:w-10 md:h-10 rounded-sm flex items-center justify-center",
                          (hoverRating || rating) >= star
                            ? "bg-[#BE13BF]/10 dark:bg-[#BE13BF]/20"
                            : "bg-gray-100 dark:bg-gray-900"
                        )}>
                          <Star
                            className={cn(
                              "w-5 h-5 md:w-6 md:h-6 transition-colors",
                              (hoverRating || rating) >= star
                                ? "fill-[#BE13BF] text-[#BE13BF] dark:fill-[#E83FF0] dark:text-[#E83FF0]"
                                : "fill-gray-300 text-gray-300 dark:fill-gray-600 dark:text-gray-600"
                            )}
                          />
                        </div>
                      </button>
                      <RatingTooltip value={star} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center">
                <div className="text-[13px] font-semibold text-gray-900 dark:text-white mb-1">
                  {rating > 0 ? (
                    rating === 5 ? "Excellent" : rating === 4 ? "Good" : rating === 3 ? "Average" : rating === 2 ? "Poor" : "Terrible"
                  ) : (
                    "Not Rated"
                  )}
                </div>

                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mr-1">
                    {rating === 0 ? "—" : rating}
                  </span>
                  <span className="text-base text-gray-500 dark:text-gray-400">/5</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tags Section - Only show if rating >= 3 */}
        <AnimatePresence>
          {showTagSection && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white dark:bg-gray-900 rounded-sm p-6 mb-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[#6742EE]/10 dark:bg-[#6742EE]/20 rounded-sm">
                    <ThumbsUp className="w-5 h-5 text-[#6742EE] dark:text-[#8A6CFF]" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                      What stood out the most about {professionalData?.business_name || "this professionalData"}?
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Choose up to three aspects
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-base font-bold text-[#0077B6] dark:text-[#40A9FF]">
                    {selectedTags.length}/3
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">selected</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {REVIEW_TAGS.map((tag) => {
                  const isSelected = selectedTags.includes(tag.id);

                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => handleTagClick(tag.id)}
                      className={cn(
                        "p-3 rounded-sm border transition-all text-left",
                        "flex items-start gap-3",
                        isSelected
                          ? "bg-[#0077B6]/10 dark:bg-[#0077B6]/20 border-[#0077B6] dark:border-[#40A9FF]"
                          : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-600 hover:border-[#0077B6]/50 dark:hover:border-[#40A9FF]/50"
                      )}
                    >
                      <div className={cn(
                        "p-2 rounded-sm",
                        isSelected
                          ? "bg-[#0077B6] dark:bg-[#40A9FF] text-white"
                          : "bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
                      )}>
                        {tag.icon}
                      </div>

                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white mb-0.5 text-sm">
                          {tag.label}
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-300">
                          {tag.description}
                        </p>
                      </div>

                      {isSelected && (
                        <div className="w-5 h-5 bg-[#0077B6] dark:bg-[#40A9FF] rounded-sm flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Media Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-900 rounded-sm p-6 mb-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-[#BE13BF]/10 dark:bg-[#BE13BF]/20 rounded-sm">
              <Camera className="w-5 h-5 text-[#BE13BF] dark:text-[#E83FF0]" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                Add Photos (optional)
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Upload up to 3 photos or videos
              </p>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          <div
            ref={dragAreaRef}
            className={cn(
              "relative rounded-sm border border-dashed transition-colors",
              isDragging
                ? "border-[#0077B6] dark:border-[#40A9FF] bg-[#0077B6]/5 dark:bg-[#0077B6]/10"
                : "border-gray-300 dark:border-gray-600",
              mediaFiles.length === 0 ? "p-8" : "p-4"
            )}
          >
            {mediaFiles.length === 0 ? (
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 mb-3 bg-gray-100 dark:bg-gray-900 rounded-sm">
                  <Upload className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Drag & drop or click to upload
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  Supports JPG, PNG, MP4 up to 20MB
                </p>
                <button
                  type="button"
                  onClick={triggerFileInput}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#0077B6] dark:bg-[#40A9FF] text-white text-sm rounded-sm hover:bg-[#0066A3] dark:hover:bg-[#1890FF] transition-colors"
                >
                  <Upload className="w-3 h-3" />
                  Browse Files
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      Media Preview
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {mediaFiles.length} of 3 files
                    </p>
                  </div>
                  {mediaFiles.length < 3 && (
                    <button
                      type="button"
                      onClick={triggerFileInput}
                      className="text-xs text-[#0077B6] dark:text-[#40A9FF] hover:text-[#0066A3] dark:hover:text-[#1890FF] transition-colors"
                    >
                      + Add More
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <AnimatePresence>
                    {mediaFiles.map((file) => (
                      <motion.div
                        key={file.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="relative group"
                      >
                        <div className="relative aspect-square rounded-sm overflow-hidden bg-gray-100 dark:bg-gray-900">
                          {file.type === "image" ? (
                            <Image
                              src={file.preview}
                              alt="Uploaded media"
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Video className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                            </div>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => removeMediaFile(file.id)}
                          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>

                        {!file.uploaded && (
                          <div className="absolute top-1 left-1">
                            <div className="w-5 h-5 bg-blue-500 rounded-sm flex items-center justify-center">
                              <Loader2 className="w-3 h-3 text-white animate-spin" />
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {mediaFiles.length < 3 && (
                    <button
                      type="button"
                      onClick={triggerFileInput}
                      className="aspect-square border border-dashed border-gray-300 dark:border-gray-600 rounded-sm hover:border-[#0077B6] dark:hover:border-[#40A9FF] transition-colors flex items-center justify-center"
                    >
                      <PlusIcon />
                    </button>
                  )}
                </div>
              </div>
            )}

            {isDragging && (
              <div className="absolute inset-0 bg-[#0077B6]/10 dark:bg-[#0077B6]/20 flex items-center justify-center">
                <div className="text-center">
                  <Upload className="w-8 h-8 text-[#0077B6] dark:text-[#40A9FF] mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Drop files here
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Comments */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-900 rounded-sm p-6 mb-6 border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
            Comments
          </h3>
          <textarea
            value={additionalComments}
            onChange={(e) => setAdditionalComments(e.target.value)}
            placeholder={`Share your message about your experience with ${professionalData?.business_name || "this professional"}`}
            className="w-full h-32 px-4 py-3 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-sm resize-none focus:outline-none focus:ring-1 focus:ring-[#0077B6] dark:focus:ring-[#40A9FF] focus:border-[#0077B6] dark:focus:border-[#40A9FF] transition-all text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <button
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            className={cn(
              "w-full py-3.5 px-4 text-sm font-medium rounded-sm transition-colors",
              "flex items-center justify-center gap-2",
              isSubmitDisabled
                ? "bg-gray-100 dark:bg-gray-900 text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-700 cursor-not-allowed"
                : "bg-[#0077B6] dark:bg-[#40A9FF] text-white hover:bg-[#0066A3] dark:hover:bg-[#1890FF]"
            )}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit Review
              </>
            )}
          </button>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-600 dark:text-gray-300">
              By clicking Submit you agree to the{" "}
              <a href="#" className="text-[#0077B6] dark:text-[#40A9FF] hover:underline">
                Terms of Use
              </a>{" "}
              and{" "}
              <a href="#" className="text-[#0077B6] dark:text-[#40A9FF] hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </motion.div>

        {/* Submitting overlay */}
        {isSubmitting && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60">
            <div className="bg-white dark:bg-gray-900 px-6 py-5 rounded-md flex items-center gap-4 shadow-lg">
              <Loader2 className="w-5 h-5 animate-spin text-[#0077B6] dark:text-[#40A9FF]" />
              <div className="text-sm font-medium text-gray-900 dark:text-white">Submitting your review...</div>
            </div>
          </div>
        )}

        {/* Register modal (opens before submitting if needed) */}
        <RegisterUserModal
          open={showRegisterModal}
          onClose={() => setShowRegisterModal(false)}
          onCreated={async (userId) => {
            setShowRegisterModal(false);
            if (userId) setCreatedUserId(userId);
            if (pendingSubmitRef.current) {
              const fn = pendingSubmitRef.current;
              pendingSubmitRef.current = null;
              await fn(userId);
            }
          }}
        />
      </div>
    </div>
  );
}

function PlusIcon() {
  return (
    <svg
      className="w-5 h-5 text-gray-400 dark:text-gray-500"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4v16m8-8H4"
      />
    </svg>
  );
}