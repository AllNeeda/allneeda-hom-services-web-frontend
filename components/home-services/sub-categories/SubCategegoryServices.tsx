import { getStaticURL } from "@/app/api/axios";
import { motion } from "framer-motion";
import { Tags, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ServicesInterface {
  id: string;
  title: string;
  text: string;
  slug: string;
  season: string;
  imageUrl: string;
}

type ServiceTypeProps = {
  service: ServicesInterface;
};

const SubCategoryServices = ({ service }: ServiceTypeProps) => {
  const { id, title, text, season, imageUrl } = service;
  const API_BASE_URL = getStaticURL();

  return (
    <div className="">
      <Link href={`/home-services/professional-service/${id}`}>
        <div className="group relative rounded overflow-hidden shadow hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-gray-800 h-full">
          {/* Image with gradient overlay */}
          <div className="relative h-36 w-full overflow-hidden">
            <Image
              src={`${API_BASE_URL}/${imageUrl}`}
              alt={title}
              fill
              sizes="(max-width: 768px) 280px, 280px"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Season badge */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="absolute top-3 left-3 z-10"
            >
              <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-sm">
                <div className="flex items-center gap-1">
                  <Tags className="w-4 h-4 text-orange-500" />
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300 capitalize">
                    {season} upkeep
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Favorite button */}
            <motion.button
              whileTap={{ scale: 1.3 }}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 dark:bg-gray-700/90 backdrop-blur-sm shadow-sm hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
            >
              <Heart className="w-4 h-4 text-gray-600 dark:text-gray-300 group-hover:text-red-500 transition-colors" />
            </motion.button>

            {/* Text content */}
            <h3 className="text-md font-bold text-gray-800 dark:text-white mt-2 mb-1 line-clamp-1">
              {title}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
              {text}
            </p>

            {/* Animated underline */}
            <motion.div
              initial={{ width: 0 }}
              whileHover={{ width: "100%" }}
              className="h-0.5 bg-sky-500 origin-left"
            />
          </div>
        </div>
      </Link>
    </div>
  );
};

export default SubCategoryServices;
