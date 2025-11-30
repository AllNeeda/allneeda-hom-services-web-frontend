"use client";

// import Breadcrumbs from "@/components/home-services/homepage/Breadcrumbs";
import ServiceList from "@/components/home-services/homepage/ServiceList";

import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { useAllServices } from "@/hooks/useHomeServices";
import ApiErrorMessage from "@/components/common/ApiErrorMessage";

// Skeleton component for loading state
const CategorySkeleton = () => (
  <div className="my-10 px-4">
    <div className="max-w-6xl mx-auto">
      {/* Header skeleton */}
      <div className="flex justify-between mb-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-6 w-32" />
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
          >
            <Skeleton className="h-40 w-full" />
            <div className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-2/3 mb-3" />
              <Skeleton className="h-8 w-full rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default function AllServicesPage() {
  const {
    data: allServices,
    isLoading: allServicesLoading,
    error: allServicesError,
    refetch: refetchAllServices,
  } = useAllServices();

  const updatedAllServices = allServices?.data || [];
  if (allServicesError)
    return (
      <ApiErrorMessage error={allServicesError} onRetry={refetchAllServices} />
    );

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-60 md:h-76 lg:h-[400px] w-full overflow-hidden mb-4">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/assets/home-service/all-services.jpg')`,
          }}
        >
          {/* Dark Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40 dark:bg-black/60"></div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
          >
            All Services
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-200 max-w-2xl leading-relaxed"
          >
            Discover comprehensive home services tailored to your needs
          </motion.p>

          {/* Decorative Elements */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <div className="w-1 h-16 bg-white/30 rounded-full"></div>
          </motion.div>
        </div>

        {/* Floating decorative elements */}
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-10 left-10 w-4 h-4 bg-white/20 rounded-full"
        />
        <motion.div
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
          className="absolute top-20 right-16 w-3 h-3 bg-white/15 rounded-full"
        />
        <motion.div
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-20 left-20 w-2 h-2 bg-white/10 rounded-full"
        />
      </section>
      <div className="min-h-screen transition-colors duration-300 dark:bg-gray-900 dark:text-gray-100 bg-gray-50 text-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* <Breadcrumbs
          paths={[
            { name: "Home", href: "/" },
            { name: "Home Services", href: "/home-services" },
            { name: "All Services" },
          ]}
        /> */}

          {/* Show skeleton while loading, ServiceList when data is ready */}
          {allServicesLoading ? (
            <CategorySkeleton />
          ) : (
            <ServiceList allServices={updatedAllServices} />
          )}
        </div>
      </div>
    </>
  );
}
