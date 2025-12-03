'use client';
import { useState } from "react";
import { getAccessToken } from "@/app/api/axios";
import { MapPin, Trash2, Edit, ChevronDown, ChevronUp, Plus } from "lucide-react";
import { useGetServiceById } from "@/hooks/useServices";
import GlobalLoader from "@/components/ui/global-loader";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";

interface ServiceLocation {
  _id: string;
  city?: string;
  state?: string;
  zipcode?: string[];
  address_line?: string;
  country?: string;
  serviceRadiusMiles?: number;
  coordinates?: {
    coordinates: [number, number];
  };
}

const ServiceLocation = () => {
  const token = getAccessToken();
  const router = useRouter();

  const [expandedLocation, setExpandedLocation] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const service_id = searchParams.get("service_id");
    const professional_id = searchParams.get("professional_id");


  const {
    data: serviceByIdData,
    isLoading: isServiceLoading,
    isError: serviceError
  } = useGetServiceById(service_id!, professional_id!, token!);
  const serviceLocations: ServiceLocation[] = serviceByIdData?.data?.data?.location_ids || [];
  const handleEditLocation = (location: ServiceLocation) => {
    const currentLocationData = {
      service_id: service_id,
      professional_id: professional_id,
      location_id: location._id,
      location_data: location
    };
    localStorage.setItem('currentLocation', JSON.stringify(currentLocationData));
    router.push("/home-services/dashboard/services/editLocation");
  };
  const handleDeleteLocation = (locationId: string, locationName: string) => {
    toast.success(`Delete location ${locationName}`);
  };

  const handleAddLocation = () => {
    const currentServiceData = {
      service_id: service_id,
      professional_id: professional_id,
    };
    localStorage.setItem('currentService', JSON.stringify(currentServiceData));
    router.push("/home-services/dashboard/services/serviceLocation");
  };

  const toggleZipCodes = (locationId: string) => {
    setExpandedLocation(expandedLocation === locationId ? null : locationId);
  };

  const formatLocation = (location: ServiceLocation) => {
    const parts = [];
    if (location.address_line) parts.push(location.address_line);
    if (location.city) parts.push(location.city);
    if (location.state) parts.push(location.state);
    if (location.zipcode?.[0]) parts.push(location.zipcode[0]);

    return parts.length > 0 ? parts.join(', ') : 'No address specified';
  };

  if (isServiceLoading) {
    return <GlobalLoader />;
  }
  if (serviceError) {
    return (
      <div className="dark:bg-gray-900 min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="text-red-600 dark:text-red-400 text-[13px] sm:text-sm">
            Failed to load service data. Please try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 text-[#0077B6] text-[13px] py-2 px-4 rounded-[4px] border border-[#0077B6] hover:bg-[#0077B6] hover:text-white transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="dark:bg-gray-900 min-h-screen py-4 sm:py-6 px-3 sm:px-4 lg:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8 lg:mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                Service Locations
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {serviceLocations.length > 0
                  ? `Manage ${serviceLocations.length} service location${serviceLocations.length > 1 ? 's' : ''} for your business`
                  : "No service locations configured yet"
                }
              </p>
            </div>

            {serviceLocations.length > 0 && (
              <button
                type="button"
                onClick={handleAddLocation}
                className="w-full sm:w-auto bg-[#0077B6] text-white text-[13px] sm:text-sm py-2 px-4 rounded-sm hover:bg-[#005A8D] transition-colors flex items-center gap-2 justify-center shadow-sm"
              >
                <Plus className="h-4 w-4" />
                Add New Location
              </button>
            )}
          </div>
        </div>

        {/* Locations List */}
        <div className="w-full">
          {/* Section Header */}

          {/* Locations List Content */}
          <div className="p-4 sm:p-6">
            <div className="space-y-4">
              {serviceLocations.map((location, index) => (
                <div
                  key={location._id}
                  className="border border-gray-200 dark:border-gray-600 rounded-sm bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors overflow-hidden"
                >
                  {/* Location Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between p-4 sm:p-6">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="flex-shrink-0 w-8 h-8 bg-[#0077B6] text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[15px] sm:text-[16px] font-semibold text-gray-900 dark:text-white mb-2 truncate">
                          {formatLocation(location)}
                        </p>
                        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-2 text-xs text-gray-600 dark:text-gray-300">
                          {location.city && (
                            <div className="flex items-center gap-1">
                              <strong>City:</strong>
                              <span>{location.city}</span>
                            </div>
                          )}
                          {location.state && (
                            <div className="flex items-center gap-1">
                              <strong>State:</strong>
                              <span>{location.state}</span>
                            </div>
                          )}
                          {location.country && (
                            <div className="flex items-center gap-1">
                              <strong>Country:</strong>
                              <span>{location.country}</span>
                            </div>
                          )}
                          {location.serviceRadiusMiles && location.serviceRadiusMiles > 0 && (
                            <div className="flex items-center gap-1">
                              <strong>Radius:</strong>
                              <span>{location.serviceRadiusMiles} miles</span>
                            </div>
                          )}
                          {location.zipcode && location.zipcode.length > 0 && (
                            <div className="flex items-center gap-1">
                              <strong>Zip Codes:</strong>
                              <span>{location.zipcode.length}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-4 sm:mt-0 sm:ml-4 flex-shrink-0">
                      {/* Zip Code Toggle Button */}
                      {location.zipcode && location.zipcode.length > 0 && (
                        <button
                          type="button"
                          onClick={() => toggleZipCodes(location._id)}
                          className="p-2 text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-600 rounded-sm transition-colors"
                          title={expandedLocation === location._id ? "Hide zip codes" : "Show zip codes"}
                        >
                          {expandedLocation === location._id ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleEditLocation(location)}
                        className="p-2 text-[#0077B6] hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-sm transition-colors"
                        title="Edit location"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteLocation(location._id, location.city || location._id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-sm transition-colors"
                        title="Delete location"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Collapsible Zip Codes Section */}
                  {expandedLocation === location._id && location.zipcode && location.zipcode.length > 0 && (
                    <div className="border-t border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-4 sm:p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                          Serviceable Zip Codes ({location.zipcode.length})
                        </h4>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Click to collapse
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 bg-gray-50 dark:bg-gray-900 rounded-sm">
                        {location.zipcode.map((zip, zipIndex) => (
                          <span
                            key={zipIndex}
                            className="inline-flex items-center px-3 py-1.5 bg-blue-100 dark:bg-[#0077B6] text-[#0077B6] dark:text-blue-200 text-sm rounded-sm border border-blue-200 dark:border-blue-700 font-medium"
                          >
                            {zip}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Empty State */}
            {serviceLocations.length === 0 && (
              <div className="text-center py-12 sm:py-16">
                <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-10 w-10 text-[#0077B6]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No Service Locations
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 max-w-md mx-auto">
                  Start by adding your first service location to define where you provide your services.
                </p>
                <button
                  type="button"
                  onClick={handleAddLocation}
                  className="bg-[#0077B6] text-white text-sm py-3 px-8 rounded-sm hover:bg-[#005A8D] transition-colors flex items-center gap-2 mx-auto"
                >
                  <Plus className="h-4 w-4" />
                  Add First Location
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceLocation;