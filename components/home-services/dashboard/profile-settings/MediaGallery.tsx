import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChartNoAxesCombined, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const MediaGallery = () => {
  const gallery = [
    { image: "/assets/home-service/service (1).jpg" },
    { image: "/assets/home-service/service (2).jpg" },
    { image: "/assets/home-service/service (3).jpg" },
    { image: "/assets/home-service/service (4).jpg" },
  ];
  const EditMedia = "add-media";
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
        <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 mb-6">
          <div className="w-full aspect-square border flex justify-center items-center border-dashed border-gray-200 dark:border-gray-700 rounded-md">
            <label htmlFor="input-file" className="cursor-pointer">
              <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
            </label>
            <Input type="file" id="input-file" className="hidden" />
          </div>
          {gallery.map((item, index) => (
            <div key={index} className="w-full aspect-square">
              <Image
                src={item.image}
                width={100}
                height={100}
                alt="gallery image"
                className="w-full h-full rounded-md object-cover"
              />
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
