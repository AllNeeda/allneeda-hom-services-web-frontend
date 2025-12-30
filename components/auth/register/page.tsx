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
import { Loader2, Building2, User, MapPin, Shield, ChevronDown, Calendar, Mail, Key, Search, Home, Briefcase, Map, Globe2, UserCircle, PhoneCall, Lock, Check } from 'lucide-react';
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
} from '@/components/ui/command';
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
import OTPVerification from "./verification";
import { useSendOTP, useVerifyOTP, useCompleteRegistration, useCreateUser, OTPRegisterData } from "@/hooks/RegisterPro/useUserRegister";

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

type SignupStep = 'form' | 'otp';

export default function Register() {
    // State
    const [currentStep, setCurrentStep] = useState<SignupStep>('form');
    const [tempRegistrationData, setTempRegistrationData] = useState<OTPRegisterData | null>(null);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([]);
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [businessTypeValue, setBusinessTypeValue] = useState<string>('');

    // API data hooks
    const { data: categoriesData, isLoading: isLoadingCategories } = useCategoryServiceCount();
    const { data: subCategoriesData, isLoading: isLoadingSubCategories } = useSubcategoryServiceCount();
    const { data: servicesData, isLoading: isLoadingServices } = useServices();

    // OTP Hooks
    const sendOTPMutation = useSendOTP();
    const verifyOTPMutation = useVerifyOTP();
    const completeRegistrationMutation = useCompleteRegistration();
    const createUserMutation = useCreateUser();

    // Form Hook
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isValid },
        clearErrors,
        trigger,
    } = useForm({
        resolver: zodResolver(ProfessionalStepOne),
        mode: 'onChange',
        defaultValues: {
            firstName: '',
            lastName: '',
            dateOfBirth: '',
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
            phoneNo: '',
            terms: false,
        }
    });

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

    // Selection handlers
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

    // Step 1: Handle form submission and send OTP
    const handleFormSubmit = async (data: ProfessionalStepOneSchemaType) => {
        const isValidForm = await trigger();

        if (!isValidForm) {
            toast.error("Please fill in all required fields correctly");
            return;
        }

        // Store form data temporarily
        const registrationData: OTPRegisterData = {
            ...data,
            categories: selectedCategories,
            subCategories: selectedSubCategories,
            services_id: selectedServices
        };

        setTempRegistrationData(registrationData);

        // First create the external user (auth service)
        const createUserResult = await createUserMutation.mutateAsync({
            firstName: registrationData.firstName,
            lastName: registrationData.lastName,
            phoneNo: registrationData.phoneNo,
            dob: registrationData.dateOfBirth,
            isAgreeTermsConditions: registrationData.terms,
        });

        const createdUserId = createUserResult?.data?.id || createUserResult?.id || null;

        const registrationWithUserId = {
            ...registrationData,
            user_id: createdUserId || undefined,
            website: registrationData.website ?? "",
        };

        setTempRegistrationData(registrationWithUserId);

        // Then send OTP and move to OTP step
        await sendOTPMutation.mutateAsync({ phoneNo: data.phoneNo });
        setCurrentStep('otp');
    };

    // Step 2: Handle OTP verification
    const handleOTPVerify = async (otp: string) => {
        if (!tempRegistrationData) {
            toast.error("Registration data not found. Please start over.");
            return;
        }

        try {
            // Verify OTP first
            await verifyOTPMutation.mutateAsync({
                phoneNo: tempRegistrationData.phoneNo,
                otp,
            });

            // On success, send remaining professional data to internal API
            await completeRegistrationMutation.mutateAsync(tempRegistrationData);
        } catch {
            // Error handled by mutation
        }
    };

    // Step 2: Handle OTP resend
    const handleResendOTP = async () => {
        if (!tempRegistrationData) return;

        try {
            // resend OTP
            await sendOTPMutation.mutateAsync({ phoneNo: tempRegistrationData.phoneNo });
        } catch {
            // Error handled by mutation
        }
    };

    // Reset form
    const handleReset = () => {
        setSelectedCategories([]);
        setSelectedSubCategories([]);
        setSelectedServices([]);
        setBusinessTypeValue('');
        setValue('businessType', '');
        setValue('businessName', '');
        setValue('streetAddress', '');
        setValue('city', '');
        setValue('region', '');
        setValue('postalCode', '');
        setValue('website', '');
        setValue('firstName', '');
        setValue('lastName', '');
        setValue('dateOfBirth', '');
        setValue('username', '');
        setValue('email', '');
        setValue('phoneNo', '');
        setValue('terms', false);
        setCurrentStep('form');
        setTempRegistrationData(null);
    };

    const handleBackToForm = () => {
        setCurrentStep('form');
    };

    const isLoading = isLoadingCategories || isLoadingSubCategories || isLoadingServices;

    if (isLoading) {
        return <GlobalLoader />;
    }

    // Render OTP verification step
    if (currentStep === 'otp' && tempRegistrationData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
                <div className="w-full max-w-md">
                    <OTPVerification
                        phoneNo={tempRegistrationData.phoneNo}
                        onVerify={handleOTPVerify}
                        onResend={handleResendOTP}
                        onBack={handleBackToForm}
                        isLoading={verifyOTPMutation.isPending || completeRegistrationMutation.isPending}
                        isResending={sendOTPMutation.isPending}
                    />
                </div>
            </div>
        );
    }

    // Enhanced registration form with Nexus professional design
    return (
        <div className=" dark:bg-gray-900 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-1xl mx-auto"> {/* 60-80% width */}

                {/* Compact Header */}
                <div className="mb-8 text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-[#0077B6] rounded-sm flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-left">
                            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                                Allneeda Professional
                            </h1>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                Business Registration
                            </p>
                        </div>
                    </div>

                </div>

                {/* Main Form Card - Compact */}
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-sm shadow-sm">
                    <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6">

                        {/* Business Section - Compact */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                                <Briefcase className="w-4 h-4 text-[#0077B6]" />
                                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                                    Business Information
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Business Name with Icon */}
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                                        Business Name *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                            <Building2 className="w-4 h-4 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Your Business Name"
                                            className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-1 focus:ring-[#0077B6] focus:border-[#0077B6]"
                                            {...register('businessName')}
                                        />
                                    </div>
                                    {errors.businessName && (
                                        <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                                            {errors.businessName.message}
                                        </p>
                                    )}
                                </div>

                                {/* Business Type with Icon */}
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                                        Business Type *
                                    </label>
                                    <Select onValueChange={handleBusinessTypeChange} value={businessTypeValue}>
                                        <SelectTrigger className="w-full text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-sm py-2 pl-10">
                                            <div className="absolute left-3">
                                            </div>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-sm border border-gray-200 dark:border-gray-800">
                                            <SelectItem value="home-services" className="text-sm">Home Services</SelectItem>
                                            <SelectItem value="it-services" className="text-sm">IT Services</SelectItem>
                                            <SelectItem value="food-delivery" className="text-sm">Food Delivery</SelectItem>
                                            <SelectItem value="shopping" className="text-sm">Shopping</SelectItem>
                                            <SelectItem value="grocery" className="text-sm">Grocery</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.businessType && (
                                        <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                                            {errors.businessType.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Category Selection - Stacked */}
                            <div className="space-y-3">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    {/* Category */}
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                                            Category *
                                        </label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="w-full justify-between text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-sm py-2 h-auto"
                                                >
                                                    <div className="flex items-center">
                                                        <Search className="w-4 h-4 text-gray-400 mr-2" />
                                                        <span>{selectedCategories.length > 0 ? 'Selected' : 'Select'}</span>
                                                    </div>
                                                    <ChevronDown className="w-4 h-4" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[280px] p-0 rounded-sm border border-gray-200 dark:border-gray-800" align="start">
                                                <Command className="rounded-sm">
                                                    <CommandInput placeholder="Search..." className="text-sm h-9" />
                                                    <CommandList className="max-h-48">
                                                        {(categoriesData?.data?.data || []).map((category: Category) => (
                                                            <CommandItem
                                                                key={category._id}
                                                                onSelect={() => toggleCategory(category._id)}
                                                                className="cursor-pointer text-sm py-2 px-3"
                                                            >
                                                                <div className="flex items-center justify-between w-full">
                                                                    <span>{category.name}</span>
                                                                    {selectedCategories.includes(category._id) && (
                                                                        <Check className="w-4 h-4 text-green-500" />
                                                                    )}
                                                                </div>
                                                            </CommandItem>
                                                        ))}
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    {/* Sub-Category */}
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                                            Sub-Category *
                                        </label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="w-full justify-between text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-sm py-2 h-auto"
                                                    disabled={filteredSubCategories.length === 0}
                                                >
                                                    <div className="flex items-center">
                                                        <Search className="w-4 h-4 text-gray-400 mr-2" />
                                                        <span>{selectedSubCategories.length > 0 ? 'Selected' : filteredSubCategories.length === 0 ? 'N/A' : 'Select'}</span>
                                                    </div>
                                                    <ChevronDown className="w-4 h-4" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[280px] p-0 rounded-sm border border-gray-200 dark:border-gray-800" align="start">
                                                <Command className="rounded-sm">
                                                    <CommandInput placeholder="Search..." className="text-sm h-9" />
                                                    <CommandList className="max-h-48">
                                                        {filteredSubCategories.map((subCategory: SubCategory) => (
                                                            <CommandItem
                                                                key={subCategory._id}
                                                                onSelect={() => toggleSubCategory(subCategory._id)}
                                                                className="cursor-pointer text-sm py-2 px-3"
                                                            >
                                                                <div className="flex items-center justify-between w-full">
                                                                    <span>{subCategory.name}</span>
                                                                    {selectedSubCategories.includes(subCategory._id) && (
                                                                        <Check className="w-4 h-4 text-green-500" />
                                                                    )}
                                                                </div>
                                                            </CommandItem>
                                                        ))}
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    {/* Services */}
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                                            Services *
                                        </label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="w-full justify-between text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-sm py-2 h-auto"
                                                    disabled={filteredServices.length === 0}
                                                >
                                                    <div className="flex items-center">
                                                        <Search className="w-4 h-4 text-gray-400 mr-2" />
                                                        <span>{selectedServices.length > 0 ? `${selectedServices.length}` : filteredServices.length === 0 ? 'N/A' : 'Select'}</span>
                                                    </div>
                                                    <ChevronDown className="w-4 h-4" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[280px] p-0 rounded-sm border border-gray-200 dark:border-gray-800" align="start">
                                                <Command className="rounded-sm">
                                                    <CommandInput placeholder="Search..." className="text-sm h-9" />
                                                    <CommandList className="max-h-48">
                                                        {filteredServices.map((service: Service) => (
                                                            <CommandItem
                                                                key={service._id}
                                                                onSelect={() => toggleService(service._id)}
                                                                className="cursor-pointer text-sm py-2 px-3"
                                                            >
                                                                <div className="flex items-center justify-between w-full">
                                                                    <span>{service.name}</span>
                                                                    {selectedServices.includes(service._id) && (
                                                                        <Check className="w-4 h-4 text-green-500" />
                                                                    )}
                                                                </div>
                                                            </CommandItem>
                                                        ))}
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>

                                {/* Selected Badges - Compact */}
                                {(selectedCategories.length > 0 || selectedSubCategories.length > 0 || selectedServices.length > 0) && (
                                    <div className="flex flex-wrap gap-1.5 pt-2">
                                        {selectedCategories.map((id) => {
                                            const category = (categoriesData?.data?.data || []).find((c: Category) => c._id === id);
                                            return (
                                                <Badge key={id} variant="secondary" className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-sm px-2 py-0.5 text-xs">
                                                    {category?.name}
                                                </Badge>
                                            );
                                        })}
                                        {selectedSubCategories.map((id) => {
                                            const subCategory = filteredSubCategories.find((s: SubCategory) => s._id === id);
                                            return (
                                                <Badge key={id} variant="secondary" className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-sm px-2 py-0.5 text-xs">
                                                    {subCategory?.name}
                                                </Badge>
                                            );
                                        })}
                                        {selectedServices.map((id) => {
                                            const service = filteredServices.find((s: Service) => s._id === id);
                                            return (
                                                <Badge key={id} variant="secondary" className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-sm px-2 py-0.5 text-xs">
                                                    {service?.name}
                                                </Badge>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Address Section - Compact */}
                            <div className="pt-3 border-t border-gray-200 dark:border-gray-800">
                                <div className="flex items-center gap-2 mb-3">
                                    <MapPin className="w-4 h-4 text-[#0077B6]" />
                                    <h3 className="text-xs font-semibold text-gray-900 dark:text-white uppercase">
                                        Business Address
                                    </h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                                            Street Address *
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                                <Home className="w-4 h-4 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="123 Main St"
                                                className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-sm bg-white dark:bg-gray-800"
                                                {...register('streetAddress')}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                                            City *
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                                <Map className="w-4 h-4 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="New York"
                                                className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-sm bg-white dark:bg-gray-800"
                                                {...register('city')}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                                            State / ZIP *
                                        </label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder="NY"
                                                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-sm bg-white dark:bg-gray-800"
                                                    {...register('region')}
                                                />
                                            </div>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder="10001"
                                                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-sm bg-white dark:bg-gray-800"
                                                    {...register('postalCode')}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                                            Website
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                                <Globe2 className="w-4 h-4 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="yourbusiness.com"
                                                className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-sm bg-white dark:bg-gray-800"
                                                {...register('website')}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Personal Section - Compact */}
                        <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                            <div className="flex items-center gap-2 mb-3">
                                <UserCircle className="w-4 h-4 text-[#0077B6]" />
                                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                                    Personal Information
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {/* First Name with Icon */}
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                                        First Name *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                            <User className="w-4 h-4 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="John"
                                            className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-sm bg-white dark:bg-gray-800"
                                            {...register('firstName')}
                                        />
                                    </div>
                                </div>

                                {/* Last Name with Icon */}
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                                        Last Name *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                            <User className="w-4 h-4 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Doe"
                                            className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-sm bg-white dark:bg-gray-800"
                                            {...register('lastName')}
                                        />
                                    </div>
                                </div>

                                {/* Date of Birth with Icon */}
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                                        Date of Birth *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                        </div>
                                        <input
                                            type="date"
                                            className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-sm bg-white dark:bg-gray-800"
                                            {...register('dateOfBirth')}
                                        />
                                    </div>
                                </div>

                                {/* Username with Icon */}
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                                        Username *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                            <Key className="w-4 h-4 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="johndoe"
                                            className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-sm bg-white dark:bg-gray-800"
                                            {...register('username')}
                                        />
                                    </div>
                                </div>

                                {/* Email with Icon */}
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                                        Email (Optional)
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                            <Mail className="w-4 h-4 text-gray-400" />
                                        </div>
                                        <input
                                            type="email"
                                            placeholder="john@example.com"
                                            className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-sm bg-white dark:bg-gray-800"
                                            {...register('email')}
                                        />
                                    </div>
                                </div>

                                {/* Phone Number with Icon */}
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                                        Phone Number *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                            <PhoneCall className="w-4 h-4 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="+1 (555) 123-4567"
                                            className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-sm bg-white dark:bg-gray-800"
                                            {...register('phoneNo')}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        4-digit OTP will be sent
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Terms & Submit - Compact */}
                        <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                            <div className="space-y-4">
                                {/* Terms Checkbox */}
                                <div className="flex items-start gap-2">
                                    <input
                                        type="checkbox"
                                        id="terms"
                                        className="mt-0.5 h-4 w-4 rounded-sm border-gray-300 dark:border-gray-700 text-[#0077B6] focus:ring-1 focus:ring-[#0077B6]"
                                        {...register('terms')}
                                    />
                                    <label htmlFor="terms" className="text-xs text-gray-700 dark:text-gray-300">
                                        I agree to the{' '}
                                        <Link href="/terms" className="text-[#0077B6] dark:text-blue-400 hover:underline">
                                            Terms
                                        </Link>{' '}
                                        and{' '}
                                        <Link href="/privacy" className="text-[#0077B6] dark:text-blue-400 hover:underline">
                                            Privacy Policy
                                        </Link>
                                    </label>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="flex-1">
                                        <button
                                            type="button"
                                            className="w-full px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-700 rounded-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                            onClick={handleReset}
                                        >
                                            Reset All
                                        </button>
                                    </div>
                                    <div className="flex-1">
                                        <button
                                            type="submit"
                                            aria-busy={sendOTPMutation.isPending}
                                            disabled={sendOTPMutation.isPending || !isValid}
                                            className="w-full px-4 py-2.5 bg-[#0077B6] hover:bg-[#016194] text-white text-sm font-medium rounded-sm transition-colors
             disabled:opacity-50 disabled:cursor-not-allowed
             flex items-center justify-center gap-2"
                                        >
                                            {sendOTPMutation.isPending ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    <span>Sending OTP...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Lock className="w-4 h-4" />
                                                    <span>Continue</span>
                                                </>
                                            )}
                                        </button>

                                    </div>
                                </div>

                                {/* Login Link */}
                                <div className="text-center pt-2">
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                        Already registered?{' '}
                                        <Link
                                            href="/login"
                                            className="text-[#0077B6] dark:text-blue-400 font-medium hover:underline"
                                        >
                                            Sign in here
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Security Note - Compact */}
                <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-sm p-3">
                    <div className="flex items-start gap-2">
                        <Shield className="w-4 h-4 text-[#0077B6] mt-0.5 " />
                        <div>
                            <p className="text-xs text-gray-700 dark:text-gray-300">
                                <span className="font-medium">Secure registration:</span> You will receive a 4-digit OTP via SMS for verification. No password required.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}