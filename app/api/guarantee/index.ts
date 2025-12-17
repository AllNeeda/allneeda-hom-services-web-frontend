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
