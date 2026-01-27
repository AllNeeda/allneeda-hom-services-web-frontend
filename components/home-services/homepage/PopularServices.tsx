"use client";
import React, { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { ChevronRight, Image as ImageIcon } from "lucide-react";
import { ServiceType } from "@/types/service/services";
import Image from "next/image";
import { getStaticURL } from "@/app/api/axios";

interface PopularSubCategory {
  id: string;
  name: string;
  slug: string;
  image_url: string;
}

interface PopularServicesProps {
  popularServices: ServiceType[];
}

const PopularServices = ({ popularServices }: PopularServicesProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [services, setServices] = useState<PopularSubCategory[]>([]);

  const API_BASE_URL = getStaticURL();

  useEffect(() => {
    setIsMounted(true);
    // Transform the API data to match component needs
    if (popularServices && popularServices.length > 0) {
      const transformedServices = popularServices.map((service) => ({
        id: service._id || service._id || String(Math.random()),
        name: service.name || service.name || "Unnamed Service",
        slug: service.slug || "default-slug",
        image_url: service.image_url || "",
      }));
      setServices(transformedServices);
    }
  }, [popularServices]);

  // Function to check if image URL is valid
  const isValidImageUrl = (url: string): boolean => {
    if (!url || url.trim() === "") return false;
    
    // Check if it ends with common image extensions
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const lowerUrl = url.toLowerCase();
    
    return imageExtensions.some(ext => 
      lowerUrl.endsWith(ext) || 
      lowerUrl.includes(ext + '?') || 
      lowerUrl.includes(ext + '&')
    );
  };

  // Function to get image URL - with fallback to placeholder
  const getImageSrc = (image_url: string, serviceName: string) => {
    if (isValidImageUrl(image_url)) {
      // Check if it's already a full URL
      if (image_url.startsWith('http')) {
        return image_url;
      }
      // Construct full URL
      return `${API_BASE_URL}/${image_url.replace(/^\/+/, '')}`;
    }
    
    // Use Lorem Picsum placeholder with service name as seed
    const seed = encodeURIComponent(serviceName.replace(/\s+/g, '-').toLowerCase());
    return `https://picsum.photos/seed/${seed}/400/300`;
  };

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
        type: "spring",
        stiffness: 100,
        damping: 10,
        mass: 0.5,
        restDelta: 0.0001,
      },
    },
  };

  const displayServices = services;
  
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

  return (
    <section className="my-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={isMounted ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6"
        >
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            Popular{" "}
            <span className="text-sky-600 dark:text-sky-400">Services</span>
          </h2>
          <motion.div
            whileHover={isMounted ? { x: 3 } : { x: 0 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Link
              href="/home-services/explore-categories"
              className="text-sm text-sky-600 hover:underline dark:text-sky-400 mt-2 sm:mt-0 flex items-center gap-1"
              aria-label="Explore all categories"
              prefetch={true}
            >
              Explore all services
              <ChevronRight className="w-4 h-4 text-sky-600" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={isMounted ? container : undefined}
          initial="hidden"
          animate={isMounted ? "show" : "hidden"}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4"
        >
          {displayServices.map(({ id, name, slug, image_url }) => {
            const hasValidImage = isValidImageUrl(image_url);
            const imageSrc = getImageSrc(image_url, name);
            
            return (
              <motion.div
                key={id}
                variants={isMounted ? item : undefined}
                className="col-span-1"
              >
                <Link
                  href={`/home-services/professional-service/${slug}?id=${id}&zipcode=${userZipcode}`}
                  className="group block h-full rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-gray-100 dark:bg-gray-800"
                  aria-label={`Browse ${name} services`}
                  prefetch={true}
                >
                  <div className="h-40 relative overflow-hidden bg-gray-200 dark:bg-gray-700">
                    {hasValidImage ? (
                      <Image
                        src={imageSrc}
                        alt={name}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          // Fallback to placeholder if image fails to load
                          const target = e.target as HTMLImageElement;
                          const seed = encodeURIComponent(name.replace(/\s+/g, '-').toLowerCase());
                          target.src = `https://picsum.photos/seed/${seed}/400/300`;
                        }}
                      />
                    ) : (
                      // Placeholder state
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700">
                        <ImageIcon className="w-12 h-12 text-gray-500 dark:text-gray-400 mb-2" />
                        <span className="text-xs text-gray-600 dark:text-gray-300 text-center px-2">
                          {name}
                        </span>
                      </div>
                    )}
                    
                    {/* Gradient overlay for better text visibility */}
                    <div className={`absolute inset-0 bg-gradient-to-t ${hasValidImage ? 'from-black/70 to-transparent' : 'from-black/50 to-transparent'}`}></div>
                    
                    {/* Service name positioned at bottom left */}
                    <div className="absolute bottom-0 left-0 p-3 text-white">
                      <h3 className="text-sm font-semibold line-clamp-2">
                        {name}
                      </h3>
                      <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        View professionals →
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default PopularServices;