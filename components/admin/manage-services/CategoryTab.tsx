"use client";

import { PostCategory } from "@/app/api/homepage/postServices";
import { useEffect, useState } from "react";
import ActiveToggle from "@/components/ui/admin/ActiveToggle";
import StatusMessage from "@/components/ui/admin/StatusMessage";
import SubmitButton from "@/components/ui/admin/SubmitButton";
import ImageUploadSection from "@/components/ui/admin/ImageUploadSection";
import { useCategoryServiceCount } from "@/hooks/useHomeServices";
import RecentItems from "./ReactItems";

interface CategoryType {
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
  category_image_file: File | null;
  category_image_url: string;
}

const CategoryTab = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [categoryFormData, setCategoryFormData] = useState<CategoryType>({
    name: "",
    slug: "",
    description: "",
    is_active: true,
    category_image_file: null,
    category_image_url: "",
  });

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

  const { data: categoryServiceCount } = useCategoryServiceCount();
  const categroyData = categoryServiceCount?.data || [];
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Add New Category</h2>
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category Name
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
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
            className="w-full text-gray-500 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            placeholder="will be auto generated"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            rows={3}
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

        <ImageUploadSection
          onImageSelect={handleImageSelect}
          previewUrl={categoryFormData.category_image_url}
          label="Category Image"
        />

        <StatusMessage error={error} success={success} />

        <ActiveToggle
          isActive={categoryFormData.is_active}
          onChange={(is_active) =>
            setCategoryFormData((prev) => ({ ...prev, is_active }))
          }
          label="Category is active and visible to customers"
          id="categoryIsActive"
        />

        <SubmitButton
          isSubmitting={isSubmitting}
          onSubmit={handlePostCategory}
          label="Add Category"
        />
      </div>
      <RecentItems dataItem={categroyData} maxItems={3} />
    </div>
  );
};

export default CategoryTab;
