"use client";

import { PostCategory } from "@/app/api/homepage/postServices";
import { useEffect, useState } from "react";
import ActiveToggle from "@/components/ui/admin/ActiveToggle";
import StatusMessage from "@/components/ui/admin/StatusMessage";
import SubmitButton from "@/components/ui/admin/SubmitButton";
import ImageUploadSection from "@/components/ui/admin/ImageUploadSection";
import { useCategoryServiceCount } from "@/hooks/useHomeServices";
import RecentItems from "./ReactItems";
import DataTable, { Column } from "@/components/admin/ui/DataTable";
import { ChevronDown } from "lucide-react";
import { getCategoryStaticURL } from "@/app/api/axios";

interface CategoryType {
  id?: string;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
  category_image_file: File | null;
  category_image_url: string;
}

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
  category_image_url: string; // This contains just the filename like "category_12345.png"
  services_count?: number;
}

const CategoryTab = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [categoryFormData, setCategoryFormData] = useState<CategoryType>({
    name: "",
    slug: "",
    description: "",
    is_active: true,
    category_image_file: null,
    category_image_url: "",
  });
  const staticURL = getCategoryStaticURL();

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^-+|-+$/g, "");

  useEffect(() => {
    setCategoryFormData((prev) => ({ ...prev, slug: slugify(prev.name) }));
  }, [categoryFormData.name]);

  const handleImageSelect = (file: File) => {
    setCategoryFormData((prev) => ({
      ...prev,
      category_image_file: file,
      category_image_url: URL.createObjectURL(file),
    }));
  };

  const handlePostCategory = async () => {
    if (!categoryFormData.category_image_file) {
      setError("Category image is required");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      setSuccess(null);

      const formData = new FormData();
      formData.append("name", categoryFormData.name);
      formData.append("slug", categoryFormData.slug);
      formData.append("description", categoryFormData.description);
      formData.append("is_active", String(categoryFormData.is_active));
      formData.append(
        "category_image_url",
        categoryFormData.category_image_file
      );

      await PostCategory(formData);

      setSuccess("Category created successfully!");
      setCategoryFormData({
        name: "",
        slug: "",
        description: "",
        is_active: true,
        category_image_file: null,
        category_image_url: "",
      });
      setShowForm(false);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to create category"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (
    categoryId: string,
    currentStatus: boolean
  ) => {
    try {
      setSuccess(
        `Category ${!currentStatus ? "activated" : "deactivated"} successfully!`
      );
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to update category status"
      );
    }
  };

  const resetForm = () => {
    setCategoryFormData({
      name: "",
      slug: "",
      description: "",
      is_active: true,
      category_image_file: null,
      category_image_url: "",
    });
    setError(null);
    setSuccess(null);
  };

  const { data: categoryServiceCount } = useCategoryServiceCount();
  const categoryData = categoryServiceCount?.data.data || [];

  const categoryColumns: Column<CategoryItem>[] = [
    {
      key: "category_image_url",
      header: "Image",
      isImage: true,
      className: "w-20",
      cellClassName: "text-center",
    },
    {
      key: "name",
      header: "Category",
      render: (category) => (
        <div>
          <div className="font-medium text-gray-900">{category.name}</div>
        </div>
      ),
    },
    {
      key: "description",
      header: "Description",
      render: (category) => (
        <div className="text-sm text-gray-500">{category.description}</div>
      ),
    },

    {
      key: "is_active",
      header: "Status",
      render: (category) => (
        <span
          className={`inline-flex items-center text-xs px-3 py-1 rounded-full text-sm font-medium ${
            category.is_active
              ? "bg-green-100 text-green-800 border border-green-400"
              : "bg-red-100 text-red-800 border border-red-400"
          }`}
        >
          {category.is_active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (category) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleStatus(category.id, category.is_active);
            }}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors duration-200 ${
              category.is_active
                ? "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                : "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
            }`}
          >
            {category.is_active ? "Deactivate" : "Activate"}
          </button>
          <button
            onClick={(e) => e.stopPropagation()}
            className="px-2 py-1 bg-gray-50 text-gray-700 rounded hover:bg-gray-100 border border-gray-200 transition-colors duration-200 text-sm font-medium"
          >
            Edit
          </button>
        </div>
      ),
    },
  ];

  // Alternative: If you want to keep the custom layout but use staticURL
  // const categoryColumnsAlternative: Column<CategoryItem>[] = [
  //   {
  //     key: "category",
  //     header: "Category",
  //     render: (category) => {
  //       const imageUrl = category.category_image_url
  //         ? `${staticURL}/${category.category_image_url}`
  //         : null;

  //       console.log("Rendering category image:", {
  //         name: category.name,
  //         imageUrl: imageUrl,
  //         staticURL: staticURL,
  //       });

  //       return (
  //         <div className="flex items-center gap-4">
  //           <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
  //             {imageUrl ? (
  //               <img
  //                 src={imageUrl}
  //                 alt={category.name}
  //                 className="w-full h-full object-cover"
  //                 onError={(e) => {
  //                   console.error("Category image failed to load:", imageUrl);
  //                   e.currentTarget.style.display = "none";
  //                   e.currentTarget.nextElementSibling?.classList.remove(
  //                     "hidden"
  //                   );
  //                 }}
  //               />
  //             ) : null}
  //             <div
  //               className={`hidden w-full h-full bg-gray-300 flex items-center justify-center ${
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
  //             <div className="font-medium text-gray-900">{category.name}</div>
  //             <div className="text-sm text-gray-500">{category.slug}</div>
  //           </div>
  //         </div>
  //       );
  //     },
  //   },
  //   {
  //     key: "services_count",
  //     header: "Services",
  //     render: (category) => (
  //       <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
  //         {category.services_count || 0} services
  //       </span>
  //     ),
  //   },
  //   {
  //     key: "is_active",
  //     header: "Status",
  //     render: (category) => (
  //       <span
  //         className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
  //           category.is_active
  //             ? "bg-green-100 text-green-800"
  //             : "bg-red-100 text-red-800"
  //         }`}
  //       >
  //         {category.is_active ? "Active" : "Inactive"}
  //       </span>
  //     ),
  //   },
  //   {
  //     key: "actions",
  //     header: "Actions",
  //     render: (category) => (
  //       <div className="flex items-center gap-2">
  //         <button
  //           onClick={(e) => {
  //             e.stopPropagation();
  //             handleToggleStatus(category.id, category.is_active);
  //           }}
  //           className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
  //             category.is_active
  //               ? "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
  //               : "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
  //           }`}
  //         >
  //           {category.is_active ? "Deactivate" : "Activate"}
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

  const emptyAction = (
    <button
      onClick={() => setShowForm(true)}
      className="mt-4 bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
    >
      Add New Category
    </button>
  );

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Categories</h2>
          <p className="text-gray-600 mt-1">Manage your service categories</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded font-medium transition-colors duration-200 flex items-center gap-2"
        >
          <ChevronDown className="w-5 h-5" />
          Add New Category
        </button>
      </div>

      {/* Debug Info */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-bold text-blue-900 mb-2">Categories Status</h4>
        <div className="flex flex-row items-center justify-between gap-4 text-sm font-semibold">
          <div>
            <span className="font-medium">Total Categories:</span>{" "}
            {categoryData.length}
          </div>
          <div>
            <span className="font-medium">Active:</span>{" "}
            {categoryData.filter((c: { is_active: any }) => c.is_active).length}
          </div>
          <div className="">
            <span className="font-medium">Deative:</span>{" "}
            {
              categoryData.filter((c: { is_active: any }) => !c.is_active)
                .length
            }
          </div>
        </div>
      </div>

      {/* Add Category Form */}
      {showForm && (
        <div className="bg-white rounded shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">
            Create New Category
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={categoryFormData.name}
                  onChange={(e) =>
                    setCategoryFormData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors duration-200"
                  placeholder="Enter category name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug
                </label>
                <input
                  type="text"
                  value={categoryFormData.slug}
                  disabled
                  className="w-full px-4 py-3 bg-gray-50 text-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors duration-200"
                  placeholder="Auto-generated slug"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors duration-200"
                  rows={4}
                  value={categoryFormData.description}
                  onChange={(e) =>
                    setCategoryFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Enter category description"
                />
              </div>
            </div>

            <div className="space-y-6">
              <ImageUploadSection
                onImageSelect={handleImageSelect}
                previewUrl={categoryFormData.category_image_url}
                label="Category Image *"
              />

              <ActiveToggle
                isActive={categoryFormData.is_active}
                onChange={(is_active) =>
                  setCategoryFormData((prev) => ({ ...prev, is_active }))
                }
                label="Category is active and visible to customers"
                id="categoryIsActive"
              />
            </div>
          </div>

          <StatusMessage error={error} success={success} />

          <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200">
            <SubmitButton
              isSubmitting={isSubmitting}
              onSubmit={handlePostCategory}
              label="Create Category"
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

      {/* Categories Table using DataTable component */}
      {/* Use the first approach with separate image column */}
      <DataTable
        data={categoryData}
        columns={categoryColumns} // Use the simplified version
        staticURL={staticURL}
        keyField="id"
        emptyMessage="Get started by creating your first category."
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
              All Categories ({categoryData.length})
            </h3>
          </div>
        }
        hover={true}
        striped={true}
      />

      {/* Recent Items Section */}
      <RecentItems dataItem={categoryData} maxItems={3} />
    </div>
  );
};

export default CategoryTab;
