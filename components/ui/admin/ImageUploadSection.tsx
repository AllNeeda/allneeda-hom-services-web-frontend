import React from "react";
import { useRef } from "react";

interface ImageUploadSectionProps {
  /* eslint-disable no-unused-vars */
  onImageSelect?: (file: File) => void;
  previewUrl?: string;
  label?: string;
  /* eslint-enable no-unused-vars */
}

const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
  onImageSelect,
  previewUrl,
  label = "Image",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImageSelect) {
      onImageSelect(file);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50"
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="text-gray-500">
          <svg
            className="mx-auto h-12 w-12"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="mt-1">Click to upload or drag and drop</p>
          <p className="text-xs text-gray-400">
            SVG, PNG, JPG or GIF (max. 800x400px)
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>
      {previewUrl && (
        <img
          src={previewUrl}
          alt="Preview"
          className="w-24 h-16 object-cover rounded-lg mt-3 mx-auto"
        />
      )}
    </div>
  );
};

export default ImageUploadSection;
