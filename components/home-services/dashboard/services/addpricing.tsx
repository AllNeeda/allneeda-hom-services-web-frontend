'use client';
import { useEffect } from "react";
import { getAccessToken } from "@/app/api/axios";
import { Loader2, DollarSign, ClipboardList, FileText } from "lucide-react";
import { ServicePricingPayload, useAddServicePricing } from "@/hooks/useServices";
import { useProfessionalReview } from "@/hooks/RegisterPro/useRegister";
import GlobalLoader from "@/components/ui/global-loader";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter, useSearchParams } from "next/navigation";



const PRICING_TYPES = [
    { value: "hourly", label: "Hourly Rate" },
    { value: "fixed", label: "Fixed Price" },
    { value: "Project Based", label: "Per Project" },
    { value: "custom", label: "Custom Pricing" },
];

// Zod schema for validation
const servicePricingSchema = z.object({
    pricing_type: z.string().nonempty("Completed tasks is required"),
    minimum_price: z
        .string()
        .nonempty("Minimum price is required")
        .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, "Invalid minimum price"),
    maximum_price: z
        .string()
        .nonempty("Maximum price is required")
        .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, "Invalid maximum price"),
    completed_tasks: z
        .string()
        .nonempty("Completed tasks is required")
        .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, "Invalid completed tasks"),
    description: z.string().min(16, "Description must be at least 16 characters"),
});

type ServicePricingFormData = z.infer<typeof servicePricingSchema>;

const ServicePricing = () => {
    const token = getAccessToken() || "";
    const { mutate, isPending } = useAddServicePricing(token);
    const router = useRouter()
    const { data: professionalData, isLoading: isProfLoading } = useProfessionalReview(token);
    const queryClient = useQueryClient();
    const serviceData = queryClient.getQueryData(['currentService']) as
        { service_id: string; professional_id: string } | undefined;
    const searchParams = useSearchParams();
    const serviceID = searchParams.get("service_id");
    const professionalId = searchParams.get("professional_id");
    const serviceId = serviceID || serviceData?.service_id;
    const professional_id = professionalId || serviceData?.professional_id;
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<ServicePricingFormData>({
        resolver: zodResolver(servicePricingSchema),
    });

    useEffect(() => {
        if (professionalData?.professional?.professional) {
            const prof = professionalData.professional.professional;
            if (prof.service_id === serviceId) {
                setValue("pricing_type", prof.pricing_type || "hourly");
                setValue("minimum_price", prof.minimum_price || "");
                setValue("maximum_price", prof.maximum_price || "");
                setValue("completed_tasks", prof.completed_tasks || "");
                setValue("description", prof.description || "");
            }
        }
    }, [professionalData, serviceId, setValue]);

    if (isProfLoading) {
        return <GlobalLoader />;
    }

    const onSubmit = (data: ServicePricingFormData) => {
        // Check min/max prices
        if (Number(data.minimum_price) > Number(data.maximum_price)) {
            toast.error("Minimum price cannot be greater than maximum price");
            return;
        }

        if (!serviceId || !professional_id) {
            router.push("/home-services/dashboard/services");
            return;
        }

        const pricingData: ServicePricingPayload = {
            service_id: serviceId,
            professional_id,
            pricing_type: data.pricing_type,
            minimum_price: data.minimum_price,
            maximum_price: data.maximum_price,
            completed_tasks: data.completed_tasks,
            description: data.description.trim(),
        };

        mutate(pricingData);
    };

    return (
        <div className="dark:bg-gray-900 py-2 px-4 sm:px-2">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 text-[13px]">
                        Service Pricing & Information
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 text-[13px]">
                        Set your pricing structure and service details.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-8">
                        {/* Pricing Type */}
                        <section className="border-b border-gray-200 dark:border-gray-700 pb-8">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-[4px]">
                                    <DollarSign className="h-3.5 w-3.5 text-[#0077B6]" />
                                </div>
                                <div>
                                    <h3 className="text-[13px] font-medium text-gray-900 dark:text-gray-200">
                                        Pricing Structure
                                    </h3>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label htmlFor="pricing-type" className="block text-[13px] font-medium text-gray-900 dark:text-gray-200 mb-2">
                                        Pricing Type *
                                    </label>
                                    <select
                                        id="pricing-type"
                                        {...register("pricing_type")}
                                        disabled={isPending}
                                        className="mt-1 block w-full rounded-[4px] bg-white dark:bg-gray-900 py-2 pl-3 pr-8 text-[13px] text-gray-900 dark:text-white outline-1 outline-gray-300 dark:outline-gray-600 focus:outline-1 focus:outline-[#0077B6] focus:outline-offset-2"
                                    >
                                        {PRICING_TYPES.map((type) => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.pricing_type && (
                                        <p className="text-red-500 text-sm mt-1">{errors.pricing_type.message}</p>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* Price Range */}
                        <section className="border-b border-gray-200 dark:border-gray-700 pb-8">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-[4px]">
                                    <ClipboardList className="h-3.5 w-3.5 text-[#0077B6]" />
                                </div>
                                <div>
                                    <h3 className="text-[13px] font-medium text-gray-900 dark:text-gray-200">
                                        Price Range
                                    </h3>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="minimum-price" className="block text-[13px] font-medium text-gray-900 dark:text-gray-200 mb-2">
                                        Minimum Price ($) *
                                    </label>
                                    <input
                                        id="minimum-price"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        {...register("minimum_price")}
                                        disabled={isPending}
                                        placeholder="0.00"
                                        className="mt-1 block w-full rounded-[4px] bg-white dark:bg-gray-900 px-3 py-2 text-[13px] text-gray-900 dark:text-white placeholder:text-[13px] dark:placeholder-gray-500 outline-1 outline-gray-300 dark:outline-gray-600 focus:outline-1 focus:outline-[#0077B6] focus:outline-offset-2"
                                    />
                                    {errors.minimum_price && (
                                        <p className="text-red-500 text-sm mt-1">{errors.minimum_price.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="maximum-price" className="block text-[13px] font-medium text-gray-900 dark:text-gray-200 mb-2">
                                        Maximum Price ($) *
                                    </label>
                                    <input
                                        id="maximum-price"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        {...register("maximum_price")}
                                        disabled={isPending}
                                        placeholder="0.00"
                                        className="mt-1 block w-full rounded-[4px] bg-white dark:bg-gray-900 px-3 py-2 text-[13px] text-gray-900 dark:text-white placeholder:text-[13px] dark:placeholder-gray-500 outline-1 outline-gray-300 dark:outline-gray-600 focus:outline-1 focus:outline-[#0077B6] focus:outline-offset-2"
                                    />
                                    {errors.maximum_price && (
                                        <p className="text-red-500 text-sm mt-1">{errors.maximum_price.message}</p>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* Experience & Description */}
                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-[4px]">
                                    <FileText className="h-3.5 w-3.5 text-[#0077B6]" />
                                </div>
                                <div>
                                    <h3 className="text-[13px] font-medium text-gray-900 dark:text-gray-200">
                                        Experience & Description
                                    </h3>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label htmlFor="completed-tasks" className="block text-[13px] font-medium text-gray-900 dark:text-gray-200 mb-2">
                                        Completed Tasks *
                                    </label>
                                    <input
                                        id="completed-tasks"
                                        type="number"
                                        min="0"
                                        {...register("completed_tasks")}
                                        disabled={isPending}
                                        placeholder="Number of completed tasks"
                                        className="mt-1 block w-full rounded-[4px] bg-white dark:bg-gray-900 px-3 py-2 text-[13px] text-gray-900 dark:text-white placeholder:text-[13px] dark:placeholder-gray-500 outline-1 outline-gray-300 dark:outline-gray-600 focus:outline-1 focus:outline-[#0077B6] focus:outline-offset-2"
                                    />
                                    {errors.completed_tasks && (
                                        <p className="text-red-500 text-sm mt-1">{errors.completed_tasks.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="description" className="block text-[13px] font-medium text-gray-900 dark:text-gray-200 mb-2">
                                        Service Description *
                                    </label>
                                    <textarea
                                        id="description"
                                        rows={4}
                                        {...register("description")}
                                        disabled={isPending}
                                        placeholder="Describe your services, expertise, and what clients can expect..."
                                        className="mt-1 block w-full rounded-[4px] bg-white dark:bg-gray-900 px-3 py-2 text-[13px] text-gray-900 dark:text-white placeholder:text-[13px] dark:placeholder-gray-500 outline-1 outline-gray-300 dark:outline-gray-600 focus:outline-1 focus:outline-[#0077B6] focus:outline-offset-2 resize-none"
                                    />
                                    {errors.description && (
                                        <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                                    )}
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Submit Button */}
                    <div className="fixed bottom-6 right-6 flex gap-4 text-[13px]">
                        <button
                            type="submit"
                            disabled={isPending}
                            className="text-white text-[13px] py-2 px-6 rounded-[4px] bg-[#0077B6] hover:bg-[#005f8e] disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center gap-2"
                        >
                            {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                            Next
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ServicePricing;