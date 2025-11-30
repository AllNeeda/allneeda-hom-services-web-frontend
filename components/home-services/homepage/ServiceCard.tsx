import { getStaticURL } from "@/app/api/axios";
import { motion } from "framer-motion";
import { Heart, Tags } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ServiceCardProps {
  id: string;
  title: string;
  slug: string;
  text: string;
  season: string;
  imageUrl: string;
  className?: string;
  showFavorite?: boolean;
  showSeason?: boolean;
  href?: string;
}

export function ServiceCard({
  id,
  title,
  slug,
  text,
  season,
  imageUrl,
  className = "",
  showFavorite = true,
  showSeason = true,
  href = `/home-services/professional-service/${slug}`,
}: ServiceCardProps) {
  const API_BASE_URL = getStaticURL();

  // Handle location safely
  let userZipcode = "10003";
  if (typeof window !== "undefined") {
    const userLocation = localStorage.getItem("user_location");
    if (userLocation) {
      try {
        const userData = JSON.parse(userLocation);
        userZipcode = userData?.postcode || userZipcode;
      } catch {
        console.warn("Invalid user_location JSON");
      }
    }
  }

  // ✅ Build the full href with query params
  const linkHref = `${href}?id=${id}&zipcode=${userZipcode}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 10 }}
      className={`flex-shrink-0 ${className}`}
      key={id}
    >
      <Link href={linkHref}>
        <div className="group relative rounded overflow-hidden shadow hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-gray-800 h-full">
          {/* Image */}
          <div className="relative h-40 overflow-hidden">
            <Image
              src={`${API_BASE_URL}/${imageUrl}`}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />
          </div>

          <div className="p-4">
            {showSeason && (
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
            )}

            {showFavorite && (
              <motion.button
                whileTap={{ scale: 1.3 }}
                className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 dark:bg-gray-700/90 backdrop-blur-sm shadow-sm hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                onClick={(e) => e.preventDefault()}
              >
                <Heart className="w-4 h-4 text-gray-600 dark:text-gray-300 group-hover:text-red-500 transition-colors" />
              </motion.button>
            )}

            <h3 className="text-md font-bold text-gray-800 dark:text-white mt-2 mb-1 line-clamp-1">
              {title}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
              {text}
            </p>

            <motion.div
              initial={{ width: 0 }}
              whileHover={{ width: "100%" }}
              className="h-0.5 bg-sky-500 origin-left"
            />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
