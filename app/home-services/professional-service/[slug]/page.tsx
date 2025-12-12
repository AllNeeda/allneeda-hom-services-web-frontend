"use client";
import { use, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Dialog } from "@headlessui/react";
import ProfessionalList from "@/components/home-services/homepage/professional/ProfessionalList";
import Breadcrumbs from "@/components/home-services/homepage/Breadcrumbs";
import ServiceQuestion from "@/components/home-services/question/ServiceQuestion";
import { useSearchParams } from "next/navigation";
import { useTopProfessionals } from "@/hooks/useHomeServices";
import ErrorDisplay from "@/components/ui/ErrorDisplay";

// Define interfaces for your API data
interface ApiProfessional {
  _id: string;
  service_name: string;
  maximum_price: number;
  minimum_price: number;
  description: string;
  pricing_type: string;
  completed_tasks: number;
  professional: {
    _id: string;
    business_name: string;
    introduction: string;
    business_type: string;
    total_hire: number;
    total_review: number;
    rating_avg: number;
    profile_image: string;
  };
}

interface GoogleProfessional {
  place_id: string;
  name: string;
  formatted_address: string;
  formatted_phone_number: string;
  rating: number | string;
  user_ratings_total: number;
  business_status: string;
  opening_hours?: {
    open_now: boolean;
  };
  photos?: any[];
  geometry?: any;
  types: string[];
  website?: string;
  url?: string;
  reviews?: any[];
  price_level?: number;
  icon?: string;
  icon_background_color?: string;
  icon_mask_base_uri?: string;
}

// Transform function for API data
const transformProfessionalData = (apiData: ApiProfessional[]) => {
  return apiData.map((item, index) => ({
    id: item._id || `professional-${index}`,
    company: item.professional.business_name,
    type:
      item.professional.business_type === "company" ? "Company" : "Handyman",
    service: item.service_name,
    rating: item.professional.rating_avg || 0,
    services: [item.service_name],
    zipCodes: [],
    distance: 0,
    guarantee: true,
    employee_count: item.professional.business_type === "company" ? 10 : 1,
    total_hires: item.professional.total_hire,
    founded: 2020,
    background_check: true,
    status: "Available",
    description: item.description || item.professional.introduction,
    imageUrl:
      item.professional.profile_image ||
      "/assets/home-service/default-service.jpg",
    apiData: {
      maximum_price: item.maximum_price,
      minimum_price: item.minimum_price,
      pricing_type: item.pricing_type,
      completed_tasks: item.completed_tasks,
      professional_id: item.professional._id,
    },
  }));
};

function ProfessionalTypeFilter({
  selectedType,
  onTypeChange,
}: {
  selectedType: string;
  onTypeChange: (type: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <button
        className={`px-4 py-1 rounded-full text-xs font-medium transition-colors ${
          selectedType === "All"
            ? "bg-sky-600 text-white"
            : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
        }`}
        onClick={() => onTypeChange("All")}
      >
        All Professionals
      </button>
      <button
        className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
          selectedType === "company"
            ? "bg-sky-600 text-white"
            : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
        }`}
        onClick={() => onTypeChange("company")}
      >
        Companies
      </button>
      <button
        className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
          selectedType === "individual"
            ? "bg-sky-600 text-white"
            : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
        }`}
        onClick={() => onTypeChange("individual")}
      >
        Individuals
      </button>
    </div>
  );
}

export default function ProfessionalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const searchParams = useSearchParams();
  const service_id = searchParams.get("id");
  const zipcode = searchParams.get("zipcode");

  const [selectedType, setSelectedType] = useState<string>("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [googleProfessionals, setGoogleProfessionals] = useState<
    GoogleProfessional[]
  >([]);
  const [loading, setLoading] = useState(false);

  const formatted = slug
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  const service = service_id || "68e7ce11b0735d6e372e4380";
  const zip = zipcode || "95814";

  const {
    data: topProfessionals,
    isLoading,
    isError,
  } = useTopProfessionals(service, zip);

  const searchProfessionals = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/google?serviceName=${formatted}&zipcode=${zip}`
      );
      const json = await res.json();
      setGoogleProfessionals(json.data ?? []);
    } catch (err) {
      console.error("Error fetching professionals:", err);
    } finally {
      setLoading(false);
    }
  };

  const platformProfessionals = topProfessionals?.data
    ? transformProfessionalData(topProfessionals.data)
    : [];

  // Filter platform professionals based on selected type
  const filteredProfessionals = platformProfessionals.filter((professional) => {
    if (selectedType === "All") return true;
    if (selectedType === "company") return professional.type === "Company";
    if (selectedType === "individual") return professional.type === "Handyman";
    return true;
  });

  // Filter Google professionals based on selected type (if needed)
  const filteredGoogleProfessionals = googleProfessionals.filter((pro) => {
    if (selectedType === "All") return true;
    if (selectedType === "company") {
      return pro.types?.includes("general_contractor") || false;
    }
    if (selectedType === "individual") {
      return (
        pro.types?.some(
          (type) =>
            type.includes("plumber") ||
            type.includes("electrician") ||
            type.includes("handyman")
        ) || false
      );
    }
    return true;
  });

  useEffect(() => {
    searchProfessionals();
  }, []); // Consider adding dependencies if needed

  const displayService = slug
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  if (isLoading && platformProfessionals.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading professionals...
          </p>
        </div>
      </div>
    );
  }

  if (
    isError &&
    platformProfessionals.length === 0 &&
    googleProfessionals.length === 0
  ) {
    return (
      <ErrorDisplay
        errorType="loading"
        fullScreen={true}
        onRetry={() => window.location.reload()}
      />
    );
  }

  const userLocationRaw = localStorage.getItem("user_location");
  let userLocation: any = null;
  try {
    userLocation = userLocationRaw ? JSON.parse(userLocationRaw) : null;
  } catch (e) {
    console.error("Failed to parse user_location from localStorage:", e);
    userLocation = null;
  }

  return (
    <div className="relative bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300 dark:text-gray-100 text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Breadcrumbs
          paths={[
            { name: "Home", href: "/" },
            { name: "Home Services", href: "/home-services" },
            { name: displayService },
          ]}
        />

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="py-4"
        ></motion.div>

        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="w-full py-2 px-4 bg-sky-600 text-white rounded-md shadow hover:bg-sky-700 transition-colors"
          >
            Filter Professionals
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 order-3">
          {/* Sidebar Filter - Hidden on mobile */}
          <div className="hidden lg:block lg:w-1/4">
            <ServiceQuestion serviceId={slug} />
          </div>

          <div className="lg:w-2/4 flex-1">
            <div className="flex flex-row flex-wrap justify-between items-center my-2">
              <div className="space-y-2">
                <h1 className="text-md md:text-md font-bold">
                  Top {filteredProfessionals.length} {formatted} Professionals
                  in&nbsp;
                  <u className="text-sky-600 dark:text-sky-400">
                    {userLocation?.city}, {userLocation?.state}
                  </u>
                </h1>

                <ProfessionalTypeFilter
                  selectedType={selectedType}
                  onTypeChange={setSelectedType}
                />
              </div>
            </div>

            <ProfessionalList
              professionals={filteredProfessionals}
              googleProfessionals={filteredGoogleProfessionals}
              serviceId={service}
              loading={loading || isLoading}
            />

            {filteredProfessionals.length === 0 &&
              filteredGoogleProfessionals.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">
                    No professionals found for the selected filters.
                  </p>
                </div>
              )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Dialog */}
      <Dialog
        open={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Panel className="relative bg-white dark:bg-gray-800 rounded-lg max-w-md w-full mx-4 p-6 shadow-xl">
            <Dialog.Title className="text-lg font-bold mb-4">
              Filter Professionals
            </Dialog.Title>

            <ServiceQuestion serviceId={slug} />

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsFilterOpen(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
