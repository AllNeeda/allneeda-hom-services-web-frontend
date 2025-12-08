import { useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { RegisterFormData } from "@/types/auth/register";
import {
  AnswerPayload,
  BusinesAvailabilityAPI,
  BusinessAvailabilityPayload,
  BusinessInfoPayload,
  getProServicesQuestionsAPI,
  LocationData,
  ProfessionalProgressAPI,
  registerUserAPI,
  saveBusinessInfoAPI,
  saveLocationAPI,
  submitServiceAnswersAPI,
  UpdateBusinessName,
} from "@/app/api/services/ProAccount";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/components/providers/context/auth-context";
import {} from "@/components/home-services/onboarding/step-4";
import { getProfessionalStepsAPI } from "@/app/api/services/services";

export function useRegister() {
  const { login } = useAuth();
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const mutation = useMutation({
    mutationFn: registerUserAPI,
    retry: false,
    onMutate: () => {
      setIsPending(true);
    },
    onSuccess: async (response, variables) => {
      try {
        await login(variables.email, variables.password, "/home-services/dashboard/services/step-2");
        redirect("/home-services/dashboard/services/step-2");
      } catch {
        router.push("/auth/login");
      }
    },
    onSettled: () => {
      setIsPending(false);
    },
  });

  const registerUser = (data: RegisterFormData) => {
    mutation.mutate(data);
  };

  return { registerUser, isPending: mutation.isPending || isPending };
}





// Create Professional Account - Step 03
export function useUpdateBusinessName(token: string) {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["UpdateBusinessName"],
    mutationFn: (data: { businessName: string; id: string }) =>
      UpdateBusinessName(data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["professionalReview"],
      });

      router.push(`/home-services/dashboard/services/step-4`);
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
    onSuccess: () => {
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
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["professionalReview"],
      });
      router.push("/home-services/dashboard/services/step-8");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to save Business Info"
      );
    },
    retry: false,
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
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["professionalReview"],
      });
      router.push("/home-services/dashboard/services/step-9");
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
    onSuccess: () => {
      router.refresh();
      router.push("/home-services/dashboard/services/step-10");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to save location");
    },
    retry: false,
  });
}

// Create Professional Account - Review Account Profile
export function useProfessionalReview(token: string) {
  return useQuery({
    queryKey: ["professionalReview", token],
    queryFn: () => getProfessionalStepsAPI(token),
    enabled: !!token,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: "always",
    staleTime: 0,
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
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
