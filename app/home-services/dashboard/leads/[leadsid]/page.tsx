"use client";

import { getAccessToken } from "@/app/api/axios";
import ErrorDisplay from "@/components/ui/ErrorDisplay";
import { useLeadDetails } from "@/hooks/useHomeServices";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import React, { Suspense, FC } from "react";

const Steps = dynamic(
  () => import("@/components/home-services/dashboard/leads/leadDetails"),
  {
    ssr: false,
  }
);

const SkeletonLoader: FC = () => (
  <div
    role="status"
    aria-live="polite"
    className="w-full max-w-4xl mx-auto p-6"
  >
    <div className="animate-pulse space-y-4">
      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
      <div className="h-40 bg-gray-300 dark:bg-gray-700 rounded"></div>
      <div className="flex space-x-4">
        <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded flex-1"></div>
        <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded flex-1"></div>
      </div>
    </div>
  </div>
);

const ParentComponent: FC = () => {
  const token = getAccessToken() || '';
  const params = useParams();
  const leadId = String(params.leadsid);
  const { data: LeadDetails, isLoading, isError } = useLeadDetails(leadId, token);
 

  if (isLoading) {
    return <SkeletonLoader />;
  }

  if (isError || !LeadDetails?.data?.data) {
    return <ErrorDisplay fullScreen={true} title="loading" />;
  }

  return (
    <main className="dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Suspense fallback={<SkeletonLoader />}>
        <Steps leadDetails={LeadDetails.data.data} />
      </Suspense>
    </main>
  );
};

export default ParentComponent;
