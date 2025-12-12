import { handleApiError } from "@/lib/errorHandler";
import { api } from "../axios";

// Get Credits Packages....
export const GetCreditPackageAPI = async (token: string) => {
  try {
    const response = await api.get("/credits/get_package", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
