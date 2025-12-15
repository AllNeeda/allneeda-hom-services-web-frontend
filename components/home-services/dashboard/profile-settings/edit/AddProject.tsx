"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, X } from "lucide-react";
import React, { useState, useRef, useMemo, useEffect } from "react";
import { getAccessToken } from "@/app/api/axios";
import { useProfesssionalProgress } from "@/hooks/RegisterPro/useRegister";
import { useAllServices } from "@/hooks/useHomeServices";
import { postFeaturedService } from "@/app/api/services/professional";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const AddProject = () => {
  const [serviceName, setServiceName] = useState("");
  const [locationCity, setLocationCity] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [approximatePrice, setApproximatePrice] = useState("");
  const [durationValue, setDurationValue] = useState("");
  const [durationType, setDurationType] = useState("");
  const [year, setYear] = useState<string>("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [yearObject, setYearObject] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: File[] = [];
    const newPreviews: string[] = [];

    for (let i = 0; i < files.length; i++) {
      if (images.length + newImages.length >= 20) break; // Limit to 20 images

      const file = files[i];
      newImages.push(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          newPreviews.push(e.target.result as string);
          if (newPreviews.length === files.length) {
            setImagePreviews([...imagePreviews, ...newPreviews]);
          }
        }
      };
      reader.readAsDataURL(file);
    }

    setImages([...images, ...newImages]);
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    const newPreviews = [...imagePreviews];

    newImages.splice(index, 1);
    newPreviews.splice(index, 1);

    setImages(newImages);
    setImagePreviews(newPreviews);
  };
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

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!proId) {
      console.error("No professional ID found");
      return;
    }

    const formData = new FormData();

    formData.append("professional_id", proId);
    formData.append("service_id", serviceName);
    formData.append("projectTitle", projectTitle);
    formData.append("approximate_total_price", approximatePrice);
    formData.append("year", year);
    formData.append("description", description);
    formData.append("cityname", locationCity);
    formData.append("duration_value", durationValue);
    formData.append("duration_type", durationType);

    images.forEach((file) => formData.append("files", file));

    try {
      const res = await postFeaturedService(token, formData);
      console.log("Uploaded Featured Project:", res);
      toast.success("Featured project saved successfully");
      toast.success("Success !", {
        description: " Your featured project has been saved successfully.",
      });
    } finally {
      setIsSubmitting(false);
      handleCancel();
      router.push("/home-services/dashboard/profile-settings");
    }
  };

  const handleCancel = () => {
    setServiceName("");
    setLocationCity("");
    setProjectTitle("");
    setApproximatePrice("");
    setDurationValue("");
    setDurationType("");
    setYear("");
    setDescription("");
    setImages([]);
    setImagePreviews([]);
  };

  const { data: allServices, isLoading } = useAllServices();
  const serviceList = allServices?.data || [];

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const yearsArray = [];

    for (let y = 1990; y <= currentYear; y++) {
      yearsArray.push(y);
    }

    setYearObject(yearsArray.reverse());
  }, []);

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-bold text-2xl mb-6">New Project</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="w-full">
              <label
                htmlFor="service"
                className="font-semibold text-sm mb-2 block"
              >
                Service
              </label>
              <Select onValueChange={(val) => setServiceName(val)}>
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      isLoading ? "Loading services..." : "Select the Services"
                    }
                  />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Services</SelectLabel>

                    {isLoading ? (
                      <SelectItem value="N/A">Loading services...</SelectItem>
                    ) : (
                      serviceList.map((s: any) => (
                        <SelectItem value={s._id} key={s._id}>
                          {s.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full">
              <label
                htmlFor="city"
                className="font-semibold text-sm mb-2 block"
              >
                Location (Optional)
              </label>
              <Input
                type="text"
                id="city"
                value={locationCity}
                onChange={(e) => setLocationCity(e.target.value)}
                className="dark:bg-gray-800 dark:border-gray-700"
                placeholder="⛳ Enter city"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="project-title"
              className="font-semibold text-sm mb-2 block"
            >
              Project title
            </label>
            <Input
              type="text"
              id="project-title"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="dark:bg-gray-800 dark:border-gray-700"
              placeholder="Enter project title"
            />
            <p className="text-xs text-gray-500 mt-1">
              Example: Outdoor beach wedding
            </p>
          </div>

          <div>
            <label className="font-semibold text-sm mb-2 block">Photos</label>
            <div className="flex flex-wrap gap-2">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <div className="w-24 h-24 flex items-center justify-center border rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <Image
                      src={preview}
                      width={100}
                      height={100}
                      alt={`Preview ${index + 1}`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}

              {imagePreviews.length < 20 && (
                <>
                  <div
                    className="w-24 h-24 flex flex-col items-center justify-center border border-dashed rounded-md bg-gray-50 dark:bg-gray-800 dark:border-gray-700 cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImagePlus className="w-8 h-8 text-gray-400 mb-1" />
                    <span className="text-xs text-gray-500">Add Photo</span>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    multiple
                    hidden
                  />
                </>
              )}
            </div>

            <div className="mt-4">
              <p className="text-xs text-gray-500">
                Consider showing before and after photos, the work in progress,
                and you or your team at work (20 photos max).
              </p>
            </div>
          </div>

          <div>
            <label htmlFor="price" className="font-semibold text-sm mb-2 block">
              Approximate total price
            </label>
            <Input
              type="text"
              id="price"
              value={approximatePrice}
              onChange={(e) => setApproximatePrice(e.target.value)}
              className="dark:bg-gray-800 dark:border-gray-700"
              placeholder="$ 0"
            />
            <p className="text-xs text-gray-500 mt-1">
              This helps customers understand how much things cost.
            </p>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex-1">
              <label
                htmlFor="duration"
                className="font-semibold text-sm mb-2 block"
              >
                Duration (Optional)
              </label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  id="duration"
                  value={durationValue}
                  onChange={(e) => setDurationValue(e.target.value)}
                  className="dark:bg-gray-800 dark:border-gray-700"
                  placeholder="0"
                  min="0"
                />
                <Select
                  value={durationType}
                  onValueChange={(val) => setDurationType(val)}
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Duration</SelectLabel>
                      <SelectItem value="hours">hour(s)</SelectItem>
                      <SelectItem value="days">Day(s)</SelectItem>
                      <SelectItem value="weeks">Week(s)</SelectItem>
                      <SelectItem value="months">Month(s)</SelectItem>
                      <SelectItem value="years">Year(s)</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex-1">
              <label
                htmlFor="year"
                className="font-semibold text-sm mb-2 block"
              >
                Year
              </label>
              <Select onValueChange={(val) => setYear(val)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Year</SelectLabel>
                    {yearObject.map((y) => (
                      <SelectItem value={String(y)} key={y}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="font-semibold text-sm mb-2 block"
            >
              Description (optional)
            </label>
            <Textarea
              className="h-32 text-sm dark:bg-gray-800 dark:border-gray-700"
              name="description"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a short summary of the project"
              maxLength={255}
            />
            <p className="text-xs text-gray-500 mt-1">
              You can describe the goal, process, materials, equipment, or final
              result (255 characters max). {description.length}/255
            </p>
          </div>

          <div className="flex gap-3 justify-start pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-sky-600 dark:bg-sky-500 hover:bg-sky-500 dark:hover:bg-sky-400 text-white"
            >
              {isSubmitting ? "Saving..." : "Save Project"}
            </Button>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProject;
