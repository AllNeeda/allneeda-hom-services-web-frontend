"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Image from "next/image";
import { useRouter } from "next/navigation";
import BackgroundCheckForm from "./BackgroundCheckForm";
import CheckPhotoId from "./CheckPhotoId";

const GetBackgroundCheck = () => {
  const [step, setStep] = useState(1);
  const [bgCheckType, setCheckType] = useState("ssn");
  const router = useRouter();

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  // const handleSubmit = () => {
  //   // Final submit logic (API call, Supabase insert, etc.)
  //   console.log("Form submitted!");
  // };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* ---------------- Step 1 ---------------- */}
      {step === 1 && (
        <div className="flex flex-col lg:flex-row gap-6 items-center lg:items-start">
          {/* Left Content */}
          <div className="flex-1">
            <h1 className="font-bold text-2xl md:text-3xl lg:text-4xl mb-4">
              Get a free background check
            </h1>
            <p className="text-sm md:text-base text-gray-600 mb-6">
              This is required to join Servicyee (Home Service). It&apos;s free,
              won&apos;t affect your credit, and builds trust with customers.
            </p>

            <RadioGroup
              value={bgCheckType}
              onValueChange={setCheckType}
              className="space-y-6"
            >
              <div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem
                    value="ssn"
                    id="social-security-number"
                    className="h-6 w-6 border-2 border-gray-400 
          data-[state=checked]:border-sky-500 
          data-[state=checked]:bg-sky-500"
                  />
                  <Label
                    htmlFor="social-security-number"
                    className="font-semibold text-base"
                  >
                    Use your social security number
                  </Label>
                </div>
                <p className="text-sm text-gray-500 pl-9">
                  Get a background check using your SSN.
                </p>
              </div>

              <div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem
                    value="photo-id"
                    id="photo-id"
                    className="h-6 w-6 border-2 border-gray-400 
          data-[state=checked]:border-sky-500 
          data-[state=checked]:bg-sky-500"
                  />
                  <Label htmlFor="photo-id" className="font-semibold text-base">
                    Don&apos;t have a social security number?
                  </Label>
                </div>
                <p className="text-sm text-gray-500 pl-9">
                  Upload a picture of your photo ID instead.
                </p>
              </div>
            </RadioGroup>
          </div>

          {/* Right Image */}
          <div className="flex-1 flex justify-center lg:justify-end">
            <Image
              src="/assets/home-service/bg-check.svg"
              width={400}
              height={400}
              alt="Background Check"
              className="w-60 h-100"
            />
          </div>
        </div>
      )}

      {/* ---------------- Step 2 ---------------- */}
      {step === 2 &&
        (bgCheckType === "ssn" ? <BackgroundCheckForm /> : <CheckPhotoId />)}

      {/* ---------------- Step 3 ---------------- */}
      {step === 3 && (
        <div className="text-center">
          <h2 className="text-xl font-bold">Step 3: Review & Submit</h2>
          <p className="text-gray-600">
            Please review your details before final submission.
          </p>
        </div>
      )}

      {/* ---------------- Buttons ---------------- */}
      <div className="flex items-center gap-4 mt-10 justify-center">
        {/* Back Button */}
        <Button
          type="button"
          onClick={() => (step === 1 ? router.back() : prevStep())}
          className="bg-transparent text-sky-500 hover:bg-sky-50 
            dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700"
        >
          Back
        </Button>

        {/* Next / Submit */}
        {step < 2 ? (
          <Button
            type="button"
            onClick={nextStep}
            className="bg-sky-500 text-white hover:bg-sky-600"
          >
            Next
          </Button>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default GetBackgroundCheck;
