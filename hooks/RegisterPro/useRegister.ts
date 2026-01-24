import { useRouter } from "next/navigation";
import { OTPRegisterData } from "@/types/auth/register";
import {
  AnswerPayload,
  BusinesAvailabilityAPI,
  BusinessAvailabilityPayload,
  BusinessInfoPayload,
  getProServicesQuestionsAPI,
  LocationData,
  ProfessionalProgressAPI,
  saveBusinessInfoAPI,
  saveLocationAPI,
  submitServiceAnswersAPI,
  UpdateBusinessName,
} from "@/app/api/services/ProAccount";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {} from "@/components/home-services/onboarding/step-4";
import { getProfessionalStepsAPI } from "@/app/api/services/services";
import { authAPI } from "@/app/api/auth/register";
import { getAccessToken } from "@/app/api/axios";
import { safeProfessionalRedirect } from "@/lib/redirectProfessional";

// 1️⃣ Send OTP
export function useSendOTP() {
  return useMutation({
    mutationFn: ({ phoneNo }: { phoneNo: string }) => authAPI.sendOTP(phoneNo),
    onSuccess: () => {
      toast.success("OTP sent successfully! Check your phone.");
    },
  });
}

// 2️⃣ Create User
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
    onSuccess: (response: any) => {
      return response;
    },
  });
}

// 3️⃣ Verify OTP
export function useVerifyOTP() {
  return useMutation({
    mutationFn: (data: { phoneNo: string; otp: string }) =>
      authAPI.verifyOTP(data.phoneNo, data.otp),
    onSuccess: (response: any) => {
      toast.success("OTP verified successfully!");
      return response;
    },
  });
}

// 4️⃣ Complete Registration
export function useCompleteRegistration() {
  const router = useRouter();
  const token = getAccessToken();

  return useMutation({
    mutationFn: (data: OTPRegisterData) =>
      authAPI.completeRegistration(data, token!),
    onSuccess: (response: any) => {
      router.push("/home-services/dashboard/services/step-2");
      return response;
    },
  });
}

// Create Professional Account - Step 03
export function useUpdateBusinessName(token: string) {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["UpdateBusinessName"],
    mutationFn: (data: { businessName: string; id: string }) =>
      UpdateBusinessName(data, token),
    onSuccess: async() => {
      queryClient.invalidateQueries({
        queryKey: ["professionalReview"],
      });

      await safeProfessionalRedirect(token, router);
    },
  });
}
// End of Create Professional Account - Step 03

// Craete Prof Account Business Info - Step 04
export function useBusinessInfo(token: string) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["BusinessInfo"],
    mutationFn: (data: BusinessInfoPayload) => saveBusinessInfoAPI(data, token),
    onSuccess: async() => {
      queryClient.invalidateQueries({
        queryKey: ["professionalReview"],
      });
      router.push("/home-services/dashboard/services/step-5");

    },
  });
}

export function useBusinesAvailability(token: string) {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationKey: ["BusinesAvailability"],
    mutationFn: (data: BusinessAvailabilityPayload) =>
      BusinesAvailabilityAPI(data, token),
    onSuccess: async() => {
      await safeProfessionalRedirect(token, router);
      queryClient.invalidateQueries({
        queryKey: ["professionalReview"],
      });
    },
  });
}

// Get Professional Services Question - Step 08
export function useProServicesQuestions(token: string) {
  return useQuery({
    queryKey: ["getProServicesQuestions", token],
    queryFn: () => getProServicesQuestionsAPI(token),
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
  });
}

// Create Professional Account 08
export const useSubmitServiceAnswers = (token: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationKey: ["submitServiceAnswers"],
    mutationFn: (data: AnswerPayload[]) => submitServiceAnswersAPI(data, token),
    onSuccess: async() => {
      queryClient.invalidateQueries({
        queryKey: ["professionalReview"],
      });
      await safeProfessionalRedirect(token, router);
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to save service answers"
      );
    },
    retry: false,
  });
};
// Create Professional Step 09
export function useSaveLocation(token: string) {
  const router = useRouter();
  return useMutation({
    mutationKey: ["ProfessionalLocation"],
    mutationFn: (data: LocationData) => saveLocationAPI(data, token),
    onSuccess: async() => {
      router.refresh();
      await safeProfessionalRedirect(token, router);
    },
  });
}

// Create Professional Account - Review Account Profile
export function useProfessionalReview(token: string) {
  return useQuery({
    queryKey: ["professionalReview", token],
    queryFn: () => getProfessionalStepsAPI(token),
    enabled: !!token,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 0,
    refetchInterval: 5000,
    refetchIntervalInBackground: false,
  });
}

// Check Progress Account of Professional

export function useProfesssionalProgress(token: string) {
  return useQuery({
    queryKey: ["ProfessionalProgress"],
    queryFn: () => ProfessionalProgressAPI(token),
    enabled: !!token,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });
}
