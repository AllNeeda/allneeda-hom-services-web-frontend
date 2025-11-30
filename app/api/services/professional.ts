import {api} from "../axios";
import { ProfessionalFormData } from "@/schemas/professional/professional";
import { handleApiError } from "@/lib/errorHandler";

export type Professional = {
  id: string;
  introduction: string;
};
export const getProfessionalById = async (token: string) => {
  try {
    const response = await api.get("/professionals/pro", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateProfessional = async (
  id: string,
  data: ProfessionalFormData,
  token: string
): Promise<Professional> => {
  try {
    const response = await api.put(`/professionals/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw handleApiError(error);
  }
};
