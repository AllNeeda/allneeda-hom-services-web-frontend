import React from "react";
import { motion, Variants } from "framer-motion";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const PopularSearch = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

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

  const popularSearch = [
    { id: 1, title: "House Cleaning" },
    { id: 2, title: "Inerior Painting" },
    { id: 3, title: "Interior Design" },
    { id: 4, title: "Carpet Cleaning" },
    { id: 5, title: "Lawn triming and care" },
    { id: 6, title: "Roofing" },
    { id: 7, title: "Plumbing" },
    { id: 8, title: "Electration" },
    { id: 9, title: "Handyman" },
  ];

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
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4"
        >
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Popular Search
          </h2>
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
            className="absolute left-0 top-1/3 -translate-y-1/2 z-10 p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors hidden md:block"
            aria-label="Previous categories"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-0 top-1/3 -translate-y-1/2 z-10 p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors hidden md:block"
            aria-label="Next categories"
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
            className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 scrollbar-hide"
            style={{ cursor: isDragging ? "grabbing" : "grab" }}
          >
            {popularSearch.map(({ id, title }) => (
              <motion.div
                key={id}
                variants={item}
                className="flex-shrink-0 snap-center w-[calc(100%-2rem)] sm:w-56" // Smaller width
              >
                <Link
                  href={`/home-services/sub-categories/${title}?id=${id}`}
                  className="group block h-full"
                >
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-md text-center hover:border-sky-300 dark:hover:border-sky-500 transition-all duration-300 shadow-sm hover:shadow-md">
                    <div className="flex flex-row items-center gap-4 justify-center ">
                      <div className="">
                        <h3 className="text-xs font-semibold text-gray-800 dark:text-gray-100 line-clamp-2">
                          {" "}
                          {/* Smaller text */}
                          {title}
                        </h3>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        <ChevronRight />
                      </div>
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

export default PopularSearch;
