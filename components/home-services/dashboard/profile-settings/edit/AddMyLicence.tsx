"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { InfoIcon } from "lucide-react";
import { getAccessToken } from "@/app/api/axios";
import { useProfesssionalProgress } from "@/hooks/RegisterPro/useRegister";
import {
  useLicenseTypes,
  useLocation,
} from "@/hooks/profileSettings/useProfileSettings";
import { postProfessionalLicense } from "@/app/api/dashboard/professionalLicense";
import { LicensePayload } from "@/types/professionalLicenseTypes";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

const AddMyLicence = () => {
  const router = useRouter();
  const [stateName, setStateName] = useState("");
  const [licenceType, setLicenceType] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [licenseExpiration, setLicenseExpiration] = useState("");
  const [licensingAgency, setLicensingAgency] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const token = getAccessToken() || "";
  const { data: professionalData } = useProfesssionalProgress(token);

  const { data: licenseTypes } = useLicenseTypes();
  const { data: locations, isLoading } = useLocation();

  const licenseTypeOptions = useMemo(() => {
    if (!licenseTypes) return [];
    return licenseTypes.data.map((type: { _id: string; name: string }) => ({
      value: type._id,
      label: type.name,
    }));
  }, [licenseTypes]);

  const locationOptions = useMemo(() => {
    if (!locations) return [];
    return locations.map(
      (loc: { _id: string; city: string; state: string }) => ({
        value: loc._id,
        label: `${loc.city}, ${loc.state}`,
      })
    );
  }, [locations]);

  const proId = useMemo(() => {
    if (!professionalData) return null;
    const id = Array.isArray(professionalData)
      ? professionalData?.[0]?._id
      : professionalData?._id;
    if (id) localStorage.setItem("proId", id);
    return id;
  }, [professionalData]);

  const handleSubmit = async () => {
    setSubmitting(true);
    const licenseData: LicensePayload = {
      professional_id: proId,
      state_id: stateName,
      license_type_id: licenceType,
      license_owner_name: ownerName,
      license_expiration: licenseExpiration || null,
      link_to_licensing_agency: licensingAgency || null,
      status: "pending",
    };

    console.log("Submitting license data:", licenseData);
    try {
      const response = await postProfessionalLicense(licenseData, token);
      console.log("License submission response:", response);
      toast.success("License submitted successfully!");

      return response;
    } catch (error) {
      console.error("Error saving license: ", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="font-bold text-2xl text-gray-800 dark:text-white">
          Add a professional license
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Display your professional license to build trust with customers. We
          will check the information provided against the state&apos;s public
          licensing database.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
        <div className="space-y-6">
          {/* State Selection */}
          <div className="space-y-2">
            <label
              htmlFor="state"
              className="font-medium text-gray-800 dark:text-gray-200 flex items-center gap-1"
            >
              State <span className="text-red-500">*</span>
            </label>

            <Select
              value={stateName}
              onValueChange={(val) => setStateName(val)}
            >
              <SelectTrigger className="w-full h-11 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                <SelectValue
                  placeholder={
                    isLoading ? "Loading states..." : "Select a state"
                  }
                />
              </SelectTrigger>

              <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <SelectGroup>
                  <SelectLabel className="text-gray-700 dark:text-gray-300">
                    State
                  </SelectLabel>

                  {isLoading ? (
                    <SelectItem
                      value="loading"
                      disabled
                      className="focus:bg-gray-100 dark:focus:bg-gray-700"
                    >
                      Loading...
                    </SelectItem>
                  ) : (
                    locationOptions.map(
                      (loc: { value: string; label: string }) => (
                        <SelectItem
                          key={loc.value}
                          value={loc.value}
                          className="focus:bg-gray-100 dark:focus:bg-gray-700"
                        >
                          {loc.label}
                        </SelectItem>
                      )
                    )
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* License Type Selection */}
          <div className="space-y-2">
            <label
              htmlFor="licence-type"
              className="font-medium text-gray-800 dark:text-gray-200 flex items-center gap-1"
            >
              License Type <span className="text-red-500">*</span>
            </label>
            <Select
              value={licenceType}
              onValueChange={(val) => setLicenceType(val)}
            >
              <SelectTrigger className="w-full h-11 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                <SelectValue placeholder="Select license type" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto">
                <SelectGroup>
                  <SelectLabel className="text-gray-700 dark:text-gray-300">
                    License Types
                  </SelectLabel>
                  {licenseTypeOptions.map(
                    (type: { value: string; label: string }) => (
                      <SelectItem
                        key={type.value}
                        value={type.value}
                        className="focus:bg-gray-100 dark:focus:bg-gray-700"
                      >
                        {type.label}
                      </SelectItem>
                    )
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* License Owner's Name */}
          <div className="space-y-2">
            <label
              htmlFor="license-owner"
              className="font-medium text-gray-800 dark:text-gray-200 flex items-center gap-1"
            >
              License owner&apos;s name <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              onChange={(e) => setOwnerName(e.target.value)}
              id="license-owner"
              className="h-11 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400"
              value={ownerName}
              placeholder="Enter license owner's name"
            />
          </div>

          {/* License Expiration */}
          <div className="space-y-2">
            <label
              htmlFor="license-expiration"
              className="font-medium text-gray-800 dark:text-gray-200"
            >
              License expiration
            </label>
            <Input
              type="date"
              onChange={(e) => setLicenseExpiration(e.target.value)}
              id="license-expiration"
              className="h-11 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400"
              value={licenseExpiration}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <InfoIcon size={12} /> Leave blank if your license has no
              expiration.
            </p>
          </div>

          {/* Licensing Agency */}
          <div className="space-y-2">
            <label
              htmlFor="license-agency"
              className="font-medium text-gray-800 dark:text-gray-200"
            >
              Link to licensing agency
            </label>
            <Input
              type="text"
              onChange={(e) => setLicensingAgency(e.target.value)}
              id="license-agency"
              className="h-11 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400"
              value={licensingAgency}
              placeholder="Optional: https://..."
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <InfoIcon size={12} /> Supplying this will help speed up
              verification and approval.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              onClick={handleSubmit}
              className={`flex-1 h-11 bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 text-white ${
                submitting && "bg-sky-400"
              }`}
              disabled={!stateName || !licenceType || !ownerName || submitting}
            >
              {submitting ? "Submitting..." : "Submit License"}
            </Button>
            <Button
              type="button"
              onClick={() => router.back()}
              variant="outline"
              className="flex-1 h-11 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
      <Toaster className="border border-green-500 dark:bg-green-400 bg-green-100 text-green-500 dark:text-white" />
      {/* Help Text */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-2">
          <InfoIcon
            size={16}
            className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0"
          />
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Your license information will be verified against official state
            databases. Please ensure all details match exactly what appears on
            your license document.
          </p>
        </div>
      </div>
    </div>
  );
};
export default AddMyLicence;
