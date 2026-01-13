"use client";
import { getAccessToken } from "@/app/api/axios";
import { Button } from "@/components/ui/button";
import ErrorDisplay from "@/components/ui/ErrorDisplay";
import { useProfessionalLicense } from "@/hooks/profileSettings/useProfileSettings";
import { useProfesssionalProgress } from "@/hooks/RegisterPro/useRegister";
import {
  BadgeCheck,
  Building2,
  Calendar,
  Edit,
  ExternalLink,
  HelpCircle,
  Loader2,
  MapPin,
  Plus,
  ShieldCheck,
  User,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

const BackgroundCheck = () => {
  const AddLicence = "add-licence";

  const token = getAccessToken() || "";
  const { data: professionalData } = useProfesssionalProgress(token);

  const proId = useMemo(() => {
    if (!professionalData) return null;
    const id = Array.isArray(professionalData)
      ? professionalData?.[0]?._id
      : professionalData?._id;
    if (id) localStorage.setItem("proId", id);
    return id;
  }, [professionalData]);

  const {
    data: professionalLicense,
    isLoading,
    isError,
  } = useProfessionalLicense(proId, token);
  const proLicenseData = professionalLicense?.data;
  console.log("This is the professional license: ", proLicenseData);
  if (isError) {
    return <ErrorDisplay />;
  }
  if (isLoading) {
    return <Loader2 />;
  }

  return (
    <div className="rounded bg-white dark:bg-gray-800 p-4 my-4">
      <h1 className="font-bold text-lg my-4">Credentials</h1>
      <div className="mt-4">
        <div className="flex flex-row gap-2 justify-start items-center">
          <UserCheck className="w-4 h-4" />
          <strong>Background Check</strong>
        </div>
        <div className="border-2 border-gray-200 border-dashed dark:border-gray-700 rounded-md text-gray-400 dark:text-gray-500 flex flex-row gap-2 p-6">
          <p className="flex-2">
            Add a background check badge to your profile by authorizing a free
            background check. This will help you build customer trust and get
            hired more.
          </p>
          <Button
            type="button"
            className="bg-transparent border border-gray-200 dark:border-gray-600 dark:hover:border-sky-500 text-sky-500 hover:bg-transparent hover:border-sky-500"
          >
            <Link
              href={`/home-services/dashboard/services/step-11/?id=${proId}`}
            >
              Start
            </Link>
          </Button>
        </div>
      </div>
      <div className="mt-8">
        {/* Professional Licenses Header */}
        <div className="flex flex-row gap-3 justify-start items-center mb-6">
          <div className="p-2 bg-sky-100 dark:bg-sky-900/30 rounded-lg">
            <ShieldCheck className="w-5 h-5 text-sky-600 dark:text-sky-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Professional Licenses
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Verified credentials build trust with clients
            </p>
          </div>
        </div>

        {professionalData.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* License Information */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                  {/* License Type and Location */}
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg">
                      <Building2 className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                        {proLicenseData?.license_type_id?.name ||
                          "Professional License"}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {proLicenseData?.state_id?.city ||
                            "Location not specified"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* License Details */}
                  <div className="flex flex-wrap gap-4 sm:gap-6 pl-2 sm:pl-0">
                    {/* License Number */}
                    <div className="flex items-center gap-2">
                      <BadgeCheck className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          License #
                        </p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white font-mono">
                          {proLicenseData?.license_number || "N/A"}
                        </p>
                      </div>
                    </div>

                    {/* Expiration Date */}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Expires
                        </p>
                        <p
                          className={`text-sm font-medium ${
                            new Date(proLicenseData?.license_expiration) <
                            new Date()
                              ? "text-red-600 dark:text-red-400"
                              : "text-gray-900 dark:text-white"
                          }`}
                        >
                          {proLicenseData?.license_expiration
                            ? new Date(
                                proLicenseData.license_expiration
                              ).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-start sm:items-center lg:items-start xl:items-center gap-3 lg:gap-2 xl:gap-3">
                <div className="flex-shrink-0">
                  {proLicenseData?.status === "pending" && (
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                      <span className="w-2 h-2 bg-amber-500 rounded-full mr-2 animate-pulse"></span>
                      Under Review
                    </span>
                  )}
                  {proLicenseData?.status === "verified" && (
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                      Verified ✓
                    </span>
                  )}
                  {proLicenseData?.status === "not-verified" && (
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                      Needs Verification
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {proLicenseData?.link_to_licensing_agency && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <a
                        href={proLicenseData.link_to_licensing_agency}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Verify
                      </a>
                    </Button>
                  )}
                  <Button
                    disabled
                    variant="outline"
                    size="sm"
                    className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* License Owner Information */}
            {proLicenseData?.license_owner_name && (
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <User className="w-4 h-4" />
                  <span>License holder: </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {proLicenseData.license_owner_name}
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Empty State */
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 text-center bg-gray-50/50 dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/70 transition-colors duration-300">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No License Added
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                Customers are 3x more likely to hire professionals with verified
                licenses. Build trust and showcase your qualifications by adding
                your professional license.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  asChild
                  className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2.5 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <Link
                    href={`/home-services/dashboard/profile-settings/${AddLicence}`}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add License
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default BackgroundCheck;
