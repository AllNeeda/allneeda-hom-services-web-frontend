import { handleApiError } from "@/lib/errorHandler";
import { api } from "../axios";

export const SendReviewAPI = async (data: any, token?: string) => {
  try {
    const response = await api.post(
      "/professionals/profileReviewsCustomer",
      data,
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
