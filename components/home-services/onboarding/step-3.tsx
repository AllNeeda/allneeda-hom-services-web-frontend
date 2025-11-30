"use client";
import { CheckCircle, Star, Loader2, BadgeCheck, Clock } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { ProgressBar } from "@/components/home-services/onboarding/ProgressBar";
import { useProfessionalReview, useUpdateBusinessName } from "@/hooks/RegisterPro/useRegister";
import z from "zod";
import { getAccessToken } from "@/app/api/axios";
import GlobalLoader from "@/components/ui/global-loader";

const ONBOARDING_STEPS = [
    { id: 1, name: "Profile" },
    { id: 2, name: "Reviews" },
    { id: 3, name: "Preferences" },
    { id: 4, name: "Location" },
    { id: 5, name: "Payment" },
    { id: 6, name: "Background" },
];

const businessNameSchema = z.object({
    businessName: z
        .string()
        .min(3, "Business name must be at least 3 characters")
        .max(100, "Business name must be at most 100 characters"),
});

const BusinessName = () => {
    const token = getAccessToken() || "";
    const { data: professionalData, isLoading } = useProfessionalReview(token);
    const { mutate, isPending } = useUpdateBusinessName(token);

    const [businessName, setBusinessName] = useState("");
    const [currentStep] = useState(1);
    const [error, setError] = useState("");

    useEffect(() => {
        if (professionalData?.professional?.professional?.business_name) {
            setBusinessName(professionalData.professional.professional.business_name);
        }
    }, [professionalData]);

    const handleBusiness = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const result = businessNameSchema.safeParse({ businessName });
        if (!result.success) {
            setError(result.error.issues[0].message);
            return;
        }
        setError("");

        mutate({
            businessName,
            id: professionalData?.professional?.professional?._id,
        });
    };

    if (isLoading) {
        return (
            <GlobalLoader></GlobalLoader>
        );
    }

    return (
        <div>
            <ProgressBar
                currentStep={currentStep}
                totalSteps={ONBOARDING_STEPS.length}
                steps={ONBOARDING_STEPS}
                className="mb-8"
            />

            <div className="flex items-center justify-center text-[13px] bg-white dark:bg-gray-900">
                <div className="grid grid-cols-1 md:grid-cols-2 rounded-[7px] overflow-hidden w-full max-w-4xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    {/* Left Section - Business Name Entry */}
                    <form onSubmit={handleBusiness}>
                        <div className="p-8 md:p-10 bg-white dark:bg-gray-900">
                            <h2 className="text-2xl font-bold text-[#023E8A] dark:text-white mb-3">
                                Stand out to customers.
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 text-base mb-5 text-[13px]">
                                Add a few details to your profile to help customers get to know
                                you better.
                            </p>

                            <label
                                htmlFor="businessName"
                                className="text-[13px] block text-gray-700 dark:text-gray-300 font-semibold text-sm mb-2"
                            >
                                First, enter your business name.
                            </label>
                            <input
                                id="businessName"
                                type="text"
                                placeholder="Business Name"
                                name="businessName"
                                value={businessName}
                                onChange={(e) => setBusinessName(e.target.value)}
                                className="mt-1 block w-full text-[13px] px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[#0096C7] focus:border-transparent text-gray-800 dark:text-white dark:bg-gray-800 text-sm"
                            />
                            {error && (
                                <p className="text-red-500 text-[12px] mt-1">{error}</p>
                            )}

                            <div>
                                <button
                                    className={`mt-6 w-full text-white text-[13px] py-2 px-2 rounded-[4px] transition duration-300 ${isPending
                                        ? "bg-[#0077B6]/70 cursor-not-allowed"
                                        : "bg-[#0077B6] hover:bg-[#005f8e]"
                                        }`}
                                >
                                    {isPending && (
                                        <Loader2 className="h-4 w-4 animate-spin inline-block mr-2" />
                                    )}
                                    Next
                                </button>
                            </div>
                        </div>
                    </form>

                    {/* Right Section - Profile Card */}
                    <div className="bg-gray-50 dark:bg-gray-800 p-8 md:p-10 border-t dark:border-gray-700 md:border-l md:border-t-0">
                        <div className="flex flex-col items-center text-center">
                            <div
                                className="w-20 h-20 rounded-full overflow-hidden mb-3 border-2"
                                style={{ borderColor: "#0096C7" }}
                            >
                                <Image
                                    src="/service_profile.jpg"
                                    alt="Handyman"
                                    className="object-cover w-full h-full"
                                    width={80}
                                    height={80}
                                />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                {businessName || "Your Business"}{" "}
                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                    Services
                                </span>
                            </h3>

                            {/* Verified Badge */}
                            <div className="mt-1 flex items-center gap-1 text-blue-600 dark:text-blue-400 text-sm font-medium">
                                <BadgeCheck className="w-4 h-4" />
                                Verified
                            </div>

                            <div className="mt-2 text-green-600 font-semibold text-base flex items-center gap-1">
                                <Star className="w-4 h-4 text-green-500" /> Good 4.0
                            </div>
                            <div className="flex items-center gap-1 text-yellow-500 mt-1 text-sm">
                                <span>★★★★☆</span>
                                <span className="text-gray-500 dark:text-gray-400">
                                    (11 reviews)
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-4 text-[13px]">
                                <span className="bg-[#0096C7]/10 text-[#0096C7] px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                    <BadgeCheck className="w-4 h-4" /> In high demand
                                </span>
                                <span className="bg-green-100 dark:bg-green-200/20 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                    <Clock className="w-4 h-4" /> Fast response
                                </span>
                            </div>

                            <ul className="mt-5 space-y-2 text-gray-600 dark:text-gray-300 text-sm text-left">
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-[#0096C7]" /> 82 hired
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-[#0096C7]" /> Background
                                    checked
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-[#0096C7]" /> 5 years in
                                    business
                                </li>
                            </ul>

                            <button className="mt-6 w-full bg-[#023E8A] hover:bg-[#022d6b] text-white text-[13px] py-2 px-5 rounded-[4px] transition duration-300">
                                Message
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessName;