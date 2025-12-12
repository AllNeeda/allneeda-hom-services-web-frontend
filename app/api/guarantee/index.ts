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
export const ActivateGuaranteeAPI = async (data: GuaranteeFormData, token: string) => {
  try {
    console.log("ActivateGuaranteeAPI called with data:", data); // Debug log
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


