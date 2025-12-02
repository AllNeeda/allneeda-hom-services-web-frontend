"use client";

import { useEffect, useState } from "react";
import ActiveToggle from "@/components/ui/admin/ActiveToggle";
import ImageUploadSection from "@/components/ui/admin/ImageUploadSection";
import { ServiceType } from "@/types/service/services";
import {
  useSubcategoryServiceCount,
  useServices,
} from "@/hooks/useHomeServices";
import {
  postServices,
  // updateServiceStatus,
} from "@/app/api/homepage/postServices";
import SubmitButton from "@/components/ui/admin/SubmitButton";
import StatusMessage from "@/components/ui/admin/StatusMessage";
import DataTable, { Column } from "@/components/admin/ui/DataTable";
import { ChevronDown } from "lucide-react";
import { getStaticURL } from "@/app/api/axios";

interface ItemTypes {
  _id: string;
  name: string;
  serviceCount: number;
  servicesCount: number;
  is_active: boolean;
  subcategory_name?: string;
  category_name?: string;
}

interface ServiceItem {
  _id: string;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
  is_featured: boolean;
  image_url: string; // This should contain just the filename like "service_12345.jpg"
  subcategory_id: string;
  subcategory_name?: string;
  category_name?: string;
  price?: number;
  duration?: number;
}

const ServiceTab = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [serviceFormData, setServiceFormData] = useState<Partial<ServiceType>>({
    name: "",
    slug: "",
    description: "",
    is_active: true,
    image_url: "",
    image_file: null as unknown as File,
    _id: "",
    subcategory_id: "",
    is_featured: false,
  });

  const staticURL = getStaticURL();

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^-+|-+$/g, "");

  useEffect(() => {
    setServiceFormData((prev) => ({ ...prev, slug: slugify(prev.name ?? "") }));
  }, [serviceFormData.name]);

  const handleImageSelect = (file: File) => {
    const url = URL.createObjectURL(file);
    setServiceFormData((prev) => ({
      ...prev,
      image_file: file,
      image_url: url,
    }));
  };

  const handlePostService = async () => {
    if (!serviceFormData.image_file) {
      setError("Service image is required");
      return;
    }

    if (!serviceFormData.subcategory_id) {
      setError("Please select a subcategory");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      setSuccess(null);

      const formData = new FormData();
      formData.append("name", serviceFormData.name ?? "");
      formData.append("slug", serviceFormData.slug ?? "");
      formData.append("subcategory_id", serviceFormData.subcategory_id);
      formData.append("description", serviceFormData.description ?? "");
      formData.append("is_active", String(serviceFormData.is_active ?? true));
      formData.append(
        "is_featured",
        String(serviceFormData.is_featured ?? false)
      );
      formData.append("image_url", serviceFormData.image_file as Blob);

      await postServices(formData);
      setSuccess("Service created successfully!");

      // Reset form
      setServiceFormData({
        name: "",
        slug: "",
        subcategory_id: "",
        description: "",
        is_active: true,
        image_file: null as unknown as File,
        image_url: "",
        is_featured: false,
      });
      setShowForm(false);

      // You might want to add a refetch function here
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "Failed to create service"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleFeatured = async (
    serviceId: string,
    currentFeatured: boolean
  ) => {
    try {
      // await updateServiceFeatured(serviceId, !currentFeatured);
      setSuccess(
        `Service ${
          !currentFeatured ? "added to" : "removed from"
        } featured successfully!`
      );

      // Refresh the service list
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to update featured status"
      );
    }
  };

  const resetForm = () => {
    setServiceFormData({
      name: "",
      slug: "",
      subcategory_id: "",
      description: "",
      is_active: true,
      image_file: null as unknown as File,
      image_url: "",
      is_featured: false,
    });
    setError(null);
    setSuccess(null);
  };

  // Data fetching
  const { data: subcategoryServiceCount } = useSubcategoryServiceCount();
  const { data: servicesData } = useServices();

  // Process subcategory data for dropdown
  const subcategoryData = subcategoryServiceCount?.data || [];
  let subcategoryArray: ItemTypes[] = [];

  if (Array.isArray(subcategoryData)) {
    subcategoryArray = subcategoryData;
  } else if (subcategoryData && Array.isArray(subcategoryData.data)) {
    subcategoryArray = subcategoryData.data;
  }

  // Filter only active subcategories for the dropdown
  const activeSubcategories = subcategoryArray.filter((sub) => sub.is_active);

  // Process services data for table
  const servicesList = servicesData?.data || [];
  let serviceArray: ServiceItem[] = [];

  if (Array.isArray(servicesList)) {
    serviceArray = servicesList;
  } else if (servicesList && Array.isArray(servicesList.data)) {
    serviceArray = servicesList.data;
  }
  // hangle toggle service status
  const handleToggleStatus = async (
    serviceId: string,
    currentStatus: boolean
  ) => {
    console.log(
      "Toggle status for service ID:",
      serviceId,
      "Current status:",
      currentStatus
    );
  };

  // Define columns for the services table - SIMPLIFIED VERSION
  const serviceColumns: Column<ServiceItem>[] = [
    {
      key: "image_url", // This column contains just the image filename
      header: "Image",
      isImage: true, // Explicitly mark this as an image column
      className: "w-20", // Set fixed width for image column
      cellClassName: "text-center", // Center the image
    },
    {
      key: "name",
      header: "Service",
      render: (service) => (
        <div>
          <div className="font-medium text-gray-900">{service.name}</div>
        </div>
      ),
    },
    {
      key: "details",
      header: "Description",
      render: (service) => (
        <div className="space-y-1">
          <div className="text-xs text-gray-400">
            {service.description && service.description.length > 50
              ? `${service.description.substring(0, 50)}...`
              : service.description}
          </div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (service) => (
        <div className="space-y-2">
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              service.is_active
                ? "bg-green-100 text-green-800 border border-green-400"
                : "bg-red-100 text-red-800 border border-red-400"
            }`}
          >
            {service.is_active ? "Active" : "Inactive"}
          </span>
          {service.is_featured ? (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-500">
              Featured
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-500">
              Unfeatured
            </span>
          )}
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (service) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleStatus(service._id, service.is_active);
            }}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors duration-200 ${
              service.is_active
                ? "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                : "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
            }`}
          >
            {service.is_active ? "Deactivate" : "Activate"}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleFeatured(service._id, service.is_featured);
            }}
            className={`px-2 py-1 rounded text-sm font-medium transition-colors duration-200 ${
              service.is_featured
                ? "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                : "bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200"
            }`}
          >
            {service.is_featured ? "Unfeature" : "Feature"}
          </button>
          <button
            onClick={(e) => e.stopPropagation()}
            className="px-2 py-1 bg-gray-50 text-gray-700 rounded text-xs hover:bg-gray-100 border border-gray-200 transition-colors duration-200 text-sm font-medium"
          >
            Edit
          </button>
        </div>
      ),
    },
  ];

  const emptyAction = (
    <button
      onClick={() => setShowForm(true)}
      className="mt-4 bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
    >
      Add New Service
    </button>
  );

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Services</h2>
          <p className="text-gray-600 mt-1">Manage your services</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded font-medium transition-colors duration-200 flex items-center gap-2"
        >
          <ChevronDown className="w-5 h-5" />
          Add New Service
        </button>
      </div>
      {/* Debug Info */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-bold text-blue-900 mb-2">Services Status</h4>
        <div className="flex flex-row items-center justify-between gap-4 text-sm font-semibold">
          <div>
            <span className="font-medium">Total Services:</span>{" "}
            {serviceArray.length}
          </div>
          <div>
            <span className="font-medium">Active:</span>{" "}
            {serviceArray.filter((s) => s.is_active).length}
          </div>
          <div>
            <span className="font-medium">Deactive:</span>{" "}
            {serviceArray.filter((s) => !s.is_active).length}
          </div>
        </div>
      </div>

      {/* Add Service Form */}
      {showForm && (
        <div className="bg-white rounded shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">
            Create New Service
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subcategory *
                </label>
                <select
                  value={serviceFormData.subcategory_id}
                  onChange={(e) =>
                    setServiceFormData((prev) => ({
                      ...prev,
                      subcategory_id: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors duration-200"
                >
                  <option value="">Select a Subcategory</option>
                  {activeSubcategories.map((item: ItemTypes) => (
                    <option key={item._id} value={item._id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Name *
                </label>
                <input
                  type="text"
                  value={serviceFormData.name}
                  onChange={(e) =>
                    setServiceFormData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors duration-200"
                  placeholder="Enter service name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug
                </label>
                <input
                  type="text"
                  value={serviceFormData.slug}
                  readOnly
                  className="w-full px-4 py-3 bg-gray-50 text-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors duration-200"
                  placeholder="Auto-generated slug"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={serviceFormData.description}
                  onChange={(e) =>
                    setServiceFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors duration-200"
                  rows={4}
                  placeholder="Enter service description"
                />
              </div>

              <ImageUploadSection
                onImageSelect={handleImageSelect}
                previewUrl={serviceFormData.image_url}
                label="Service Image *"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <ActiveToggle
              isActive={serviceFormData.is_active ?? true}
              onChange={(is_active) =>
                setServiceFormData((prev) => ({ ...prev, is_active }))
              }
              label="Service is active and available to customers"
              id="serviceIsActive"
            />

            <div className="flex items-center p-4 border border-gray-200 rounded-lg">
              <input
                type="checkbox"
                name="is_featured"
                id="is_featured"
                checked={serviceFormData.is_featured ?? false}
                onChange={(e) =>
                  setServiceFormData((prev) => ({
                    ...prev,
                    is_featured: e.target.checked,
                  }))
                }
                className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
              />
              <label
                htmlFor="is_featured"
                className="ml-3 block text-sm font-medium text-gray-700"
              >
                This service will be considered a featured service
              </label>
            </div>
          </div>

          <StatusMessage error={error} success={success} />

          <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200">
            <SubmitButton
              isSubmitting={isSubmitting}
              onSubmit={handlePostService}
              label="Create Service"
            />
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                resetForm();
              }}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Services Table using DataTable component */}
      <DataTable
        data={serviceArray}
        columns={serviceColumns}
        staticURL={staticURL} // This will be passed to DataTable
        keyField="_id"
        emptyMessage="Get started by creating your first service."
        emptyIcon={
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        }
        emptyAction={emptyAction}
        header={
          <div className="px-6 py-2">
            <h3 className="text-lg font-semibold text-gray-800">
              All Services
            </h3>
          </div>
        }
        hover={true}
        striped={true}
      />
    </div>
  );
};

export default ServiceTab;
