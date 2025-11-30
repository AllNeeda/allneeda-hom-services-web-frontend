"use client";
import { motion, Variants } from "framer-motion";
import { useState } from "react";
import { ServiceCard } from "./ServiceCard";
import { ServiceType } from "@/types/service/services";
import { useUserLocationStorage } from "@/hooks/useHomeServices";

interface allServicesProps {
  allServices: ServiceType[];
}

const ServiceList = ({ allServices }: allServicesProps) => {
  const [locationFilter, setLocationFilter] = useState<string>("all");

  const { data: userLocationData } = useUserLocationStorage();

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
      },
    },
  };

  return (
    <>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <div className="px-4 sm:px-6 lg:px-8 pb-12">
          {/* Header and Filter */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
          >
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Available Services at{" "}
                <u className="text-sky-600 dark:text-sky-500">
                  {userLocationData?.city}, {userLocationData?.state}
                </u>
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {allServices.length} services available
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Filter by:
              </span>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="all">All Locations</option>
                <option value="urban">Urban</option>
                <option value="suburban">Suburban</option>
                <option value="rural">Rural</option>
              </select>
            </div>
          </motion.div>

          {/* Services Grid */}
          {allServices.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {allServices.map((service) => (
                <motion.div
                  key={service._id}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                >
                  <ServiceCard
                    id={service._id}
                    title={service.name}
                    slug={service.slug}
                    text={service.description}
                    season={"fall"}
                    imageUrl={service.image_url}
                    className="h-full"
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-gray-500 dark:text-gray-400">
                No services found for this location filter.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default ServiceList;
