'use client'; // REQUIRED at top for client-side code

import { ProgressBar } from "@/components/home-services/onboarding/ProgressBar";
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
const ONBOARDING_STEPS = [
  { id: 1, name: 'Profile' },
  { id: 2, name: 'Reviews' },
  { id: 3, name: 'Preferences' },
  { id: 4, name: 'Location' },
  { id: 5, name: 'Payment' },
  { id: 6, name: 'Background' },
];


export default function Onboarding() {
  const router = useRouter();


  const [currentStep] = useState(1);



  const handleNext = () => {

    router.push(`/home-services/dashboard/services/step-3`);
  };

  return (
    <div className="dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col justify-between ">
      <ProgressBar
        currentStep={currentStep}
        totalSteps={ONBOARDING_STEPS.length}
        steps={ONBOARDING_STEPS}
        className="mb-8"
      />
      <div className="max-w-xl mx-auto py-12 px-4">
        <div className="flex flex-col items-center text-center">
          {/* Step Indicator */}
          <div className="text-left w-full">
            {/* Step 1 - Active */}
            <div className="flex items-start space-x-4 mb-6">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0077B6] text-white flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  Build a winning business profile.
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Your profile is free, but it takes time to make it great. It’s worth it — this is how you’ll get hired.
                </p>
              </div>
            </div>

            {/* Step 2 - Upcoming */}
            <div className="flex items-start space-x-4 opacity-40">
              <div className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center font-bold text-gray-500 dark:text-gray-400">
                2
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-500 dark:text-gray-400">Add your preferences</h2>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-6 right-6 flex gap-4 text-[13px]">
        <button
          type="button"
          onClick={() => router.back()}
          className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white text-[13px] py-2 px-5 rounded-[4px] font-medium hover:bg-gray-400 dark:hover:bg-gray-600 transition"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="bg-[#0077B6] text-white text-[13px] py-2 px-6 rounded-[4px] font-medium hover:bg-[#005f8e] transition flex items-center justify-center gap-2"
        >
          <span>Next</span>
        </button>
      </div>
    </div>
  );
}
