"use client";
import Breadcrumbs from "@/components/home-services/homepage/Breadcrumbs";
import PopularSearch from "@/components/home-services/homepage/PopularSearch";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import PopularLocation from "@/components/home-services/homepage/PopularLocation";
import { useEffect, useState, useMemo} from "react";
import { useAuth } from "@/components/providers/context/auth-context";
import {
  usePopularServices,
  useSubcategoryServices,
  useFeaturedServices,
} from "@/hooks/useHomeServices";
import { LeadDialog } from "@/components/home-services/LeadAlert";
import { useProfessionalDetection } from "@/hooks/useProfessionalLeads";

// Skeletons (keep the same)
const TitlePageSkeleton = () => (
  <div className="w-full h-60 md:h-72 lg:h-80 xl:h-96 bg-gray-200 dark:bg-gray-800 animate-pulse" />
);

const CategorySkeleton = () => (
  <div className="my-10 px-4">
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between mb-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-6 w-32" />
      </div>
      <div className="flex gap-4 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex-shrink-0 w-56">
            <Skeleton className="h-40 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

const FeaturedServicesSkeleton = () => (
  <div className="mt-10 px-4">
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-6 w-32 mt-2 sm:mt-0" />
      </div>
      <div className="relative">
        <div className="flex overflow-x-auto gap-6 pb-4 -mx-4 px-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[280px] sm:w-[calc(25%-18px)] lg:w-[calc(25%-18px)] snap-center"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow h-full">
                <Skeleton className="h-40 w-full" />
                <div className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center items-center mt-5">
        <Skeleton className="w-56 h-10 rounded-full" />
      </div>
    </div>
  </div>
);

// Dynamic imports
const TitlePage = dynamic(
  () => import("@/components/home-services/homepage/TitlePage"),
  {
    loading: () => <TitlePageSkeleton />,
  }
);

const PopularServices = dynamic(
  () => import("@/components/home-services/homepage/PopularServices"),
  {
    loading: () => <CategorySkeleton />,
    ssr: false,
  }
);

const FeaturedServices = dynamic(
  () => import("@/components/home-services/homepage/FeaturedServices"),
  {
    loading: () => <FeaturedServicesSkeleton />,
    ssr: false,
  }
);

const CategoryServices = dynamic(
  () => import("@/components/home-services/homepage/CategoryServices"),
  {
    loading: () => <CategorySkeleton />,
    ssr: false,
  }
);

const HomeServicesPage = () => {
  const { user, getAccessToken } = useAuth();
  const token = getAccessToken();
  const userPhone = user?.phoneNo || '';
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: detectionResult, isError, isLoading } = useProfessionalDetection(token, userPhone);
  
  // FIX 1: Initialize userLocation from localStorage only once on mount
  /* eslint-disable no-unused-vars */
  const [userLocation, setUserLocation] = useState<any>(() => {
    // Initialize from localStorage only during initial render
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem("user_location");
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  });
  /* eslint-enable no-unused-vars */

  const apiResult = detectionResult?.data;
  const leads = apiResult?.data ?? [];
  const isSuccess = apiResult?.success ?? false;

  // FIX 2: Use a ref to track if we've already set the location
  // const locationSetRef = useRef(false);

  useEffect(() => {
    if (isSuccess && leads.length > 0) {
      setIsDialogOpen(true);
    }
  }, [isSuccess, leads]);

  // FIX 3: Remove the localStorage reading from useEffect that runs on every render
  // This was causing the infinite loop

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    localStorage.setItem('leadDialogDismissed', 'true');
  };

  // Service hooks
  const { data: popularServicesData, isLoading: popularLoading } =
    usePopularServices();
  const { data: subcategoryServicesData, isLoading: subcategoriesLoading } =
    useSubcategoryServices();
  const { data: featuredServicesData, isLoading: featuredLoading } =
    useFeaturedServices();

  const popularServices = popularServicesData?.data || [];
  const subcategoryServices = subcategoryServicesData || [];
  const featuredServices = featuredServicesData?.data || [];

  // FIX 4: Memoize the location prop to prevent unnecessary re-renders
  const memoizedLocation = useMemo(() => userLocation, [
    userLocation?.city, 
    userLocation?.state, 
    userLocation?.postcode
  ]);

  return (
    <div className="relative bg-white dark:bg-gray-900 border border-white dark:border-gray-900">
      {!isLoading && !isError && isDialogOpen && (
        <LeadDialog
          isOpen={isDialogOpen}
          onClose={handleCloseDialog}
          leadCount={leads.length || 5}
          userEmail={leads[0]?.phone}
          userName={leads[0]?.businessName}
        />
      )}

      <Breadcrumbs
        paths={[{ name: "Home", href: "/" }, { name: "Home Services" }]}
      />

      {/* FIX 5: Pass the memoized location prop */}
      <TitlePage location={memoizedLocation} />

      {popularLoading ? (
        <CategorySkeleton />
      ) : (
        <PopularServices popularServices={popularServices} />
      )}
      {featuredLoading ? (
        <FeaturedServicesSkeleton />
      ) : (
        <FeaturedServices featuredServices={featuredServices} />
      )}
      {subcategoriesLoading ? (
        <CategorySkeleton />
      ) : (
        <CategoryServices subcategoryService={subcategoryServices} />
      )}

      <PopularLocation />
      <PopularSearch />
    </div>
  );
};

export default HomeServicesPage;