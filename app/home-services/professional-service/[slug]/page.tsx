"use client";

import { use, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";

import Breadcrumbs from "@/components/home-services/homepage/Breadcrumbs";
import ProfessionalList from "@/components/home-services/homepage/professional/ProfessionalList";
import ErrorDisplay from "@/components/ui/ErrorDisplay";
import GlobalLoader from "@/components/ui/global-loader";

import { useTopProfessionals } from "@/hooks/useHomeServices";

import {
  Professional,
  GoogleProfessional,
} from "@/types/professional";

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/*                         Data Transformation Helper                          */
/* -------------------------------------------------------------------------- */

const transformProfessionalData = (
  data: ApiProfessional[]
): Professional[] =>
  data.map((item, index) => ({
    _id: item._id || `professional-${index}`,
    company: item.professional.business_name,
    type:
      item.professional.business_type === "company"
        ? "Company"
        : "Handyman",
    service: item.service_name,
    rating: item.professional.rating_avg || 0,
    services: [item.service_name],

    zipCodes: [],
    founded: 2020,
    background_check: true,
    distance: 0,
    guarantee: true,
    employee_count:
      item.professional.business_type === "company" ? 10 : 1,
    total_hires: item.professional.total_hire,
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

/* -------------------------------------------------------------------------- */
/*                                Page Component                               */
/* -------------------------------------------------------------------------- */

const FINAL_LIMIT = 5;

export default function ProfessionalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  /* -------------------------------- Params -------------------------------- */
  const { slug } = use(params);
  const searchParams = useSearchParams();

  const serviceId =
    searchParams.get("id") ?? "68e7ce11b0735d6e372e4380";
  const zip =
    searchParams.get("zipcode") ?? "95814";

  const serviceName = useMemo(
    () =>
      slug
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase()),
    [slug]
  );

  /* -------------------------------- State --------------------------------- */
  const [selectedType] = useState("All");

  const [googleProfessionals, setGoogleProfessionals] =
    useState<GoogleProfessional[]>([]);
  const [googleLoading, setGoogleLoading] = useState(false);
  
  // Track if we've already fetched Google data
  // const [hasFetchedGoogle, setHasFetchedGoogle] = useState(false);

  /* ----------------------------- Platform API ------------------------------ */
  const {
    data: topProfessionals,
    isLoading,
    isError,
  } = useTopProfessionals(serviceId, zip);

  /* ------------------------- Transform Platform Data ------------------------ */
  const platformProfessionals = useMemo<Professional[]>(() => {
    if (!topProfessionals?.data) return [];
    return transformProfessionalData(topProfessionals.data);
  }, [topProfessionals]);

  /* ------------------------------- Filtering -------------------------------- */
  const filteredPlatformProfessionals = useMemo(() => {
    if (selectedType === "All") return platformProfessionals;

    return platformProfessionals.filter((pro) =>
      selectedType === "company"
        ? pro.type === "Company"
        : pro.type === "Handyman"
    );
  }, [platformProfessionals, selectedType]);

  const filteredGoogleProfessionals = useMemo(() => {
    if (selectedType === "All") return googleProfessionals;

    return googleProfessionals.filter((pro) =>
      selectedType === "company"
        ? pro.types?.includes("general_contractor")
        : true
    );
  }, [googleProfessionals, selectedType]);

 /* ------------------------------ Google API ------------------------------- */
useEffect(() => {
  // ✅ Skip Google if platform already enough
  if (filteredPlatformProfessionals.length >= FINAL_LIMIT) return;

  const cacheKey = `google-pros-${serviceName}-${zip}`;
  const cached = sessionStorage.getItem(cacheKey);

  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      
      // Handle both formats: direct array or object with data array
      let cachedData: GoogleProfessional[] = [];
      
      if (Array.isArray(parsed)) {
        // Old format: direct array
        cachedData = parsed;
      } else if (parsed && Array.isArray(parsed.data)) {
        // New format: object with data array
        cachedData = parsed.data;
      }
      
      setGoogleProfessionals(cachedData);
      return;
    } catch (error) {
      console.error("Failed to parse cached Google professionals:", error);
      sessionStorage.removeItem(cacheKey);
    }
  }

  const fetchGoogleProfessionals = async () => {
    setGoogleLoading(true);
    try {
      const res = await fetch(
        `/api/google?serviceName=${serviceName}&zipcode=${zip}`
      );

      const json = await res.json();

      const normalized: GoogleProfessional[] = (json?.data ?? []).map(
        (item: GoogleProfessional) => ({
          ...item,
          formatted_phone_number:
            item.formatted_phone_number ?? "Not available",
        })
      );

      // Store with timestamp for cache management
      const cacheData = {
        data: normalized,
        timestamp: Date.now(),
      };
      sessionStorage.setItem(cacheKey, JSON.stringify(cacheData));
      setGoogleProfessionals(normalized);
    } catch (error) {
      console.error("Google search failed:", error);
      setGoogleProfessionals([]);
    } finally {
      setGoogleLoading(false);
    }
  };

  fetchGoogleProfessionals();
}, [serviceName, zip, filteredPlatformProfessionals.length]);

  /* ------------------------ Final Combined Result --------------------------- */
  const combinedProfessionals = useMemo(() => {
    const platformCount = filteredPlatformProfessionals.length;

    if (platformCount >= FINAL_LIMIT) {
      return {
        platform: filteredPlatformProfessionals,
        google: [],
      };
    }

    const needed = FINAL_LIMIT - platformCount;
    
    // Ensure filteredGoogleProfessionals is an array before slicing
    const googleArray = Array.isArray(filteredGoogleProfessionals) 
      ? filteredGoogleProfessionals 
      : [];

    return {
      platform: filteredPlatformProfessionals,
      google: googleArray.slice(0, needed),
    };
  }, [filteredPlatformProfessionals, filteredGoogleProfessionals]);

  /* ------------------------------- UI States -------------------------------- */
  if (isLoading && platformProfessionals.length === 0) {
    return <GlobalLoader />;
  }

  if (
    isError &&
    platformProfessionals.length === 0 &&
    googleProfessionals.length === 0
  ) {
    return (
      <ErrorDisplay
        errorType="loading"
        fullScreen
        onRetry={() => window.location.reload()}
      />
    );
  }

  /* -------------------------------- Render -------------------------------- */
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <Breadcrumbs
          paths={[
            { name: "Home", href: "/" },
            { name: "Home Services", href: "/home-services" },
            { name: serviceName },
          ]}
        />
        

        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="py-4"
        />

        <ProfessionalList
          professionals={combinedProfessionals.platform}
          googleProfessionals={combinedProfessionals.google}
          serviceId={serviceId}
          loading={googleLoading || (isLoading && platformProfessionals.length === 0)}
        />
      </div>
    </div>
  );
}