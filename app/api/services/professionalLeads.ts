import { handleApiError } from "@/lib/errorHandler";
import { api } from "../axios";

export const GetProfessionalLeadsAPI = async (token: string) => {
  try {
    const response = await api.get("/professionals/professional_leads", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
