"use client";
import {
  Star,
  BadgeCheck,
  PackageOpen,
  IdCardLanyard,
  MousePointerClick,
  OctagonAlert,
  Check,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Questioner from "../../question/Questioner";
import { useEffect, useState } from "react";
import { getPorfessionalsStaticURL } from "@/app/api/axios";

interface Professional {
  id: string;
  company: string;
  type: string;
  service: string;
  rating: number;
  services: string[];
  zipCodes: string[];
  distance?: number;
  guarantee: boolean;
  employee_count: number;
  total_hires: number;
  founded: number;
  background_check: boolean;
  status: string;
  description: string;
  imageUrl: string;
  apiData?: {
    maximum_price: number;
    minimum_price: number;
    pricing_type: string;
    completed_tasks: number;
    professional_id: string;
  };
}

interface ProfessionalListProps {
  professionals: Professional[];
  selectedType?: string;
  serviceId: string;
}

export default function ProfessionalList({
  professionals,
  selectedType,
  serviceId,
}: ProfessionalListProps) {
  console.log(selectedType);
  const [BASEDIR, setBaseDir] = useState("");
  // Format price range display
  const formatPriceRange = (min: number, max: number, pricingType: string) => {
    if (pricingType === "fixed") {
      return `$${min}`;
    }
    return `$${min} - $${max}`;
  };

  // Calculate years in business (simplified)
  const calculateYearsInBusiness = (founded: number) => {
    const currentYear = new Date().getFullYear();
    return currentYear - founded;
  };
  const selectedProfessionals: string[] = professionals.map((item) => item.id);
  console.log("PROFESSIONAL SELECTED FOR LEAD: ", selectedProfessionals);
  console.log("Professional Image url: ", professionals);

  useEffect(() => {
    setBaseDir(getPorfessionalsStaticURL());
  }, []);

  return (
    <div className="grid gap-4 bg-white dark:bg-gray-900">
      {professionals.map((professional) => (
        <motion.div
          key={professional.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          className="bg-white p-4 dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-300"
        >
          {/* Top Row: Image + Basic Info */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Image */}
            <div className="w-full h-32 sm:w-24 sm:h-24 relative flex-shrink-0">
              {professional.imageUrl ? (
                <Image
                  src={`${BASEDIR}/${professional.imageUrl}`}
                  fill
                  alt={professional.company}
                  className="object-cover rounded"
                  sizes="(max-width: 640px) 100vw, 96px"
                  onError={(e) => {
                    // Fallback if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm rounded">
                  No Image
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
                        ? professional.rating
                        : "No ratings"}
                    </span>
                    <span className="mx-2 text-gray-300 dark:text-gray-600">
                      •
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {professional.total_hires} hires
                    </span>
                  </div>

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
                  <span className="truncate">Guarantee</span>
                </div>
                <div className="flex items-center truncate">
                  <IdCardLanyard className="w-3 h-3 mr-1 flex-shrink-0" />
                  <span className="truncate">
                    {professional.employee_count}{" "}
                    {professional.employee_count === 1
                      ? "Employee"
                      : "Employees"}
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
                    {professional.apiData?.completed_tasks || 0} tasks
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
                {professional.services.map((service, idx) => (
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
              </div>
            )}

            {/* Button */}
            <div className="flex justify-end gap-2 items-center">
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
            </div>
          </div>
        </motion.div>
      ))}

      {professionals.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            No professionals found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
}
