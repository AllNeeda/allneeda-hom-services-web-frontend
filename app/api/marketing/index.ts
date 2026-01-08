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

export const ActiveRankingStatusAPI = async (data: {
  campaign_id: string;
  status: string;
  token: string;
}) => {
  const { campaign_id, status, token } = data;

  try {
    const response = await api.put(
      `/marketing/campaign_status`,
      {
        campaign_id: campaign_id,
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

export const DeleteActivateRankingAPI = async (
  campaign_id: string,
  token: string
) => {
  try {
    const response = await api.delete("/marketing/delete_campaign", {
      data: {
        campaign_id,
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

export interface VisibilitySettings {
  total_hire: boolean;
  last_hire: boolean;
  last_seen: boolean;
  expected_response_time: boolean;
}

export interface ProfileVisibilityData {
  visibility_settings: VisibilitySettings;
  total_hire: number;
  last_hire_date: string;
  last_seen: string;
  expected_response_time: string;
  profile_views: number;
}

// Update all visibility settings at once
export const UpdateAllVisibilitySettingsAPI = async (data: {
  settings: VisibilitySettings;
  token: string;
}) => {
  const { settings, token } = data;

  try {
    const response = await api.put("/marketing/visibility_setting", settings, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Update single visibility setting
export const UpdateSingleVisibilitySettingAPI = async (data: {
  setting_type: keyof VisibilitySettings;
  value: boolean;
  token: string;
}) => {
  const { setting_type, value, token } = data;

  try {
    const response = await api.put(
      `/marketing/visibility/${setting_type}`,
      { value },
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

// Get response time settings for the professional
export const GetResponseTimeSettingsAPI = async (
  professional_id: string,
  token: string
) => {
  try {
    const response = await api.get('/marketing/response-time-settings', {
      params: { professional_id },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Fetching response time settings for professional:', response);

    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Update response time settings (expects a body like { response_time: string })
export const UpdateResponseTimeSettingsAPI = async (
  data: { response_time: string; professional_id: string },
  token: string
) => {
  try {
    const response = await api.put('/marketing/response-time-settings', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
