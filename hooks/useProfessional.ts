import {
  getProfessionalById,
  getProfessionalDetailsById,
  updateProfessional,
  Professional as ApiProfessional,
} from "@/app/api/services/professional";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ProfessionalFormData } from "@/schemas/professional/professional";
import { toast } from "react-hot-toast";

export interface Professional extends ApiProfessional {
  id?: string;
  introduction?: string;
}

interface UpdateProfessionalPayload {
  id: string;
  // Accept either the typed ProfessionalFormData or a FormData instance
  data: ProfessionalFormData | FormData;
  token: string;
}

interface UseUpdateProfessionalOptions {
  onSuccessRedirect?: string;
  showAdvancedError?: boolean;
  enableOptimisticUpdate?: boolean;
}

interface MutationContext {
  previousProfessional?: Professional;
}

export const useGetProfessionalbyUserId = (token: string | null) => {
  return useQuery({
    queryKey: ["professional", "current", token],
    queryFn: async () => {
      return await getProfessionalById(token!);
    },
    enabled: !!token,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateProfessionalbyUserId = (
  token: string | null,
  options: UseUpdateProfessionalOptions = {},
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
    Omit<UpdateProfessionalPayload, "token">,
    MutationContext | undefined
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

      await queryClient.cancelQueries({
        queryKey: ["professional", "current", token],
      });

      const previousProfessional = queryClient.getQueryData<Professional>([
        "professional",
        "current",
        token,
      ]);

      if (previousProfessional) {
        queryClient.setQueryData<Professional>(
          ["professional", "current", token],
          {
            ...previousProfessional,
            ...payload.data,
          },
        );
      }

      return { previousProfessional };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["professional", "current", token],
      });
      queryClient.invalidateQueries({
        queryKey: ["professional"],
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
      if (context?.previousProfessional && token) {
        queryClient.setQueryData(
          ["professional", "current", token],
          context.previousProfessional,
        );
      }

      if (showAdvancedError) {
        toast.error("Professional Update Failed");
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
      toast.error("Professional update form reset");
    },
  };
};

//  Update Professional Details - Account Setting
export const useUpdateProfessional = (token: string) => {
  return useMutation<
    Professional,
    Error,
    Omit<UpdateProfessionalPayload, "token">
  >({
    mutationKey: ["updateProfessional", token!],
    mutationFn: async (payload) => {
      if (!token) throw new Error("Authentication token is required");
      const { id, data } = payload;
      return await updateProfessional(
        id,
        data as FormData | ProfessionalFormData,
        token,
      );
    },
  });
};

// : Professional Error Handler
export const useProfessionalErrorHandler = () => {
  const handleProfessionalError = (error: Error, context?: string) => {
    console.error(
      `Professional Error${context ? ` in ${context}` : ""}:`,
      error,
    );

    toast.error("Professional Operation Failed");

    return {
      severity: error.message.includes("Network") ? "high" : "medium",
      timestamp: new Date().toISOString(),
      context,
      message: error.message,
    };
  };

  return { handleProfessionalError };
};

// : Professional Cache Utilities
export const useProfessionalCache = () => {
  const queryClient = useQueryClient();

  const updateProfessionalCache = (
    professionalId: string,
    updates: Partial<Professional>,
    token?: string | null,
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
    token?: string | null,
  ): Professional | undefined => {
    const queryKey = token
      ? ["professional", "current", token]
      : ["professional", professionalId];

    return queryClient.getQueryData<Professional>(queryKey);
  };

  const prefetchProfessional = async (
    professionalId?: string,
    token?: string | null,
  ) => {
    const queryKey = token
      ? ["professional", "current", token]
      : ["professional", professionalId];

    await queryClient.prefetchQuery({
      queryKey,
      queryFn: () =>
        queryClient.getQueryData(queryKey) ||
        Promise.reject("No cache available"),
    });
  };

  const invalidateProfessional = (
    professionalId?: string,
    token?: string | null,
  ) => {
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
          token,
        );
      }
    },
  };
};

export const useProfessionalDetails = (proId: string) => {
  return useQuery({
    queryKey: ["professionalDetails", proId],
    queryFn: () => getProfessionalDetailsById(proId),
    enabled: !!proId,
    staleTime: 5 * 60 * 1000,
  });
};
