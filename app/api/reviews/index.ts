import { handleApiError } from "@/lib/errorHandler";
import { api } from "../axios";

export async function getProfessionalById(id: string) {
  try {
    const response = await api.get(`/reviews/professional/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}
