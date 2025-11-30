"use client";
import { use, useState } from "react";
import { motion } from "framer-motion";
import { Dialog } from "@headlessui/react";
import ProfessionalList from "@/components/home-services/homepage/professional/ProfessionalList";
import Breadcrumbs from "@/components/home-services/homepage/Breadcrumbs";
import ServiceQuestion from "@/components/home-services/question/ServiceQuestion";
import { useSearchParams } from "next/navigation";
import { useTopProfessionals } from "@/hooks/useHomeServices";
import ErrorDisplay from "@/components/ui/ErrorDisplay";

// Interface matching your API response structure
interface Professional {
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

function ProfessionalTypeFilter({
  selectedType,
  onTypeChange,
}: {
  selectedType: string;
  /* eslint-disable no-unused-vars */
  onTypeChange: (type: string) => void;
  /* eslint-enable no-unused-vars */
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

// Transform API data to match your ProfessionalList component expected format
const transformProfessionalData = (apiData: Professional[]) => {
  return apiData.map((item, index) => ({
    id: item._id || `professional-${index}`,
    company: item.professional.business_name,
    type:
      item.professional.business_type === "company" ? "Company" : "Handyman",
    service: item.service_name,
    rating: item.professional.rating_avg || 0,
    services: [item.service_name], // You might want to expand this based on your actual data
    zipCodes: [], // This would need to come from your API
    distance: 0, // This would need to come from your API
    guarantee: true, // Default value
    employee_count: item.professional.business_type === "company" ? 10 : 1, // Default values
    total_hires: item.professional.total_hire,
    founded: 2020, // Default value
    background_check: true, // Default value
    status: "Available",
    description: item.description || item.professional.introduction,
    imageUrl:
      item.professional.profile_image ||
      "/assets/home-service/default-service.jpg",
    // Additional fields from API
    apiData: {
      maximum_price: item.maximum_price,
      minimum_price: item.minimum_price,
      pricing_type: item.pricing_type,
      completed_tasks: item.completed_tasks,
      professional_id: item.professional._id,
    },
  }));
};

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

  // Format the slug for display
  const formatted = slug
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  // Use the service_id from URL params or fallback to slug

  const service = service_id || "68e7ce11b0735d6e372e4380";
  const zip = zipcode || "95814";
  console.log("Requesting professionals for service:", service, "in zip:", zip);

  const {
    data: topProfessionals,
    isLoading,
    isError,
  } = useTopProfessionals(service, zip);

  // Transform API data for the ProfessionalList component
  const professionalData = topProfessionals?.data
    ? transformProfessionalData(topProfessionals.data)
    : [];

  // Filter professionals based on selected type
  const filteredProfessionals = professionalData.filter((professional) => {
    if (selectedType === "All") return true;
    if (selectedType === "company") return professional.type === "Company";
    if (selectedType === "individual") return professional.type === "Handyman";
    return true;
  });

  const displayService = slug
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  if (isLoading) {
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

  if (isError) {
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
                  Top {professionalData.length} {formatted} Professionals
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
              selectedType={selectedType}
              serviceId={service}
            />

            {filteredProfessionals.length === 0 && (
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
