"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { Pencil, Loader2, Calendar, Users, Globe, MapPin, Building, Mail } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/components/providers/context/auth-context";
import { useUpdateProfessional } from "@/hooks/useProfessional";
import { useProfessionalReview } from "@/hooks/RegisterPro/useRegister";
import GlobalLoader from "@/components/ui/global-loader";
import toast from "react-hot-toast";
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

const defaultSchedule = [
  { dayOfWeek: 0, day: 'Sunday', shifts: [{ openTime: '09:00', closeTime: '17:00', isClosed: true }] },
  { dayOfWeek: 1, day: 'Monday', shifts: [{ openTime: '09:00', closeTime: '17:00', isClosed: false }] },
  { dayOfWeek: 2, day: 'Tuesday', shifts: [{ openTime: '09:00', closeTime: '17:00', isClosed: false }] },
  { dayOfWeek: 3, day: 'Wednesday', shifts: [{ openTime: '09:00', closeTime: '17:00', isClosed: false }] },
  { dayOfWeek: 4, day: 'Thursday', shifts: [{ openTime: '09:00', closeTime: '17:00', isClosed: false }] },
  { dayOfWeek: 5, day: 'Friday', shifts: [{ openTime: '09:00', closeTime: '17:00', isClosed: false }] },
  { dayOfWeek: 6, day: 'Saturday', shifts: [{ openTime: '09:00', closeTime: '17:00', isClosed: true }] },
];

const generateTimeOptions = () => {
  const times: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      times.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
    }
  }
  return times;
};

const timeOptions = generateTimeOptions();

const formSchema = z.object({
  introduction: z.string().min(60, "Introduction must be at least 60 characters"),
  business_name: z.string().min(1, "Business name is required"),
  founded_year: z
    .string()
    .min(1, "Year founded is required")
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) >= 1900 && Number(val) <= new Date().getFullYear(),
      { message: "Year must be a valid number between 1900 and current year" }
    ),
  employees: z
    .string()
    .optional()
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "Employees must be a valid non-negative number",
    }),
  website: z
    .string()
    .optional()
  ,
  address_line: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().optional(),
  zipcode: z.string().min(1, "Zipcode is required"),
  business_type: z.string().min(1, "Business type is required"),
  business_hours: z
    .array(
      z.object({
        day: z.number(),
        status: z.enum(["open", "closed"]),
        start_time: z.string(),
        end_time: z.string(),
      })
    )
    .min(1, "Business hours are required"),
  profile_image: z
    .instanceof(FileList)
    .optional()
    .nullable()
    .refine((files) => !files?.length || files[0].size <= MAX_FILE_SIZE, "Max file size is 10MB")
    .refine(
      (files) => !files?.length || ACCEPTED_IMAGE_TYPES.includes(files[0].type),
      "Only .jpg, .jpeg, and .png files are accepted."
    ),
});

type FormValues = z.infer<typeof formSchema>;

export default function EditBasicInfo() {
  const router = useRouter();
  const { isLoading: authLoading, getAccessToken } = useAuth();
  const token = getAccessToken();
  const {
    data: reviewData,
    isLoading: loadingReview,
    isError: errorReview,
    refetch: refetchReview,
  } = useProfessionalReview(token!);

  const { mutate: updatePro, isPending } = useUpdateProfessional(token!);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [formDataLoaded, setFormDataLoaded] = useState(false);
  const [schedule, setSchedule] = useState(defaultSchedule);
  const [availabilityOption, setAvailabilityOption] = useState<'business' | 'anytime'>('business');
  const [uploadingImage, setUploadingImage] = useState(false);

  const Backend_URL = process.env.NEXT_PUBLIC_API_BASE_MEDIA || "http://localhost:4000";

  const displayImageSrc = (() => {
    const img = previewImage;
    if (!img) return "/default-profile.png";
    const s = String(img);
    if (s.startsWith("data:") || s.startsWith("http://") || s.startsWith("https://") || s.startsWith("blob:")) return s;
    if (s.startsWith("/")) return s;
    return `${Backend_URL.replace(/\/$/, "")}/uploads/professionals/${s}`;
  })();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      business_name: "",
      introduction: "",
      founded_year: "",
      employees: "",
      website: "",
      address_line: "",
      city: "",
      state: "",
      country: "",
      zipcode: "",
      business_type: "",
      business_hours: [],
      profile_image: undefined,
    },
  });

  useEffect(() => {
    if (!reviewData || formDataLoaded) return;
    const typedData = (reviewData ?? {}) as any;
    const pro =
      (typedData.professional && (typedData.professional as any).professional) ||
      (typedData.professional as any) ||
      (reviewData as any) ||
      {};
    const locations = (typedData.professional && (typedData.professional as any).locations) || [];
    const primaryLocation = locations[0] || {};

    const zipcodeValue = Array.isArray(primaryLocation.zipcode)
      ? (primaryLocation.zipcode as string[]).join(", ")
      : (primaryLocation.zipcode as string) || "";

    reset({
      introduction: pro.introduction || "",
      business_name: pro.business_name || "",
      founded_year: pro.founded_year?.toString() || "",
      employees: pro.employees?.toString() || "",
      website: pro.website || "",
      address_line: primaryLocation.address_line || "",
      city: primaryLocation.city || "",
      state: primaryLocation.state || "",
      country: primaryLocation.country || "",
      zipcode: zipcodeValue,
      business_type: pro.business_type || "",
    });
    setPreviewImage(pro.profile_image || null);
    const savedAvailability = pro.business_hours;
    if (Array.isArray(savedAvailability) && savedAvailability.length > 0) {
      const normalized = savedAvailability.map((day: any) => ({
        dayOfWeek: day.day,
        day: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][day.day],
        shifts: [{
          openTime: new Date(day.start_time).toISOString().substring(11, 16),
          closeTime: new Date(day.end_time).toISOString().substring(11, 16),
          isClosed: day.status !== 'open'
        }]
      }));
      setSchedule(normalized);
      setValue('business_hours', normalized.map(d => ({
        day: d.dayOfWeek,
        status: d.shifts[0].isClosed ? 'closed' : 'open',
        start_time: d.shifts[0].openTime,
        end_time: d.shifts[0].closeTime
      })), { shouldDirty: false });
      const isAnytime = normalized.every(d => d.shifts.length === 1 && d.shifts[0].openTime === '00:00' && d.shifts[0].closeTime === '23:59' && !d.shifts[0].isClosed);
      setAvailabilityOption(isAnytime ? 'anytime' : 'business');
    }
    setFormDataLoaded(true);
  }, [reviewData, reset, formDataLoaded, setValue]);

  useEffect(() => {
    setValue('business_hours', schedule.map(d => ({
      day: d.dayOfWeek,
      status: d.shifts[0].isClosed ? 'closed' : 'open',
      start_time: d.shifts[0].openTime,
      end_time: d.shifts[0].closeTime
    })), { shouldDirty: true });
  }, [schedule, setValue]);

  const watchedImage = watch("profile_image");
  useEffect(() => {
    if (watchedImage?.length && watchedImage[0] instanceof File) {
      const file = watchedImage[0];
      setUploadingImage(true);
      if (file.size <= MAX_FILE_SIZE && ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result as string);
          setUploadingImage(false);
        };
        reader.readAsDataURL(file);
      } else {
        setUploadingImage(false);
      }
    }
  }, [watchedImage]);

  const handleDayToggle = (dayIndex: number) => {
    const updatedSchedule = schedule.map((d, i) =>
      i === dayIndex ? {
        ...d,
        shifts: [{
          ...d.shifts[0],
          isClosed: !d.shifts[0].isClosed,
          openTime: !d.shifts[0].isClosed ? '00:00' : '09:00',
          closeTime: !d.shifts[0].isClosed ? '00:00' : '17:00'
        }]
      } : d
    );
    setSchedule(updatedSchedule);
  };

  const handleTimeChange = (dayIndex: number, field: 'openTime' | 'closeTime', value: string) => {
    const updatedSchedule = schedule.map((d, i) =>
      i === dayIndex ? {
        ...d,
        shifts: [{
          ...d.shifts[0],
          [field]: value
        }]
      } : d
    );
    setSchedule(updatedSchedule);
  };

  const set24_7Schedule = () => {
    const anytimeSchedule = defaultSchedule.map(d => ({
      ...d,
      shifts: [{
        openTime: '00:00',
        closeTime: '23:59',
        isClosed: false
      }]
    }));
    setSchedule(anytimeSchedule);
    setAvailabilityOption('anytime');
  };

  const onSubmit = async (values: FormValues) => {
    const typedData = (reviewData ?? {}) as any;
    const pro =
      (typedData.professional && (typedData.professional as any).professional) ||
      (typedData.professional as any) ||
      (reviewData as any) ||
      {};

    if (!pro?._id || !token) return;

    const formData = new FormData();
    Object.entries(values).forEach(([key, val]) => {
      if (key === "profile_image" && val instanceof FileList && val[0]) {
        formData.append(key, val[0]);
      } else if (typeof val === "string" && val.trim() !== "") {
        formData.append(key, val);
      }
    });

    // Always append these values
    formData.append("city", values.city);
    formData.append("state", values.state);
    formData.append("country", values.country || "");
    formData.append("business_type", values.business_type);

    const finalSchedule = availabilityOption === 'anytime'
      ? defaultSchedule.map(d => ({ day: d.dayOfWeek, status: 'open', start_time: '00:00', end_time: '23:59' }))
      : schedule.map((d: any) => ({
        day: d.dayOfWeek,
        status: d.shifts[0].isClosed ? 'closed' : 'open',
        start_time: d.shifts[0].openTime,
        end_time: d.shifts[0].closeTime
      }));
    formData.append('business_hours', JSON.stringify(finalSchedule));

    updatePro(
      { id: pro._id, data: formData },
      {
        onSuccess: async () => {
          if (refetchReview) await refetchReview();
          toast.success("Professional details updated successfully!");
          router.back();
        },
      }
    );
  };

  if (authLoading || loadingReview) {
    return (
      <GlobalLoader></GlobalLoader>
    );
  }



  if (errorReview) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-10 space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full">
              <Mail className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Unable to Load Profile</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Failed to load your profile information. Please try again.
            </p>
            <Button
              onClick={() => refetchReview && refetchReview()}
              className="bg-[#0077B6] hover:bg-[#0066A3] text-white h-10 px-6 text-sm font-medium"
            >
              Retry Loading
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#0077B6]/10 dark:bg-[#0077B6]/20 rounded px-3 py-1.5 border border-[#0077B6]/20 dark:border-[#0077B6]/30 mb-2">
              <div className="w-1.5 h-1.5 bg-[#0077B6] dark:bg-[#0077B6] rounded-full animate-pulse" />
              <span className="text-sm font-medium text-[#0077B6] dark:text-[#0077B6]/90">
                Edit Profile
              </span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Edit Basic Information
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Update your business details and preferences
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.back()}
              className="h-9 px-4 text-sm border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Cancel
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Profile Image Card */}
            <div className="bg-white dark:bg-gray-900 rounded-sm p-4 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <div className="p-1.5 bg-[#0077B6]/10 dark:bg-[#0077B6]/20 rounded-sm">
                    <Pencil className="w-4 h-4 text-[#0077B6]" />
                  </div>
                  Profile Photo
                </h3>
              </div>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow">
                    {uploadingImage ? (
                      <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 animate-spin text-[#0077B6]" />
                      </div>
                    ) : (
                      <Image
                        src={displayImageSrc}
                        width={96}
                        height={96}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <label
                    htmlFor="upload-profile"
                    className="absolute bottom-0 right-0 p-2 bg-white dark:bg-gray-800 rounded-full border border-gray-300 dark:border-gray-700 cursor-pointer shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    {uploadingImage ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0077B6]" />
                    ) : (
                      <Pencil className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
                    )}
                  </label>
                  <input
                    type="file"
                    id="upload-profile"
                    accept="image/png, image/jpeg, image/jpg"
                    {...register("profile_image")}
                    className="hidden"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Upload a professional photo of your business. Recommended size: 400x400px.
                  </p>
                  {errors.profile_image && (
                    <p className="text-red-600 dark:text-red-400 text-sm">{errors.profile_image.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Basic Information Card */}
            <div className="bg-white dark:bg-gray-900 rounded-sm p-4 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <div className="p-1.5 bg-[#BE13BF]/10 dark:bg-[#BE13BF]/20 rounded-sm">
                    <Building className="w-4 h-4 text-[#BE13BF]" />
                  </div>
                  Basic Information
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                    Business Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    {...register("business_name")}
                    className="border-gray-300 dark:border-gray-700 focus:border-[#0077B6] focus:ring-[#0077B6]"
                    placeholder="Enter your business name"
                  />
                  {errors.business_name && (
                    <p className="text-red-600 dark:text-red-400 text-sm mt-1 flex items-center gap-1">
                      <span>⚠</span> {errors.business_name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                    Introduction <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    {...register("introduction")}
                    className="border-gray-300 dark:border-gray-700 focus:border-[#0077B6] focus:ring-[#0077B6] min-h-[100px]"
                    placeholder="Tell customers about your business, services, and expertise..."
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Minimum 10 characters
                  </p>
                  {errors.introduction && (
                    <p className="text-red-600 dark:text-red-400 text-sm mt-1 flex items-center gap-1">
                      <span>⚠</span> {errors.introduction.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-500" />
                        Year Founded <span className="text-red-500">*</span>
                      </div>
                    </label>
                    <Input
                      {...register("founded_year")}
                      className="border-gray-300 dark:border-gray-700 focus:border-[#0077B6] focus:ring-[#0077B6]"
                      placeholder="e.g., 2010"
                    />
                    {errors.founded_year && (
                      <p className="text-red-600 dark:text-red-400 text-sm mt-1 flex items-center gap-1">
                        <span>⚠</span> {errors.founded_year.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                      <div className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-gray-500" />
                        Employees <span className="text-red-500"></span>
                      </div>
                    </label>
                    <Input
                      {...register("employees")}
                      className="border-gray-300 dark:border-gray-700 focus:border-[#0077B6] focus:ring-[#0077B6]"
                      placeholder="e.g., 10"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                      <div className="flex items-center gap-1">
                        <Globe className="w-3.5 h-3.5 text-gray-500" />
                        Website (Optional)
                      </div>
                    </label>
                    <Input
                      {...register("website")}
                      className="border-gray-300 dark:border-gray-700 focus:border-[#0077B6] focus:ring-[#0077B6]"
                      placeholder="https://example.com"
                    />
                    {errors.website && (
                      <p className="text-red-600 dark:text-red-400 text-sm mt-1 flex items-center gap-1">
                        <span>⚠</span> {errors.website.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                    Business Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("business_type")}
                    className="w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-900 focus:border-[#0077B6] focus:ring-[#0077B6] text-sm"
                  >
                    <option value="">Select business type</option>
                    <option value="company">Company</option>
                    <option value="individual">Individual</option>
                    <option value="sub-contractor">Sub-contractor</option>
                  </select>
                  {errors.business_type && (
                    <p className="text-red-600 dark:text-red-400 text-sm mt-1 flex items-center gap-1">
                      <span>⚠</span> {errors.business_type.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Location Card */}
            <div className="bg-white dark:bg-gray-900 rounded-sm p-4 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <div className="p-1.5 bg-[#0077B6]/10 dark:bg-[#0077B6]/20 rounded-sm">
                    <MapPin className="w-4 h-4 text-[#0077B6]" />
                  </div>
                  Business Location
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <Input
                    {...register("address_line")}
                    className="border-gray-300 dark:border-gray-700 focus:border-[#0077B6] focus:ring-[#0077B6]"
                    placeholder="Street address"
                  />
                  {errors.address_line && (
                    <p className="text-red-600 dark:text-red-400 text-sm mt-1 flex items-center gap-1">
                      <span>⚠</span> {errors.address_line.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                      City <span className="text-red-500">*</span>
                    </label>
                    <Input
                      {...register("city")}
                      className="border-gray-300 dark:border-gray-700 focus:border-[#0077B6] focus:ring-[#0077B6]"
                      placeholder="City"
                    />
                    {errors.city && (
                      <p className="text-red-600 dark:text-red-400 text-sm mt-1 flex items-center gap-1">
                        <span>⚠</span> {errors.city.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                      State <span className="text-red-500">*</span>
                    </label>
                    <Input
                      {...register("state")}
                      className="border-gray-300 dark:border-gray-700 focus:border-[#0077B6] focus:ring-[#0077B6]"
                      placeholder="State"
                    />
                    {errors.state && (
                      <p className="text-red-600 dark:text-red-400 text-sm mt-1 flex items-center gap-1">
                        <span>⚠</span> {errors.state.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                      Zip Code <span className="text-red-500">*</span>
                    </label>
                    <Input
                      {...register("zipcode")}
                      className="border-gray-300 dark:border-gray-700 focus:border-[#0077B6] focus:ring-[#0077B6]"
                      placeholder="Zip code"
                    />
                    {errors.zipcode && (
                      <p className="text-red-600 dark:text-red-400 text-sm mt-1 flex items-center gap-1">
                        <span>⚠</span> {errors.zipcode.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                      Country <span className="text-red-500"></span>
                    </label>
                    <Input
                      {...register("country")}
                      className="border-gray-300 dark:border-gray-700 focus:border-[#0077B6] focus:ring-[#0077B6]"
                      placeholder="Country"
                    />
                    {errors.country && (
                      <p className="text-red-600 dark:text-red-400 text-sm mt-1 flex items-center gap-1">
                        <span>⚠</span> {errors.country.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours Card */}
            <div className="bg-white dark:bg-gray-900 rounded-sm p-4 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <div className="p-1.5 bg-[#6742EE]/10 dark:bg-[#6742EE]/20 rounded-sm">
                    <Calendar className="w-4 h-4 text-[#6742EE]" />
                  </div>
                  Business Hours
                </h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-3">
                  {schedule.map((day, dayIndex) => (
                    <div
                      key={day.dayOfWeek}
                      className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-sm hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                    >
                      <label className="min-w-28 text-sm font-medium text-gray-700 dark:text-gray-300">
                        {day.day}
                      </label>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleDayToggle(dayIndex)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-sm text-sm font-medium transition-colors ${!day.shifts[0].isClosed
                            ? 'bg-[#0077B6] text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                            }`}
                        >
                          <span className="w-2 h-2 rounded-full bg-current opacity-80"></span>
                          {day.shifts[0].isClosed ? 'Closed' : 'Open'}
                        </button>

                        {!day.shifts[0].isClosed && (
                          <div className="flex flex-col sm:flex-row items-center gap-2 flex-1">
                            <div className="flex items-center gap-2">
                              <select
                                value={day.shifts[0].openTime}
                                onChange={(e) => handleTimeChange(dayIndex, 'openTime', e.target.value)}
                                className="border border-gray-300 dark:border-gray-700 rounded px-2 py-1.5 text-sm focus:border-[#0077B6] focus:ring-[#0077B6] bg-white dark:bg-gray-900 min-w-[85px]"
                              >
                                {timeOptions.map(t => (
                                  <option key={t} value={t}>{t}</option>
                                ))}
                              </select>
                              <span className="text-gray-500 text-sm">to</span>
                              <select
                                value={day.shifts[0].closeTime}
                                onChange={(e) => handleTimeChange(dayIndex, 'closeTime', e.target.value)}
                                className="border border-gray-300 dark:border-gray-700 rounded px-2 py-1.5 text-sm focus:border-[#0077B6] focus:ring-[#0077B6] bg-white dark:bg-gray-900 min-w-[85px]"
                              >
                                {timeOptions.map(t => (
                                  <option key={t} value={t}>{t}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Quick Options
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setAvailabilityOption('business');
                        setSchedule(defaultSchedule);
                      }}
                      className={`px-3 py-1.5 text-sm rounded-sm transition-colors ${availabilityOption === 'business'
                        ? 'bg-[#0077B6] text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                    >
                      Custom Hours
                    </button>
                    <button
                      type="button"
                      onClick={set24_7Schedule}
                      className={`px-3 py-1.5 text-sm rounded-sm transition-colors ${availabilityOption === 'anytime'
                        ? 'bg-[#0077B6] text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                    >
                      Available 24/7
                    </button>
                  </div>
                  {availabilityOption === 'anytime' && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      All days will be set to 00:00 - 23:59 (24/7 availability)
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="sticky bottom-4 mt-8">
            <div className="bg-white dark:bg-gray-900 rounded-sm p-4 border border-gray-200 dark:border-gray-700 shadow-lg">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {isDirty ? (
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-[#0077B6] rounded-full animate-pulse"></span>
                      You have unsaved changes
                    </span>
                  ) : (
                    "All changes saved"
                  )}
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => router.back()}
                    className="h-10 px-6 text-sm border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isPending || !isDirty || !token}
                    className="h-10 px-6 text-sm bg-[#0077B6] hover:bg-[#0066A3] text-white flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed min-w-[120px]"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}