import React, { useState, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Upload, Video, CheckCircle } from "lucide-react";
import { getAccessToken } from "@/app/api/axios";
import { useProfesssionalProgress } from "@/hooks/RegisterPro/useRegister";
import { createProMedia } from "@/app/api/services/professional";

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

  const getYouTubeEmbedUrl = (url: string): string | null => {
    // Handle various YouTube URL formats
    /* eslint-disable no-useless-escape */
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    /* eslint-enable no-useless-escape */
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }

    // Check if it's already an embed URL
    if (url.includes("youtube.com/embed/")) {
      return url;
    }

    return null;
  };

  const getVimeoEmbedUrl = (url: string): string | null => {
    // Handle Vimeo URL formats
    /* eslint-disable no-useless-escape */
    const regExp = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)([0-9]+)/;
    /* eslint-enable no-useless-escape */
    const match = url.match(regExp);

    if (match && match[1]) {
      return `https://player.vimeo.com/video/${match[1]}`;
    }

    return null;
  };

  // const getVideoThumbnail = (url: string): string | null => {
  //   const youtubeEmbedUrl = getYouTubeEmbedUrl(url);
  //   if (youtubeEmbedUrl) {
  //     const videoId = youtubeEmbedUrl.split("/embed/")[1];
  //     return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  //   }
  //   return null;
  // };

  const isVideoLink = (url: string): boolean => {
    return getYouTubeEmbedUrl(url) !== null || getVimeoEmbedUrl(url) !== null;
  };

  const handleAddEmbedLink = () => {
    if (embedLink.trim()) {
      if (isVideoLink(embedLink.trim())) {
        setVideoLinks((prev) => [...prev, embedLink.trim()]);
        setEmbedLink("");
      } else {
        alert("Please enter a valid YouTube or Vimeo URL");
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddEmbedLink();
    }
  };

  const token = getAccessToken() || "";
  const { data: professionalData } = useProfesssionalProgress(token);

  const proId = useMemo(() => {
    if (!professionalData) return null;
    const id = Array.isArray(professionalData)
      ? professionalData?.[0]?._id
      : professionalData?._id;
    if (id) localStorage.setItem("proId", id);
    return id;
  }, [professionalData]);

  const handleDone = async () => {
    try {
      const payload = {
        uploadedFiles,
        videoLinks,
        source: "gallery",
      };

      const response = await createProMedia(payload, token, proId);

      console.log("Server response:", response);
      alert("Media uploaded successfully!");
    } catch (error) {
      console.log("Error uploading: ", error);
      alert("Upload failed: ");
    }
  };

  const handleTriggerUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="space-y-8">
        {/* Upload Photos Section */}
        <div className="space-y-4">
          <div>
            <h1 className="font-bold text-xl text-gray-900 dark:text-white mb-2">
              Upload Photos and Videos
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Add photos of your work (before and after), team, workspace, or
              equipment. Supports images and video files.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <Button
              onClick={handleTriggerUpload}
              className="bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 text-white py-3 px-6 rounded-lg text-sm font-medium flex items-center gap-3 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Upload size={18} />
              Upload Media
            </Button>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              PNG, JPG, MP4 up to 50MB
            </span>
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
            <div className="mt-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 text-lg">
                Uploaded Media ({uploadedFiles.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="w-40 h-30 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 flex items-center justify-center transition-all duration-200 group-hover:border-sky-300 dark:group-hover:border-sky-600">
                      {file.type.startsWith("image/") ? (
                        <div className="flex flex-col items-center gap-2 text-gray-400">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-gray-400">
                          <Video size={32} />
                          <span className="text-xs">Video</span>
                        </div>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100 rounded-lg">
                      <Button
                        variant="destructive"
                        size="sm"
                        className="h-9 w-9 p-0 rounded-full bg-red-500 hover:bg-red-600 transition-all"
                        onClick={() => removeFile(index)}
                      >
                        <X size={16} />
                      </Button>
                    </div>
                    <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 truncate text-center px-1">
                      {file.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Video Embed Section */}
        <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div>
            <h1 className="font-bold text-xl text-gray-900 dark:text-white mb-2">
              Embed Videos from YouTube or Vimeo
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Paste YouTube or Vimeo links to embed videos directly. The video
              player will be displayed immediately.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              type="text"
              value={embedLink}
              onChange={(e) => setEmbedLink(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 dark:bg-gray-800 dark:border-gray-700 dark:text-white py-2.5 px-4 rounded-lg border-2 focus:border-sky-300 dark:focus:border-sky-600 transition-colors"
              placeholder="Paste YouTube or Vimeo URL here..."
            />
            <Button
              onClick={handleAddEmbedLink}
              className="bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 text-white whitespace-nowrap py-2.5 px-6 font-medium transition-all duration-200 shadow-sm hover:shadow-md"
              disabled={!embedLink.trim()}
            >
              Add Video
            </Button>
          </div>

          {/* Video Links List with Previews */}
          {videoLinks.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 text-lg">
                Embedded Videos ({videoLinks.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {videoLinks.map((link, index) => {
                  const youtubeEmbedUrl = getYouTubeEmbedUrl(link);
                  const vimeoEmbedUrl = getVimeoEmbedUrl(link);
                  const embedUrl = youtubeEmbedUrl || vimeoEmbedUrl;
                  // const thumbnail = getVideoThumbnail(link);

                  return (
                    <div
                      key={index}
                      className="relative group w-80 h-50 overflow-hidden rounded border border-gray-200 dark:border-gray-700"
                    >
                      {embedUrl ? (
                        <div className="aspect-video w-full h-full">
                          <iframe
                            src={embedUrl}
                            className="w-full h-full"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title={`Embedded video ${index + 1}`}
                          />
                        </div>
                      ) : (
                        <div className="aspect-video bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <div className="text-center text-gray-500 dark:text-gray-400">
                            <Video size={32} className="mx-auto mb-2" />
                            <p className="text-sm">Invalid video URL</p>
                          </div>
                        </div>
                      )}

                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Button
                          variant="destructive"
                          size="sm"
                          className="h-8 w-8 p-0 rounded-full bg-red-500 hover:bg-red-600 bg-opacity-90 hover:bg-opacity-100"
                          onClick={() => removeVideoLink(index)}
                        >
                          <X size={14} />
                        </Button>
                      </div>

                      {/* <div className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <Play
                              size={16}
                              className="text-gray-500 flex-shrink-0"
                            />
                            <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                              {link}
                            </span>
                          </div>
                        </div>
                      </div> */}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Done Button */}
        {(uploadedFiles.length > 0 || videoLinks.length > 0) && (
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
            <Button
              onClick={handleDone}
              className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white flex items-center gap-2 py-2.5 px-6 font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <CheckCircle size={18} />
              Save Media
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddMedia;
