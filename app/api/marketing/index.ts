// src/app/api/guarantee.ts
import { handleApiError } from "@/lib/errorHandler";
import { api } from "../axios";

// Types
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

// Activate Guarantee API
export const ActivateGuaranteeAPI = async (
  data: GuaranteeFormData,
  token: string
) => {
  try {
    const response = await api.post("/marketing/guarantees", data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const ActiveGuaranteeStatusAPI = async (data: {
  guarantee_id: string;
  status: string;
  token: string;
}) => {
  const { guarantee_id, status, token } = data;

  try {
    const response = await api.put(
      `/marketing/guarantee_status`,
      {
        guarantee_id: guarantee_id,
        status: status,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const DeleteActivateGuarantee = async (
  guarantee_id: string,
  token: string
) => {
  try {
    const response = await api.delete("/marketing/delete_guarantee", {
      data: {
        guarantee_id,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Interface for ranking campaign payload
export interface RankingCampaignPayload {
  professional_id: string;
  service_id: string;
  location_id?: string | null;
  package_id: string;
  service_name: string;
  duration: "monthly" | "annual";
  credits_used: number;
}

export interface RankingCampaignResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const RankingCampaignAPI = async (
  data: RankingCampaignPayload,
  token: string
): Promise<RankingCampaignResponse> => {
  try {
    console.log("the ranking data is", data);
    const response = await api.post("/marketing/ranking", data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};



export const GetRankingCampaignAPI = async (
  professional_id: string,
  token: string
) => {
  try {
    const response = await api.get("/marketing/get_ranking", {
      params: { professional_id }, 
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};


