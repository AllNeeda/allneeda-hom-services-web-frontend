"use client";
import { getAccessToken, getMediacUrl } from "@/app/api/axios";
import { Button } from "@/components/ui/button";
import ErrorDisplay from "@/components/ui/ErrorDisplay";
import { Input } from "@/components/ui/input";
import { useProfessionalMedia } from "@/hooks/profileSettings/useProfileSettings";
import { useProfesssionalProgress } from "@/hooks/RegisterPro/useRegister";
import { ChartNoAxesCombined, Loader2, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {useMemo } from "react";

type MediaItem = { fileUrl?: string; youtubeEmbed?: string };

const MediaGallery = () => {
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

  const {
    data: proMeida,
    isLoading,
    isError,
  } = useProfessionalMedia(proId, token);
  const proMediaData = proMeida?.data || [];
  console.log("the pro media: ", proMediaData)
  

  const EditMedia = "add-media";
  if (isError) {
    return <ErrorDisplay />;
  }
  if (isLoading) {
    return <Loader2 />;
  }
  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="rounded-lg bg-white dark:bg-gray-800 p-4 md:p-6 my-4">
        <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2 mb-4">
          <h1 className="font-bold text-lg">Photos and Videos</h1>
          <Link
            href={`/home-services/dashboard/profile-settings/${EditMedia}`}
            className="text-sky-500 font-semibold"
          >
            Edit
          </Link>
        </div>

        {/* Gallery Grid */}
        {/* Gallery Grid */}
        <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 mb-6">
          {/* Upload Button */}
          <div className="w-full aspect-square border flex justify-center items-center border-dashed border-gray-200 dark:border-gray-700 rounded-md">
            <label htmlFor="input-file" className="cursor-pointer">
              <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
            </label>
            <Input type="file" id="input-file" className="hidden" />
          </div>

          {/* Render professional media */}
          {proMediaData?.data?.map((item: MediaItem, index: number) => (
            <div
              key={index}
              className="w-full aspect-square rounded-md overflow-hidden"
            >
              {/* If it's an image */}
              {item.fileUrl && (
                <Image
                  src={`${getMediacUrl()}${item.fileUrl}`}
                  width={100}
                  height={100}
                  alt="Professional media"
                  className="w-full h-full object-cover rounded-md"
                />
              )}

              {/* If it's a YouTube embed */}
              {item.youtubeEmbed && (
                <div
                  className="w-full h-full"
                  dangerouslySetInnerHTML={{ __html: item.youtubeEmbed }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Call to Action Section */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 my-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex-1">
              <p className="font-bold">Show off your business</p>
              <p className="text-gray-500 text-sm">
                Include photos of your work (before and after), team, workspace,
                or equipment.
              </p>
            </div>
            <Button
              type="button"
              className="bg-sky-500 text-white hover:bg-sky-500 dark:hover:bg-sky-500 whitespace-nowrap w-full md:w-auto"
            >
              <Link
                href={`/home-services/dashboard/profile-settings/${EditMedia}`}
              >
                Add Photos
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Comparison Footer */}
      <div className="flex flex-col sm:flex-row gap-2 justify-center items-center mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <div className="flex items-center">
          <ChartNoAxesCombined className="w-4 h-4 text-emerald-500 mr-1" />
          <p className="text-xs text-gray-600 dark:text-gray-300">
            Other pros in your market have an average of
          </p>
        </div>
        <strong className="text-xs text-emerald-600 dark:text-emerald-400">
          46 photos and videos
        </strong>
      </div>
    </div>
  );
};
export default MediaGallery;
