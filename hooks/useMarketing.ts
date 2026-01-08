// src/hooks/useGuarantee.ts
import {
  ActivateGuaranteeAPI,
  ActiveGuaranteeStatusAPI,
  ActiveRankingStatusAPI,
  DeleteActivateGuarantee,
  DeleteActivateRankingAPI,
  GetRankingCampaignAPI,
  RankingCampaignAPI,
  RankingCampaignPayload,
  RankingCampaignResponse,
  UpdateAllVisibilitySettingsAPI,
  UpdateSingleVisibilitySettingAPI,
  VisibilitySettings,
  GetResponseTimeSettingsAPI,
  UpdateResponseTimeSettingsAPI,
} from "@/app/api/marketing";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface GuaranteeFormData {
  professional_id: string;
  service_id: string;
  guarantee_type: string;
  duration: "monthly" | "annual";
  start_date: string;
  credits: number;
  end_date: string;
  guarantee_name: string;
  guarantee_details: string;
}

export function useActivateGuarantee() {
  return useMutation({
    mutationKey: ["activateGuarantee"],
    mutationFn: async ({
      data,
      token,
    }: {
      data: GuaranteeFormData;
      token: string;
    }) => {
      return ActivateGuaranteeAPI(data, token);
    },
    onSuccess: (response) => {
      toast.success(response?.message || "Guarantee activated successfully");
    },
  });
}

export function useGuaranteeStatus() {
  return useMutation({
    mutationKey: ["update-status"],
    mutationFn: (data: {
      guarantee_id: string;
      status: string;
      token: string;
    }) => ActiveGuaranteeStatusAPI(data),
  });
}

export const useDeleteActivateGuarantee = () => {
  return useMutation({
    mutationKey: ["deleteGuarantee"],
    mutationFn: ({
      guarantee_id,
      token,
    }: {
      guarantee_id: string;
      token: string;
    }) => DeleteActivateGuarantee(guarantee_id, token),
  });
};

interface MutationParams {
  data: RankingCampaignPayload;
  token: string;
}
export function useRankingCampaign() {
  return useMutation<RankingCampaignResponse, unknown, MutationParams>({
    mutationKey: ["RankingCampaign"],
    mutationFn: async ({ data, token }) => {
      return RankingCampaignAPI(data, token);
    },
    onSuccess: (response) => {
      toast.success(
        response?.message || "Ranking Campaign activated successfully"
      );
    },
  });
}

export function useGetRankingCampaign(
  professional_id: string,
  token: string | null
) {
  return useQuery({
    queryKey: ["GetRankingCampaign"],
    queryFn: () => GetRankingCampaignAPI(professional_id, token!),
    enabled: !!token,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });
}

export function useRankingStatus() {
  return useMutation({
    mutationKey: ["update-statusRanking"],
    mutationFn: (data: {
      campaign_id: string;
      status: string;
      token: string;
    }) => ActiveRankingStatusAPI(data),
  });
}

export const useDeleteActivateRanking = () => {
  return useMutation({
    mutationKey: ["DeleteActivateBoost"],
    mutationFn: ({
      campaign_id,
      token,
    }: {
      campaign_id: string;
      token: string;
    }) => DeleteActivateRankingAPI(campaign_id, token),
  });
};

export function useUpdateAllVisibilitySettings() {
  return useMutation({
    mutationKey: ["update-all-visibility-settings"],
    mutationFn: (data: { settings: VisibilitySettings; token: string }) =>
      UpdateAllVisibilitySettingsAPI(data),
  });
}

// Hook to update visibility with optimistic updates
export function useVisibilityWithOptimisticUpdate() {
  return useMutation({
    mutationKey: ["update-visibility-optimistic"],
    mutationFn: (data: {
      setting_type: keyof VisibilitySettings;
      value: boolean;
      token: string;
    }) => UpdateSingleVisibilitySettingAPI(data),
  });
}

// Add to your existing useMarketing hook
export const useGetResponseTimeSettings = (
  professional_id: string,
  token: string
) => {
  return useQuery({
    queryKey: ["responseTimeSettings", professional_id],
    queryFn: () => GetResponseTimeSettingsAPI(professional_id, token),
    enabled: !!token && !!professional_id,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });
};

export const useUpdateResponseTime = () => {
  return useMutation({
    mutationKey: ["update-response-time"],
    mutationFn: (data: {
      response_time: string;
      professional_id: string;
      token: string;
    }) =>
      UpdateResponseTimeSettingsAPI(
        {
          response_time: data.response_time,
          professional_id: data.professional_id,
        },
        data.token
      ),
    onSuccess: () => {
      toast.success("Response time updated successfully");
    },
  });
};
