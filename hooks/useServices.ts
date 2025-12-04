import {
  AddNewServiceAPI,
  DeleteServiceAPI,
  DeleteServiceLocationAPI,
  GetProfessionalServicesAPI,
  GetServiceByIdAPI,
  GetServiceLocationByIdAPI,
  GetServicesAPI,
  SaveServiceLocationAPI,
  SaveUpdateServiceLocationAPI,
  UpdateServiceStatusAPI,
  UseGetServicesQuestionAPI,
  UseServicePricingAPI,
  UseSubmitQuestionAnswerAPI,
} from "@/app/api/services/services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// Get Professional Services Hook
export function useGetServices(token: string | null) {
  return useQuery({
    queryKey: ["professionalServices"],
    queryFn: () => GetProfessionalServicesAPI(token!),
    enabled: !!token,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });
}

// Update Service Status Hook
export function useUpdateServiceStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-service-status"],
    mutationFn: (data: {
      service_id: string;
      professional_id: string;
      service_status: boolean;
      token: string;
    }) => UpdateServiceStatusAPI(data),
    onSuccess: (response) => {
      toast.success(response?.message || "Service status updated successfully");
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["services"] }),
        queryClient.invalidateQueries({ queryKey: ["professionalServices"] }),
      ]);
    },
    retry: false,
  });
}

// Get Services List Hook
export function useGetServicesList(token: string | null) {
  return useQuery({
    queryKey: ["services"],
    queryFn: () => GetServicesAPI(token!),
    enabled: !!token,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });
}

// Insert New Service Hook
export function useAddNewService(token: string) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["AddNewService"],
    mutationFn: (data: {
      service_name: string;
      service_id: string;
      professional_id: string;
    }) => AddNewServiceAPI(data, token),

    onSuccess: async (data, variables) => {
      // Invalidate relevant queries
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["serviceData"] }),
        queryClient.invalidateQueries({ queryKey: ["professionalServices"] }),
        queryClient.invalidateQueries({ queryKey: ["services"] }),
      ]);
      queryClient.setQueryData(["currentService"], {
        service_id: variables.service_id,
        professional_id: variables.professional_id,
      });

      const params = new URLSearchParams({
        service_id: variables.service_id,
        professional_id: variables.professional_id,
      }).toString();

      router.push(`/home-services/dashboard/services/pricing?${params}`);
    },
  });
}

// Service Pricing Hook
export interface ServicePricingPayload {
  service_id: string;
  professional_id: string;
  pricing_type: string;
  minimum_price: string;
  maximum_price: string;
  completed_tasks: string;
  description: string;
}

export function useServicePricing(token: string) {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["UseServicePricing"],
    mutationFn: (data: ServicePricingPayload) =>
      UseServicePricingAPI(data, token),
    onSuccess: async (data, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["serviceData"] });
      queryClient.setQueryData(["currentService"], {
        service_id: variables.service_id,
        professional_id: variables.professional_id,
      });
      const params = new URLSearchParams({
        service_id: variables.service_id,
        professional_id: variables.professional_id,
      }).toString();
      router.push(`/home-services/dashboard/services/questions?${params}`);
    },
  });
}

// add service Pricing Only
export function useAddServicePricing(token: string) {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["UseServicePricing"],
    mutationFn: (data: ServicePricingPayload) =>
      UseServicePricingAPI(data, token),
    onSuccess: async (data, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["serviceData"] });
      queryClient.setQueryData(["currentService"], {
        service_id: variables.service_id,
        professional_id: variables.professional_id,
      });
      router.push(`/home-services/dashboard/services`);
    },
  });
}

export function useUpdateServicePricing(token: string) {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateServicePricing"],
    mutationFn: (data: ServicePricingPayload) =>
      UseServicePricingAPI(data, token),
    onSuccess: async (response, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["serviceData"] });
      queryClient.setQueryData(["currentService"], {
        service_id: variables.service_id,
        professional_id: variables.professional_id,
      });
      toast.success(
        response?.message || "Service pricing updated successfully"
      );
      router.push("/home-services/dashboard/services");
    },
  });
}

// Get Service Questions by Service ID Hook
export function useGetServicesQuestionByServiceId(
  token: string | null,
  serviceId: string | null
) {
  return useQuery({
    queryKey: ["questions", serviceId],
    queryFn: () => UseGetServicesQuestionAPI(token!, serviceId!),
    enabled: !!token && !!serviceId,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });
}

// Submit Service Questions Answers Hook
export interface AnswerPayload {
  professional_id: string;
  service_id: string;
  question_id: string;
  answer: string | string[];
}

export const useSubmitQuestionAnswer = (token: string) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["submitServiceAnswers"],
    mutationFn: (data: AnswerPayload[]) =>
      UseSubmitQuestionAnswerAPI(data, token),

    onSuccess: async (data, variables) => {
      if (variables.length > 0) {
        await queryClient.invalidateQueries({ queryKey: ["serviceData"] });
        queryClient.setQueryData(["currentService"], {
          service_id: variables[0].service_id,
          professional_id: variables[0].professional_id,
        });
        const params = new URLSearchParams({
          service_id: variables[0].service_id,
          professional_id: variables[0].professional_id,
        }).toString();
        router.push(
          `/home-services/dashboard/services/serviceLocation?${params}`
        );
      }
    },
  });
};

// Location of Service Hook
export interface LocationPayload {
  professional_id: string;
  service_id: string;
  location_id: string;
  lat: number;
  lng: number;
  city: string;
  state: string;
  zip: string;
  radiusMiles: number;
  isLoading: boolean;
}

export const useServiceLocation = (token: string) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["saveServiceLocation"],
    mutationFn: (data: LocationPayload) => SaveServiceLocationAPI(data, token),

    onSuccess: async () => {
      try {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["serviceData"] }),
          queryClient.invalidateQueries({ queryKey: ["professionalServices"] }),
          queryClient.invalidateQueries({ queryKey: ["services"] }),
          queryClient.invalidateQueries({ queryKey: ["questions"] }),
        ]);

        toast.success("New Service Added successfully");
        router.push(`/home-services/dashboard/services`);
      } catch {
        toast.success("New Service Added successfully");
        router.push(`/home-services/dashboard/services`);
      }
    },
  });
};

// Deleting the service
export const useDeleteService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deleteService"],
    mutationFn: ({
      service_id,
      professional_id,
      token,
    }: {
      service_id: string;
      professional_id: string;
      token: string;
    }) => DeleteServiceAPI(service_id, professional_id, token),

    onSuccess: async () => {
      try {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["serviceData"] }),
          queryClient.invalidateQueries({ queryKey: ["professionalServices"] }),
          queryClient.invalidateQueries({ queryKey: ["services"] }),
          queryClient.invalidateQueries({ queryKey: ["questions"] }),
        ]);
        toast.success("Service deleted successfully");
      } catch {
        toast.success("Service deleted successfully");
      }
    },
  });
};

// Updating the service Pricing
export const useGetServiceById = (
  service_id: string,
  professional_id: string,
  token: string
) => {
  return useQuery({
    queryKey: ["service", service_id, professional_id],
    queryFn: () => GetServiceByIdAPI(service_id, professional_id, token),
    enabled: !!token && !!service_id && !!professional_id,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });
};

export const useUpdateServiceLocation = (token: string) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["saveServiceLocation"],
    mutationFn: (data: LocationPayload) =>
      SaveUpdateServiceLocationAPI(data, token),

    onSuccess: async () => {
      try {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["serviceData"] }),
          queryClient.invalidateQueries({ queryKey: ["professionalServices"] }),
          queryClient.invalidateQueries({ queryKey: ["services"] }),
          queryClient.invalidateQueries({ queryKey: ["questions"] }),
        ]);

        toast.success("Service Area Updated successfully");
        router.push(`/home-services/dashboard/services`);
      } catch {
        toast.success("Service Area Updated successfully");
        router.push(`/home-services/dashboard/services`);
      }
    },
  });
};

/// Get Service Location by Location, Pro and Service Id,
// Updating the service Pricing
export const useGetServiceLocationById = (
  service_id: string,
  professional_id: string,
  location_id: string,
  token: string
) => {
  return useQuery({
    queryKey: ["service", service_id, professional_id],
    queryFn: () =>
      GetServiceLocationByIdAPI(
        service_id,
        professional_id,
        location_id,
        token
      ),
    enabled: !!token && !!service_id && !!professional_id && !!location_id,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};

// Add New Question
export const useAddQuestionAnswer = (token: string) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["submitServiceAnswers"],
    mutationFn: (data: AnswerPayload[]) =>
      UseSubmitQuestionAnswerAPI(data, token),
    onSuccess: async (data, variables) => {
      if (variables.length > 0) {
        await queryClient.invalidateQueries({
          queryKey: [
            "service",
            variables[0].service_id,
            variables[0].professional_id,
          ],
        });
        queryClient.setQueryData(["currentService"], {
          service_id: variables[0].service_id,
          professional_id: variables[0].professional_id,
        });
        router.push(`/home-services/dashboard/services`);
      }
    },
  });
};

// Deleting the service
export const useDeleteServiceLocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deleteServiceLocation"],
    mutationFn: async ({
      location_id,
      token,
    }: {
      location_id: string;
      token: string;
    }) => {
      return DeleteServiceLocationAPI(location_id, token);
    },
    onSuccess: async () => {
      try {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["serviceData"] }),
          queryClient.invalidateQueries({ queryKey: ["professionalServices"] }),
          queryClient.invalidateQueries({ queryKey: ["services"] }),
          queryClient.invalidateQueries({ queryKey: ["questions"] }),
        ]);
        toast.success("Service location deleted successfully");
      } catch {
        toast.success("Service location deleted successfully");
      }
    },
  });
};
