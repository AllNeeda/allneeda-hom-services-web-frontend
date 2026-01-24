import { handleApiError } from "@/lib/errorHandler";
import { api } from "../axios";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_AUTH_SERVICE;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30s for production (Vercel cold starts), 15s for dev
  headers: { "Content-Type": "application/json" },
});

export const SendReviewAPI = async (data: any, token?: string) => {
  try {
    const response = await api.post(
      "/professionals/profileReviewsCustomer",
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const SubmitCustomerReviewAPI = async (data: {
  professionalId: string;
  rating: number;
  tags?: string[];
  comments?: string;
  media?: { type: "video" | "image"; name: string }[];
}) => {
  try {
    const response = await api.post("/reviews/submitCustomerReview", data);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const SubmitCustomerReviewWithUserAPI = async (data: {
  firstName: string;
  lastName: string;
  phoneNo: string;
  dob: string;
  isAgreeTermsConditions: boolean;
  role_id?: string;
  status?: boolean;
}) => {
  try {
    const response = await axiosInstance.post("/api/v2/user/create", data);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
