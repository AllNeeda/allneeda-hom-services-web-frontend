import { handleApiError } from "@/lib/errorHandler";
import {api} from "../axios";

export const getLocationByUserId = async (token: string) => {
  try {
    const response = await api.get("/location/pro", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
