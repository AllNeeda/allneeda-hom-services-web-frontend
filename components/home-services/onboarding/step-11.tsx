"use client";

import React, { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { ProgressBar } from "./ProgressBar";

const ONBOARDING_STEPS = [
    { id: 1, name: 'Profile' },
    { id: 2, name: 'Reviews' },
    { id: 3, name: 'Preferences' },
    { id: 4, name: 'Location' },
    { id: 5, name: 'Payment' },
    { id: 6, name: 'Background' },
];

interface FormData {
    firstName: string;
    lastName: string;
    middleName: string;
    noMiddleName: boolean;
    dob: string;
    street: string;
    suite: string;
    city: string;
    state: string;
    zip: string;
    ssn: string;
    confirm: boolean;
}

export default function BackgroundCheckSelection() {
    const [currentStep] = useState(6);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    // Get service Id
    const params = useSearchParams()
    const serviceId = params.get('id')

    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        lastName: '',
        middleName: '',
        noMiddleName: false,
        dob: '',
        street: '',
        suite: '',
        city: '',
        state: '',
        zip: '',
        ssn: '',
        confirm: false,
    });

    const handleOptionChange = (option: string) => {
        setSelectedOption(option);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        if (serviceId) {
            setIsLoading(true)
            router.back()
        }

        router.push('/home-services/dashboard/services/complete');
        setIsLoading(false);
    };

    const handleNext = () => {
        if (!selectedOption) return;
        setIsLoading(true);

        setTimeout(() => {
            setShowForm(true);
            setIsLoading(false);
        }, 500);
    };

    const handleBack = () => {
        if (showForm) {
            setShowForm(false);
        } else {
            router.back();
        }
    };

    const options = [
        {
            id: "ssn",
            title: "Use your Social Security Number",
            description: "Get a background check using your SSN.",
        },
        {
            id: "id",
            title: "Don't have a Social Security Number?",
            description: "Upload a picture of your photo ID instead.",
        },
    ];

    return (
        <>
            {!serviceId && (
                <ProgressBar
                    currentStep={currentStep}
                    totalSteps={ONBOARDING_STEPS.length}
                    steps={ONBOARDING_STEPS}
                    className="mb-8"
                />
            )}
            <div className="dark:from-gray-900 dark:to-gray-950 flex items-center justify-center px-4 py-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full  dark:bg-gray-800 dark:border-gray-700 rounded-[6px] md:p-8"
                >
                    {showForm ? (
                        <form onSubmit={handleFormSubmit} className="space-y-4">
                            <div>
                                <h1 className="text-2xl font-bold text-[#023E8A] dark:text-white mb-1">
                                    Submit a free background check
                                </h1>
                                <p className="text-[13px] text-gray-600 dark:text-gray-400">
                                    Your information is kept confidential and private. Make sure everything is correct before submitting.
                                </p>
                            </div>

                            {/* First + Last Name */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        First name
                                    </label>
                                    <input
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Last name
                                    </label>
                                    <input
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>
                            </div>

                            {/* Middle Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Middle name (optional)
                                </label>
                                <input
                                    name="middleName"
                                    value={formData.middleName}
                                    onChange={handleChange}
                                    disabled={formData.noMiddleName}
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                                />
                                <label className="flex items-center mt-1 text-sm text-gray-700 dark:text-gray-400 select-none">
                                    <input
                                        type="checkbox"
                                        name="noMiddleName"
                                        checked={formData.noMiddleName}
                                        onChange={handleChange}
                                        className="mr-2"
                                    />
                                    I confirm I do not have a middle name
                                </label>
                            </div>

                            {/* DOB */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Date of Birth
                                </label>
                                <input
                                    name="dob"
                                    value={formData.dob}
                                    onChange={handleChange}
                                    required
                                    type="date"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                            </div>

                            {/* Street Address */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Street address
                                </label>
                                <input
                                    name="street"
                                    value={formData.street}
                                    onChange={handleChange}
                                    required
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                            </div>

                            {/* Apt / City / State */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Apt / Suite
                                    </label>
                                    <input
                                        name="suite"
                                        value={formData.suite}
                                        onChange={handleChange}
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        City
                                    </label>
                                    <input
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        required
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        State
                                    </label>
                                    <select
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    >
                                        <option value="">Select</option>
                                        {['VA', 'CA', 'NY', 'TX', 'FL', 'IL', 'WA', 'AZ', 'MI'].map((state) => (
                                            <option key={state} value={state}>{state}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* ZIP */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    ZIP Code
                                </label>
                                <input
                                    name="zip"
                                    value={formData.zip}
                                    onChange={handleChange}
                                    required
                                    type="text"
                                    pattern="\d{5}"
                                    title="5-digit ZIP code"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                            </div>

                            {/* SSN - Only shown when SSN option is selected */}
                            {selectedOption === "ssn" && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Social Security Number
                                    </label>
                                    <input
                                        name="ssn"
                                        value={formData.ssn}
                                        onChange={handleChange}
                                        required={selectedOption === "ssn"}
                                        type="text"
                                        pattern="\d{3}-\d{2}-\d{4}"
                                        title="Format: 123-45-6789"
                                        placeholder="123-45-6789"
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>
                            )}



                            {/* Confirmation */}
                            <div className="mb-8 flex items-start gap-2 text-sm">
                                <input
                                    name="confirm"
                                    checked={formData.confirm}
                                    onChange={handleChange}
                                    required
                                    type="checkbox"
                                    className="mt-1"
                                />
                                <label htmlFor="confirm" className="text-gray-700 dark:text-gray-300 select-none">
                                    By checking this box, I authorize a background check and agree to the{' '}
                                    <a href="#" className="underline">Disclosures</a>,{' '}
                                    <a href="#" className="underline">Privacy Policy</a>,{' '}
                                    <a href="#" className="underline">CA Notice at Collection</a>, and{' '}
                                    <a href="#" className="underline">Do Not Sell or Share My Personal Information</a>.
                                </label>
                            </div>

                            <div className="flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white text-[13px] py-2 px-5"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`
                                        text-white text-[13px] py-2 px-6
                                        transition duration-300 flex items-center justify-center gap-2
                                        ${isLoading ? 'bg-[#0077B6]/70 cursor-not-allowed' : 'bg-[#0077B6] hover:bg-[#005f8e]'}
                                    `}
                                >
                                    {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                                    <span>Next</span>
                                </button>
                            </div>
                        </form>
                    ) : (
                        <>
                            <h1 className="text-2xl font-bold text-[#023E8A] dark:text-white mb-3">
                                Get a free background check
                            </h1>
                            <p className="text-[13px] text-gray-600 dark:text-gray-300 mb-8">
                                This is required to join Thumbtack. It is free, we not affect your credit,
                                and builds trust with customers.
                            </p>

                            <div className="space-y-5">
                                {options.map((option) => (
                                    <motion.div
                                        key={option.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        whileHover={{ scale: 1.015 }}
                                        transition={{ duration: 0.25 }}
                                        onClick={() => handleOptionChange(option.id)}
                                        className={`relative cursor-pointer border rounded-[6px] px-6 py-5 group transition-colors duration-300 flex items-start gap-4 ${selectedOption === option.id
                                            ? "bg-[#E0F4FF] dark:bg-[#1e3a50] border-[#0096C7]"
                                            : "border-gray-300 dark:border-gray-600 hover:border-[#0096C7]/50"
                                            }`}
                                    >
                                        <div
                                            className={`w-6 h-6 mt-1 flex items-center justify-center rounded-full border transition-colors duration-300 ${selectedOption === option.id
                                                ? "bg-[#0096C7] border-[#0096C7]"
                                                : "border-gray-400 dark:border-gray-500"
                                                }`}
                                        >
                                            <AnimatePresence>
                                                {selectedOption === option.id && (
                                                    <motion.div
                                                        initial={{ scale: 0.6, opacity: 0 }}
                                                        animate={{ scale: 1, opacity: 1 }}
                                                        exit={{ scale: 0.6, opacity: 0 }}
                                                        transition={{ duration: 0.25 }}
                                                    >
                                                        <Check className="w-4 h-4 text-white" />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        <div>
                                            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                                                {option.title}
                                            </h3>
                                            <p className="text-[13px] text-gray-500 dark:text-gray-300 mt-1">
                                                {option.description}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </>
                    )}
                </motion.div>

                {/* Navigation Buttons (only shown in selection mode) */}
                {!showForm && (
                    <div className="fixed bottom-6 right-6 flex gap-4 text-[13px]">
                        <button
                            onClick={handleBack}
                            type="button"
                            className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white py-2 px-5"
                        >
                            Back
                        </button>
                        <button
                            type="button"
                            disabled={isLoading || !selectedOption}
                            onClick={handleNext}
                            className={`
                                text-white py-2 px-6
                                transition duration-300 flex items-center justify-center gap-2
                                ${isLoading
                                    ? 'bg-[#0077B6]/70 cursor-not-allowed'
                                    : !selectedOption
                                        ? 'bg-[#0077B6]/50 cursor-not-allowed'
                                        : 'bg-[#0077B6] hover:bg-[#005f8e]'
                                }
                            `}
                        >
                            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                            <span>Next</span>
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}