// lib/api/businessAvailability.ts

import { handleApiError } from "@/lib/errorHandler";
import { api } from "../axios";

export interface AvailabilityPayload {
  professional_id: string;
  isAvailable: boolean;
  hiddenUntil: string;
}

export interface AvailabilityResponse {
  success: boolean;
  message: string;
  data: {
    professional_id: string;
    isAvailable: boolean;
    hiddenUntil: string;
    daysUntil: number;
    updatedAt: string;
  };
}

export const UseUpdateBusinessAvailabilityAPI = async (
  data: AvailabilityPayload,
  token: string
) => {
  try {
    const response = await api.put("/professionals/update_availability", data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
