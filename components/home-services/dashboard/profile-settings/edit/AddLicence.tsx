"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import AddMyLicence from "./AddMyLicence";
import AddCompanyLicence from "./AddCompanyLicence";
import { ArrowLeft } from "lucide-react";

const AddLicence = () => {
  const [licence, setLicence] = useState<number | null>(null);

  return (
    <div className="max-w-4xl w-full mx-auto my-5 p-4">
      {/* Back button when in step 2 */}
      {licence !== null && (
        <Button
          variant="ghost"
          onClick={() => setLicence(null)}
          className="mb-4 flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
        >
          <ArrowLeft size={16} />
          Back to selection
        </Button>
      )}

      {/* Step 1 - Choose License Holder */}
      {licence === null && (
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="font-bold text-2xl md:text-3xl text-gray-800 dark:text-white">
              Add a professional license
            </h1>
            <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-2 max-w-2xl mx-auto">
              Display your professional license to build trust with customers
              and showcase your qualifications.
            </p>
          </div>

          <div className="text-center">
            <h2 className="font-semibold text-lg md:text-xl text-gray-800 dark:text-gray-200">
              Who is the license holder?
            </h2>
          </div>

          <div className="flex flex-col md:flex-row items-stretch gap-6 justify-center">
            {/* Myself or Business Card */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg flex flex-col items-center justify-between p-6 transition-all duration-300 hover:border-sky-300 dark:hover:border-sky-500 hover:shadow-md dark:hover:shadow-sky-900/20 bg-white dark:bg-gray-800 flex-1">
              <div className="flex flex-col items-center">
                <div className="mb-4 p-4 bg-sky-100 dark:bg-sky-900/30 rounded-full">
                  <Image
                    src={"/assets/home-service/individual.svg"}
                    width={80}
                    height={80}
                    alt="individual"
                    className="w-20 h-20"
                  />
                </div>
                <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-3">
                  Myself or Business
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
                  The license is held directly by the Servicyee account holder
                  or by your business name registered on Servicyee.
                </p>
              </div>
              <Button
                type="button"
                onClick={() => setLicence(1)}
                className="w-full bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 text-white"
              >
                Select
              </Button>
            </div>

            {/* Employee or Other Card */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg flex flex-col items-center justify-between p-6 transition-all duration-300 hover:border-sky-300 dark:hover:border-sky-500 hover:shadow-md dark:hover:shadow-sky-900/20 bg-white dark:bg-gray-800 flex-1">
              <div className="flex flex-col items-center">
                <div className="mb-4 p-4 bg-sky-100 dark:bg-sky-900/30 rounded-full">
                  <Image
                    src={"/assets/home-service/company.svg"}
                    width={80}
                    height={80}
                    alt="company"
                    className="w-20 h-20"
                  />
                </div>
                <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-3">
                  Employee or Other
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
                  The license belongs to someone other than the account holder
                  (for example, another employee or business entity).
                </p>
              </div>
              <Button
                type="button"
                onClick={() => setLicence(2)}
                className="w-full bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 text-white"
              >
                Select
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2 - Show Form Based on Choice */}
      {licence === 1 && <AddMyLicence />}
      {licence === 2 && <AddCompanyLicence />}
    </div>
  );
};

export default AddLicence;
