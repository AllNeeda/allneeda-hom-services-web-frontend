import React from "react";
import { motion, Variants } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { ServiceCard } from "./ServiceCard";
import { ServiceType } from "@/types/service/services";

interface FeaturedServicesProps {
  featuredServices: ServiceType[];
}

const FeaturedServices = ({ featuredServices }: FeaturedServicesProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  // Transform API data to match ServiceCard props
  const transformedServices = featuredServices.map((service) => ({
    id: service._id,
    title: service.name,
    slug: service.slug,
    text: service.description,
    season: "all", // You can modify this based on your data
    imageUrl: service.image_url,
  }));

  // Animation variants
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

  // Carousel controls
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

  // Dragging handlers
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
    <div className="mt-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl md:text-xl font-bold text-gray-800 dark:text-white"
          >
            Featured Services
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/home-services/all-services"
              className="text-sm text-sky-600 hover:underline dark:text-sky-400 mt-2 sm:mt-0 flex items-center gap-1"
            >
              See all services
              <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors hidden md:block"
            aria-label="Previous services"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors hidden md:block"
            aria-label="Next services"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
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
            className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory gap-6 pb-4 -mx-4 px-4"
            style={{ cursor: isDragging ? "grabbing" : "grab" }}
          >
            {transformedServices.map((service) => (
              <ServiceCard
                key={service.id}
                {...service}
                className="w-[280px] sm:w-[calc(25%-18px)] lg:w-[calc(25%-18px)] flex-shrink-0 snap-center"
              />
            ))}
          </motion.div>
        </div>

        {/* View all button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center items-center mt-5"
        >
          <Link
            href="/home-services/all-services"
            className="relative w-56 h-10 text-sm flex justify-center border border-gray-200 dark:border-gray-700 hover:text-sky-500 hover:border-sky-500 dark:hover:border-sky-400 items-center text-center rounded-full overflow-hidden group"
          >
            <span className="relative flex items-center gap-2">
              View all services (99+)
              <ChevronRight className="w-4 h-4" />
            </span>
            <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default FeaturedServices;
