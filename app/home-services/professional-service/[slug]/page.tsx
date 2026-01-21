"use client";

import { use, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";

import Breadcrumbs from "@/components/home-services/homepage/Breadcrumbs";
import ProfessionalList from "@/components/home-services/homepage/professional/ProfessionalList";
import ErrorDisplay from "@/components/ui/ErrorDisplay";

import { useTopProfessionals } from "@/hooks/useHomeServices";

import {
  Professional,
  GoogleProfessional,
} from "@/types/professional";
import GlobalLoader from "@/components/ui/global-loader";

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
    id: item._id || `professional-${index}`,
    company: item.professional.business_name,
    type:
      item.professional.business_type === "company"
        ? "Company"
        : "Handyman",
    service: item.service_name,
    rating: item.professional.rating_avg || 0,
    services: [item.service_name],

    /* ✅ REQUIRED BY Professional TYPE */
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
  /* eslint-disable no-unused-vars */
  const [selectedType, setSelectedType] = useState("All");
  /* eslint-enable no-unused-vars */
  const [googleProfessionals, setGoogleProfessionals] = useState<
    GoogleProfessional[]
  >([]);
  const [googleLoading, setGoogleLoading] = useState(false);

  /* ----------------------------- Platform API ------------------------------ */
  const {
    data: topProfessionals,
    isLoading,
    isError,
  } = useTopProfessionals(serviceId, zip);

  /* ------------------------------ Google API ------------------------------- */
  useEffect(() => {
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

        setGoogleProfessionals(normalized);
      } catch (error) {
        console.error("Google search failed:", error);
      } finally {
        setGoogleLoading(false);
      }
    };

    fetchGoogleProfessionals();
  }, [serviceName, zip]);

  /* ------------------------- Transform Platform Data ------------------------ */
  const platformProfessionals = useMemo<Professional[]>(() => {
    console.log("top google professional: ", topProfessionals)
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

  /* ------------------------------- UI States -------------------------------- */
  if (isLoading && platformProfessionals.length === 0) {
    return (
      <GlobalLoader/>
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
          professionals={filteredPlatformProfessionals}
          googleProfessionals={filteredGoogleProfessionals}
          serviceId={serviceId}
          loading={googleLoading || isLoading}
        />
      </div>
    </div>
  );
}
