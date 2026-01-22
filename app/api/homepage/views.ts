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

// --------------------------------------------------
//      Generate Review Link
// --------------------------------------------------
export const getReviewLink = async(token:string) => {
  try {
      const res = await api.get('/review-token/send-review-link',{
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "Application/json",
        }
      });
      return res.data;
  } catch(error) {
    console.error("Error geting link: ", error);
  }
}

export const submitReview = async (
  token: string,
  rating: number,
  message: string
) => {
  const res = await api.post(
    "/review-token/create",
    {
      rating,
      comment: message.trim(),
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};


