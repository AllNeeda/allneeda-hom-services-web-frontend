'use client'
import { useState, useCallback, FormEvent, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { ImagePlus, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProgressBar } from "@/components/home-services/onboarding/ProgressBar";
import { useBusinessInfo, useProfessionalReview } from "@/hooks/RegisterPro/useRegister";
import { BusinessInfoPayload } from "@/app/api/services/ProAccount";
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

const DEFAULT_LOGO = "/service_profile.jpg";

const BusinessInfo = () => {
  const token = getAccessToken() || "";
  const { data: professionalData, isLoading } = useProfessionalReview(token);
  const { mutate, isPending } = useBusinessInfo(token);
  const router = useRouter();
  const params = useSearchParams();
  const serviceId = params.get("id");
  const Backend_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
  const [businessType, setBusinessType] = useState<"company" | "individual" | "sub-contractor">("company");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [employees, setEmployees] = useState<string>("");
  const [founded, setFounded] = useState<string>("");
  const [about, setAbout] = useState<string>("");
  const [hasExistingProfileImage, setHasExistingProfileImage] = useState<boolean>(false);
  useEffect(() => {
    if (professionalData?.professional?.professional) {
      const prof = professionalData.professional.professional;

      setBusinessType(prof.business_type || "company");
      setEmployees(prof.employees || "");
      setFounded(prof.founded_year || "");
      setAbout(prof.introduction || "");

      if (prof.profile_image) {
        const fullImageUrl = prof.profile_image.startsWith('http')
          ? prof.profile_image
          : `${Backend_URL}/uploads/professionals/${prof.profile_image}`;
        setPreview(fullImageUrl);
        setHasExistingProfileImage(true);
      } else {
        setPreview(DEFAULT_LOGO);
        setHasExistingProfileImage(false);
      }
    }
  }, [professionalData, Backend_URL]);

  // Get current image source
  const getImageSrc = () => {
    if (preview) return preview;
    if (professionalData?.professional?.professional?.profile_image) {
      const profImage = professionalData.professional.professional.profile_image;
      return profImage.startsWith('http') ? profImage : `${Backend_URL}/uploads/professionals/${profImage}`;
    }
    return DEFAULT_LOGO;
  };

  // Check if image is required (no existing profile image)
  const isImageRequired = !hasExistingProfileImage && !logoFile;

  // Clean up blob URLs
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (!acceptedFiles.length) return;
    const file = acceptedFiles[0];
    setLogoFile(file);

    // Clean up previous blob URL if it exists
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setHasExistingProfileImage(false); // User is uploading a new image
  }, [preview]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
    noClick: true,
    noKeyboard: true,
  });

  const handleRemove = () => {
    setLogoFile(null);

    // Clean up blob URL if it exists
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }

    // Reset to existing profile URL from API or default
    const existingProfileUrl = professionalData?.professional?.professional?.profile_image;
    if (existingProfileUrl) {
      const fullImageUrl = existingProfileUrl.startsWith('http')
        ? existingProfileUrl
        : `${Backend_URL}/uploads/professionals/${existingProfileUrl}`;
      setPreview(fullImageUrl);
      setHasExistingProfileImage(true);
    } else {
      setPreview(DEFAULT_LOGO);
      setHasExistingProfileImage(false);
    }
  };

  const handleBusiness = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate image is provided
    if (isImageRequired) {
      alert("Please upload a business profile image");
      return;
    }

    const businessInfoData: BusinessInfoPayload = {
      id: professionalData?.professional?.professional?._id,
      businessType,
      employees: employees || null,
      founded: founded || null,
      about: about || null,
      profile: logoFile,
    };

    mutate(businessInfoData);
  };

  if (isLoading) {
    return (
      <GlobalLoader></GlobalLoader>
    );
  }

  return (
    <div>
      {!serviceId && (
        <ProgressBar
          currentStep={1}
          totalSteps={ONBOARDING_STEPS.length}
          steps={ONBOARDING_STEPS}
          className="mb-8"
        />
      )}

      <form onSubmit={handleBusiness} className="mx-6">
        <section className="border-b border-gray-200 dark:border-gray-700 pb-12">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Business Profile Setup
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            This information is visible to customers looking for services.
          </p>

          <div className="sm:col-span-1 mt-6">
            <div className="flex items-center gap-2 mb-2">
              <label htmlFor="logoUpload" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Business Profile
              </label>
              {isImageRequired && (
                <span className="text-red-500 text-xs">* Required</span>
              )}
            </div>

            <div
              {...getRootProps()}
              id="logoUpload"
              className={`relative w-36 h-36 border-2 border-dashed rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center cursor-pointer transition-colors ${isDragActive
                  ? "border-blue-500 bg-blue-100 dark:bg-blue-900"
                  : isImageRequired
                    ? "border-red-300 dark:border-red-700"
                    : "border-gray-300 dark:border-gray-600 hover:border-[#0077B6]"
                }`}
            >
              <input
                {...getInputProps({
                  name: "image",
                  id: "logoUpload",
                  required: isImageRequired
                })}
                aria-label="Upload business logo"
              />
              <Image
                src={getImageSrc()}
                alt="Logo Preview"
                fill
                className="object-cover rounded-full shadow-sm"
                sizes="144px"
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_LOGO;
                }}
              />

              <div className="absolute inset-0 rounded-full bg-black bg-opacity-40 opacity-0 hover:opacity-100 flex flex-col items-center justify-center space-y-2 transition-opacity">
                {(logoFile || professionalData?.professional?.professional?.profile_image) && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleRemove(); }}
                    className="text-white bg-red-600 px-3 py-1 rounded text-xs font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Remove
                  </button>
                )}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); open(); }}
                  className="flex items-center gap-1 text-white bg-[#0077B6] px-3 py-1 rounded text-xs font-semibold hover:bg-[#004fb6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <ImagePlus className="w-4 h-4" />
                  {logoFile || professionalData?.professional?.professional?.profile_image ? "Change" : "Upload"}
                </button>
              </div>
            </div>
            {isImageRequired && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                Please upload a business profile image
              </p>
            )}
          </div>

          {/* Form Fields */}
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 text-[13px]">
            {/* Business Type */}
            <div className="sm:col-span-3">
              <label htmlFor="business-type" className="block text-sm font-medium text-gray-900 dark:text-gray-200">
                Business Type
              </label>
              <select
                id="business-type"
                name="businessType"
                value={businessType}
                required
                onChange={(e) => setBusinessType(e.target.value as any)}
                className="mt-2 block w-full rounded-[4px] bg-white dark:bg-gray-900 py-1.5 pl-3 pr-8 text-base text-gray-900 dark:text-white placeholder:text-[13px] dark:placeholder-gray-500 outline-1 outline-gray-300 dark:outline-gray-600 focus:outline-1 focus:outline-[#0077B6] focus:outline-offset-2 sm:text-sm"
              >
                <option value="company">Company</option>
                <option value="individual">Individual</option>
                <option value="sub-contractor">Sub-Contractor</option>
              </select>
            </div>

            {/* Employees Field */}
            {(businessType === "company" || businessType === "sub-contractor") && (
              <div className="sm:col-span-3">
                <label htmlFor="employees" className="block text-sm font-medium text-gray-900 dark:text-gray-200">
                  Number of Employees
                </label>
                <input
                  id="employees"
                  name="employees"
                  type="number"
                  min={0}
                  value={employees}
                  onChange={(e) => setEmployees(e.target.value)}
                  placeholder="Ex: 14"
                  className="mt-2 block w-full rounded-[4px] bg-white dark:bg-gray-900 px-3 py-1.5 text-base text-gray-900 dark:text-white placeholder:text-[13px] dark:placeholder-gray-500 outline-1 outline-gray-300 dark:outline-gray-600 focus:outline-1 focus:outline-[#0077B6] focus:outline-offset-2 sm:text-sm"
                />
              </div>
            )}

            <div className="sm:col-span-full">
              <label htmlFor="founded" className="block text-sm font-medium text-gray-900 dark:text-gray-200">
                Founded Year
              </label>
              <input
                id="founded"
                name="founded"
                type="number"
                required
                min={1800}
                value={founded}
                onChange={(e) => setFounded(e.target.value)}
                placeholder="Ex: 2014"
                className="mt-2 block w-full rounded-[4px] bg-white dark:bg-gray-900 px-3 py-1.5 text-base text-gray-900 dark:text-white placeholder:text-[13px] dark:placeholder-gray-500 outline-1 outline-gray-300 dark:outline-gray-600 focus:outline-1 focus:outline-[#0077B6] focus:outline-offset-2 sm:text-sm"
              />
            </div>

            {/* About */}
            <div className="sm:col-span-6 mt-6">
              <label htmlFor="why-hire" className="block text-sm font-medium text-gray-900 dark:text-gray-200 text-[13px]">
                Why should customers hire you?
              </label>
              <textarea
                id="why-hire"
                name="about"
                rows={4}
                required
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="Explain what makes your business stand out and why you'll do a great job."
                className="mt-2 block w-full rounded-[4px] bg-white dark:bg-gray-900 px-3 py-1.5 text-[13px] text-gray-900 dark:text-white placeholder:text-[13px] dark:placeholder-gray-500 outline-1 outline-gray-300 dark:outline-gray-600 focus:outline-1 focus:outline-[#0077B6] focus:outline-offset-1"
              />
              <div className="mt-2 text-gray-600 dark:text-gray-400 text-[13px]">
                <p>You can mention:</p>
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>Years in business</li>
                  <li>What you are passionate about</li>
                  <li>Special skills or equipment</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Form Actions */}
        <div className="fixed bottom-6 right-6 flex gap-4 text-[13px]">
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white text-[13px] py-2 px-5 rounded-[4px] font-medium hover:bg-gray-400 dark:hover:bg-gray-600 transition"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isPending || isImageRequired}
            className="text-white text-[13px] py-2 px-6 rounded-[4px] bg-[#0077B6] hover:bg-[#005f8e] disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin inline-block mr-2" />}
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default BusinessInfo;