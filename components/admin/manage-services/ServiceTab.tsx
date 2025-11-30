import { useEffect, useState } from "react";
import ActiveToggle from "@/components/ui/admin/ActiveToggle";
import ImageUploadSection from "@/components/ui/admin/ImageUploadSection";
import { ServiceType } from "@/types/service/services";
import { useSubcategoryServiceCount } from "@/hooks/useHomeServices";
import { postServices } from "@/app/api/homepage/postServices";
import SubmitButton from "@/components/ui/admin/SubmitButton";
import StatusMessage from "@/components/ui/admin/StatusMessage";

interface ItemTypes {
  _id: string;
  name: string;
  serviceCount: number;
  servicesCount: number;
  is_active: boolean;
}

const ServiceTab = () => {
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [serviceFormData, setServiceFormData] = useState<Partial<ServiceType>>({
    name: "",
    slug: "",
    description: "",
    is_active: true,
    image_url: "",
    image_file: null as unknown as File, // Proper type casting
    _id: "",
    subcategory_id: "",
    is_featured: false,
  });

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

  const handlePostSubcategory = async () => {
    if (!serviceFormData.image_file) {
      setError("Subcategory image is required");
      return;
    }
    try {
      setIsSubmitting(true);
      setError(null);
      setSuccess(null);
      const formData = new FormData();
      formData.append("name", serviceFormData.name ?? "");
      formData.append("slug", serviceFormData.slug ?? "");
      formData.append(
        "subcategory_id",
        String(serviceFormData.subcategory_id ?? "")
      );
      formData.append("description", String(serviceFormData.description ?? ""));
      formData.append("is_active", String(serviceFormData.is_active ?? true));
      formData.append(
        "is_featured",
        String(serviceFormData.is_featured ?? true)
      );
      formData.append("image_url", serviceFormData.image_file as Blob);
      await postServices(formData);
      setSuccess("Service created successfully.");
      setServiceFormData({
        name: "",
        slug: "",
        subcategory_id: "",
        description: "",
        is_active: true,
        image_file: null as unknown as File, // Proper type casting
        image_url: "",
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

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Add New Service</h2>
      <div className="grid grid-cols-1 gap-6">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subcategory
            </label>
            <select
              onChange={(e) =>
                setServiceFormData((prev) => ({
                  ...prev,
                  subcategory_id: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            >
              <option value="">Select a Subcategory</option>
              {itemsArray.map((item: { _id: string; name: string }) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Service Name
          </label>
          <input
            type="text"
            onChange={(e) =>
              setServiceFormData((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            placeholder="Enter service name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            slug
          </label>
          <input
            type="text"
            value={serviceFormData.slug}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            placeholder="Enter service name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            onChange={(e) =>
              setServiceFormData((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            rows={3}
            placeholder="Enter service description"
          />
        </div>
        <ImageUploadSection
          onImageSelect={handleImageSelect}
          previewUrl={serviceFormData.image_url}
          label="Service Image"
        />
        <StatusMessage error={error} success={success} />

        <ActiveToggle
          isActive={isActive}
          onChange={setIsActive}
          label="Service is active and available to customers"
          id="serviceIsActive"
        />
        <div className="flex flex-row items-center justify-start">
          <input
            type="checkbox"
            name="is_featured"
            id="is_featured"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
          />
          <label
            htmlFor="is_featured"
            className="ml-2 block text-sm text-gray-700"
          >
            This service will be considered a featured service
          </label>
        </div>

        <SubmitButton
          isSubmitting={isSubmitting}
          onSubmit={handlePostSubcategory}
          label="Add Service"
        />
      </div>
    </div>
  );
};

export default ServiceTab;
