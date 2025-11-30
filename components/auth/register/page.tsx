'use client'
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Command, CommandInput, CommandItem, CommandList, CommandEmpty } from '@/components/ui/command';
import { useRegister } from '@/hooks/RegisterPro/useRegister';
import { ProfessionalStepOne, ProfessionalStepOneSchemaType } from '@/schemas/professional/professional';
import { toast } from 'sonner'; // or your toast library

const CategoriesData = [
    { id: '1', name: 'Construction' },
    { id: '2', name: 'Electrical' },
];

const subCategoriesData = [
    { id: '1', name: 'Plumbing', categoryId: '1' },
    { id: '2', name: 'Carpentry', categoryId: '1' },
    { id: '3', name: 'Wiring', categoryId: '2' },
    { id: '4', name: 'Appliance Repair', categoryId: '2' },
];

const servicesData = [
    { id: '68eaad6c73f142e5115639ed', name: 'Leak Fixing', subCategoryId: '1' },
    { id: '68eaae2a73f142e5115639f0', name: 'Furniture Assembly', subCategoryId: '1' },
    { id: '68e6876ce5690430fb1cf2e3', name: 'Wiring Repair', subCategoryId: '3' },
    { id: '68e6876ce5690430fb1cf2e4', name: 'Fan Installation', subCategoryId: '3' },
    { id: '68e6876ce5690430fb1cf20', name: 'Furniture Repair', subCategoryId: '2' },
    { id: '68e6876ce5690430fb1cf21', name: 'Door Installation', subCategoryId: '2' },
];

export default function Register() {
    const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [countryValue, setCountryValue] = useState<string>('');
    const [businessTypeValue, setBusinessTypeValue] = useState<string>('');
    const [formErrors, setFormErrors] = useState<{
        categories?: string;
        subCategories?: string;
        services?: string;
        country?: string;
        businessType?: string;
        passwordMatch?: string;
    }>({});
    const [hasSubmitted, setHasSubmitted] = useState(false);

    const { registerUser, isPending } = useRegister();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
        trigger,
        clearErrors,
    } = useForm<ProfessionalStepOneSchemaType>({
        resolver: zodResolver(ProfessionalStepOne),
        mode: 'onChange',
        defaultValues: {
            categories: [],
            subCategories: [],
            services_id: [],
            country: '',
            businessType: '',
            username: '',
            website: '',
            streetAddress: '',
            city: '',
            region: '',
            postalCode: '',
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            password: '',
            repassword: '',
        }
    });

    const password = watch('password');
    const repassword = watch('repassword');

    useEffect(() => {
        setValue('categories', selectedCategories, { shouldValidate: hasSubmitted });
        if (selectedCategories.length > 0) {
            setFormErrors(prev => ({ ...prev, categories: undefined }));
            clearErrors('categories');
        }
    }, [selectedCategories, setValue, hasSubmitted, clearErrors]);

    useEffect(() => {
        setValue('subCategories', selectedSubCategories, { shouldValidate: hasSubmitted });
        if (selectedSubCategories.length > 0) {
            setFormErrors(prev => ({ ...prev, subCategories: undefined }));
            clearErrors('subCategories');
        }
    }, [selectedSubCategories, setValue, hasSubmitted, clearErrors]);

    useEffect(() => {
        setValue('services_id', selectedServices, { shouldValidate: hasSubmitted });
        if (selectedServices.length > 0) {
            setFormErrors(prev => ({ ...prev, services: undefined }));
            clearErrors('services_id');
        }
    }, [selectedServices, setValue, hasSubmitted, clearErrors]);

    useEffect(() => {
        if (countryValue) {
            setValue('country', countryValue, { shouldValidate: hasSubmitted });
            setFormErrors(prev => ({ ...prev, country: undefined }));
            clearErrors('country');
        }
    }, [countryValue, setValue, hasSubmitted, clearErrors]);

    useEffect(() => {
        if (businessTypeValue) {
            setValue('businessType', businessTypeValue, { shouldValidate: hasSubmitted });
            setFormErrors(prev => ({ ...prev, businessType: undefined }));
            clearErrors('businessType');
        }
    }, [businessTypeValue, setValue, hasSubmitted, clearErrors]);

    // Clear password match error when passwords match
    useEffect(() => {
        if (password && repassword && password === repassword) {
            setFormErrors(prev => ({ ...prev, passwordMatch: undefined }));
        }
    }, [password, repassword]);

    const toggleCategory = (id: string) => {
        setSelectedCategories(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [id]
        );
        setSelectedSubCategories([]);
        setSelectedServices([]);
        setFormErrors(prev => ({ ...prev, categories: undefined }));
        clearErrors('categories');
    };

    const toggleSubCategory = (id: string) => {
        setSelectedSubCategories(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [id]
        );
        setSelectedServices([]);
        setFormErrors(prev => ({ ...prev, subCategories: undefined }));
        clearErrors('subCategories');
    };

    const toggleService = (id: string) => {
        setSelectedServices(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
        setFormErrors(prev => ({ ...prev, services: undefined }));
        clearErrors('services_id');
    };

    const handleCountryChange = (value: string) => {
        setCountryValue(value);
        setValue('country', value, { shouldValidate: hasSubmitted });
        setFormErrors(prev => ({ ...prev, country: undefined }));
        clearErrors('country');
    };

    const handleBusinessTypeChange = (value: string) => {
        setBusinessTypeValue(value);
        setValue('businessType', value, { shouldValidate: hasSubmitted });
        setFormErrors(prev => ({ ...prev, businessType: undefined }));
        clearErrors('businessType');
    };

    const filteredSubCategories = subCategoriesData.filter(sub =>
        selectedCategories.includes(sub.categoryId)
    );

    const filteredServices = servicesData.filter(s =>
        selectedSubCategories.includes(s.subCategoryId)
    );

    const validateAllFields = React.useCallback(async () => {
        const errors: typeof formErrors = {};

        // Check password match
        if (password !== repassword) {
            errors.passwordMatch = "Passwords do not match";
        }

        // Check required selections only after submission attempt
        if (hasSubmitted) {
            if (selectedCategories.length === 0) {
                errors.categories = "Please select at least one category";
            }
            if (selectedSubCategories.length === 0) {
                errors.subCategories = "Please select at least one sub-category";
            }
            if (selectedServices.length === 0) {
                errors.services = "Please select at least one service";
            }
            if (!countryValue) {
                errors.country = "Please select a country";
            }
            if (!businessTypeValue) {
                errors.businessType = "Please select a business type";
            }
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    }, [password, repassword, selectedCategories, selectedSubCategories, selectedServices, countryValue, businessTypeValue, hasSubmitted]);

    // Validate on relevant changes
    useEffect(() => {
        if (hasSubmitted) {
            validateAllFields();
        }
    }, [password, repassword, selectedCategories, selectedSubCategories, selectedServices, countryValue, businessTypeValue, hasSubmitted, validateAllFields]);

    const validateFormData = (data: ProfessionalStepOneSchemaType) => {
        const errors = [];

        if (data.categories.length === 0) errors.push("At least one category is required");
        if (data.subCategories.length === 0) errors.push("At least one sub-category is required");
        if (data.services_id.length === 0) errors.push("At least one service is required");
        if (!data.country) errors.push("Country is required");
        if (!data.businessType) errors.push("Business type is required");
        if (data.password !== data.repassword) errors.push("Passwords do not match");

        return errors;
    };
    const onSubmit = async (data: ProfessionalStepOneSchemaType) => {
        setHasSubmitted(true);
        if (isPending) {
            toast.error("Please wait while we process your registration");
            return;
        }

        // Trigger form validation first
        const isValid = await trigger();
        const customValidationValid = await validateAllFields();
        const formValidationErrors = validateFormData(data);

        if (!isValid || !customValidationValid || formValidationErrors.length > 0) {
            if (formValidationErrors.length > 0) {
                toast.error(formValidationErrors[0]);
            }
            return;
        }

        const submitData = {
            ...data,
            categories: selectedCategories,
            subCategories: selectedSubCategories,
            services_id: selectedServices
        };
        await registerUser(submitData);
    };

    const ErrorMessage = ({ message }: { message?: string }) => {
        if (!message) return null;
        return (
            <p className="mt-1 text-sm text-[12px] text-red-600 dark:text-red-400">
                {message}
            </p>
        );
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md shadow-md p-12 space-y-8 divide-y divide-gray-200 dark:divide-gray-700">
                <div className="space-y-8">
                    <div className="border-b border-gray-900/10 dark:border-gray-700 pb-6">
                        <h2 className="text-base/7 font-semibold text-gray-900 dark:text-white">Business Information:</h2>
                        <p className="mt-1 text-sm/6 text-gray-600 dark:text-gray-300">
                            This information will be displayed publicly so be careful what you share.
                        </p>

                        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
                            {/* Business Name */}
                            <div className="sm:col-span-3">
                                <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900 dark:text-white">Business Name:</label>
                                <div className="mt-1.5">
                                    <input
                                        id="username"
                                        type="text"
                                        className="block w-full text-[13px] rounded-[4px] bg-white dark:bg-gray-900 px-3 py-2 text-gray-900 dark:text-white outline-1 outline-gray-300 dark:outline-gray-600 focus:outline-1 focus:outline-[#0077B6]"
                                        {...register('username')}
                                    />
                                    <ErrorMessage message={errors.username?.message} />
                                </div>
                            </div>

                            {/* Business Type */}
                            <div className="sm:col-span-3">
                                <label htmlFor="businessType" className="block text-sm/6 font-medium text-gray-900 dark:text-white">Business Type</label>
                                <div className="mt-1.5">
                                    <Select onValueChange={handleBusinessTypeChange} value={businessTypeValue}>
                                        <SelectTrigger className="w-full text-[13px] bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="home-services">Home Services</SelectItem>
                                            <SelectItem value="it-services">IT Services</SelectItem>
                                            <SelectItem value="food-delivery">Food Delivery</SelectItem>
                                            <SelectItem value="shopping">Shopping</SelectItem>
                                            <SelectItem value="grocery">Grocery</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <ErrorMessage message={formErrors.businessType} />
                                    <ErrorMessage message={errors.businessType?.message} />
                                </div>
                            </div>

                            {/* Category Selection */}
                            <div className="sm:col-span-3">
                                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">
                                    Select Category
                                </label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full text-[13px] bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white justify-start"
                                        >
                                            {selectedCategories.length > 0
                                                ? `${selectedCategories.length} selected`
                                                : 'Select Category'}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[100%] p-0">
                                        <Command>
                                            <CommandInput className='rounded-[4px]' placeholder="Search Categories..." />
                                            <CommandEmpty>No category found.</CommandEmpty>
                                            <CommandList>
                                                {CategoriesData.map((item) => (
                                                    <CommandItem key={item.id} onSelect={() => toggleCategory(item.id)}>
                                                        <div className="flex justify-between w-full text-sm">
                                                            <span>{item.name}</span>
                                                            {selectedCategories.includes(item.id) && <span>✓</span>}
                                                        </div>
                                                    </CommandItem>
                                                ))}
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {selectedCategories.map((id) => {
                                        const name = CategoriesData.find((c) => c.id === id)?.name;
                                        return (
                                            <Badge key={id} className="bg-[#0077B6] rounded-[2px] text-white hover:bg-[#0077B6]">
                                                {name}
                                            </Badge>
                                        );
                                    })}
                                </div>
                                <ErrorMessage message={formErrors.categories} />
                                <ErrorMessage message={errors.categories?.message} />
                            </div>

                            {/* Sub-Categories */}
                            <div className="sm:col-span-3">
                                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">
                                    Select Sub-Categories
                                </label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full text-[13px] bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white justify-start"
                                            disabled={filteredSubCategories.length === 0}
                                        >
                                            {selectedSubCategories.length > 0
                                                ? `${selectedSubCategories.length} selected`
                                                : filteredSubCategories.length === 0 ? 'No sub-categories available' : 'Select sub-categories'}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[100%] p-0">
                                        <Command>
                                            <CommandInput className='rounded-[4px]' placeholder="Search sub-categories..." />
                                            <CommandEmpty>No sub-category found.</CommandEmpty>
                                            <CommandList>
                                                {filteredSubCategories.map((item) => (
                                                    <CommandItem key={item.id} onSelect={() => toggleSubCategory(item.id)}>
                                                        <div className="flex justify-between w-full text-sm">
                                                            <span>{item.name}</span>
                                                            {selectedSubCategories.includes(item.id) && <span>✓</span>}
                                                        </div>
                                                    </CommandItem>
                                                ))}
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {selectedSubCategories.map((id) => {
                                        const name = subCategoriesData.find((s) => s.id === id)?.name;
                                        return (
                                            <Badge key={id} className="bg-[#0077B6] rounded-[2px] text-white hover:bg-[#0077B6]">
                                                {name}
                                            </Badge>
                                        );
                                    })}
                                </div>
                                <ErrorMessage message={formErrors.subCategories} />
                                <ErrorMessage message={errors.subCategories?.message} />
                            </div>

                            {/* Services */}
                            <div className="sm:col-span-3">
                                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">
                                    Select Services
                                </label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full text-[13px] bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white justify-start"
                                            disabled={filteredServices.length === 0}
                                        >
                                            {selectedServices.length > 0
                                                ? `${selectedServices.length} selected`
                                                : filteredServices.length === 0 ? 'No services available' : 'Select services'}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[100%] p-0">
                                        <Command>
                                            <CommandInput placeholder="Search services..." />
                                            <CommandEmpty>No service found.</CommandEmpty>
                                            <CommandList>
                                                {filteredServices.map((item) => (
                                                    <CommandItem key={item.id} onSelect={() => toggleService(item.id)}>
                                                        <div className="flex justify-between w-full text-sm">
                                                            <span>{item.name}</span>
                                                            {selectedServices.includes(item.id) && <span>✓</span>}
                                                        </div>
                                                    </CommandItem>
                                                ))}
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {selectedServices.map((id) => {
                                        const name = servicesData.find((s) => s.id === id)?.name;
                                        return (
                                            <Badge key={id} className="bg-[#0077B6] rounded-[2px] text-white hover:bg-[#0077B6]">
                                                {name}
                                            </Badge>
                                        );
                                    })}
                                </div>
                                <ErrorMessage message={formErrors.services} />
                                <ErrorMessage message={errors.services_id?.message} />
                            </div>

                            {/* Country */}
                            <div className="sm:col-span-3">
                                <label htmlFor="country" className="block text-sm/6 font-medium text-gray-900 dark:text-white">Country</label>
                                <div className="mt-1.5">
                                    <Select onValueChange={handleCountryChange} value={countryValue}>
                                        <SelectTrigger className="w-full text-[13px] bg-white dark:bg-gray-900 rounded-[4px] border-gray-300 py-2 dark:border-gray-600 text-gray-900 dark:text-white">
                                            <SelectValue placeholder="Select country" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="United States">United States</SelectItem>
                                            <SelectItem value="Canada">Canada</SelectItem>
                                            <SelectItem value="Others">Others</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <ErrorMessage message={formErrors.country} />
                                    <ErrorMessage message={errors.country?.message} />
                                </div>
                            </div>

                            {/* Street Address */}
                            <div className="sm:col-span-full">
                                <label htmlFor="streetAddress" className="block text-sm/6 font-medium text-gray-900 dark:text-white">Street address</label>
                                <div className="mt-1.5">
                                    <input
                                        id="streetAddress"
                                        type="text"
                                        className="block w-full text-[13px] rounded-[4px] bg-white dark:bg-gray-900 px-3 py-2 text-gray-900 dark:text-white outline-1 outline-gray-300 dark:outline-gray-600 focus:outline-1 focus:outline-[#1ba0e7]"
                                        {...register('streetAddress')}
                                    />
                                    <ErrorMessage message={errors.streetAddress?.message} />
                                </div>
                            </div>

                            {/* City */}
                            <div className="sm:col-span-2 sm:col-start-1">
                                <label htmlFor="city" className="block text-sm/6 font-medium text-gray-900 dark:text-white">City</label>
                                <div className="mt-1.5">
                                    <input
                                        id="city"
                                        type="text"
                                        className="block w-full text-[13px] rounded-[4px] bg-white dark:bg-gray-900 px-3 py-2 text-gray-900 dark:text-white outline-1 outline-gray-300 dark:outline-gray-600 focus:outline-1 focus:outline-[#0077B6]"
                                        {...register('city')}
                                    />
                                    <ErrorMessage message={errors.city?.message} />
                                </div>
                            </div>

                            {/* State */}
                            <div className="sm:col-span-2">
                                <label htmlFor="region" className="block text-sm/6 font-medium text-gray-900 dark:text-white">State / Province</label>
                                <div className="mt-1.5">
                                    <input
                                        id="region"
                                        type="text"
                                        className="block w-full text-[13px] rounded-[4px] bg-white dark:bg-gray-900 px-3 py-2 text-gray-900 dark:text-white outline-1 outline-gray-300 dark:outline-gray-600 focus:outline-1 focus:outline-[#0077B6]"
                                        {...register('region')}
                                    />
                                    <ErrorMessage message={errors.region?.message} />
                                </div>
                            </div>

                            {/* ZIP */}
                            <div className="sm:col-span-2">
                                <label htmlFor="postalCode" className="block text-sm/6 font-medium text-gray-900 dark:text-white">ZIP / Postal code</label>
                                <div className="mt-1.5">
                                    <input
                                        id="postalCode"
                                        type="text"
                                        className="block w-full text-[13px] rounded-[4px] bg-white dark:bg-gray-900 px-3 py-2 text-gray-900 dark:text-white outline-1 outline-gray-300 dark:outline-gray-600 focus:outline-1 focus:outline-[#0077B6]"
                                        {...register('postalCode')}
                                    />
                                    <ErrorMessage message={errors.postalCode?.message} />
                                </div>
                            </div>

                            {/* Website */}
                            <div className="col-span-full">
                                <label htmlFor="website" className="block text-sm/6 font-medium text-gray-900 dark:text-white">Website or Social Media</label>
                                <div className="mt-1.5">
                                    <input
                                        id="website"
                                        type="text"
                                        className="block w-full text-[13px] rounded-[4px] bg-white dark:bg-gray-900 px-3 py-2 text-gray-900 dark:text-white outline-1 outline-gray-300 dark:outline-gray-600 focus:outline-1 focus:outline-[#0077B6]"
                                        {...register('website')}

                                    />
                                </div>
                            </div>
                        </div>

                        {/* Personal Info */}
                        <h2 className="text-base/7 font-semibold text-gray-900 dark:text-white mt-4">Personal Information</h2>
                        <p className="mt-1 text-sm/6 text-gray-600 dark:text-gray-300">Please enter your personal details and contact information!</p>

                        <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
                            <div className="sm:col-span-3">
                                <label htmlFor="firstName" className="block text-sm/6 font-medium text-gray-900 dark:text-white">First name</label>
                                <div className="mt-1.5">
                                    <input
                                        id="firstName"
                                        type="text"
                                        className="block w-full text-[13px] rounded-[4px] bg-white dark:bg-gray-900 px-3 py-2 text-gray-900 dark:text-white outline-1 outline-gray-300 dark:outline-gray-600 focus:outline-1 focus:outline-[#0077B6]"
                                        {...register('firstName')}
                                    />
                                    <ErrorMessage message={errors.firstName?.message} />
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="lastName" className="block text-sm/6 font-medium text-gray-900 dark:text-white">Last name</label>
                                <div className="mt-1.5">
                                    <input
                                        id="lastName"
                                        type="text"
                                        className="block w-full text-[13px] rounded-[4px] bg-white dark:bg-gray-900 px-3 py-2 text-gray-900 dark:text-white outline-1 outline-gray-300 dark:outline-gray-600 focus:outline-1 focus:outline-[#0077B6]"
                                        {...register('lastName')}
                                    />
                                    <ErrorMessage message={errors.lastName?.message} />
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900 dark:text-white">Email Address</label>
                                <div className="mt-1.5">
                                    <input
                                        id="email"
                                        type="email"
                                        className="block w-full text-[13px] rounded-[4px] bg-white dark:bg-gray-900 px-3 py-2 text-gray-900 dark:text-white outline-1 outline-gray-300 dark:outline-gray-600 focus:outline-1 focus:outline-[#0077B6]"
                                        {...register('email')}
                                    />
                                    <ErrorMessage message={errors.email?.message} />
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="phone" className="block text-sm/6 font-medium text-gray-900 dark:text-white">Phone Number</label>
                                <div className="mt-1.5">
                                    <input
                                        id="phone"
                                        type="text"
                                        className="block w-full text-[13px] rounded-[4px] bg-white dark:bg-gray-900 px-3 py-2 text-gray-900 dark:text-white outline-1 outline-gray-300 dark:outline-gray-600 focus:outline-1 focus:outline-[#0077B6]"
                                        {...register('phone')}
                                    />
                                    <ErrorMessage message={errors.phone?.message} />
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900 dark:text-white">Password</label>
                                <div className="mt-1.5">
                                    <input
                                        id="password"
                                        type="password"
                                        className="block w-full text-[13px] rounded-[4px] bg-white dark:bg-gray-900 px-3 py-2 text-gray-900 dark:text-white outline-1 outline-gray-300 dark:outline-gray-600 focus:outline-1 focus:outline-[#0077B6]"
                                        {...register('password')}
                                    />
                                    <ErrorMessage message={errors.password?.message} />
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="repassword" className="block text-sm/6 font-medium text-gray-900 dark:text-white">Re-Enter Password</label>
                                <div className="mt-1.5">
                                    <input
                                        id="repassword"
                                        type="password"
                                        className="block w-full text-[13px] rounded-[4px] bg-white dark:bg-gray-900 px-3 py-2 text-gray-900 dark:text-white outline-1 outline-gray-300 dark:outline-gray-600 focus:outline-1 focus:outline-[#0077B6]"
                                        {...register('repassword')}
                                    />
                                    <ErrorMessage message={errors.repassword?.message} />
                                    <ErrorMessage message={formErrors.passwordMatch} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button type="button" className="text-sm/6 font-semibold text-gray-900 dark:text-white">Cancel</button>
                    <button
                        type="submit"
                        className="inline-flex items-center gap-2 rounded-[4px] bg-[#0077B6] px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-[#35a5e1] focus-visible:outline-1 focus-visible:outline-[#0077B6] focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        disabled={isPending}
                    >
                        {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                        {isPending ? "Creating Account..." : "Sign Up"}
                    </button>
                </div>
            </form>
        </>
    )
}