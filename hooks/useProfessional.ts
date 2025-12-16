import {
  getProfessionalById,
  updateProfessional,
} from "@/app/api/services/professional";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ProfessionalFormData } from "@/schemas/professional/professional";
import { toast } from "sonner";
import { api } from "@/app/api/axios";
import { handleApiError } from "@/lib/errorHandler";

// 🎯 Define comprehensive Professional interface
export interface Professional {
  id: string;
  introduction: string;
  business_name?: string;
  phone?: string;
  website?: string;
  founded_year?: string;
  employees?: string;
  profile_image?: string;
  rating_avg?: number;
  user_id?: string;
}

interface UpdateProfessionalPayload {
  id: string;
  data: ProfessionalFormData;
  token: string;
}

interface UseUpdateProfessionalOptions {
  onSuccessRedirect?: string;
  showAdvancedError?: boolean;
  enableOptimisticUpdate?: boolean;
}

// 🎯 FIXED: Define proper context type for onMutate
interface MutationContext {
  previousProfessional?: Professional;
}

// 🎯 FIXED: Get Professional By User_Id with proper token handling
export const useGetProfessionalbyUserId = (token: string | null) => {
  return useQuery({
    queryKey: ["professional", "current", token],
    queryFn: async () => {
      if (!token) {
        throw new Error("Authentication token is required");
      }
      return await getProfessionalById(token);
    },
    enabled: !!token,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error: Error) => {
      if (error.message.includes("401") || error.message.includes("403")) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

// 🎯 FIXED: Update Professional with proper TypeScript context
export const useUpdateProfessionalbyUserId = (
  token: string | null,
  options: UseUpdateProfessionalOptions = {}
) => {
  const {
    onSuccessRedirect,
    showAdvancedError = true,
    enableOptimisticUpdate = true,
  } = options;

  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation<
    Professional,
    Error,
    Omit<UpdateProfessionalPayload, 'token'>,
    MutationContext | undefined // ✅ Add context type here, allow undefined
  >({
    mutationFn: async (payload) => {
      if (!token) {
        throw new Error("Authentication token is required");
      }
      return await updateProfessional(payload.id, payload.data, token);
    },
    onMutate: async (payload) => {
      if (!enableOptimisticUpdate || !token) {
        return undefined;
      }

      // ✅ Cancel any ongoing queries for this professional
      await queryClient.cancelQueries({
        queryKey: ["professional", "current", token],
      });

      // ✅ Snapshot the previous value
      const previousProfessional = queryClient.getQueryData<Professional>([
        "professional", "current", token
      ]);

      // ✅ Optimistically update to the new value
      if (previousProfessional) {
        queryClient.setQueryData<Professional>(
          ["professional", "current", token],
          {
            ...previousProfessional,
            ...payload.data,
          }
        );
      }

      // ✅ Return context with proper typing
      return { previousProfessional };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["professional", "current", token]
      });
      queryClient.invalidateQueries({
        queryKey: ["professional"]
      });

      toast.success("Professional updated successfully!", {
        duration: 3000,
        position: "top-center",
      });

      if (onSuccessRedirect) {
        router.push(onSuccessRedirect);
      } else {
        router.back();
      }
    },
    onError: (error: Error, variables, context) => {
      // ✅ TypeScript now knows context has previousProfessional
      if (context?.previousProfessional && token) {
        queryClient.setQueryData(
          ["professional", "current", token],
          context.previousProfessional
        );
      }

      if (showAdvancedError) {
        toast.error("Professional Update Failed", {
          description: `Error: ${error.message}`,
          duration: 5000,
          position: "top-center",
          action: {
            label: "Retry",
            onClick: () => mutation.mutate(variables),
          },
        });
      } else {
        toast.error(`Failed to update professional: ${error.message}`);
      }
    },
    retry: (failureCount, error: Error) => {
      if (error.message.includes("401") || error.message.includes("403")) {
        return false;
      }
      if (error.message.includes("Network")) {
        return failureCount < 3;
      }
      return false;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    ...mutation,
    updateProfessional: mutation.mutate,
    updateProfessionalAsync: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    errorMessage: mutation.error?.message,
    reset: () => {
      mutation.reset();
      toast.info("Professional update form reset");
    },
  };
};

// 🎯 FIXED: Update Professional Details - Account Setting
export const useUpdateProfessional = (token: string | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateProfessional", "introduction", token],
    mutationFn: async ({
      id,
      data
    }: {
      id: string;
      data: FormData | Record<string, any>
    }) => {
      if (!token) {
        throw new Error("Authentication token is required");
      }

      if (!id) {
        throw new Error("Missing professional ID");
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          ...(data instanceof FormData
            ? {}
            : { "Content-Type": "application/json" }
          )
        }
      };

      try {
        const response = await api.put(
          `/professionals/${id}/introduction`,
          data,
          config
        );
        return response.data;
      } catch (error: any) {
        throw handleApiError(error);
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData<Professional>(
        ["professional", "current", token],
        (old) => old ? { ...old, ...data } : data
      );

      queryClient.invalidateQueries({
        queryKey: ["professional", "current", token]
      });
      queryClient.invalidateQueries({
        queryKey: ["professional"]
      });
      queryClient.invalidateQueries({
        queryKey: ["location"]
      });

      toast.success("Professional details updated successfully!");
    },
    onError: (error: Error) => {
      toast.error("Failed to update professional details", {
        description: error.message,
      });
    },
  });
};

// 🎯 IMPROVED: Professional Error Handler
export const useProfessionalErrorHandler = () => {
  const handleProfessionalError = (error: Error, context?: string) => {
    console.error(`Professional Error${context ? ` in ${context}` : ""}:`, error);

    toast.error("Professional Operation Failed", {
      description: `Context: ${context || "General"}\nError: ${error.message}`,
      position: "top-center",
      duration: 6000,
    });

    return {
      severity: error.message.includes("Network") ? "high" : "medium",
      timestamp: new Date().toISOString(),
      context,
      message: error.message,
    };
  };

  return { handleProfessionalError };
};

// 🎯 IMPROVED: Professional Cache Utilities
export const useProfessionalCache = () => {
  const queryClient = useQueryClient();

  const updateProfessionalCache = (
    professionalId: string,
    updates: Partial<Professional>,
    token?: string | null
  ) => {
    const queryKey = token
      ? ["professional", "current", token]
      : ["professional", professionalId];

    queryClient.setQueryData<Professional>(queryKey, (old) => {
      if (!old) return undefined;
      return { ...old, ...updates };
    });
  };

  const getProfessionalFromCache = (
    professionalId?: string,
    token?: string | null
  ): Professional | undefined => {
    const queryKey = token
      ? ["professional", "current", token]
      : ["professional", professionalId];

    return queryClient.getQueryData<Professional>(queryKey);
  };

  const prefetchProfessional = async (professionalId?: string, token?: string | null) => {
    const queryKey = token
      ? ["professional", "current", token]
      : ["professional", professionalId];

    await queryClient.prefetchQuery({
      queryKey,
      queryFn: () => queryClient.getQueryData(queryKey) || Promise.reject("No cache available"),
    });
  };

  const invalidateProfessional = (professionalId?: string, token?: string | null) => {
    if (professionalId || token) {
      const queryKey = token
        ? ["professional", "current", token]
        : ["professional", professionalId];

      queryClient.invalidateQueries({ queryKey });
    }
    queryClient.invalidateQueries({ queryKey: ["professional"] });
  };

  return {
    updateProfessionalCache,
    getProfessionalFromCache,
    prefetchProfessional,
    invalidateProfessional,
  };
};

// 🎯 NEW: Professional Hook Factory for consistent token handling
export const useProfessional = (token: string | null) => {
  const professionalQuery = useGetProfessionalbyUserId(token);
  const professionalCache = useProfessionalCache();
  const errorHandler = useProfessionalErrorHandler();

  return {
    // Query state
    ...professionalQuery,

    // Cache utilities
    ...professionalCache,

    // Error handling
    ...errorHandler,

    // Convenience properties
    professional: professionalQuery.data,
    isEmpty: !professionalQuery.data?.id,

    // Combined actions
    refetchProfessional: professionalQuery.refetch,
    updateProfessionalCache: (updates: Partial<Professional>) => {
      if (professionalQuery.data?.id) {
        professionalCache.updateProfessionalCache(
          professionalQuery.data.id,
          updates,
          token
        );
      }
    },
  };
};