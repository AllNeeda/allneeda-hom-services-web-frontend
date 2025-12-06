'use client'
import React, { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem
} from "@/components/ui/select";
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverTrigger,
    PopoverContent
} from '@/components/ui/popover';
import {
    Command,
    CommandInput,
    CommandItem,
    CommandList,
    CommandEmpty
} from '@/components/ui/command';
import { useRegister } from '@/hooks/RegisterPro/useRegister';
import {
    ProfessionalStepOne,
    ProfessionalStepOneSchemaType
} from '@/schemas/professional/professional';
import {
    useCategoryServiceCount,
    useServices,
    useSubcategoryServiceCount
} from "@/hooks/useHomeServices";
import toast from "react-hot-toast";
import GlobalLoader from "@/components/ui/global-loader";
import Link from "next/link";

// Define types
interface Category {
    _id: string;
    name: string;
    slug: string;
    is_active: boolean;
    category_id: string;
}

interface SubCategory {
    _id: string;
    name: string;
    slug: string;
    is_active: boolean;
    category_id: string;
}

interface Service {
    _id: string;
    name: string;
    slug: string;
    subcategory_id: string;
    description: string;
}

export default function Register() {
    // API data hooks
    const { data: categoriesData, isLoading: isLoadingCategories } = useCategoryServiceCount();
    const { data: subCategoriesData, isLoading: isLoadingSubCategories } = useSubcategoryServiceCount();
    const { data: servicesData, isLoading: isLoadingServices } = useServices();
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([]);
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [businessTypeValue, setBusinessTypeValue] = useState<string>('');
    const { registerUser, isPending } = useRegister();
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        clearErrors,
        watch,
        trigger,
    } = useForm<ProfessionalStepOneSchemaType>({
        resolver: zodResolver(ProfessionalStepOne),
        mode: 'onChange',
        defaultValues: {
            categories: [],
            subCategories: [],
            services_id: [],
            country: 'United States',
            businessType: '',
            businessName: '',
            website: '',
            streetAddress: '',
            city: '',
            region: '',
            postalCode: '',
            username: '',
            email: '',
            phone: '',
            password: '',
            repassword: '',
            terms: false,
        }
    });

    const password = watch('password');
    const filteredSubCategories = useMemo(() => {
        return (subCategoriesData?.data?.data || []).filter((sub: SubCategory) =>
            selectedCategories.includes(sub.category_id)
        );
    }, [subCategoriesData, selectedCategories]);
    const filteredServices = useMemo(() => {
        return (servicesData?.data?.data || []).filter((service: Service) =>
            selectedSubCategories.includes(service.subcategory_id)
        );
    }, [servicesData, selectedSubCategories]);

    const toggleCategory = (id: string) => {
        const newCategories = selectedCategories.includes(id) ? [] : [id];
        setSelectedCategories(newCategories);
        setValue('categories', newCategories, { shouldValidate: true });
        if (newCategories.length > 0) {
            clearErrors('categories');
        }
        setSelectedSubCategories([]);
        setSelectedServices([]);
        setValue('subCategories', [], { shouldValidate: true });
        setValue('services_id', [], { shouldValidate: true });
        clearErrors('subCategories');
        clearErrors('services_id');
    };
    const toggleSubCategory = (id: string) => {
        const newSubCategories = selectedSubCategories.includes(id) ? [] : [id];
        setSelectedSubCategories(newSubCategories);
        setValue('subCategories', newSubCategories, { shouldValidate: true });
        if (newSubCategories.length > 0) {
            clearErrors('subCategories');
        }
        setSelectedServices([]);
        setValue('services_id', [], { shouldValidate: true });
        clearErrors('services_id');
    };
    const toggleService = (id: string) => {
        const newServices = selectedServices.includes(id)
            ? selectedServices.filter(item => item !== id)
            : [...selectedServices, id];
        setSelectedServices(newServices);
        setValue('services_id', newServices, { shouldValidate: true });

        // Clear services error if at least one selected
        if (newServices.length > 0) {
            clearErrors('services_id');
        }
    };

    const handleBusinessTypeChange = (value: string) => {
        setBusinessTypeValue(value);
        setValue('businessType', value, { shouldValidate: true });
        if (value) {
            clearErrors('businessType');
        }
    };

    const checkPasswordStrength = (pass: string) => {
        if (!pass) return { score: 0, message: '' };

        let score = 0;
        if (pass.length >= 8) score++;
        if (/[A-Z]/.test(pass)) score++;
        if (/[0-9]/.test(pass)) score++;
        if (/[^A-Za-z0-9]/.test(pass)) score++;

        const messages = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong'];
        const colors = [
            'text-red-600',
            'text-orange-600',
            'text-yellow-600',
            'text-green-600',
            'text-green-600'
        ];

        return {
            score,
            message: messages[score],
            color: colors[score]
        };
    };

    const onSubmit = async (data: ProfessionalStepOneSchemaType) => {
        if (isPending) {
            toast.error("Please wait while we process your registration");
            return;
        }
        const isValid = await trigger();

        if (!isValid) {
            toast.error("Please fill in all required fields correctly");
            return;
        }

        if (data.password !== data.repassword) {
            toast.error("Passwords do not match");
            return;
        }

        const submitData = {
            ...data,
            categories: selectedCategories,
            subCategories: selectedSubCategories,
            services_id: selectedServices
        };

        registerUser(submitData);
    };

    const isLoading = isLoadingCategories || isLoadingSubCategories || isLoadingServices;
    const passwordStrength = checkPasswordStrength(password);

    if (isLoading) {
        return <GlobalLoader />;
    }

    return (
        <div className="flex items-center justify-center dark:bg-gray-900 px-8 sm:px-6 lg:px-4">
            <div className="max-w-3xl w-full">
                <div className="flex justify-center">
                    <div className="w-full max-w-3xl">
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-sm shadow-lg p-8 space-y-8"
                        >
                            <div className="space-y-8">
                                <section className="border-b border-gray-200 dark:border-gray-700 pb-8">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                        Business Information
                                    </h2>
                                    <p className="mb-6 text-gray-600 dark:text-gray-300 text-[13px]">
                                        This information will be displayed publicly so be careful what you share.
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Business Name */}
                                        <div>
                                            <label htmlFor="businessName" className="block text-[13px] font-medium text-gray-900 dark:text-white mb-2">
                                                Business Name
                                            </label>
                                            <input
                                                id="businessName"
                                                type="text"
                                                placeholder="Enter your business name"
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-[4px] bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-[13px]"
                                                {...register('businessName')}
                                            />
                                            {errors.businessName && (
                                                <p className="mt-1 text-[12px] text-red-600 dark:text-red-400">
                                                    {errors.businessName.message}
                                                </p>
                                            )}
                                        </div>

                                        {/* Business Type */}
                                        <div>
                                            <label className="block text-[13px] font-medium text-gray-900 dark:text-white mb-2">
                                                Business Type *
                                            </label>
                                            <Select
                                                onValueChange={handleBusinessTypeChange}
                                                value={businessTypeValue}
                                            >
                                                <SelectTrigger className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-[13px]">
                                                    <SelectValue placeholder="Select business type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="home-services" className="text-[13px]">Home Services</SelectItem>
                                                    <SelectItem value="it-services" className="text-[13px]">IT Services</SelectItem>
                                                    <SelectItem value="food-delivery" className="text-[13px]">Food Delivery</SelectItem>
                                                    <SelectItem value="shopping" className="text-[13px]">Shopping</SelectItem>
                                                    <SelectItem value="grocery" className="text-[13px]">Grocery</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.businessType && (
                                                <p className="mt-1 text-[12px] text-red-600 dark:text-red-400">
                                                    {errors.businessType.message}
                                                </p>
                                            )}
                                        </div>

                                        {/* Category Selection */}
                                        <div>
                                            <label className="block text-[13px] font-medium text-gray-900 dark:text-white mb-2">
                                                Select Category *
                                            </label>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className="w-full justify-between border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-[13px]"
                                                    >
                                                        {selectedCategories.length > 0
                                                            ? `1 selected`
                                                            : 'Select Category'}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-full p-0">
                                                    <Command>
                                                        <CommandInput placeholder="Search Categories..." className="text-[13px]" />
                                                        <CommandEmpty className="text-[13px]">No category found.</CommandEmpty>
                                                        <CommandList className="max-h-60">
                                                            {(categoriesData?.data?.data || []).map((category: Category) => (
                                                                <CommandItem
                                                                    key={category._id}
                                                                    onSelect={() => toggleCategory(category._id)}
                                                                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 text-[13px]"
                                                                >
                                                                    <div className="flex items-center justify-between w-full">
                                                                        <span>{category.name}</span>
                                                                        {selectedCategories.includes(category._id) && (
                                                                            <span className="text-green-500">✓</span>
                                                                        )}
                                                                    </div>
                                                                </CommandItem>
                                                            ))}
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {selectedCategories.map((id) => {
                                                    const category = (categoriesData?.data?.data || []).find((c: Category) => c._id === id);
                                                    return (
                                                        <Badge key={id} className="bg-[#0077B6] rounded-[4px] text-white text-[13px]">
                                                            {category?.name}
                                                        </Badge>
                                                    );
                                                })}
                                            </div>
                                            {errors.categories && (
                                                <p className="mt-1 text-[12px] text-red-600 dark:text-red-400">
                                                    {errors.categories.message}
                                                </p>
                                            )}
                                        </div>

                                        {/* Sub-Category Selection */}
                                        <div>
                                            <label className="block text-[13px] font-medium text-gray-900 dark:text-white mb-2">
                                                Select Sub-Category *
                                            </label>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className="w-full justify-between border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-[13px]"
                                                        disabled={filteredSubCategories.length === 0}
                                                    >
                                                        {selectedSubCategories.length > 0
                                                            ? `1 selected`
                                                            : filteredSubCategories.length === 0
                                                                ? 'No sub-categories available'
                                                                : 'Select sub-category'}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-full p-0">
                                                    <Command>
                                                        <CommandInput placeholder="Search sub-categories..." className="text-[13px]" />
                                                        <CommandEmpty className="text-[13px]">No sub-category found.</CommandEmpty>
                                                        <CommandList className="max-h-60">
                                                            {filteredSubCategories.map((subCategory: SubCategory) => (
                                                                <CommandItem
                                                                    key={subCategory._id}
                                                                    onSelect={() => toggleSubCategory(subCategory._id)}
                                                                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 text-[13px]"
                                                                >
                                                                    <div className="flex items-center justify-between w-full">
                                                                        <span>{subCategory.name}</span>
                                                                        {selectedSubCategories.includes(subCategory._id) && (
                                                                            <span className="text-green-500">✓</span>
                                                                        )}
                                                                    </div>
                                                                </CommandItem>
                                                            ))}
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {selectedSubCategories.map((id) => {
                                                    const subCategory = filteredSubCategories.find((s: SubCategory) => s._id === id);
                                                    return (
                                                        <Badge key={id} className="bg-[#0077B6] text-white text-[13px]">
                                                            {subCategory?.name}
                                                        </Badge>
                                                    );
                                                })}
                                            </div>
                                            {errors.subCategories && (
                                                <p className="mt-1 text-[12px] text-red-600 dark:text-red-400">
                                                    {errors.subCategories.message}
                                                </p>
                                            )}
                                        </div>

                                        {/* Services Selection */}
                                        <div>
                                            <label className="block text-[13px] font-medium text-gray-900 dark:text-white mb-2">
                                                Select Services *
                                            </label>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className="w-full justify-between border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-[13px]"
                                                        disabled={filteredServices.length === 0}
                                                    >
                                                        {selectedServices.length > 0
                                                            ? `${selectedServices.length} selected`
                                                            : filteredServices.length === 0
                                                                ? 'No services available'
                                                                : 'Select services'}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-full p-0">
                                                    <Command>
                                                        <CommandInput placeholder="Search services..." className="text-[13px]" />
                                                        <CommandEmpty className="text-[13px]">No service found.</CommandEmpty>
                                                        <CommandList className="max-h-60">
                                                            {filteredServices.map((service: Service) => (
                                                                <CommandItem
                                                                    key={service._id}
                                                                    onSelect={() => toggleService(service._id)}
                                                                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 text-[13px]"
                                                                >
                                                                    <div className="flex items-center justify-between w-full">
                                                                        <span>{service.name}</span>
                                                                        {selectedServices.includes(service._id) && (
                                                                            <span className="text-green-500">✓</span>
                                                                        )}
                                                                    </div>
                                                                </CommandItem>
                                                            ))}
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {selectedServices.map((id) => {
                                                    const service = filteredServices.find((s: Service) => s._id === id);
                                                    return (
                                                        <Badge key={id} className="bg-[#0077B6] text-white text-[13px]">
                                                            {service?.name}
                                                        </Badge>
                                                    );
                                                })}
                                            </div>
                                            {errors.services_id && (
                                                <p className="mt-1 text-[12px] text-red-600 dark:text-red-400">
                                                    {errors.services_id.message}
                                                </p>
                                            )}
                                        </div>

                                        {/* Country */}
                                        <div>
                                            <label className="block text-[13px] font-medium text-gray-900 dark:text-white mb-2">
                                                Country
                                            </label>
                                            <input
                                                id="country"
                                                type="text"
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-[4px] bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[13px]"
                                                {...register('country')}
                                                readOnly
                                            />
                                            <p className="mt-1 text-[12px] text-gray-500 dark:text-gray-400">
                                                Currently available only in United States
                                            </p>
                                            {errors.country && (
                                                <p className="mt-1 text-[12px] text-red-600 dark:text-red-400">
                                                    {errors.country.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Address Section */}
                                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="md:col-span-3">
                                            <label htmlFor="streetAddress" className="block text-[13px] font-medium text-gray-900 dark:text-white mb-2">
                                                Street Address
                                            </label>
                                            <input
                                                id="streetAddress"
                                                type="text"
                                                placeholder="123 Main St"
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-[4px] bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[13px]"
                                                {...register('streetAddress')}
                                            />
                                            {errors.streetAddress && (
                                                <p className="mt-1 text-[12px] text-red-600 dark:text-red-400">
                                                    {errors.streetAddress.message}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="city" className="block text-[13px] font-medium text-gray-900 dark:text-white mb-2">
                                                City
                                            </label>
                                            <input
                                                id="city"
                                                type="text"
                                                placeholder="New York"
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-[4px] bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[13px]"
                                                {...register('city')}
                                            />
                                            {errors.city && (
                                                <p className="mt-1 text-[12px] text-red-600 dark:text-red-400">
                                                    {errors.city.message}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="region" className="block text-[13px] font-medium text-gray-900 dark:text-white mb-2">
                                                State / Province
                                            </label>
                                            <input
                                                id="region"
                                                type="text"
                                                placeholder="NY"
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-[4px] bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[13px]"
                                                {...register('region')}
                                            />
                                            {errors.region && (
                                                <p className="mt-1 text-[12px] text-red-600 dark:text-red-400">
                                                    {errors.region.message}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="postalCode" className="block text-[13px] font-medium text-gray-900 dark:text-white mb-2">
                                                ZIP / Postal Code
                                            </label>
                                            <input
                                                id="postalCode"
                                                type="text"
                                                placeholder="10001"
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-[4px] bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[13px]"
                                                {...register('postalCode')}
                                            />
                                            {errors.postalCode && (
                                                <p className="mt-1 text-[12px] text-red-600 dark:text-red-400">
                                                    {errors.postalCode.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Website */}
                                    <div className="mt-6">
                                        <label htmlFor="website" className="block text-[13px] font-medium text-gray-900 dark:text-white mb-2">
                                            Website or Social Media
                                        </label>
                                        <input
                                            id="website"
                                            type="text"
                                            placeholder="https://yourbusiness.com or @yourbusiness"
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-[4px] bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[13px]"
                                            {...register('website')}
                                        />
                                        <p className="mt-2 text-[13px] text-gray-500 dark:text-gray-400">
                                            Add your business website or social media profile
                                        </p>
                                    </div>
                                </section>

                                {/* Personal Information Section */}
                                <section>
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                        Personal Information
                                    </h2>
                                    <p className="mb-6 text-gray-600 dark:text-gray-300 text-[13px]">
                                        Please enter your personal details and contact information
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="username" className="block text-[13px] font-medium text-gray-900 dark:text-white mb-2">
                                                Username
                                            </label>
                                            <input
                                                id="username"
                                                type="text"
                                                placeholder="johndoe"
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-[4px] bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[13px]"
                                                {...register('username')}
                                            />
                                            {errors.username && (
                                                <p className="mt-1 text-[12px] text-red-600 dark:text-red-400">
                                                    {errors.username.message}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="email" className="block text-[13px] font-medium text-gray-900 dark:text-white mb-2">
                                                Email Address
                                            </label>
                                            <input
                                                id="email"
                                                type="email"
                                                placeholder="john@example.com"
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-[4px] bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[13px]"
                                                {...register('email')}
                                            />
                                            {errors.email && (
                                                <p className="mt-1 text-[12px] text-red-600 dark:text-red-400">
                                                    {errors.email.message}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="phone" className="block text-[13px] font-medium text-gray-900 dark:text-white mb-2">
                                                Phone Number
                                            </label>
                                            <input
                                                id="phone"
                                                type="text"
                                                placeholder="+1 (555) 123-4567"
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-[4px] bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[13px]"
                                                {...register('phone')}
                                            />
                                            {errors.phone && (
                                                <p className="mt-1 text-[12px] text-red-600 dark:text-red-400">
                                                    {errors.phone.message}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="password" className="block text-[13px] font-medium text-gray-900 dark:text-white mb-2">
                                                Password
                                            </label>
                                            <input
                                                id="password"
                                                type="password"
                                                placeholder="••••••••"
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-[4px] bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[13px]"
                                                {...register('password')}
                                            />
                                            {password && (
                                                <div className="mt-3">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className={`text-[12px] font-medium ${passwordStrength.color}`}>
                                                            {passwordStrength.message}
                                                        </span>
                                                        <span className="text-[12px] text-gray-500">
                                                            {password.length}/8+ characters
                                                        </span>
                                                    </div>
                                                    <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full transition-all duration-300 ${passwordStrength.score <= 1 ? 'bg-red-500 w-1/4' :
                                                                passwordStrength.score <= 2 ? 'bg-orange-500 w-1/2' :
                                                                    passwordStrength.score <= 3 ? 'bg-yellow-500 w-3/4' : 'bg-green-500 w-full'
                                                                }`}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                            <p className="mt-2 text-[12px] text-gray-500 dark:text-gray-400">
                                                Must be at least 8 characters with uppercase, lowercase, number, and special character
                                            </p>
                                            {errors.password && (
                                                <p className="mt-1 text-[12px] text-red-600 dark:text-red-400">
                                                    {errors.password.message}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="repassword" className="block text-[13px] font-medium text-gray-900 dark:text-white mb-2">
                                                Confirm Password
                                            </label>
                                            <input
                                                id="repassword"
                                                type="password"
                                                placeholder="••••••••"
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-[4px] bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[13px]"
                                                {...register('repassword')}
                                            />
                                            {errors.repassword && (
                                                <p className="mt-1 text-[12px] text-red-600 dark:text-red-400">
                                                    {errors.repassword.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </section>

                                {/* Terms and Privacy Section */}
                                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <div className="flex items-start gap-3">
                                        <input
                                            type="checkbox"
                                            id="terms"
                                            className="mt-1 h-4 w-4 rounded border-gray-300 text-[#0077B6] focus:ring-[#0077B6]"
                                            {...register('terms', {
                                                required: 'You must accept the terms and conditions'
                                            })}
                                        />
                                        <div className="text-sm text-gray-600 dark:text-gray-300">
                                            <label htmlFor="terms" className="font-medium cursor-pointer">
                                                I agree to the{' '}
                                                <Link
                                                    href="/terms"
                                                    className="text-[#0077B6] dark:text-blue-400 hover:underline"
                                                    target="_blank"
                                                >
                                                    Terms of Service
                                                </Link>
                                                {' '}and{' '}
                                                <Link
                                                    href="/privacy"
                                                    className="text-[#0077B6] dark:text-blue-400 hover:underline"
                                                    target="_blank"
                                                >
                                                    Privacy Policy
                                                </Link>
                                            </label>
                                            {errors.terms && (
                                                <p className="mt-1 text-[12px] text-red-600 dark:text-red-400">
                                                    {errors.terms.message}
                                                </p>
                                            )}
                                            <p className="mt-1 text-[12px] text-gray-500 dark:text-gray-400">
                                                By creating an account, you agree to our terms and acknowledge that you have read our privacy policy.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <div className="text-center sm:text-left">
                                    <span className="text-gray-600 dark:text-gray-300 text-[13px]">
                                        Already have an account?{' '}
                                    </span>
                                    <Link
                                        href="/login"
                                        className="text-[#0077B6] dark:text-blue-400 hover:underline font-medium text-[13px]"
                                    >
                                        Back to Login
                                    </Link>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full justify-end">
                                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto justify-end">
                                        <button
                                            type="button"
                                            className="px-4 py-2.5 sm:px-6 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors w-full sm:w-auto text-sm sm:text-[13px] font-medium"
                                            onClick={() => {
                                                setSelectedCategories([]);
                                                setSelectedSubCategories([]);
                                                setSelectedServices([]);
                                                setBusinessTypeValue('');
                                            }}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2.5 sm:px-6 sm:py-2 bg-[#0077B6] hover:bg-[#016194] text-white font-medium rounded-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto text-sm sm:text-[13px]"
                                            disabled={isPending}
                                        >
                                            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                                            {isPending ? "Creating Account..." : "Create Account"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}