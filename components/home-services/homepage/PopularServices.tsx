"use client";
import React, { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
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

        {/* Services Grid - Using img tag for better reliability */}
        <motion.div
          variants={isMounted ? container : undefined}
          initial="hidden"
          animate={isMounted ? "show" : "hidden"}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4"
        >
          {displayServices.map(({ id, name, slug, image_url }) => {
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
                  <div className="h-40 relative overflow-hidden">
                    <Image
                      src={`${API_BASE_URL}/${image_url}`}
                      alt={name}
                      width={100}
                      height={40}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Gradient overlay for better text visibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
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
