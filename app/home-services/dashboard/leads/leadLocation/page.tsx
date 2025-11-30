"use client";

import dynamic from "next/dynamic";
import React, { Suspense, FC } from "react";
import { useRouter } from "next/navigation";


const Leads = dynamic(() => import("@/components/home-services/dashboard/leads/LocationModal"),
{
    ssr: false

});

const SkeletonLoader: FC = () => (
  <div role="status" aria-live="polite" className="w-full max-w-4xl mx-auto p-6">
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
  const router = useRouter();
  const [showModal, setShowModal] = React.useState(true);
  const locations = [
    {
      id: 1,
      address: 'Within 150 miles of LL21 9RG',
      zip: 'LL21 9RG',
      milesRadius: 150,
      selected: false,
      servicesCount: 2,
      center: { lat: 53.02252, lng: -3.45073 }
    }
  ];

  return (
    <main className="dark:bg-gray-900 text-gray-900 dark:text-gray-100 ">
      <Suspense fallback={<SkeletonLoader />}>
        {showModal && (
          <Leads
            onClose={() => {setShowModal(false);router.back()}}
            onContinue={() => {setShowModal(false); router.back();}}
            zip={locations[0].zip}
            milesRadius={locations[0].milesRadius}
            center={locations[0].center}
          />
        )}
      </Suspense>
    </main>
  );
};

export default ParentComponent;
