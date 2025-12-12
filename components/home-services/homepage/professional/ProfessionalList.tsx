"use client";
import React from "react";
import {
  Star,
  BadgeCheck,
  PackageOpen,
  IdCardLanyard,
  MousePointerClick,
  OctagonAlert,
  Check,
  MapPin,
  Phone,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Questioner from "../../question/Questioner";
import { useEffect, useState } from "react";
import { getPorfessionalsStaticURL } from "@/app/api/axios";
import { Professional, GoogleProfessional } from "@/types/professional";
interface ProfessionalListProps {
  professionals: Professional[];
  googleProfessionals?: GoogleProfessional[];
  selectedType?: string;
  serviceId: string;
  loading?: boolean;
}

// Transform Google professional data to match the Professional interface
const transformGoogleProfessional = (
  googlePro: GoogleProfessional
): Professional => {
  const rating =
    typeof googlePro.rating === "string"
      ? parseFloat(googlePro.rating) || 0
      : googlePro.rating || 0;

  const businessType = googlePro.types?.includes("general_contractor")
    ? "Company"
    : googlePro.types?.includes("plumber") ||
      googlePro.types?.includes("electrician")
    ? "Specialist"
    : "Business";

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
      businessType === "Company" ? 10 : businessType === "Specialist" ? 3 : 1,
    total_hires: googlePro.user_ratings_total || 0,
    founded: 2015, // Default year for Google businesses
    background_check: true, // Assume verified by Google
    status:
      googlePro.business_status === "OPERATIONAL"
        ? "Available"
        : "Not Available",
    description: `${
      googlePro.name
    } is a ${businessType.toLowerCase()} providing ${
      googlePro.types?.join(", ") || "professional services"
    } in the area. ${
      googlePro.opening_hours?.open_now ? "Currently open for business." : ""
    }`,
    imageUrl: googlePro.icon || "/assets/home-service/default-service.jpg",
    apiData: {
      maximum_price: googlePro.price_level ? googlePro.price_level * 100 : 500,
      minimum_price: googlePro.price_level ? googlePro.price_level * 50 : 100,
      pricing_type: "hourly",
      completed_tasks: googlePro.user_ratings_total || 0,
      professional_id: googlePro.place_id,
    },
    // Store original Google data for display
    ...({ googleData: googlePro } as any),
  };
};

export default function ProfessionalList({
  professionals,
  googleProfessionals = [],
  // selectedType,
  serviceId,
  loading = false,
}: ProfessionalListProps) {
  const [BASEDIR, setBaseDir] = useState("");
  const [showGoogleProfessionals, setShowGoogleProfessionals] = useState(true);

  console.log("The professionals: ", professionals);
  console.log("The google professionals: ", googleProfessionals);

  // Format price range display
  // const formatPriceRange = (min: number, max: number, pricingType: string) => {
  //   if (min === 0 && max === 0) return "Contact for pricing";
  //   if (pricingType === "fixed") {
  //     return `$${min}`;
  //   }
  //   return `$${min} - $${max}`;
  // };

  // Calculate years in business (simplified)
  // const calculateYearsInBusiness = (founded: number) => {
  //   const currentYear = new Date().getFullYear();
  //   return currentYear - founded;
  // };

  const selectedProfessionals: string[] = professionals.map((item) => item.id);

  useEffect(() => {
    setBaseDir(getPorfessionalsStaticURL());
    setShowGoogleProfessionals(true);
  }, []);

  // Transform Google professionals
  const transformedGooglePros = googleProfessionals.map(
    transformGoogleProfessional
  );

  // Combine all professionals
  const allProfessionals = [...professionals, ...transformedGooglePros];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md animate-pulse border border-gray-200 dark:border-gray-700"
            >
              <div className="flex gap-4">
                <div className="w-24 h-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Regular Platform Professionals */}
      {professionals.length > 0 && (
        <div className="space-y-4">
          {professionals.length > 0 && transformedGooglePros.length > 0 && (
            <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300">
              Platform Professionals ({professionals.length})
            </h3>
          )}
          <div className="grid gap-4">
            {professionals.map((professional) => (
              <ProfessionalCard
                key={professional.id}
                professional={professional}
                serviceId={serviceId}
                selectedProfessionals={selectedProfessionals}
                BASEDIR={BASEDIR}
                isGoogleProfessional={false}
              />
            ))}
          </div>
        </div>
      )}

      {/* Google Professionals */}
      {showGoogleProfessionals && transformedGooglePros.length > 0 && (
        <div className="space-y-4">
          <div className="grid gap-4">
            {transformedGooglePros.map((professional) => (
              <ProfessionalCard
                key={professional.id}
                professional={professional}
                serviceId={serviceId}
                selectedProfessionals={selectedProfessionals}
                BASEDIR={BASEDIR}
                isGoogleProfessional={true}
                googleData={(professional as any).googleData}
              />
            ))}
          </div>
        </div>
      )}

      {allProfessionals.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No professionals found for the selected filters.
          </p>
        </div>
      )}
    </div>
  );
}

// Professional Card Component
interface ProfessionalCardProps {
  professional: Professional;
  serviceId: string;
  selectedProfessionals: string[];
  BASEDIR: string;
  isGoogleProfessional: boolean;
  googleData?: GoogleProfessional;
}

const ProfessionalCard: React.FC<ProfessionalCardProps> = ({
  professional,
  serviceId,
  selectedProfessionals,
  BASEDIR,
  isGoogleProfessional,
  googleData,
}) => {
  const formatPriceRange = (min: number, max: number, pricingType: string) => {
    if (min === 0 && max === 0) return "Contact for pricing";
    if (pricingType === "fixed") {
      return `$${min}`;
    }
    return `$${min} - $${max}`;
  };

  const calculateYearsInBusiness = (founded: number) => {
    return new Date().getFullYear() - founded;
  };

  return (
    <motion.div
      key={professional.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={`bg-white p-4 dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border transition-all duration-300 ${
        isGoogleProfessional
          ? "border-blue-200 dark:border-blue-900"
          : "border-gray-200 dark:border-gray-700"
      }`}
    >
      {/* Top Row: Image + Basic Info */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Image */}
        <div className="w-full h-32 sm:w-24 sm:h-24 relative flex-shrink-0">
          {professional.imageUrl ? (
            <Image
              src={
                isGoogleProfessional
                  ? professional.imageUrl // Google images are already full URLs
                  : `${BASEDIR}/${professional.imageUrl}` // Local images need BASEDIR
              }
              fill
              alt={professional.company}
              className="object-cover rounded"
              sizes="(max-width: 640px) 100vw, 96px"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm rounded">
              {isGoogleProfessional ? (
                <div className="text-center p-2">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-1">
                    <span className="text-blue-600 dark:text-blue-300 font-bold">
                      G
                    </span>
                  </div>
                  <span className="text-xs">Google</span>
                </div>
              ) : (
                "No Image"
              )}
            </div>
          )}
        </div>

        {/* Basic Info */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div className="flex justify-between items-start gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                  {professional.type}
                </span>
                {isGoogleProfessional && (
                  <span className="text-xs font-medium px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                    Google Verified
                  </span>
                )}
                <h2 className="text-md font-semibold truncate">
                  {professional.company}
                </h2>
              </div>

              {/* Rating */}
              <div className="flex items-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < Math.floor(professional.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                  />
                ))}
                <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                  {professional.rating > 0
                    ? professional.rating.toFixed(1)
                    : "No ratings"}
                </span>
                <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {professional.total_hires}{" "}
                  {isGoogleProfessional ? "reviews" : "hires"}
                </span>
                {isGoogleProfessional && googleData?.opening_hours && (
                  <>
                    <span className="mx-2 text-gray-300 dark:text-gray-600">
                      •
                    </span>
                    <span
                      className={`text-xs ${
                        googleData.opening_hours.open_now
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {googleData.opening_hours.open_now
                        ? "Open Now"
                        : "Closed"}
                    </span>
                  </>
                )}
              </div>

              {/* Google-specific info */}
              {isGoogleProfessional && googleData && (
                <div className="space-y-1 mb-2">
                  <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                    <MapPin className="w-3 h-3 mr-1" />
                    {/* <span className="truncate">
                      {googleData.formatted_address}
                    </span> */}
                    <span className="truncate">************************</span>
                  </div>
                  {googleData.formatted_phone_number && (
                    <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                      <Phone className="w-3 h-3 mr-1" />
                      {/* <span>{googleData.formatted_phone_number}</span> */}
                      <span className="text-gray-500">*** ************</span>
                    </div>
                  )}
                </div>
              )}

              {/* Price Range */}
              {professional.apiData && (
                <div className="flex items-center text-sm font-medium text-green-600 dark:text-green-400">
                  {formatPriceRange(
                    professional.apiData.minimum_price,
                    professional.apiData.maximum_price,
                    professional.apiData.pricing_type
                  )}
                  <span className="ml-1 text-xs text-gray-500 dark:text-gray-400 capitalize">
                    ({professional.apiData.pricing_type.replace("_", " ")})
                  </span>
                </div>
              )}
            </div>
            <span
              className={`px-2 py-0.5 text-xs rounded-full flex-shrink-0 ${
                professional.status === "Available"
                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100"
                  : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100"
              }`}
            >
              {professional.status}
            </span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-1 mt-2 text-xs text-gray-600 dark:text-gray-300">
            <div className="flex items-center truncate">
              {professional.guarantee ? (
                <BadgeCheck className="w-3 h-3 text-green-500 mr-1 flex-shrink-0" />
              ) : (
                <OctagonAlert className="w-3 h-3 text-red-500 mr-1 flex-shrink-0" />
              )}
              <span className="truncate">
                {isGoogleProfessional ? "Google Verified" : "Guarantee"}
              </span>
            </div>
            <div className="flex items-center truncate">
              <IdCardLanyard className="w-3 h-3 mr-1 flex-shrink-0" />
              <span className="truncate">
                {professional.employee_count}{" "}
                {professional.employee_count === 1 ? "Employee" : "Employees"}
              </span>
            </div>
            <div className="flex items-center truncate">
              <PackageOpen className="w-3 h-3 mr-1 flex-shrink-0" />
              <span className="truncate">
                {calculateYearsInBusiness(professional.founded)} years
              </span>
            </div>
            <div className="flex items-center truncate">
              <MousePointerClick className="w-3 h-3 mr-1 flex-shrink-0" />
              <span className="truncate">
                {professional.apiData?.completed_tasks || 0}{" "}
                {isGoogleProfessional ? "reviews" : "tasks"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Description + Services + Button */}
      <div className="dark:border-gray-700 pt-2 mt-2">
        {/* Description */}
        <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">
          {professional.description}
        </p>

        {/* Services */}
        {professional.services?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {professional.services.slice(0, 3).map((service, idx) => (
              <span
                key={idx}
                className="flex items-center text-xs border border-green-200 bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-200 px-2 py-0.5 rounded-full flex-shrink-0"
              >
                <Check className="w-3 h-3 mr-1" />
                <span className="truncate max-w-[100px] sm:max-w-none">
                  {service}
                </span>
              </span>
            ))}
            {professional.services.length > 3 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                +{professional.services.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Button */}
        <div className="flex justify-end gap-2 items-center">
          {isGoogleProfessional ? (
            <>
              {/* {googleData?.website && (
                <Button
                  type="button"
                  className="bg-green-600 dark:bg-green-500 dark:hover:bg-green-600 hover:bg-green-500 rounded-xs text-white font-semibold text-sm px-4 py-2 flex items-center gap-1"
                  onClick={() => window.open(googleData.website, "_blank")}
                >
                  <Globe className="w-4 h-4" />
                  Visit Website
                </Button>
              )}
              <Button
                type="button"
                className="bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-600 hover:bg-blue-500 rounded-xs text-white font-semibold text-sm px-4 py-2 flex items-center gap-1"
                onClick={() =>
                  window.open(
                    googleData?.url ||
                      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        professional.company
                      )}&query_place_id=${professional.id}`,
                    "_blank"
                  )
                }
              >
                <MapPin className="w-4 h-4" />
                View on Maps
              </Button> */}
              <Questioner
                className="bg-sky-600 dark:bg-sky-500 dark:hover:bg-sky-600 hover:bg-sky-500 px-4 py-2 rounded-xs text-white font-semibold text-sm flex items-center gap-1"
                serviceId={serviceId}
                professionalId={professional.id}
                professionalIds={selectedProfessionals}
                triggerText="Request Quote"
              />
            </>
          ) : (
            <>
              <Questioner
                className="bg-sky-600 dark:bg-sky-500 dark:hover:bg-sky-600 hover:bg-sky-500 px-4 py-2 rounded-xs text-white font-semibold text-sm"
                serviceId={serviceId}
                professionalId={professional.id}
                professionalIds={selectedProfessionals}
                triggerText="Request Quotation"
              />
              <Button
                type="button"
                className="bg-sky-600 dark:bg-sky-500 dark:hover:bg-sky-600 hover:bg-sky-500 rounded-xs text-white font-semibold text-sm px-4 py-2"
              >
                <Link
                  href={`/home-services/professional-profile/${professional.id}`}
                >
                  View Details
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};
