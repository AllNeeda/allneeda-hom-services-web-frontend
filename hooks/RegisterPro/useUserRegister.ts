// hooks/RegisterPro/useOTPRegister.ts
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authAPI } from "@/app/api/auth/regiter";
import { getAccessToken } from "@/app/api/axios";

// Types
export interface OTPRegisterData {
  // Business Information
  businessName: string;
  businessType: string;
  categories: string[];
  subCategories: string[];
  services_id: string[];
  country: string;
  streetAddress: string;
  city: string;
  region: string;
  postalCode: string;
  website?: string;

  // Personal Information
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  username: string;
  email?: string;
  phoneNo: string;
  terms: boolean;
  // ID of the external user created by the auth service (set after createUser succeeds)
  user_id?: string;
}

export interface OTPResponse {
  success: boolean;
  message: string;
  data?: {
    expiresAt?: string;
    tempId?: string;
  };
}

// React Query Hooks
export function useSendOTP() {
  return useMutation({
    mutationFn: ({ phoneNo }: { phoneNo: string }) => authAPI.sendOTP(phoneNo),
    onSuccess: (response) => {
      toast.success("OTP sent successfully! Check your phone.");
      return response;
    },
  });
}

export function useCreateUser() {
  return useMutation({
    mutationFn: (data: {
      firstName: string;
      lastName: string;
      phoneNo: string;
      dob: string;
      isAgreeTermsConditions: boolean;
      role_id?: string;
      status?: boolean;
    }) => authAPI.createUser(data),
  });
}

export function useVerifyOTP() {
  return useMutation({
    mutationFn: (data: { phoneNo: string; otp: string }) =>
      authAPI.verifyOTP(data.phoneNo, data.otp),
    onSuccess: () => {
      toast.success("OTP verified successfully!");
    },
  });
}

export function useCompleteRegistration() {
  const router = useRouter();
  return useMutation({
    mutationFn: (data: OTPRegisterData) => {
      const token = getAccessToken() || "";
      return authAPI.completeRegistration(data, token);
    },
    onSuccess: (response) => {
      toast.success("Account created successfully!");
      router.push("/home-services/dashboard/services/step-2");
      return response;
    },
  });
}
