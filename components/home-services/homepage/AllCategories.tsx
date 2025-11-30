import React from "react";
import { motion, Variants } from "framer-motion";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { SubcategoryWithServicesType } from "@/types/service/services";
import { getSubcategoryStaticURL } from "@/app/api/axios";

interface allSubcategoryProps {
  allSubcategory: SubcategoryWithServicesType[];
}

const AllCategories = ({ allSubcategory }: allSubcategoryProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const API_BASE_URL = getSubcategoryStaticURL();

  // Variants definitions
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 10,
        mass: 0.5,
        restDelta: 0.0001,
      },
    },
  };

  const handlePrev = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const startDrag = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (carouselRef.current?.offsetLeft || 0));
    setScrollLeft(carouselRef.current?.scrollLeft || 0);
  };

  const duringDrag = (e: React.MouseEvent) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - (carouselRef.current.offsetLeft || 0);
    const walk = (x - startX) * 2;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const endDrag = () => {
    setIsDragging(false);
  };

  return (
    <div className="my-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8"
        >
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Explore Our{" "}
              <span className="text-sky-600 dark:text-sky-400">Services</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Discover professional services tailored to your needs
            </p>
          </div>
          <motion.div
            whileHover={{ x: 3 }}
            transition={{ type: "spring", stiffness: 300 }}
          ></motion.div>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 hover:shadow-xl border border-gray-200 dark:border-gray-600 hidden md:block"
            aria-label="Previous categories"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>

          <button
            onClick={handleNext}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 hover:shadow-xl border border-gray-200 dark:border-gray-600 hidden md:block"
            aria-label="Next categories"
          >
            <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>

          {/* Carousel */}
          <motion.div
            ref={carouselRef}
            variants={container}
            initial="hidden"
            animate="show"
            onMouseDown={startDrag}
            onMouseMove={duringDrag}
            onMouseUp={endDrag}
            onMouseLeave={endDrag}
            className="flex overflow-x-auto gap-6 pb-6 -mx-4 px-4 scrollbar-hide"
            style={{ cursor: isDragging ? "grabbing" : "grab" }}
          >
            {allSubcategory.map((subcategory) => (
              <motion.div
                key={subcategory._id}
                variants={item}
                className="flex-shrink-0 snap-center w-[280px]" // Fixed width for consistency
              >
                <Link
                  href={`/home-services/sub-categories/${subcategory.name}?id=${subcategory._id}`}
                  className="group block h-full"
                >
                  <div className="h-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl flex flex-col items-center text-center hover:border-sky-300 dark:hover:border-sky-500 transition-all duration-500 shadow-sm hover:shadow-2xl overflow-hidden relative hover:scale-[1.02]">
                    {/* Image background with brightness control */}
                    <div className="relative w-full h-full bg-gray-200 dark:bg-gray-700">
                      {subcategory.subcategory_image_url && (
                        <>
                          <Image
                            src={`${API_BASE_URL}/${subcategory.subcategory_image_url}`}
                            alt={subcategory.name}
                            fill
                            sizes="(max-width: 768px) 280px, 280px"
                            className="object-cover brightness-75 group-hover:brightness-90 transition-all duration-500"
                          />
                          {/* Gradient overlay for better text readability */}
                          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 group-hover:from-black/50 group-hover:via-black/30 group-hover:to-black/60 transition-all duration-500" />
                        </>
                      )}

                      {/* Content positioned over the image */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-white">
                        {/* Category name with improved typography */}
                        <h3 className="text-lg font-bold mb-3 line-clamp-2 group-hover:text-sky-200 transition-colors duration-300 text-center leading-tight drop-shadow-lg">
                          {subcategory.name}
                        </h3>

                        {/* Count badge with improved design */}
                        <div className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-sm font-semibold group-hover:bg-sky-500/80 group-hover:border-sky-300 group-hover:text-white transition-all duration-300 shadow-lg">
                          {subcategory.services.length}{" "}
                          {subcategory.services.length === 1
                            ? "service"
                            : "services"}
                        </div>

                        {/* Animated explore button (appears on hover) */}
                        <div className="absolute bottom-3 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-medium transition-all duration-300">
                            <span>Explore</span>
                            <ChevronRight size={18} />
                          </div>
                        </div>
                      </div>

                      {/* Hover effect overlay */}
                      <div className="absolute inset-0 bg-sky-500/0 group-hover:bg-sky-500/10 transition-all duration-500 rounded-2xl" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AllCategories;
