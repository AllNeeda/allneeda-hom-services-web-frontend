import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Upload, Video, CheckCircle, ImagePlus } from "lucide-react";

const AddMedia = () => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [videoLinks, setVideoLinks] = useState<string[]>([]);
  const [embedLink, setEmbedLink] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setUploadedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeVideoLink = (index: number) => {
    setVideoLinks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddEmbedLink = () => {
    if (embedLink.trim()) {
      setVideoLinks((prev) => [...prev, embedLink.trim()]);
      setEmbedLink("");
    }
  };

  const handleDone = () => {
    // Implement your save logic here
    console.log("Uploaded files:", uploadedFiles);
    console.log("Video links:", videoLinks);
    alert("Media saved successfully!");
  };

  const handleTriggerUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="space-y-6">
        {/* Upload Photos Section */}
        <div className="space-y-3">
          <h1 className="font-bold text-lg text-gray-900 dark:text-white">
            Upload photos and videos
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Add photos of your work (before and after), team, workspace, or
            equipment.
          </p>

          <div className="my-4">
            <Button
              onClick={handleTriggerUpload}
              className="bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 text-white py-2 px-5 rounded-md text-sm flex items-center gap-2"
            >
              <Upload size={16} />
              Upload Media
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              multiple
              accept="image/*,video/*"
              className="hidden"
            />
          </div>

          {/* Uploaded Files Preview */}
          {uploadedFiles.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                Uploaded Media
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-md overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      {file.type.startsWith("image/") ? (
                        <ImagePlus size={32} className="text-gray-400" />
                      ) : (
                        <Video size={32} className="text-gray-400" />
                      )}
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        variant="destructive"
                        size="sm"
                        className="h-8 w-8 p-0 rounded-full"
                        onClick={() => removeFile(index)}
                      >
                        <X size={16} />
                      </Button>
                    </div>
                    <div className="mt-1 text-xs text-gray-600 dark:text-gray-400 truncate">
                      {file.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Video Embed Section */}
        <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h1 className="font-bold text-lg text-gray-900 dark:text-white">
            Embed videos from YouTube or Vimeo
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Upload your video to one of those sites and paste the link here.
          </p>

          <div className="flex flex-col sm:flex-row gap-2 mt-3">
            <Input
              type="text"
              value={embedLink}
              onChange={(e) => setEmbedLink(e.target.value)}
              className="flex-1 dark:bg-gray-800 dark:border-gray-700"
              placeholder="Enter URL or embed code"
            />
            <Button
              onClick={handleAddEmbedLink}
              className="bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 text-white whitespace-nowrap"
              disabled={!embedLink.trim()}
            >
              Add Video
            </Button>
          </div>

          {/* Video Links List */}
          {videoLinks.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                Video Links
              </h3>
              <div className="space-y-2">
                {videoLinks.map((link, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Video
                        size={16}
                        className="text-gray-500 flex-shrink-0"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                        {link}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-gray-500 hover:text-red-500"
                      onClick={() => removeVideoLink(index)}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Done Button */}
        {(uploadedFiles.length > 0 || videoLinks.length > 0) && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
            <Button
              onClick={handleDone}
              className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white flex items-center gap-2"
            >
              <CheckCircle size={16} />
              Done
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddMedia;
