"use client";

import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Upload, Image as ImageIcon, X, Sparkles } from "lucide-react";
import Image from "next/image";

interface ImageUploadSectionProps {
  /* eslint-disable no-unused-vars */
  onImageSelect?: (file: File | null) => void;
  previewUrl?: string;
  label?: string;
  required?: boolean;
  compact?: boolean;
  futuristic?: boolean;
  description?: string;
  allowClear?: boolean;
  /* eslint-enable no-unused-vars */
}

const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
  onImageSelect,
  previewUrl,
  label = "Image",
  required = false,
  compact = false,
  futuristic = false,
  description = "PNG, JPG, SVG • Max 2MB",
  allowClear = true,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImageSelect) {
      onImageSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && onImageSelect) {
      onImageSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onImageSelect) {
      onImageSelect(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (futuristic) {
    return (
      <div className="">
        {label && (
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {previewUrl && allowClear && (
              <button
                type="button"
                onClick={clearImage}
                className="text-xs px-2.5 py-1 rounded-full bg-gradient-to-r from-red-500/10 to-pink-500/10 dark:from-red-500/20 dark:to-pink-500/20 text-red-600 dark:text-red-400 hover:from-red-500/20 hover:to-pink-500/20 dark:hover:from-red-500/30 dark:hover:to-pink-500/30 border border-red-200 dark:border-red-700/50 transition-all duration-200 flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>
        )}

        <div
          className={cn(
            "relative group rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer overflow-hidden",
            "hover:scale-[1.01] active:scale-[0.99]",
            isDragging
              ? "border-cyan-500 dark:border-cyan-400 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 dark:from-cyan-500/20 dark:to-blue-500/20"
              : "border-gray-300/70 dark:border-gray-700/50 hover:border-cyan-400 dark:hover:border-cyan-500 hover:bg-gradient-to-br from-cyan-500/5 to-blue-500/5 dark:from-cyan-500/10 dark:to-blue-500/10",
            previewUrl ? "min-h-[120px]" : "min-h-[100px]"
          )}
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {/* Animated background */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute top-0 left-0 w-16 h-16 bg-cyan-500/5 rounded-full blur-lg"></div>
            <div className="absolute bottom-0 right-0 w-16 h-16 bg-blue-500/5 rounded-full blur-lg"></div>
          </div>

          {previewUrl ? (
            <div className="relative w-full h-full flex items-center justify-center p-4">
              <div className="flex items-center gap-4 w-full">
                {/* Image Preview Thumbnail */}
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-gray-300/50 dark:border-gray-700/50 bg-gray-100 dark:bg-gray-800">
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      width={100}
                      height={100}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          const fallback = document.createElement("div");
                          fallback.className =
                            "w-full h-full flex items-center justify-center";
                          fallback.innerHTML = `
                            <div class="text-gray-400">
                              <ImageIcon class="w-6 h-6 mx-auto mb-1" />
                              <span class="text-xs">Image</span>
                            </div>
                          `;
                          parent.appendChild(fallback);
                        }
                      }}
                    />
                  </div>
                  {allowClear && (
                    <button
                      type="button"
                      onClick={clearImage}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center hover:scale-110 transition-transform duration-200 shadow-lg z-10"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  )}
                </div>

                {/* Preview Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <ImageIcon className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      Image Preview
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    {description}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="text-xs px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500/10 to-blue-500/10 dark:from-cyan-500/20 dark:to-blue-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-700/50 hover:from-cyan-500/20 hover:to-blue-500/20 transition-all duration-200"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Change Image
                    </button>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      or drag & drop
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full p-4">
              <div className="text-center">
                <div className="relative inline-block mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 dark:from-cyan-500/30 dark:to-blue-500/30 flex items-center justify-center mx-auto">
                    <Upload className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                    <Sparkles className="w-2.5 h-2.5 text-white" />
                  </div>
                </div>

                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                  {isDragging ? "Drop to upload" : "Click to upload"}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {description}
                </p>
              </div>
            </div>
          )}

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>
      </div>
    );
  }

  // Compact non-futuristic version
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div
        className={cn(
          "border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200",
          isDragging
            ? "border-cyan-500 dark:border-cyan-400 bg-gradient-to-br from-cyan-500/5 to-blue-500/5"
            : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50",
          previewUrl ? "p-3" : "p-4",
          compact ? "min-h-[80px]" : "min-h-[100px]"
        )}
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {previewUrl ? (
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <div
                className={cn(
                  "rounded overflow-hidden border border-gray-200 dark:border-gray-700",
                  compact ? "w-12 h-12" : "w-16 h-16"
                )}
              >
                <Image
                  src={previewUrl}
                  alt="Preview"
                  width={100}
                  height={100}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      parent.className +=
                        " flex items-center justify-center bg-gray-100 dark:bg-gray-800";
                      parent.innerHTML = `
                        <ImageIcon class="${
                          compact ? "w-5 h-5" : "w-6 h-6"
                        } text-gray-400" />
                      `;
                    }
                  }}
                />
              </div>
              {allowClear && (
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors shadow-md"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1 truncate">
                Image uploaded
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Click or drag to change
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Upload
              className={cn(
                "mx-auto mb-2 text-gray-500 dark:text-gray-400",
                compact ? "h-6 w-6" : "h-8 w-8"
              )}
            />
            <p
              className={cn(
                "font-medium text-gray-700 dark:text-gray-300",
                compact ? "text-xs" : "text-sm"
              )}
            >
              {isDragging ? "Drop image here" : "Click to upload"}
            </p>
            {!compact && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {description}
              </p>
            )}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>
    </div>
  );
};

export default ImageUploadSection;
