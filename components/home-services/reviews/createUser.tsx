"use client";

import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import { Loader2, X, Calendar, User, Phone } from "lucide-react";
import { useCreateReviewUser } from "@/hooks/useReviews";
import { z } from "zod";

type Props = {
    open: boolean;
    onClose: () => void;
    /* eslint-disable */
    onCreated: (userId?: string) => void;
    /* eslint-enable */
    defaultPhone?: string;
};

export const registerUserSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    phoneNo: z.string().min(1, "Phone number is required").regex(/^[0-9()+\-\s]+$/, "Invalid phone number"),
    dob: z.string().min(1, "Date of birth is required"),
    isAgreeTermsConditions: z.boolean(),
    status: z.boolean().optional(),
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;

export default function RegisterUserModal({ open, onClose, onCreated, defaultPhone }: Props) {
    const createUser = useCreateReviewUser();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNo, setPhoneNo] = useState(defaultPhone || "");
    const [dob, setDob] = useState("");
    const [isAgree, setIsAgree] = useState(true);
    const [errors, setErrors] = useState<Partial<Record<keyof RegisterUserInput, string>>>({});
    const formRef = useRef<HTMLFormElement | null>(null);

    if (!open) return null;

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const parsed = registerUserSchema.safeParse({
            firstName,
            lastName,
            phoneNo,
            dob,
            isAgreeTermsConditions: Boolean(isAgree),
            status: true,
        });

        if (!parsed.success) {
            const fieldErrors: Partial<Record<keyof RegisterUserInput, string>> = {};
            parsed.error.issues.forEach((issue: z.ZodIssue) => {
                const key = issue.path?.[0];
                if (typeof key === "string") {
                    (fieldErrors as any)[key] = issue.message;
                }
            });
            setErrors(fieldErrors);
            return;
        }

        setErrors({});

        try {
            const res = await createUser.mutateAsync(parsed.data as RegisterUserInput);
            const userId = res?.data?._id || res?.data?.user?._id || res?._id || res?.user?._id || res?.data?.id || res?.id;
            onCreated(userId);
            onClose();
        } catch {
            const message = "Failed to create user";
            toast.error(message);
        }
    };


    const handleInputFocus = (field: string) => {
        setErrors(prev => ({ ...prev, [field]: undefined }));
    };

    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm transition-all duration-300"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="relative w-full max-w-md z-10 animate-in fade-in-0 zoom-in-95 duration-300">
                <form
                    ref={formRef}
                    onSubmit={onSubmit}
                    className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-sm shadow-lg overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">Enter your details to continue</p>
                            </div>
                            <button
                                type="button"
                                onClick={onClose}
                                className="p-2 rounded-sm hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors group"
                            >
                                <X className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors" />
                            </button>
                        </div>
                    </div>

                    {/* Form Content */}
                    <div className="p-6 space-y-5">
                        {/* Name Fields in Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                                    <User className="w-4 h-4" />
                                    First Name *
                                </label>
                                <div className="relative">
                                    <input
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        onFocus={() => handleInputFocus('firstName')}
                                        placeholder="John"
                                        className={`w-full px-3 py-2 text-sm border ${errors.firstName ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-[#0077B6] focus:border-transparent dark:focus:ring-[#0077B6] dark:focus:border-transparent transition-colors`}
                                    />
                                </div>
                                {errors.firstName && (
                                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                                        {errors.firstName}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                                    <User className="w-4 h-4" />
                                    Last Name *
                                </label>
                                <div className="relative">
                                    <input
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        onFocus={() => handleInputFocus('lastName')}
                                        placeholder="Doe"
                                        className={`w-full px-3 py-2 text-sm border ${errors.lastName ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-[#0077B6] focus:border-transparent dark:focus:ring-[#0077B6] dark:focus:border-transparent transition-colors`}
                                    />
                                </div>
                                {errors.lastName && (
                                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                                        {errors.lastName}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Phone Number */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                                <Phone className="w-4 h-4" />
                                Phone Number *
                            </label>
                            <div className="relative">
                                <input
                                    value={phoneNo}
                                    onChange={(e) => setPhoneNo(e.target.value)}
                                    onFocus={() => handleInputFocus('phoneNo')}
                                    placeholder="+1 (555) 123-4567"
                                    className={`w-full px-3 py-2 text-sm border ${errors.phoneNo ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-[#0077B6] focus:border-transparent dark:focus:ring-[#0077B6] dark:focus:border-transparent transition-colors`}
                                />
                            </div>
                            {errors.phoneNo && (
                                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                                    {errors.phoneNo}
                                </p>
                            )}
                        </div>

                        {/* Date of Birth */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                                <Calendar className="w-4 h-4" />
                                Date of Birth *
                            </label>
                            <div className="relative">
                                <input
                                    value={dob}
                                    onChange={(e) => setDob(e.target.value)}
                                    onFocus={() => handleInputFocus('dob')}
                                    max={today}
                                    type="date"
                                    className={`w-full px-3 py-2 text-sm border ${errors.dob ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-[#0077B6] focus:border-transparent dark:focus:ring-[#0077B6] dark:focus:border-transparent transition-colors`}
                                />
                            </div>
                            {errors.dob && (
                                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                                    {errors.dob}
                                </p>
                            )}
                        </div>

                        {/* Terms & Conditions */}
                        <div className="pt-3">

                            {errors.isAgreeTermsConditions && (
                                <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                                    Please agree to the terms and conditions
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-start gap-3 p-3  dark:bg-gray-800/50 text-sm dark:border-gray-700 rounded-sm  dark:hover:bg-gray-800 transition-all duration-200 cursor-pointer">
                                <div className="relative mt-0.5">
                                    <input
                                        type="checkbox"
                                        id="terms"
                                        checked={isAgree}
                                        onChange={(e) => {
                                            setIsAgree(e.target.checked);
                                            setErrors((s) => ({ ...s, isAgreeTermsConditions: undefined }));
                                        }}
                                        className={`h-4 w-4 rounded border ${errors.isAgreeTermsConditions ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} text-[#0077B6] focus:ring-2 focus:ring-[#0077B6] bg-white dark:bg-gray-700 checked:bg-[#0077B6] checked:border-[#0077B6]`}
                                    />
                                </div>
                                <div className="flex-1">
                                    I agree to Terms & Conditions
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={createUser.status === 'pending'}
                                className="px-5 py-2.5 bg-[#0077B6] hover:bg-[#016194] dark:bg-[#0077B6] dark:hover:bg-[#016194] text-white text-sm font-medium rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 justify-center"
                            >
                                {createUser.status === 'pending' ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    " Continue"
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}