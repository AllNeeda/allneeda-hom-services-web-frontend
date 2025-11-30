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

interface ItemTypes {
  _id: string;
  name: string;
  serviceCount: number;
  servicesCount: number;
  is_active: boolean;
}

const SubcategoryTab = () => {
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [subcategoryFormData, setSubcategoryFormData] =
    useState<SubcategoryType>({
      name: "",
      slug: "",
      category_id: "",
      description: "",
      is_active: true,
      subcategory_image_file: null as unknown as File, // Proper type casting
      subcategory_image_url: "",
    });

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
    console.log("submitted data: ", subcategoryFormData);

    if (!subcategoryFormData.subcategory_image_file) {
      setError("Subcategory image is required");
      return;
    }
    try {
      setIsSubmitting(true);
      setError(null);
      setSuccess(null);
      const formData = new FormData();
      formData.append("name", subcategoryFormData.name);
      formData.append("slug", subcategoryFormData.slug);
      formData.append("category_id", String(subcategoryFormData.category_id));
      formData.append("description", String(subcategoryFormData.description));
      formData.append("is_active", String(subcategoryFormData.is_active));
      formData.append(
        "subcategory_image_url",
        subcategoryFormData.subcategory_image_file
      );
      await postSubcategory(formData);
      setSuccess("Subcategory created successfully.");
      setSubcategoryFormData({
        name: "",
        slug: "",
        category_id: "",
        description: "",
        is_active: true,
        subcategory_image_file: null as unknown as File, // Proper type casting
        subcategory_image_url: "",
      });
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

  const { data: subcategoryServiceCount } = useSubcategoryServiceCount();
  const subcategroyData = subcategoryServiceCount?.data || [];
  let itemsArray: ItemTypes[] = [];

  if (Array.isArray(subcategroyData)) {
    itemsArray = subcategroyData;
  } else if (
    subcategroyData &&
    subcategroyData.data &&
    Array.isArray(subcategroyData.data)
  ) {
    itemsArray = subcategroyData.data;
  }

  const { data: categoryServiceCount } = useCategoryServiceCount();
  const categoryList = categoryServiceCount?.data || [];

  let categoryArray: ItemTypes[] = [];
  if (Array.isArray(categoryList)) {
    categoryArray = categoryList;
  } else if (
    categoryList &&
    categoryList.data &&
    Array.isArray(categoryList.data)
  ) {
    categoryArray = categoryList.data;
  }
  console.log("category Array: ", categoryArray);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">
        Add New Subcategory
      </h2>
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            onChange={(e) =>
              setSubcategoryFormData((prev) => ({
                ...prev,
                category_id: e.target.value,
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          >
            <option value="">Select a category</option>
            {categoryArray.map((item: { _id: string; name: string }) => (
              <option key={item._id} value={item._id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subcategory Name
          </label>
          <input
            type="text"
            onChange={(e) =>
              setSubcategoryFormData((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            placeholder="Enter subcategory name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            slug
          </label>
          <input
            type="text"
            value={subcategoryFormData.slug}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            placeholder="will be auto generated"
          />
        </div>

        <ImageUploadSection
          onImageSelect={handleImageSelect}
          previewUrl={subcategoryFormData.subcategory_image_url}
          label="Subcategory Image"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            onChange={(e) =>
              setSubcategoryFormData((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            rows={3}
            placeholder="Enter subcategory description"
          />
        </div>
        <StatusMessage error={error} success={success} />

        <ActiveToggle
          isActive={isActive}
          onChange={setIsActive}
          label="Subcategory is active and visible to customers"
          id="subcategoryIsActive"
        />

        <SubmitButton
          isSubmitting={isSubmitting}
          onSubmit={handlePostSubcategory}
          label="Add Subcategory"
        />
      </div>
      <RecentItems dataItem={itemsArray} maxItems={3} />
    </div>
  );
};

export default SubcategoryTab;
