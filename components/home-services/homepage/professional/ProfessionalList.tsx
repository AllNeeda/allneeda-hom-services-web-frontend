"use client";
import React, { useState, useEffect } from "react";
import {
  Star,
  BadgeCheck,
  Sparkles,
  Filter,
  ChartLine,
  Trophy,
  CircleDollarSign,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Questioner from "../../question/Questioner";
import { getPorfessionalsStaticURL } from "@/app/api/axios";
import { Professional, GoogleProfessional } from "@/types/professional";

interface ProfessionalListProps {
  professionals: Professional[];
  googleProfessionals?: GoogleProfessional[];
  selectedType?: string;
  serviceId: string;
  loading?: boolean;
}

// Transform Google professional data
const transformGoogleProfessional = (
  googlePro: GoogleProfessional
): Professional => {
  const rating =
    typeof googlePro.rating === "string"
      ? parseFloat(googlePro.rating) || 0
      : googlePro.rating || 0;

  const businessType = googlePro.types?.includes("general_contractor")
    ? "Company"
    : "Handyman";

  return {
    id: googlePro.place_id,
    company: googlePro.name,
    type: businessType,
    service: googlePro.types?.[0]?.replace(/_/g, " ") || "Service Provider",
    rating: rating,
    services: googlePro.types?.map((type) =>
      type.replace(/_/g, " ").toLowerCase()
    ) || ["general services"],
    zipCodes: [],
    distance: 0,
    guarantee: googlePro.business_status === "OPERATIONAL",
    employee_count:
      businessType === "Company" ? 10 : businessType === "Handyman" ? 1 : 3,
    total_hires: googlePro.user_ratings_total || 0,
    founded: null,
    background_check: true,
    status:
      googlePro.business_status === "OPERATIONAL"
        ? "Available"
        : "Not Available",
    description: `${
      googlePro.name
    } is a ${businessType.toLowerCase()} providing ${
      googlePro.types?.join(", ") || "professional services"
    } in the area.`,
    imageUrl: googlePro.icon || "/assets/home-service/default-service.jpg",
    apiData: {
      maximum_price: googlePro.price_level ? googlePro.price_level * 100 : "",
      minimum_price: googlePro.price_level ? googlePro.price_level * 50 : "",
      pricing_type: "",
      completed_tasks: googlePro.user_ratings_total || 0,
      professional_id: googlePro.place_id,
    },
    ...({ googleData: googlePro } as any),
  };
};

// Filter interface
interface FilterState {
  type: string[];
  rating: number;
  priceRange: [number, number];
  availability: string[];
  verifiedOnly: boolean;
  sortBy: string;
}

export default function ProfessionalList({
  professionals,
  googleProfessionals = [],
  serviceId,
  loading = false,
}: ProfessionalListProps) {
  const [BASEDIR, setBaseDir] = useState("");
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);
  const [isRatingExpanded, setIsRatingExpanded] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    type: [],
    rating: 0,
    priceRange: [0, 10000],
    availability: [],
    verifiedOnly: false,
    sortBy: "rating",
  });

  const selectedProfessionals: string[] = professionals.map((item) => item.id);

  useEffect(() => {
    setBaseDir(getPorfessionalsStaticURL());
  }, []);

  const transformedGooglePros = googleProfessionals.map(
    transformGoogleProfessional
  );

  const allProfessionals = [...professionals, ...transformedGooglePros];
  const maxPrice = Math.max(
    ...allProfessionals.map((p) => p.apiData?.maximum_price || 0),
    10000
  );

  // Apply filters
  const filteredProfessionals = allProfessionals.filter((pro) => {
    // Rating filter
    if (pro.rating < filters.rating) {
      return false;
    }

    // Price filter
    const minPrice = pro.apiData?.minimum_price || 0;
    const maxPrice = pro.apiData?.maximum_price || 0;
    if (minPrice < filters.priceRange[0] || maxPrice > filters.priceRange[1]) {
      return false;
    }

    // Availability filter
    if (filters.availability.includes("Available") && pro.status !== "Available") {
      return false;
    }

    // Verified filter
    if (filters.verifiedOnly && !pro.guarantee) {
      return false;
    }

    return true;
  });

  // Sort professionals
  const sortedProfessionals = [...filteredProfessionals].sort((a, b) => {
    switch (filters.sortBy) {
      case "rating":
        return b.rating - a.rating;
      case "price-low":
        return (a.apiData?.minimum_price || 0) - (b.apiData?.minimum_price || 0);
      case "reviews":
        return b.total_hires - a.total_hires;
      default:
        return 0;
    }
  });

  const resetFilters = () => {
    setFilters({
      type: [],
      rating: 0,
      priceRange: [0, maxPrice] as [number, number],
      availability: [],
      verifiedOnly: false,
      sortBy: "rating",
    });
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 p-4 rounded-xl animate-pulse border border-gray-300 dark:border-gray-700"
          >
            <div className="flex gap-3">
              <div className="w-16 h-16 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-2 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-2 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const googleProDetails = transformedGooglePros.map((pro) => ({
    name: pro.company,
    phone: (pro as any).googleData?.formatted_phone_number,
  }));

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Mobile Filter Button */}
      <div className="lg:hidden flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
          Professionals
        </h2>
        <Button
          onClick={() => setShowFilterSidebar(true)}
          className="relative overflow-hidden group bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-semibold py-2 px-4 rounded-lg border-0 shadow-[0_0_15px_rgba(99,102,241,0.3)] dark:shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-all duration-300 hover:shadow-[0_0_25px_rgba(99,102,241,0.5)]"
        >
          <div className="flex items-center gap-2 relative z-10">
            <Filter className="w-4 h-4" />
            <span>Filters & Sort</span>
          </div>
        </Button>
      </div>

      {/* Mobile Filter Overlay */}
      <AnimatePresence>
        {showFilterSidebar && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setShowFilterSidebar(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed left-0 top-0 h-full w-[85%] max-w-sm bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-50 overflow-y-auto lg:hidden"
            >
              <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
                <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                  Filter & Sort
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilterSidebar(false)}
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="p-4">
                <FilterSidebarContent
                  filters={filters}
                  setFilters={setFilters}
                  isRatingExpanded={isRatingExpanded}
                  setIsRatingExpanded={setIsRatingExpanded}
                  maxPrice={maxPrice}
                  resetFilters={resetFilters}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar - 30% - Rich Filter */}
      <div className="hidden lg:block w-full lg:w-[30%] xl:w-[25%] sticky top-24 self-start">
        <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700/50 shadow-lg dark:shadow-xl">
          <FilterSidebarContent
            filters={filters}
            setFilters={setFilters}
            isRatingExpanded={isRatingExpanded}
            setIsRatingExpanded={setIsRatingExpanded}
            maxPrice={maxPrice}
            resetFilters={resetFilters}
          />
        </div>
      </div>

      {/* Main Content - 70% */}
      <div className="w-full lg:w-[70%] xl:w-[75%]">
        {/* Desktop Header */}
        <div className="hidden lg:block mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
            Professionals
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Showing {sortedProfessionals.length} of {allProfessionals.length} professionals
          </p>
        </div>

        {/* Active Filters Badges */}
        {(Object.values(filters).some((filter) => 
          Array.isArray(filter) ? filter.length > 0 : 
          typeof filter === 'boolean' ? filter :
          typeof filter === 'number' ? filter > 0 :
          filter !== 'rating'
        )) && (
          <div className="flex flex-wrap gap-2 mb-6">
            {filters.rating > 0 && (
              <span className="px-3 py-1.5 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-500/20 dark:to-orange-500/20 text-yellow-800 dark:text-yellow-300 rounded-full text-sm border border-yellow-300 dark:border-yellow-500/30 flex items-center gap-2">
                <Star className="w-4 h-4" fill="currentColor" />
                {filters.rating}+ Stars
              </span>
            )}
            {filters.verifiedOnly && (
              <span className="px-3 py-1.5 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-500/20 dark:to-emerald-500/20 text-green-800 dark:text-green-300 rounded-full text-sm border border-green-300 dark:border-green-500/30 flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Verified Only
              </span>
            )}
            {filters.availability.includes("Available") && (
              <span className="px-3 py-1.5 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-500/20 dark:to-cyan-500/20 text-blue-800 dark:text-blue-300 rounded-full text-sm border border-blue-300 dark:border-blue-500/30 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Available Now
              </span>
            )}
            {filters.type.map((type) => (
              <span
                key={type}
                className="px-3 py-1.5 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-500/20 dark:to-purple-500/20 text-blue-800 dark:text-blue-300 rounded-full text-sm border border-blue-300 dark:border-blue-500/30"
              >
                {type}
              </span>
            ))}
          </div>
        )}

        {/* Professionals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
          {sortedProfessionals.map((professional) => (
            <CompactProfessionalCard
              key={professional.id}
              professional={professional}
              serviceId={serviceId}
              selectedProfessionals={selectedProfessionals}
              BASEDIR={BASEDIR}
              isGoogleProfessional={transformedGooglePros.some(gp => gp.id === professional.id)}
              googleProDatails={googleProDetails}
              googleData={(professional as any).googleData}
            />
          ))}
        </div>

        {sortedProfessionals.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-gray-400 dark:text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-300 mb-2">
              No Professionals Found
            </h3>
            <p className="text-gray-600 dark:text-gray-500 text-sm">
              Try adjusting your filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Filter Sidebar Content Component (Reusable)
interface FilterSidebarContentProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  isRatingExpanded: boolean;
  setIsRatingExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  maxPrice: number;
  resetFilters: () => void;
}

const FilterSidebarContent: React.FC<FilterSidebarContentProps> = ({
  filters,
  setFilters,
  isRatingExpanded,
  setIsRatingExpanded,
  maxPrice,
  resetFilters,
}) => {
  return (
    <>
      {/* Filter Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
          Filter & Sort
        </h2>
        <button
          onClick={resetFilters}
          className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          Clear All
        </button>
      </div>

      {/* Sort By Section */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
          <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
          </svg>
          Sort By
        </h3>
        <div className="space-y-2">
          {[
            { value: "rating", label: "Highest Rating", icon: Star },
            { value: "price-low", label: "Price: Low to High", icon: CircleDollarSign },
            { value: "reviews", label: "Most Reviews", icon: ChartLine },
            { value: "experience", label: "Most Experience", icon: Trophy },
          ].map((option) => {
            const IconComponent = option.icon;
            return (
              <button
                key={option.value}
                onClick={() => setFilters({...filters, sortBy: option.value})}
                className={`flex items-center gap-3 w-full text-left p-3 rounded-lg transition-all ${
                  filters.sortBy === option.value
                    ? "bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-500/20 dark:to-pink-500/20 border border-purple-300 dark:border-purple-500/30"
                    : "bg-gray-50 hover:bg-gray-100 dark:bg-gray-800/50 dark:hover:bg-gray-800"
                }`}
              >
                <IconComponent className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
                {filters.sortBy === option.value && (
                  <span className="ml-auto text-purple-600 dark:text-purple-400">✓</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Rating Filter - Expandable */}
      <div className="mb-6">
        <div 
          className="flex items-center justify-between mb-4 cursor-pointer rounded border border-gray-300 dark:border-gray-700 p-4 hover:border-purple-300 dark:hover:border-purple-700 transition-colors"
          onClick={() => setIsRatingExpanded(!isRatingExpanded)}
        >
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500 dark:text-yellow-400" fill="currentColor" />
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Rating sort</h3>
          </div>
          <svg 
            className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${isRatingExpanded ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        
        <AnimatePresence>
          {isRatingExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="space-y-2 pt-2">
                {[4, 3, 2, 1, 0].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setFilters({...filters, rating})}
                    className={`flex items-center justify-between w-full p-3 rounded-lg transition-all ${
                      filters.rating === rating
                        ? "bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-500/20 dark:to-orange-500/20 border border-yellow-300 dark:border-yellow-500/30"
                        : "bg-gray-50 hover:bg-gray-100 dark:bg-gray-800/50 dark:hover:bg-gray-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < rating ? "text-yellow-500 fill-yellow-500 dark:text-yellow-400 dark:fill-yellow-400" : "text-gray-300 dark:text-gray-600"}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {rating === 0 ? "Any Rating" : `${rating}+ Stars`}
                      </span>
                    </div>
                    {filters.rating === rating && (
                      <span className="text-yellow-500 dark:text-yellow-400">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Price Range */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
          <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Price Range
        </h3>
        <div className="space-y-4 px-2">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>${filters.priceRange[0]}</span>
            <span>${filters.priceRange[1]}</span>
          </div>
          <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
            <div 
              className="absolute h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
              style={{
                left: `${(filters.priceRange[0] / maxPrice) * 100}%`,
                width: `${((filters.priceRange[1] - filters.priceRange[0]) / maxPrice) * 100}%`
              }}
            />
            <input
              type="range"
              min="0"
              max={maxPrice}
              step="100"
              value={filters.priceRange[0]}
              onChange={(e) => setFilters({
                ...filters,
                priceRange: [parseInt(e.target.value), filters.priceRange[1]] as [number, number]
              })}
              className="absolute w-full h-2 appearance-none bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:z-10"
            />
            <input
              type="range"
              min="0"
              max={maxPrice}
              step="100"
              value={filters.priceRange[1]}
              onChange={(e) => setFilters({
                ...filters,
                priceRange: [filters.priceRange[0], parseInt(e.target.value)] as [number, number]
              })}
              className="absolute w-full h-2 appearance-none bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:z-10"
            />
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {[500, 1000, 5000].map((price) => (
              <button
                key={price}
                onClick={() => setFilters({
                  ...filters,
                  priceRange: [0, price] as [number, number]
                })}
                className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
              >
                Under ${price}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Business Type */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          Business Type
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: "Company", color: "from-blue-500 to-purple-500" },
            { value: "Handyman", color: "from-orange-500 to-red-500" },
            { value: "Individual", color: "from-green-500 to-emerald-500" },
            { value: "Contractor", color: "from-purple-500 to-pink-500" },
          ].map((type) => (
            <button
              key={type.value}
              onClick={() => {
                const newTypes = filters.type.includes(type.value)
                  ? filters.type.filter((t) => t !== type.value)
                  : [...filters.type, type.value];
                setFilters({...filters, type: newTypes});
              }}
              className={`p-3 rounded-lg text-sm transition-all ${
                filters.type.includes(type.value)
                  ? `bg-gradient-to-r ${type.color} text-white`
                  : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              {type.value}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Filters */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
          <svg className="w-4 h-4 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Quick Filters
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setFilters({
              ...filters,
              verifiedOnly: !filters.verifiedOnly
            })}
            className={`p-3 rounded-lg text-sm transition-all flex items-center justify-center gap-2 ${
              filters.verifiedOnly
                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Verified
          </button>
          <button
            onClick={() => {
              const newAvailability = filters.availability.includes("Available")
                ? filters.availability.filter((a) => a !== "Available")
                : [...filters.availability, "Available"];
              setFilters({...filters, availability: newAvailability});
            }}
            className={`p-3 rounded-lg text-sm transition-all flex items-center justify-center gap-2 ${
              filters.availability.includes("Available")
                ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Available Now
          </button>
          <button
            onClick={() => setFilters({
              ...filters,
              rating: 4,
              verifiedOnly: true
            })}
            className="col-span-2 p-3 rounded-lg text-sm bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-500/20 dark:to-pink-500/20 text-purple-800 dark:text-gray-300 hover:from-purple-200 hover:to-pink-200 dark:hover:from-purple-500/30 dark:hover:to-pink-500/30 transition-all border border-purple-300 dark:border-purple-500/30"
          >
            ⭐ Premium Only (4+ stars & verified)
          </button>
        </div>
      </div>
    </>
  );
};

// Compact Professional Card Component
interface CompactProfessionalCardProps {
  professional: Professional;
  serviceId: string;
  selectedProfessionals: string[];
  BASEDIR: string;
  isGoogleProfessional: boolean;
  googleData?: GoogleProfessional;
  googleProDatails?: { name: string; phone?: string }[];
}

const CompactProfessionalCard: React.FC<CompactProfessionalCardProps> = ({
  professional,
  serviceId,
  selectedProfessionals,
  BASEDIR,
  isGoogleProfessional,
  googleData,
  googleProDatails,
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [baseURL, setBaseURL] = useState('');

  useEffect(() => {
    const url = getPorfessionalsStaticURL();
    setBaseURL(url);
  }, []);

  const formatPrice = (min: number, max: number) => {
    if (min === 0 && max === 0) return "Contact for price";
    if (min === max) return `$${min}`;
    return `$${min} - $${max}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-gradient-to-r from-green-500 to-emerald-500";
      case "Open Now":
        return "bg-gradient-to-r from-blue-500 to-cyan-500";
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500 dark:from-gray-600 dark:to-gray-700";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Company":
        return "from-blue-500 to-purple-500";
      case "Handyman":
        return "from-orange-500 to-red-500";
      default:
        return "from-gray-500 to-gray-600 dark:from-gray-600 dark:to-gray-700";
    }
  };

  const currentStatus = googleData?.opening_hours?.open_now 
    ? "Open Now" 
    : professional.status;

  // Handle image loading errors
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.log("Image failed to load, using fallback");
    setImageError(true);
    const target = e.target as HTMLImageElement;
    target.style.display = "none";
  };

  const handleImageLoad = () => {
    console.log("Image loaded successfully");
    setImageLoaded(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -2 }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 rounded-xl blur-sm opacity-50 group-hover:opacity-70 transition-opacity" />

      <div className="relative bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700/50 overflow-hidden h-full shadow-sm hover:shadow-md dark:shadow-none transition-shadow">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

        <div className="flex flex-col h-full">
          <div className="flex flex-col sm:flex-row gap-4 mb-4 items-start sm:items-center justify-start">
            <div className="relative w-16 h-16 flex-shrink-0 mx-auto sm:mx-0">
              {professional.imageUrl && !isGoogleProfessional ? (
                <>
                  <Image
                    src={`${baseURL}/${professional.imageUrl}`}
                    fill
                    alt={professional.company}
                    className="object-cover rounded-full ring-2 ring-sky-500 ring-offset-white dark:ring-offset-gray-900 ring-offset-4 transition-opacity duration-300"
                    sizes="64px"
                    onError={handleImageError}
                    onLoad={handleImageLoad}
                    style={{ 
                      opacity: imageLoaded ? 1 : 0,
                      transition: 'opacity 0.3s ease-in-out'
                    }}
                  />
                  {!imageLoaded && !imageError && (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900 rounded-full animate-pulse" />
                  )}
                </>
              ) : null}
              
              {/* Fallback UI when no image loads */}
              {(isGoogleProfessional || !professional.imageUrl) && (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900 rounded-full flex items-center justify-center ring-2 ring-sky-500 ring-offset-white dark:ring-offset-gray-900 ring-offset-4 transition-opacity duration-300">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                      <span className="text-white text-lg font-bold">
                        {professional.company
                          .split(' ')
                          .map(word => word.charAt(0))
                          .slice(0, 2)
                          .join('')
                          .toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Verified Badge */}
              {professional.guarantee && (
                <div className="absolute -bottom-1 -right-1">
                  <BadgeCheck className="w-5 h-5 text-sky-500 drop-shadow-lg" fill="white" />
                </div>
              )}
            </div>
             
            {/* Company Info */}
            <div className="flex-1 min-w-0 text-center sm:text-left">
              <div className="flex flex-col items-center sm:items-start justify-start gap-2">
                <h3 className="font-bold text-gray-900 dark:text-white truncate text-sm w-full">
                  {professional.company}
                </h3>
                <div className="flex flex-row items-center gap-2">
                  {/* Rating */}
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-500 text-yellow-500 dark:fill-yellow-400 dark:text-yellow-400" />
                    <span className="text-xs font-bold text-gray-900 dark:text-white">
                      {professional.rating > 0 ? professional.rating.toFixed(1) : "New"}
                    </span>
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    ({professional.total_hires || 0} reviews)
                  </span>
                </div>
              </div>

              {/* Type & Status Badges */}
              <div className="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start">
                <span className={`inline-block px-2 py-0.5 text-xs font-medium bg-gradient-to-r ${getTypeColor(professional.type)} text-white rounded-full`}>
                  {professional.type}
                </span>
                <span className={`px-2 py-0.5 text-xs font-medium text-white rounded-full ${getStatusColor(currentStatus)}`}>
                  {currentStatus}
                </span>
                {isGoogleProfessional && (
                  <span className="px-2 py-0.5 text-xs bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-500/20 dark:to-purple-500/20 text-blue-800 dark:text-blue-300 rounded-full border border-blue-300 dark:border-blue-500/30">
                    Google
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Introduction / Description */}
          <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-2 mb-3 flex-1">
            {professional.description}
          </p>

          {/* Services */}
          <div className="mb-3">
            <div className="flex items-center gap-1 mb-1">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Services:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {professional.services?.slice(0, 3).map((service, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-xs border border-gray-300 dark:border-gray-700"
                >
                  {service}
                </span>
              ))}
              {professional.services && professional.services.length > 3 && (
                <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded text-xs border border-gray-300 dark:border-gray-700">
                  +{professional.services.length - 3} more
                </span>
              )}
            </div>
          </div>

          {/* Bottom Info */}
          <div className="mt-auto">
            {/* Price */}
            {professional.apiData && (
              <div className="mb-3 text-center sm:text-right">
                <div className="text-sm font-bold text-gray-900 dark:text-white">
                  {formatPrice(
                    professional.apiData.minimum_price ?? 0,
                    professional.apiData.maximum_price ?? 0
                  )}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {professional.apiData.pricing_type === "fixed" ? "Fixed price" : "Price range"}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2">
              {isGoogleProfessional ? (
                <Questioner
                  className="flex-1 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs font-medium py-2 rounded-lg transition-all duration-300 group"
                  serviceId={serviceId}
                  professionalId={professional.id}
                  professionalIds={selectedProfessionals}
                  triggerText={'Request Quotation'}
                  googleProDatails={googleProDatails}
                />
              ) : (
                <>
                  <Questioner
                    className="flex-1 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs font-medium py-2 rounded-lg transition-all duration-300 group"
                    serviceId={serviceId}
                    professionalId={professional.id}
                    professionalIds={selectedProfessionals}
                    triggerText={'Request Quotation'}
                  />
                  <Button
                    asChild
                    size="sm"
                    className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-white text-xs font-medium py-2 h-auto rounded-lg border border-gray-300 dark:border-gray-700 transition-colors"
                  >
                    <Link href={`/home-services/professional-profile/${professional.id}`}>
                      View Profile
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};