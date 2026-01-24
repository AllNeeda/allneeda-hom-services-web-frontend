// lib/api/views.js

import { handleApiError } from "@/lib/errorHandler";
import { api } from "../axios";

export const trackViewAPI = async (professional_id: string) => {
  try {
    console.log("The count is", professional_id);
    const response = await api.post(`/professionals/trackView`, { professional_id });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};




