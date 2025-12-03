'use client';
import { useState, FormEvent, useEffect } from "react";
import { getAccessToken } from "@/app/api/axios";
import { Loader2, DollarSign, ClipboardList, FileText } from "lucide-react";
import { ServicePricingPayload, useGetServiceById, useUpdateServicePricing } from "@/hooks/useServices";
import GlobalLoader from "@/components/ui/global-loader";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";

const PRICING_TYPES = [
    { value: "hourly", label: "Hourly Rate" },
    { value: "fixed", label: "Fixed Price" },
    { value: "Project Based", label: "Per Project" },
    { value: "custom", label: "Custom Pricing" },
];

const ServicePricing = () => {
    const token = getAccessToken();
    const searchParams = useSearchParams();
    const service_id = searchParams.get("service_id");
    const professional_id = searchParams.get("professional_id");
    const {
        data: serviceByIdData,
        isLoading: isServiceLoading,
        isError: serviceError
    } = useGetServiceById(service_id!, professional_id!, token!);
    const { mutate: updateServicePricing, isPending: isUpdating } = useUpdateServicePricing(token!);
    const [formData, setFormData] = useState({
        pricingType: "hourly",
        minimumPrice: "",
        maximumPrice: "",
        completedTasks: "",
        description: ""
    });

    // Pre-fill form with existing service data
    useEffect(() => {
        const service = serviceByIdData?.data?.data;
        if (service) {
            setFormData({
                pricingType: service.pricing_type || "hourly",
                minimumPrice: service.minimum_price?.toString() || "",
                maximumPrice: service.maximum_price?.toString() || "",
                completedTasks: service.completed_tasks?.toString() || "",
                description: service.description || ""
            });
        }
    }, [serviceByIdData]);

    // Handle input changes
    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validation
        if (Number(formData.minimumPrice) > Number(formData.maximumPrice)) {
            toast.error("Minimum price cannot be greater than maximum price");
            return;
        }

        if (!service_id || !professional_id) {
            toast.error("Service information not found");
            return;
        }

        const pricingData: ServicePricingPayload = {
            service_id,
            professional_id,
            pricing_type: formData.pricingType,
            minimum_price: formData.minimumPrice,
            maximum_price: formData.maximumPrice,
            completed_tasks: formData.completedTasks,
            description: formData.description.trim(),
        };

        updateServicePricing(pricingData);
    };

    // Show global loader while fetching service data
    if (isServiceLoading) {
        return <GlobalLoader />;
    }

    // Show error state
    if (serviceError) {
        return (
            <div className="dark:bg-gray-900 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 dark:text-red-400 text-[13px]">
                        Failed to load service data. Please try again.
                    </p>
                </div>
            </div>
        );
    }

    const hasExistingData = !!serviceByIdData?.data?.data;
    const isLoading = isServiceLoading || isUpdating;

    return (
        <div className="dark:bg-gray-900 min-h-screen py-2 px-4 sm:px-2">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 text-[13px]">
                        {hasExistingData ? "Update Service Pricing" : "Service Pricing & Information"}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 text-[13px]">
                        {hasExistingData
                            ? "Update your pricing structure and service details."
                            : "Set your pricing structure and service details."
                        }
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-8">
                        {/* Pricing Type Section */}
                        <section className="border-b border-gray-200 dark:border-gray-700 pb-8">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-[4px]">
                                    <DollarSign className="h-3.5 w-3.5 text-[#0077B6]" />
                                </div>
                                <h3 className="text-[13px] font-medium text-gray-900 dark:text-gray-200">
                                    Pricing Structure
                                </h3>
                            </div>

                            <div>
                                <label htmlFor="pricing-type" className="block text-[13px] font-medium text-gray-900 dark:text-gray-200 mb-2">
                                    Pricing Type *
                                </label>
                                <select
                                    id="pricing-type"
                                    value={formData.pricingType}
                                    required
                                    onChange={(e) => handleInputChange("pricingType", e.target.value)}
                                    disabled={isLoading}
                                    className="mt-1 block w-full rounded-[4px] bg-white dark:bg-gray-900 py-2 pl-3 pr-8 text-[13px] text-gray-900 dark:text-white outline-1 outline-gray-300 dark:outline-gray-600 focus:outline-1 focus:outline-[#0077B6] focus:outline-offset-2"
                                >
                                    {PRICING_TYPES.map((type) => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </section>

                        {/* Pricing Range Section */}
                        <section className="border-b border-gray-200 dark:border-gray-700 pb-8">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-[4px]">
                                    <ClipboardList className="h-3.5 w-3.5 text-[#0077B6]" />
                                </div>
                                <h3 className="text-[13px] font-medium text-gray-900 dark:text-gray-200">
                                    Price Range
                                </h3>
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
                                        required
                                        value={formData.minimumPrice}
                                        onChange={(e) => handleInputChange("minimumPrice", e.target.value)}
                                        disabled={isLoading}
                                        placeholder="0.00"
                                        className="mt-1 block w-full rounded-[4px] bg-white dark:bg-gray-900 px-3 py-2 text-[13px] text-gray-900 dark:text-white placeholder:text-[13px] dark:placeholder-gray-500 outline-1 outline-gray-300 dark:outline-gray-600 focus:outline-1 focus:outline-[#0077B6] focus:outline-offset-2"
                                    />
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
                                        required
                                        value={formData.maximumPrice}
                                        onChange={(e) => handleInputChange("maximumPrice", e.target.value)}
                                        disabled={isLoading}
                                        placeholder="0.00"
                                        className="mt-1 block w-full rounded-[4px] bg-white dark:bg-gray-900 px-3 py-2 text-[13px] text-gray-900 dark:text-white placeholder:text-[13px] dark:placeholder-gray-500 outline-1 outline-gray-300 dark:outline-gray-600 focus:outline-1 focus:outline-[#0077B6] focus:outline-offset-2"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Experience Section */}
                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-[4px]">
                                    <FileText className="h-3.5 w-3.5 text-[#0077B6]" />
                                </div>
                                <h3 className="text-[13px] font-medium text-gray-900 dark:text-gray-200">
                                    Experience & Description
                                </h3>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="completed-tasks" className="block text-[13px] font-medium text-gray-900 dark:text-gray-200 mb-2">
                                        Completed Tasks *
                                    </label>
                                    <input
                                        id="completed-tasks"
                                        type="number"
                                        min="0"
                                        required
                                        value={formData.completedTasks}
                                        onChange={(e) => handleInputChange("completedTasks", e.target.value)}
                                        disabled={isLoading}
                                        placeholder="Number of completed tasks"
                                        className="mt-1 block w-full rounded-[4px] bg-white dark:bg-gray-900 px-3 py-2 text-[13px] text-gray-900 dark:text-white placeholder:text-[13px] dark:placeholder-gray-500 outline-1 outline-gray-300 dark:outline-gray-600 focus:outline-1 focus:outline-[#0077B6] focus:outline-offset-2"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="description" className="block text-[13px] font-medium text-gray-900 dark:text-gray-200 mb-2">
                                        Service Description *
                                    </label>
                                    <textarea
                                        id="description"
                                        rows={4}
                                        required
                                        value={formData.description}
                                        onChange={(e) => handleInputChange("description", e.target.value)}
                                        disabled={isLoading}
                                        placeholder="Describe your services, expertise, and what clients can expect..."
                                        className="mt-1 block w-full rounded-[4px] bg-white dark:bg-gray-900 px-3 py-2 text-[13px] text-gray-900 dark:text-white placeholder:text-[13px] dark:placeholder-gray-500 outline-1 outline-gray-300 dark:outline-gray-600 focus:outline-1 focus:outline-[#0077B6] focus:outline-offset-2 resize-none"
                                    />
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Form Actions */}
                    <div className="fixed bottom-6 right-6 flex gap-4 text-[13px]">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="text-white text-[13px] py-2 px-6 rounded-[4px] bg-[#0077B6] hover:bg-[#005f8e] disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center gap-2"
                        >
                            {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                            {hasExistingData ? "Update Service" : "Next"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ServicePricing;