
"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronRight, ChevronLeft, Code, Globe, Video, Briefcase, Grid2X2, Pencil, Music, Heart, TrendingUp } from "lucide-react";
  import Link from "next/link";

interface ServiceCard {
  id: number;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  imageUrl: string;
  gradient: string;
}

const services: ServiceCard[] = [
  {
    id: 1,
    name: "Graphics & Design",
    icon: Grid2X2,
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop&crop=center",
    gradient: "from-purple-400 via-pink-500 to-red-500"
  },
  {
    id: 2,
    name: "Digital Marketing",
    icon: Globe,
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop&crop=center",
    gradient: "from-green-400 to-blue-500"
  },
  {
    id: 3,
    name: "Writing & Translation",
    icon: Pencil,
    imageUrl: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=300&fit=crop&crop=center",
    gradient: "from-pink-400 to-purple-500"
  },
  {
    id: 4,
    name: "Video & Animation",
    icon: Video,
    imageUrl: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop&crop=center",
    gradient: "from-yellow-400 to-orange-500"
  },
  {
    id: 5,
    name: "Music & Audio",
    icon: Music,
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop&crop=center",
    gradient: "from-green-500 to-teal-500"
  },
  {
    id: 6,
    name: "Programming & Tech",
    icon: Code,
    imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&crop=center",
    gradient: "from-pink-500 to-rose-500"
  },
  {
    id: 7,
    name: "Business",
    icon: Briefcase,
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=center",
    gradient: "from-yellow-500 to-red-500"
  },
  {
    id: 8,
    name: "Lifestyle",
    icon: Heart,
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop&crop=center",
    gradient: "from-yellow-500 to-red-500"
  },
  {
    id: 9,
    name: "Trending",
    icon: TrendingUp,
    imageUrl: "https://images.pexels.com/photos/3184436/pexels-photo-3184436.jpeg?auto=compress&w=400&h=300&fit=crop",
    gradient: "from-yellow-500 to-red-500"
  }
];

export default function PopularCategories() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: 240,
        behavior: 'smooth'
      });
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -240,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-12 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Popular <span className="text-green-600">Services</span>
          </h2>
          <p className="text-gray-600">Discover our most requested services</p>
        </div>

        {/* Top nav buttons for small/medium screens */}
        <div className="flex items-center justify-end gap-2 mb-3 lg:hidden">
          <button
            onClick={scrollLeft}
            className="h-8 w-8 grid place-items-center rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            aria-label="Prev"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={scrollRight}
            className="h-8 w-8 grid place-items-center rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            aria-label="Next"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Left Scroll Button */}
          <button
            onClick={scrollLeft}
            className="hidden lg:flex absolute -left-6 top-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-green-300 group z-10"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600 group-hover:text-green-600 transition-colors" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-3 lg:gap-4 overflow-x-auto scrollbar-hide pb-4 px-2 sm:px-4 md:px-6 lg:px-8"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {services.map((service, index) => (

              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex-shrink-0 w-56 group cursor-pointer"
              >
                <Link href={`/it-services/search/?${new URLSearchParams({ category: service.name }).toString()}`}>
                <div className="relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 h-64 flex flex-col group-hover:-translate-y-0.5">
                  {/* Top image area with badge */}
                  <div className="relative h-36 overflow-hidden">
                    <img
                      src={service.imageUrl}
                      alt={service.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-tr ${service.gradient} opacity-15`} />
                  </div>

                  {/* Floating circular icon */}
                  <div className="absolute left-4 top-[8.25rem] h-10 w-10 rounded-full grid place-items-center shadow-md ring-4 ring-white bg-gradient-to-br from-emerald-500 to-teal-500">
                    <service.icon className="w-5 h-5 text-white" />
                  </div>

                  {/* Body with title */}
                  <div className="relative px-4 pt-6 pb-3 flex-1">
                    <h3 className="text-gray-900 font-semibold text-sm leading-snug line-clamp-2 pr-2">
                      {service.name}
                    </h3>
                    <p className="text-[11px] text-gray-500 mt-1">Explore professionals</p>
                  </div>
                </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Scroll Button */}
          <button
            onClick={scrollRight}
            className="hidden lg:flex absolute -right-6 top-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-green-300 group z-10"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6 text-gray-600 group-hover:text-green-600 transition-colors" />
          </button>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}