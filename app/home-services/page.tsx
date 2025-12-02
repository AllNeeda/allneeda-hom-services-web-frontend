"use client";
import Breadcrumbs from "@/components/home-services/homepage/Breadcrumbs";
import PopularSearch from "@/components/home-services/homepage/PopularSearch";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import PopularLocation from "@/components/home-services/homepage/PopularLocation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/context/auth-context";
import {
  usePopularServices,
  useSubcategoryServices,
  useFeaturedServices,
} from "@/hooks/useHomeServices";
import LocationPermissionModal from "@/components/home-services/LocationPermissionModal";
import { getLocationInfo } from "@/lib/getLocationInfo";

// Skeletons (same as before)
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

// const AllCategories = dynamic(
//   () => import("@/components/home-services/homepage/AllCategories"),
//   {
//     loading: () => <CategorySkeleton />,
//     ssr: false,
//   }
// );

const HomeServicesPage = () => {
  const { isAuthenticated, user, getAccessToken } = useAuth();
  const token = getAccessToken();

  // LOCATION STATE
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<any>(null);

  // --- Ask for location on mount if not stored
  useEffect(() => {
    const stored = localStorage.getItem("user_location");
    if (!stored) {
      setLocationModalOpen(true);
    } else {
      setUserLocation(JSON.parse(stored));
    }
  }, []);

  const handleAcceptLocation = async () => {
    try {
      const loc = await getLocationInfo();
      setUserLocation(loc);
      setLocationModalOpen(false);

      if (isAuthenticated && user) {
        // Send to backend (example)
        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/${user._id}/location`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(loc),
          }
        );
      } else {
        localStorage.setItem("user_location", JSON.stringify(loc));
      }
    } catch (err) {
      console.error("Failed to get location:", err);
      setLocationModalOpen(false);
    }
  };

  const handleDeclineLocation = () => {
    setLocationModalOpen(false);
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

  return (
    <div className="relative bg-white dark:bg-gray-900 border border-white dark:border-gray-900">
      <LocationPermissionModal
        open={locationModalOpen}
        onAccept={handleAcceptLocation}
        onDecline={handleDeclineLocation}
      />

      <Breadcrumbs
        paths={[{ name: "Home", href: "/" }, { name: "Home Services" }]}
      />

      <TitlePage location={userLocation} />

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

      {/* <AllCategories /> */}
      <PopularLocation />
      <PopularSearch />
    </div>
  );
};

export default HomeServicesPage;
