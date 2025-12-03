"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Pencil, Loader2 } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/components/providers/context/auth-context";
import { useLocationByUserId } from "@/hooks/useLocation";
import { useGetProfessionalbyUserId, useUpdateProfessional } from "@/hooks/useProfessional";

type PaymentMethod = "Cash" | "Apple Pay" | "Paypal" | "Stripe" | "Zelle";
const paymentOptions: PaymentMethod[] = ["Cash", "Apple Pay", "Paypal", "Stripe", "Zelle"];

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

const formSchema = z.object({
  business_name: z.string().min(1, "Business name is required"),
  founded_year: z
    .string()
    .optional()
    .refine(
      (val) => val === "" || (!isNaN(Number(val)) && Number(val) >= 1900 && Number(val) <= new Date().getFullYear()),
      { message: "Year must be a valid number between 1900 and current year" }
    ),
  employees: z
    .string()
    .optional()
    .refine((val) => val === "" || (!isNaN(Number(val)) && Number(val) >= 0), {
      message: "Employees must be a valid non-negative number",
    }),
  website: z
    .string()
    .optional()
    .refine((val) => val === "" || z.string().url().safeParse(val).success, {
      message: "Please enter a valid URL",
    }),
  address_line: z.string().min(1, "Address is required"),
  zipcode: z.string().min(1, "Zipcode is required"),
  payment_methods: z.array(z.enum(["Cash", "Apple Pay", "Paypal", "Stripe", "Zelle"])).min(1),
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
  const { isAuthenticated, isLoading: authLoading, getAccessToken } = useAuth();
  const token = getAccessToken();

  const shouldFetch = useMemo(() => !!token && !authLoading, [token, authLoading]);

  const { data: pro, isLoading: loadingPro, isError: errorPro, refetch: refetchPro } =
    useGetProfessionalbyUserId(shouldFetch ? token : null);
  const { data: location, isLoading: loadingLoc, isError: errorLoc, refetch: refetchLoc } =
    useLocationByUserId(token || "");

  const { mutate: updatePro, isPending } = useUpdateProfessional(token);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [formDataLoaded, setFormDataLoaded] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      business_name: "",
      founded_year: "",
      employees: "",
      website: "",
      address_line: "",
      zipcode: "",
      payment_methods: [],
      profile_image: undefined,
    },
  });

  // ✅ Populate form once data available
  useEffect(() => {
    if (pro && location && !formDataLoaded) {
      reset({
        business_name: pro.business_name || "",
        founded_year: pro.founded_year?.toString() || "",
        employees: pro.employees?.toString() || "",
        website: pro.website || "",
        address_line: location.address_line || "",
        zipcode: location.zipcode || "",
        payment_methods: pro.payment_methods?.filter((m: string) =>
          paymentOptions.includes(m as PaymentMethod)
        ) as PaymentMethod[],
      });
      setPreviewImage(pro.profile_image || null);
      setFormDataLoaded(true);
    }
  }, [pro, location, reset, formDataLoaded]);

  // ✅ Handle profile image preview
  const watchedImage = watch("profile_image");
  useEffect(() => {
    if (watchedImage?.length && watchedImage[0] instanceof File) {
      const file = watchedImage[0];
      if (file.size <= MAX_FILE_SIZE && ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        const reader = new FileReader();
        reader.onloadend = () => setPreviewImage(reader.result as string);
        reader.readAsDataURL(file);
      }
    }
  }, [watchedImage]);

  // ✅ Submit handler
  const onSubmit = async (values: FormValues) => {
    if (!pro?._id || !token) return;

    const formData = new FormData();
    Object.entries(values).forEach(([key, val]) => {
      if (key === "profile_image" && val instanceof FileList && val[0]) {
        formData.append(key, val[0]);
      } else if (key === "payment_methods") {
        formData.append(key, JSON.stringify(val));
      } else if (typeof val === "string" && val.trim() !== "") {
        formData.append(key, val);
      }
    });

    updatePro(
      { id: pro._id, data: formData },
      {
        onSuccess: async () => {
          await Promise.all([refetchPro(), refetchLoc()]);
          router.back();
        },
      }
    );
  };

  // ✅ Handle states
  if (authLoading || loadingPro || loadingLoc) {
    return (
      <div className="max-w-3xl mx-auto p-4 text-center">
        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-sky-600" />
        <p>Loading your profile...</p>
      </div>
    );
  }

  if (!isAuthenticated || !token) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600">Please sign in to edit your business information.</p>
        <Button className="mt-3 bg-sky-500 text-white" onClick={() => router.push("/login")}>
          Go to Login
        </Button>
      </div>
    );
  }

  if (errorPro || errorLoc) {
    return (
      <div className="text-center py-10">
        <p className="text-red-600 font-semibold mb-2">
          Failed to load your profile or location.
        </p>
        <Button
          onClick={() => {
            refetchPro();
            refetchLoc();
          }}
          className="bg-sky-500 text-white"
        >
          Retry
        </Button>
      </div>
    );
  }

  // ✅ Main Form UI
  return (
    <div className="p-4 max-w-3xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1 className="font-bold text-xl mb-6">Edit Basic Information</h1>

        {/* Profile Image */}
        <div className="mt-4">
          <p className="text-sm font-semibold">Profile Photo</p>
          <div className="relative w-fit mt-2">
            {previewImage ? (
              <Image
                src={previewImage}
                width={100}
                height={100}
                alt="profile image"
                className="w-24 h-24 rounded-lg object-cover"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-200 rounded-lg" />
            )}
            <span className="p-1 rounded-lg bg-white absolute top-0 right-0 border cursor-pointer">
              <label htmlFor="upload-profile" className="cursor-pointer">
                <Pencil className="w-4 h-4" />
              </label>
              <input
                type="file"
                id="upload-profile"
                accept="image/png, image/jpeg, image/jpg"
                {...register("profile_image")}
                className="hidden"
              />
            </span>
          </div>
          {errors.profile_image && (
            <p className="text-red-600 text-sm mt-1">{errors.profile_image.message}</p>
          )}
        </div>

        {/* Text Inputs */}
        {[
          { label: "Business Name", name: "business_name", required: true },
          { label: "Year Founded", name: "founded_year" },
          { label: "Number of Employees", name: "employees" },
          { label: "Website", name: "website" },
          { label: "Address", name: "address_line", required: true },
          { label: "Zip Code", name: "zipcode", required: true },
        ].map((field) => (
          <div key={field.name} className="mt-4">
            <label className="text-sm font-semibold">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <Input {...register(field.name as keyof FormValues)} />
            {errors[field.name as keyof FormValues] && (
              <p className="text-red-600 text-sm mt-1">
                {errors[field.name as keyof FormValues]?.message as string}
              </p>
            )}
          </div>
        ))}

        {/* Payment Methods */}
        <div className="mt-6">
          <p className="text-lg font-semibold">Payment Methods Accepted</p>
          <Controller
            control={control}
            name="payment_methods"
            render={({ field }) => (
              <div className="grid grid-cols-2 gap-2 mt-3">
                {paymentOptions.map((method) => (
                  <label key={method} className="flex items-center gap-2 cursor-pointer select-none">
                    <Checkbox
                      checked={field.value?.includes(method)}
                      onCheckedChange={(checked) =>
                        checked
                          ? field.onChange([...field.value as any, method])
                          : field.onChange(field.value?.filter((m) => m !== method))
                      }
                    />
                    {method}
                  </label>
                ))}
              </div>
            )}
          />
          {errors.payment_methods && (
            <p className="text-red-600 text-sm mt-2">{errors.payment_methods.message}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-8">
          <Button variant="outline" type="button" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isPending || !isDirty || !token}
            className="bg-sky-500 text-white flex items-center gap-2 hover:bg-sky-600 disabled:bg-gray-400"
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
}
