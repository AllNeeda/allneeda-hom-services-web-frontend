"use client";

import { useEffect, useState } from "react";
import ActiveToggle from "@/components/ui/admin/ActiveToggle";
import ImageUploadSection from "@/components/ui/admin/ImageUploadSection";
import {
  useCategoryServiceCount,
  useSubcategoryServiceCount,
} from "@/hooks/useHomeServices";
import { SubcategoryType } from "@/types/service/services";
import StatusMessage from "@/components/ui/admin/StatusMessage";
import SubmitButton from "@/components/ui/admin/SubmitButton";
import RecentItems from "./ReactItems";
import { postSubcategory } from "@/app/api/homepage/postServices";
import DataTable, { Column } from "@/components/admin/ui/DataTable";
import { getSubcategoryStaticURL } from "@/app/api/axios";

interface ItemTypes {
  _id: string;
  name: string;
  slug: string;
  category_id: string;
  category_name?: string;
  serviceCount: number;
  servicesCount: number;
  is_active: boolean;
  subcategory_image_url?: string;
  description?: string;
}

interface CategoryItem {
  _id: string;
  name: string;
  is_active: boolean;
}

const SubcategoryTab = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [subcategoryFormData, setSubcategoryFormData] =
    useState<SubcategoryType>({
      name: "",
      slug: "",
      category_id: "",
      description: "",
      is_active: true,
      subcategory_image_file: null as unknown as File,
      subcategory_image_url: "",
    });

  const staticURL = getSubcategoryStaticURL();

  console.log("🔍 Subcategory Static URL:", staticURL);

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^-+|-+$/g, "");

  useEffect(() => {
    setSubcategoryFormData((prev) => ({ ...prev, slug: slugify(prev.name) }));
  }, [subcategoryFormData.name]);

  const handleImageSelect = (file: File) => {
    setSubcategoryFormData((prev) => ({
      ...prev,
      subcategory_image_file: file,
      subcategory_image_url: URL.createObjectURL(file),
    }));
  };

  const handlePostSubcategory = async () => {
    if (!subcategoryFormData.subcategory_image_file) {
      setError("Subcategory image is required");
      return;
    }

    if (!subcategoryFormData.category_id) {
      setError("Please select a category");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      setSuccess(null);

      const formData = new FormData();
      formData.append("name", subcategoryFormData.name);
      formData.append("slug", subcategoryFormData.slug);
      formData.append("category_id", subcategoryFormData.category_id);
      formData.append("description", String(subcategoryFormData.description));
      formData.append("is_active", String(subcategoryFormData.is_active));
      formData.append(
        "subcategory_image_url",
        subcategoryFormData.subcategory_image_file
      );

      await postSubcategory(formData);
      setSuccess("Subcategory created successfully!");

      // Reset form
      setSubcategoryFormData({
        name: "",
        slug: "",
        category_id: "",
        description: "",
        is_active: true,
        subcategory_image_file: null as unknown as File,
        subcategory_image_url: "",
      });
      setShowForm(false);

      // You might want to add a refetch function here to refresh the subcategory list
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to create subcategory"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubcategoryFormData({
      name: "",
      slug: "",
      category_id: "",
      description: "",
      is_active: true,
      subcategory_image_file: null as unknown as File,
      subcategory_image_url: "",
    });
    setError(null);
    setSuccess(null);
  };

  // Data fetching
  const { data: subcategoryServiceCount } = useSubcategoryServiceCount();
  const { data: categoryServiceCount } = useCategoryServiceCount();

  // Process subcategory data
  const subcategoryData = subcategoryServiceCount?.data || [];
  let itemsArray: ItemTypes[] = [];
  console.log("This is subcategory data: ", subcategoryData);

  if (Array.isArray(subcategoryData)) {
    itemsArray = subcategoryData;
  } else if (subcategoryData && Array.isArray(subcategoryData.data)) {
    itemsArray = subcategoryData.data;
  }

  // Process category data for dropdown
  const categoryList = categoryServiceCount?.data || [];
  let categoryArray: CategoryItem[] = [];

  if (Array.isArray(categoryList)) {
    categoryArray = categoryList;
  } else if (categoryList && Array.isArray(categoryList.data)) {
    categoryArray = categoryList.data;
  }

  // Filter only active categories for the dropdown
  const activeCategories = categoryArray.filter(
    (category) => category.is_active
  );

  // Define columns for the subcategories table - FIXED VERSION
  const subcategoryColumns: Column<ItemTypes>[] = [
    {
      key: "subcategory_image_url",
      header: "Image",
      isImage: true,
      className: "w-20",
      cellClassName: "text-center",
    },
    {
      key: "name",
      header: "Subcategory",
      render: (item) => (
        <div>
          <div className="font-medium text-gray-900">{item.name}</div>
        </div>
      ),
    },
    {
      key: "description",
      header: "Description",
      render: (item) => (
        <div className="text-sm text-gray-500">
          {item.description || "No description provided"}
        </div>
      ),
    },
    {
      key: "services",
      header: "Services",
      render: (item) => (
        <span className="inline-flex items-center text-xs border border-sky-500 px-3 py-1 rounded-full text-sm font-medium bg-sky-100 text-sky-800">
          {item.servicesCount || item.serviceCount || 0} services
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item) => (
        <span
          className={`inline-flex items-center text-xs px-3 py-1 rounded-full text-sm font-medium ${
            item.is_active
              ? "bg-green-100 text-green-800 border border-green-400"
              : "bg-red-100 text-red-800 border border-red-400"
          }`}
        >
          {item.is_active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (item) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              // handleToggleStatus(item._id, item.is_active);
            }}
            className={`px-4 py-1 rounded text-xs font-medium transition-colors duration-200 ${
              item.is_active
                ? "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                : "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
            }`}
          >
            {item.is_active ? "Deactivate" : "Activate"}
          </button>
          <button
            onClick={(e) => e.stopPropagation()}
            className="px-4 py-1 bg-gray-50 text-gray-700 rounded text-xs hover:bg-gray-100 border border-gray-200 transition-colors duration-200 text-sm font-medium"
          >
            Edit
          </button>
        </div>
      ),
    },
  ];

  // Alternative: If you want to keep the custom layout with image combined
  // const subcategoryColumnsAlternative: Column<ItemTypes>[] = [
  //   {
  //     key: "subcategory",
  //     header: "Subcategory",
  //     render: (item) => {
  //       const imageUrl = item.subcategory_image_url
  //         ? `${staticURL}/${item.subcategory_image_url}`
  //         : null;

  //       console.log("🖼️ Building subcategory image URL:", {
  //         subcategory: item.name,
  //         imageFilename: item.subcategory_image_url,
  //         builtURL: imageUrl,
  //       });

  //       return (
  //         <div className="flex items-center gap-4">
  //           <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
  //             {imageUrl ? (
  //               <img
  //                 src={imageUrl}
  //                 alt={item.name}
  //                 className="w-full h-full object-cover"
  //                 onError={(e) => {
  //                   console.error(
  //                     "❌ Subcategory image failed to load:",
  //                     imageUrl
  //                   );
  //                   e.currentTarget.style.display = "none";
  //                   const fallback =
  //                     e.currentTarget.parentElement?.querySelector(
  //                       ".image-fallback"
  //                     );
  //                   if (fallback) fallback.classList.remove("hidden");
  //                 }}
  //                 onLoad={() =>
  //                   console.log("✅ Subcategory image loaded:", imageUrl)
  //                 }
  //               />
  //             ) : null}
  //             <div
  //               className={`hidden image-fallback w-full h-full bg-gray-300 flex items-center justify-center ${
  //                 !imageUrl ? "flex" : ""
  //               }`}
  //             >
  //               <svg
  //                 className="w-6 h-6 text-gray-400"
  //                 fill="none"
  //                 stroke="currentColor"
  //                 viewBox="0 0 24 24"
  //               >
  //                 <path
  //                   strokeLinecap="round"
  //                   strokeLinejoin="round"
  //                   strokeWidth={2}
  //                   d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
  //                 />
  //               </svg>
  //             </div>
  //           </div>
  //           <div>
  //             <div className="font-medium text-gray-900">{item.name}</div>
  //             <div className="text-sm text-gray-500">{item.slug}</div>
  //             {item.category_name && (
  //               <div className="text-xs text-gray-400 mt-1">
  //                 Category: {item.category_name}
  //               </div>
  //             )}
  //           </div>
  //         </div>
  //       );
  //     },
  //   },
  //   {
  //     key: "services",
  //     header: "Services",
  //     render: (item) => (
  //       <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
  //         {item.servicesCount || item.serviceCount || 0} services
  //       </span>
  //     ),
  //   },
  //   {
  //     key: "status",
  //     header: "Status",
  //     render: (item) => (
  //       <span
  //         className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
  //           item.is_active
  //             ? "bg-green-100 text-green-800"
  //             : "bg-red-100 text-red-800"
  //         }`}
  //       >
  //         {item.is_active ? "Active" : "Inactive"}
  //       </span>
  //     ),
  //   },
  //   {
  //     key: "actions",
  //     header: "Actions",
  //     render: (item) => (
  //       <div className="flex items-center gap-2">
  //         <button
  //           onClick={(e) => {
  //             e.stopPropagation();
  //             // handleToggleStatus(item._id, item.is_active);
  //           }}
  //           className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
  //             item.is_active
  //               ? "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
  //               : "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
  //           }`}
  //         >
  //           {item.is_active ? "Deactivate" : "Activate"}
  //         </button>
  //         <button
  //           onClick={(e) => e.stopPropagation()}
  //           className="px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 border border-gray-200 transition-colors duration-200 text-sm font-medium"
  //         >
  //           Edit
  //         </button>
  //       </div>
  //     ),
  //   },
  // ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Subcategories</h2>
          <p className="text-gray-600 mt-1">
            Manage your service subcategories
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add New Subcategory
        </button>
      </div>

      {/* Debug Info */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-bold text-blue-900 mb-2">Subcategories Status</h4>
        <div className="flex flex-row items-center justify-between gap-4 text-sm font-semibold">
          <div>
            <span className="font-medium">Total Subcategories:</span>{" "}
            {itemsArray.length}
          </div>
          <div>
            <span className="font-medium">Active:</span>{" "}
            {itemsArray.filter((s) => s.is_active).length}
          </div>
          <div>
            <span className="font-medium">Deactive:</span>{" "}
            {itemsArray.filter((s) => !s.is_active).length}
          </div>
        </div>
      </div>

      {/* Add Subcategory Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">
            Create New Subcategory
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={subcategoryFormData.category_id}
                  onChange={(e) =>
                    setSubcategoryFormData((prev) => ({
                      ...prev,
                      category_id: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors duration-200"
                >
                  <option value="">Select a category</option>
                  {activeCategories.map((item: CategoryItem) => (
                    <option key={item._id} value={item._id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subcategory Name *
                </label>
                <input
                  type="text"
                  value={subcategoryFormData.name}
                  onChange={(e) =>
                    setSubcategoryFormData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors duration-200"
                  placeholder="Enter subcategory name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug
                </label>
                <input
                  type="text"
                  value={subcategoryFormData.slug}
                  disabled
                  className="w-full px-4 py-3 bg-gray-50 text-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors duration-200"
                  placeholder="Auto-generated slug"
                />
              </div>
            </div>

            <div className="space-y-6">
              <ImageUploadSection
                onImageSelect={handleImageSelect}
                previewUrl={subcategoryFormData.subcategory_image_url}
                label="Subcategory Image *"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={subcategoryFormData.description}
                  onChange={(e) =>
                    setSubcategoryFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors duration-200"
                  rows={4}
                  placeholder="Enter subcategory description"
                />
              </div>

              <ActiveToggle
                isActive={subcategoryFormData.is_active || false}
                onChange={(is_active) =>
                  setSubcategoryFormData((prev) => ({ ...prev, is_active }))
                }
                label="Subcategory is active and visible to customers"
                id="subcategoryIsActive"
              />
            </div>
          </div>

          <StatusMessage error={error} success={success} />

          <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200">
            <SubmitButton
              isSubmitting={isSubmitting}
              onSubmit={handlePostSubcategory}
              label="Create Subcategory"
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

      {/* Subcategories Table */}
      <DataTable
        data={itemsArray}
        staticURL={staticURL}
        columns={subcategoryColumns} // Use the simplified version with automatic image handling
        keyField="_id"
        emptyMessage="Get started by creating your first subcategory."
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
        header={
          <div className="px-6 py-2">
            <h3 className="text-lg font-semibold text-gray-800">
              All Subcategories ({itemsArray.length})
            </h3>
          </div>
        }
        hover={true}
        striped={true}
      />

      {/* Recent Items Section */}
      <RecentItems dataItem={itemsArray} maxItems={3} />
    </div>
  );
};

export default SubcategoryTab;
